# Assembly Custom App Development Guide

## App Context

This app is a Next.js iframe embedded in the Assembly dashboard (internal users) and client portal (clients). A `token` query parameter identifies the user, workspace, and context. The API key stays server-side — use server components or API routes for SDK calls, never client components.

Entry point: `app/page.tsx` (server component, routes by view type). Session init: `utils/session.ts`.

## General Guidelines

After making changes run `npx tsc --noEmit` to check for typescript errors and fix them before finalizing the changes.

## View Patterns

Three view types based on token payload (see `utils/types.ts` for `ViewType`):

| ViewType            | Token Contains                            | Component          | Route            |
| ------------------- | ----------------------------------------- | ------------------ | ---------------- |
| `internal-overview` | `internalUserId` only                     | `InternalOverview` | `/`              |
| `internal-detail`   | `internalUserId` + `clientId`/`companyId` | `DetailView`       | `/` or `/detail` |
| `client`            | `clientId` (no `internalUserId`)          | `ClientView`       | `/`              |

View type is determined in `utils/session.ts` via `determineViewType()`. The home page server component calls `getSession()` and renders the matching view. In-app navigation from overview to detail uses `app/detail/page.tsx` with query params.

## SDK Patterns

The SDK is generated from the [OpenAPI spec](https://docs.assembly.com/openapi/core-resources.json). Always verify method signatures from type definitions before use.

```
// Initialize (server-side only) — see utils/session.ts
const assembly = await assemblyApi({ apiKey: process.env.ASSEMBLY_API_KEY!, token });

// All response properties are optional — always filter with type guards
const clients = await assembly.listClients({ limit: 20, nextToken });
const valid = (clients.data ?? []).filter(
  (c): c is typeof c & { id: string } => !!c.id
);
```

Key methods: `listClients`, `listCompanies`, `listNotes`, `createNote({ requestBody })`, `retrieveTasks`, `createTask({ requestBody })`, `listFiles({ channelId })`, `listFileChannels`. Mutations use `requestBody` in the parameter object. Pagination uses `limit` + `nextToken`.

## API Route Patterns

Token is passed via `Authorization: Bearer <token>` header (not query params). Routes use shared helpers from `app/api/_helpers.ts`:

```
// app/api/notes/route.ts — example pattern
const token = extractToken(request);  // from Authorization header
if (!token) return unauthorizedResponse();
const assembly = await initSdk(token);
const result = await assembly.listNotes({ entityType, entityId });
return Response.json(result);
```

Error responses use `{ error: string }` shape (see `utils/types.ts` `ApiError`). Mutation routes validate with zod schemas. See `app/api/notes/route.ts` for a complete GET/POST/PUT/DELETE example.

## Bridge Patterns

The app bridge communicates with the parent Assembly frame for header controls. Configure before use with `useBridgeConfig(portalUrl)` — see `bridge/hooks.ts`.

```
// Detail view breadcrumbs with back navigation
useBreadcrumbs([
  { label: 'Custom App', onClick: () => router.push('/') },
  { label: entityName },
]);
// Header CTA button — auto-cleared on unmount
usePrimaryCta({ label: 'Add Note', icon: 'Plus', onClick: openDialog });
```

Available hooks: `useBreadcrumbs`, `usePrimaryCta`, `useSecondaryCta`, `useActionsMenu`. All auto-clear on component unmount.

## Design System

Use the local assembly-ui registry components under `@/components/ui/*` when available. Fall back to standard shadcn conventions (plain HTML elements + Tailwind classes) otherwise. Do **not** import any components from `@assembly-js/design-system`. Do not use `lucide-react` unless explicitly requested.

**Registry components (`@/components/ui/*`):**
- `Badge` — `@/components/ui/badge` — variants: `default`, `secondary`, `destructive`, `outline`.
- `Button` — `@/components/ui/button` — variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`; sizes: `default`, `sm`, `lg`, `icon`. Uses `children` (not a `label` prop). No built-in `loading` prop — pass `disabled` and render `<Spinner />` as a child for loading state.
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` — `@/components/ui/form` — react-hook-form integration using the Controller pattern. Wrap forms with `<Form {...form}>` and use `<FormField control={form.control} name="fieldName" render={...} />`.
- `Input` — `@/components/ui/input` — styled `<input>`. Use inside `FormControl` for form fields.
- `Label` — `@/components/ui/label` — standalone label component.
- `Spinner` — `@/components/ui/spinner` — defaults to `size-4`; pass `className="size-5"` (or similar) to resize.
- `Textarea` — `@/components/ui/textarea` — styled `<textarea>`. Use inside `FormControl` for form fields.

**Icon buttons** — use `Button` with `size="icon"` and an icon component from `@/components/ui/icons` as the child. Pass `aria-label` for accessibility. For a smaller icon button, override with `className="h-7 w-7"` (or similar).

**Typography** — use plain HTML elements (`<h1>`–`<h6>`, `<p>`, `<span>`) with Tailwind classes. For headings, add `font-semibold tracking-tight`. Font size tokens are defined in `tailwind.config.ts` (`text-2xs` through `text-3xl`).

**Icons — `@/components/ui/icons`:**
Icons are individually exported SVG React components from `@/components/ui/icons`. Each icon accepts `SVGProps<SVGSVGElement>` (e.g. `className`, `width`, `height`). There is no wrapper `Icon` component — import each icon by name.

Do **not** make up icon names — verify the export exists in `components/ui/icons.tsx` before using it. Icons do **not** accept `icon`, `name`, `size`, `type`, or `variant` props. Size with `className="w-5 h-5"` (or similar Tailwind classes).

```tsx
import { Plus, Trash } from '@/components/ui/icons';

<Plus className="w-5 h-5" />
<Trash className="w-4 h-4 text-gray-400" />
```

### Icon Reference

**Common confusion points:**
- `X` is the **X/Twitter logo**, not a close button. Use `Close` to dismiss.
- `Cancel` is a **prohibition circle** (circle with diagonal line). Use `Close` for dismiss/close actions.
- `Form` is a **clipboard icon**. It is unrelated to the `Form` UI component.
- `Scale` is an **expand/fullscreen icon** (arrows pointing to opposite corners), not a weighing scale. Use `WeightScale` for a weighing scale.
- `Compose` is a **pen-editing-a-document icon**. Use for "create new" or "write" actions, not for email-specific compose.
- `Edit` is an outlined pencil. `EditSolid` is a filled pencil. Use `Edit` for most edit actions; `EditSolid` for active/selected edit state.
- `Settings` is an outlined gear. `SettingsSolid` is a filled gear. Same pattern as Edit/EditSolid.
- `Send` is an outlined paper plane. `SendFilled` is a filled paper plane.
- `Info` / `InfoSolid`, `Success` / `SuccessSolid`, `Failed` / `FailedSolid`, `Warning` / `WarningSolid` — outlined vs filled pairs. Use solid variants for stronger visual emphasis.
- `Sidebar` is an outlined sidebar layout. `SidebarFilled` has the left panel filled.
- `Link` is a chain link icon. `EmbedsLinks` is a chain link inside a card — use for embedded/preview link content, not for hyperlink actions.

#### Navigation & Arrows

- `ArrowDownSolid` — Solid down arrow. Use for sort descending indicators.
- `ArrowLeft` — Left arrow. Use for back navigation.
- `ArrowNE` — Arrow pointing north-east. Use for external links or "open in new window."
- `ArrowRight` — Right arrow. Use for forward navigation, "next," or "go to."
- `ArrowTrendDown` — Downward trending line. Use for negative metrics or declining trends.
- `ArrowTrendUp` — Upward trending line. Use for positive metrics or growth trends.
- `ArrowUpSolid` — Solid up arrow. Use for sort ascending indicators.
- `CaretDown` — Small down caret. Use for dropdown triggers or collapsible sections.
- `CaretRight` — Small right caret. Use for expandable tree nodes or sub-navigation.
- `CaretUp` — Small up caret. Use for expanded dropdown/collapsible indicators.
- `ChevronDown` — Down chevron. Use for accordion expand or "show more."
- `ChevronLeft` — Left chevron. Use for pagination "previous" or breadcrumb back.
- `ChevronRight` — Right chevron. Use for pagination "next" or drill-in navigation.
- `ChevronUp` — Up chevron. Use for accordion collapse or "show less."
- `LocationArrow` — Navigation/compass arrow. Use for "navigate to" or current-direction indicators.

#### Common Actions

- `Plus` — Plus sign. Use for "add" or "create new" actions.
- `Minus` — Minus sign. Use for "remove" or "decrease" actions.
- `Close` — X mark. Use for closing dialogs, dismissing banners, removing chips/tags. **Not** the X/Twitter logo.
- `Check` — Checkmark. Use for confirmation, success, or "done" indicators.
- `Search` — Magnifying glass. Use for search inputs and search triggers.
- `Filter` — Funnel icon. Use for filter controls and filter panels.
- `Edit` — Outlined pencil. Use for edit/modify actions.
- `EditSolid` — Filled pencil. Use for active edit state or stronger emphasis.
- `Trash` — Trash can. Use for delete actions. Pair with destructive button variant.
- `Copy` — Two overlapping rectangles. Use for copy-to-clipboard actions.
- `Duplicate` — Two stacked documents. Use for duplicating/cloning an item. Different from `Copy` (clipboard).
- `Download` — Down arrow with tray. Use for file download actions.
- `Upload` — Up arrow with tray. Use for file upload actions.
- `Send` — Outlined paper plane. Use for send/submit actions (messages, forms).
- `SendFilled` — Filled paper plane. Use when send action needs stronger emphasis.
- `Share` — Share icon (box with up arrow). Use for share/export to external targets.
- `ShareNodes` — Three connected nodes. Use for network sharing or graph relationships.
- `Pin` — Pushpin. Use for pinning items to keep them visible.
- `UnPin` — Pushpin with slash. Use for unpinning previously pinned items.
- `DragDrop` — Grip/drag handle. Use for draggable items in reorderable lists.
- `Reposition` — Four-directional arrow cross. Use for move/reposition actions.
- `Reply` — Curved left arrow. Use for reply actions in messaging.
- `Repeat` — Circular arrows. Use for repeat/refresh/sync actions.
- `Reverse` — Curved looping arrow. Use for undo or reverse actions.
- `Export` — Box with outward arrow. Use for exporting data.
- `Exporter` — Export variant. Use for bulk export or export configuration.
- `Insert` — Inward arrow. Use for insert/import actions.
- `Compose` — Pen editing a document. Use for "create new" or "write" actions.
- `Print` — Printer icon. Use for print actions.
- `LogOut` — Arrow exiting a door. Use for sign-out/logout actions.
- `Invite` — Person with plus. Use for inviting users.
- `FolderMove` — Folder with arrow. Use for moving items between folders.
- `Archive` — Box with down arrow. Use for archiving items.
- `Unarchive` — Box with up arrow. Use for restoring archived items.
- `Scale` — Arrows to opposite corners. Use for fullscreen or expand actions. **Not** a weighing scale.
- `Minimize` — Arrows pointing inward. Use for minimize/collapse actions.
- `FitToWidth` — Magnifying glass with crosshair. Use for fit-to-width or zoom-to-fit.
- `ResetZoom` — Magnifying glass with minus. Use for zoom reset or zoom out.
- `WindowMaximize` — Maximized window frame. Use for maximize/fullscreen window actions.

#### Status & Indicators

- `Success` — Outlined checkmark circle. Use for success status in lists or status badges.
- `SuccessSolid` — Filled checkmark circle. Use for stronger success emphasis (toasts, alerts).
- `Failed` — Outlined X circle. Use for failure/error status.
- `FailedSolid` — Filled X circle. Use for stronger error emphasis.
- `Warning` — Outlined triangle with exclamation. Use for warning status.
- `WarningSolid` — Filled warning triangle. Use for stronger warning emphasis.
- `Info` — Outlined "i" circle. Use for informational tooltips or notices.
- `InfoSolid` — Filled "i" circle. Use for stronger info emphasis.
- `InProgress` — Half-filled circle (left half solid). Use for "in progress" task status.
- `ToDo` — Empty circle outline. Use for "not started" task status.
- `Cancel` — Circle with diagonal line (prohibition). Use for cancelled/blocked status. **Not** for dismissing UI — use `Close` for that.
- `Spinner` — Loading spinner. Use for loading states.
- `Question` — Outlined question mark circle. Use for help or unknown status.
- `QuestionMark` — Standalone question mark. Use for inline help indicators.
- `SquareQuestion` — Question mark in rounded square. Use for help buttons or FAQ.
- `Dot` — Solid filled circle. Use for status dots, bullet indicators, or unread badges.
- `Dash` — Horizontal line. Use for "N/A" or empty-value placeholders in tables.
- `SquareOutline` — Empty square. Use for unchecked checkbox or deselected state.
- `SquareSolid` — Filled square. Use for checked/selected state.
- `Triangle` — Triangle shape. Use for geometric indicators or warning-related contexts.

#### Assembly Platform

- `CustomApps` — Building blocks/modules icon. Use for custom app references or navigation.
- `Automation` — Lightning bolt with gear. Use for automation features.
- `Autoresponder` — Auto-reply icon. Use for automatic response settings.
- `Billing` — Credit card / financial document. Use for billing and payment settings.
- `Contract` — Document icon. Use for contracts and agreements.
- `Form` — Clipboard icon. Use for form/intake references. **Not** related to the `Form` UI component.
- `Invoice` — Invoice document. Use for invoice references.
- `InvoicePaid` — Invoice with check. Use for paid invoice status.
- `Subscription` — Recurring payment icon. Use for subscription features.
- `Tasks` — Task list icon. Use for task management features.
- `Subtask` — Indented sub-item. Use for subtask relationships.
- `Teams` — Group of people. Use for team management.
- `Templates` — Document with grid. Use for template features.
- `Helpdesk` — Support/helpdesk icon. Use for helpdesk or support features.
- `AuditLog` — Stacked panels/log entries. Use for audit trail or activity history.
- `Authentication` — Lock/key authentication. Use for auth settings.
- `Lead` — Person avatar in circle. Use for business leads/contacts.
- `Marketing` — Megaphone with sound waves. Use for marketing features.
- `PlansPayments` — Plans and pricing icon. Use for plan/pricing management.
- `MassFileShare` — File with share arrow in window frame. Use for bulk file sharing features.
- `TokenInspector` — Card with circuit elements. Use for developer token inspection tools.
- `AppSetup` — Horizontal slider controls. Use for app configuration or settings adjustment.
- `Customization` — Grid of different-sized rectangles. Use for layout or dashboard customization.
- `Details` — Document with text lines. Use for detail view or information panels.
- `Note` — Sticky note icon. Use for notes features.

#### Communication

- `Message` — Speech bubble. Use for messaging features.
- `MessageDots` — Speech bubble with dots. Use for "typing" or message-in-progress.
- `Messages` — Multiple speech bubbles. Use for conversation/thread views.
- `Comment` — Comment bubble. Use for comments on entities.
- `CommentDots` — Comment bubble with dots. Use for comment activity or "more comments."
- `Email` — Envelope. Use for email features.
- `EmailRead` — Opened envelope. Use for read email status.
- `EmailUnread` — Sealed envelope with indicator. Use for unread email status.
- `Notification` — Bell. Use for notification features.
- `Inbox` — Inbox tray. Use for inbox views.
- `Inboxes` — Multiple inbox trays. Use for multi-inbox or categorized inbox views.
- `InboxFull` — Inbox tray with items. Use for inbox-has-items status.
- `Mention` — @ with highlight. Use for mention/tag features.
- `Bullhorn` — Megaphone. Use for announcements or broadcasts.
- `Voicemail` — Voicemail icon. Use for voicemail features.

#### Files & Media

- `File` — Blank document. Use for generic file references.
- `FileLines` — Document with lines. Use for text files or documents with content.
- `Files` — Multiple documents. Use for file collections or multi-file contexts.
- `Image` — Picture/landscape in frame. Use for image files or image upload.
- `ImageMissing` — Broken image placeholder. Use for missing/failed image states.
- `ImageNotFilled` — Outlined image icon. Use for image placeholder or lighter emphasis.
- `Images` — Multiple pictures. Use for galleries or multi-image contexts.
- `ImageStack` — Stacked images. Use for image collections.
- `Film` — Film strip. Use for video content (filmstrip style).
- `Video` — Video camera. Use for video features.
- `Camera` — Camera. Use for photo capture or camera features.
- `CameraRotate` — Camera with rotation arrows. Use for camera flip/switch.
- `Music` — Music notes. Use for audio/music content.
- `MusicNote` — Single music note. Use for audio files or tracks.
- `Play` — Play triangle. Use for media playback or start.
- `Pause` — Two vertical bars. Use for pausing playback.
- `RecordVinyl` — Vinyl record. Use for recording or audio features.
- `Doc` — Document icon. Use for word-processing documents.
- `PDF` — PDF file type badge. Use for PDF file indicators.
- `PNG` — PNG file type badge. Use for PNG file indicators.
- `JPG` — JPG file type badge. Use for JPG file indicators.
- `GIF` — GIF file type badge. Use for GIF file indicators.
- `SVG` — SVG file type badge. Use for SVG file indicators.
- `CSV` — CSV file type badge. Use for CSV file indicators.
- `ZIP` — ZIP file type badge. Use for ZIP archive indicators.
- `MOV` — MOV file type badge. Use for MOV video file indicators.
- `MP3` — MP3 file type badge. Use for MP3 audio file indicators.
- `MP4` — MP4 file type badge. Use for MP4 video file indicators.
- `Excel` — Spreadsheet icon. Use for Excel/spreadsheet file references.

#### Text Formatting

- `Bold` — Bold "B". Use for bold text formatting toggle.
- `Italicize` — Italic "I". Use for italic text formatting toggle.
- `Underline` — Underlined "U". Use for underline text formatting toggle.
- `Strikethrough` — Strikethrough "S". Use for strikethrough text formatting toggle.
- `H1` — Heading 1 label. Use for heading level 1 formatting.
- `H2` — Heading 2 label. Use for heading level 2 formatting.
- `H3` — Heading 3 label. Use for heading level 3 formatting.
- `Text` — "T" with serif. Use for text/typography controls.
- `FontCase` — Case-change "Aa". Use for text case transformation.
- `NumberedList` — Ordered list. Use for numbered list formatting.
- `UnorderedList` — Bullet list. Use for unordered list formatting.
- `List` — List lines. Use for generic list view toggle.
- `Callout` — "T" inside a rounded box. Use for text callout/text-box formatting blocks.

#### Layout & UI

- `Sidebar` — Outlined two-column layout with left panel. Use for sidebar toggle.
- `SidebarFilled` — Same layout with filled left panel. Use for active/expanded sidebar state.
- `Table` — Grid/table layout. Use for table view toggle.
- `Menu` — Hamburger menu (three horizontal lines). Use for menu toggle.
- `Ellipsis` — Three horizontal dots. Use for "more actions" menus (horizontal).
- `MoreVertical` — Three vertical dots. Use for "more actions" menus (vertical).
- `GridFourSquares` — 2x2 grid. Use for grid view toggle.
- `RectangleWide` — Wide rectangle. Use for wide/card view layouts.
- `Checklist` — List with checkboxes. Use for checklist or task list views.

#### People & Identity

- `Profile` — Person silhouette. Use for user profile or account.
- `IdBadge` — ID card. Use for identity or badge references.
- `PersonSimple` — Standing person. Use for generic person reference.
- `PersonDress` — Person in dress. Use for gender-specific person reference.
- `PersonWalking` — Walking person. Use for activity or pedestrian context.
- `PersonBiking` — Person on bicycle. Use for cycling or exercise context.
- `Accessibility` — Universal accessibility symbol. Use for accessibility features.
- `Hand` — Raised hand. Use for stop, wave, or hand-raise features.
- `Ear` — Ear. Use for hearing/listening or accessibility features.

#### Business & Finance

- `Dollar` — Dollar sign. Use for monetary values or pricing.
- `Coins` — Stacked coins. Use for currency or financial features.
- `MoneyBills` — Paper bills. Use for cash or payment features.
- `Wallet` — Wallet. Use for wallet or payment method features.
- `Bank` — Bank building with columns. Use for banking or financial institution.
- `Calculator` — Calculator. Use for calculation or financial tools.
- `CartShopping` — Shopping cart. Use for cart/checkout features.
- `ShoppingBag` — Shopping bag. Use for shopping or purchase features.
- `BagShoppingMinus` — Shopping bag with minus. Use for removing from bag.
- `BagShoppingPlus` — Shopping bag with plus. Use for adding to bag.
- `BasketShoppingSimple` — Shopping basket. Use for basket/cart alternative.
- `Store` — Storefront. Use for store or marketplace features.
- `Tag` — Price tag. Use for single tag or label.
- `Tags` — Multiple tags. Use for multi-tag or categorization.
- `Briefcase` — Briefcase. Use for work, business, or professional context.
- `BriefcaseMedical` — Medical briefcase with cross. Use for healthcare or medical context.
- `Ticket` — Ticket stub. Use for tickets or event features.

#### Objects & Places

- `Home` — House. Use for home/dashboard navigation.
- `Building` — Single building. Use for company or office references.
- `Buildings` — Multiple buildings. Use for multi-location or enterprise context.
- `Calendar` — Calendar page. Use for date selection or calendar features.
- `CalendarDays` — Calendar with day numbers. Use for date-range or schedule views.
- `Time` — Clock face. Use for time display or time selection.
- `Timer` — Timer with indicator. Use for countdown or timed features.
- `AlarmClock` — Alarm clock. Use for reminders or scheduled alerts.
- `Stopwatch` — Stopwatch. Use for time tracking or elapsed time.
- `HourglassHalf` — Half-empty hourglass. Use for waiting or time-remaining indicators.
- `Book` — Open book. Use for documentation, guides, or knowledge base.
- `Bookmark` — Bookmark ribbon. Use for saving or bookmarking items.
- `Flag` — Flag. Use for flagging, reporting, or milestones.
- `Key` — Key. Use for API keys, access, or security.
- `LockFilled` — Filled padlock (locked). Use for locked/restricted items.
- `Unlock` — Open padlock. Use for unlocked or public items.
- `Shield` — Outlined shield. Use for security or protection features.
- `ShieldCheck` — Shield with checkmark. Use for verified or secure status.
- `ShieldHalf` — Half-filled shield. Use for partial security or mixed access.
- `Link` — Chain link. Use for hyperlinks, URL references, or linking entities.
- `Attachment` — Paperclip. Use for file attachments.
- `Settings` — Outlined gear. Use for settings or configuration.
- `SettingsSolid` — Filled gear. Use for active settings or stronger emphasis.
- `Wrench` — Wrench. Use for tools, maintenance, or configuration.
- `ScrewdriverWrench` — Crossed screwdriver and wrench. Use for advanced tools or setup.
- `Hammer` — Hammer. Use for build or construction context.
- `Puzzle` — Puzzle piece. Use for integrations, plugins, or extensions.
- `Rocket` — Rocket. Use for launch, deploy, or getting-started features.
- `Telescope` — Telescope. Use for exploration or discovery features.
- `Compass` — Compass. Use for navigation or orientation.
- `Map` — Folded map. Use for map views or geographic features.
- `Location` — Map pin. Use for location or address references.
- `LocationCrosshairs` — Crosshair target. Use for "use my location" or precise location.
- `Lightbulb` — Light bulb. Use for ideas, tips, or suggestions.
- `Fire` — Flame. Use for trending, hot, or urgent items.
- `FireSmoke` — Flame with smoke. Use for incidents or critical issues.
- `Flashlight` — Flashlight. Use for spotlight or highlight features.
- `Flask` — Lab flask. Use for experiments, beta, or testing features.
- `Fingerprint` — Fingerprint. Use for biometric or identity verification.
- `Eye` — Open eye. Use for visibility, preview, or "show" toggle.
- `EyeDropper` — Eyedropper tool. Use for color picking.
- `EyeHidden` — Eye with slash. Use for hidden content or "hide" toggle.
- `Magnet` — Magnet. Use for attraction or sticky features.
- `Scissors` — Scissors. Use for cut or clip actions.
- `FolderLocked` — Folder with lock. Use for restricted/protected folders.
- `FolderOpen` — Open folder. Use for browsing or opened folder state.
- `Gauge` — Speed gauge. Use for performance or level indicators.
- `SignalBars` — Signal strength bars. Use for connectivity or signal indicators.
- `SignalStream` — Broadcasting signal waves. Use for live streaming or broadcasting.
- `Desktop` — Desktop monitor. Use for desktop/web platform context.
- `Laptop` — Laptop computer. Use for laptop or portable device context.
- `Mobile` — Mobile phone. Use for mobile platform context.
- `MobileNumber` — Phone with number. Use for phone number or SMS features.
- `Tv` — Television. Use for TV or display context.
- `Headphones` — Headphones. Use for audio or support features.
- `Microchip` — Processor chip. Use for technology or hardware context.
- `FloppyDisk` — Floppy disk. Use for save actions.
- `Qrcode` — QR code. Use for QR code generation or scanning.
- `BarcodeRead` — Barcode with reader. Use for barcode scanning features.
- `Newspaper` — Newspaper. Use for news or article features.
- `PresentationScreen` — Projector screen. Use for presentations or slide decks.
- `Chart` — Bar chart. Use for analytics or data visualization.
- `ChartSimpleHorizontal` — Horizontal bar chart. Use for horizontal chart views.
- `GraphBarSolid` — Filled bar graph. Use for solid chart visualizations.
- `EarthAmericas` — Globe showing Americas. Use for global, international, or region context.
- `SolarSystem` — Solar system orbits. Use for expansive scope or universe context.
- `PlanetRinged` — Planet with rings (Saturn-like). Use for space or scope context.
- `GraduationCap` — Graduation cap. Use for education, learning, or certification.
- `Medal` — Medal on ribbon. Use for achievements or awards.
- `Trophy` — Trophy cup. Use for wins, leaderboards, or achievements.
- `AwardSimple` — Award ribbon. Use for recognition or badges.
- `Gift` — Wrapped gift box. Use for gifts, rewards, or promotional features.
- `Infinity` — Infinity symbol. Use for unlimited or recurring concepts.
- `ToggleOn` — Toggle switch in "on" position. Use for feature toggle indicators.
- `Star` — Outlined star. Use for favorites, ratings, or highlights.
- `StarHalf` — Half-filled star. Use for partial ratings.
- `Heart` — Heart shape. Use for likes or favorites.
- `HeartHalfStroke` — Half-filled heart. Use for partial like or mixed sentiment.
- `HeartPulse` — Heart with pulse line. Use for health or vitals.
- `Smile` — Smiley face. Use for positive feedback or emoji features.
- `FaceFrownSlight` — Slight frown face. Use for negative feedback.
- `ThumbsUp` — Thumbs up. Use for approval or positive feedback.
- `ThumbsDown` — Thumbs down. Use for disapproval or negative feedback.
- `SignPost` — Directional signpost. Use for guidance or wayfinding.
- `Aperture` — Camera aperture. Use for photography or lens context.
- `WandMagicSparkles` — Magic wand with sparkles. Use for AI, auto-generate, or magic features.

#### Code & Developer

- `Code` — Angle brackets `</>`. Use for code or developer features.
- `CodeBranch` — Branch icon. Use for version control branches.
- `CodeCommit` — Commit node. Use for version control commits.
- `CodeCompare` — Compare arrows. Use for diff/compare features.
- `CodeFork` — Fork icon. Use for version control forks.
- `CodeMerge` — Merge icon. Use for version control merges.
- `CodePullRequest` — Pull request icon. Use for PR features.
- `BracketsCurly` — Curly braces `{}`. Use for JSON, code objects, or developer context.
- `Bug` — Bug insect. Use for bug reports or issue tracking.
- `API` — API text badge. Use for API features or endpoints.

#### Miscellaneous Symbols

- `Asterisk` — Asterisk `*`. Use for required fields or footnotes.
- `At` — At sign `@`. Use for email addresses or mentions.
- `Number` — Hash/number sign `#`. Use for number fields or channels.
- `Balloon` — Balloon. Use for celebrations or party context.
- `PaintbrushFine` — Fine paintbrush. Use for design or styling tools.
- `Palette` — Color palette. Use for theme or color customization.
- `Fill` — Paint bucket. Use for fill color or background color tools.
- `Flower` — Flower. Use for nature, spring, or decorative context.
- `Leaf` — Leaf. Use for nature, sustainability, or eco context.
- `AppleWhole` — Apple. Use for food, education, or health context.
- `Droplet` — Water droplet. Use for liquid, color, or hydration context.
- `Snowflake` — Snowflake. Use for winter, frozen, or cooling context.
- `Umbrella` — Umbrella. Use for insurance, protection, or weather.
- `Cloud` — Cloud. Use for cloud features or weather.
- `CloudBolt` — Cloud with lightning. Use for storm or cloud-error context.
- `CloudMoon` — Cloud with moon. Use for night/dark mode or nighttime.
- `CloudSun` — Cloud with sun. Use for partly cloudy or daytime.
- `Moon` — Crescent moon. Use for dark mode or night theme.
- `Brightness` — Sun/brightness. Use for light mode or brightness controls.
- `WavePulse` — Pulse/wave line. Use for activity or health monitoring.
- `TemperatureThreeQuarters` — Thermometer at 75%. Use for temperature or heat-level context.
- `WeightScale` — Weighing scale. Use for weight or measurement features. This is the actual scale — see `Scale` for expand/fullscreen.
- `LifeRing` — Life preserver ring. Use for help or support features.
- `Disconnect` — Broken link or unplug. Use for disconnected state.
- `EmbedsLinks` — Chain links inside a card. Use for embedded link previews or link cards. **Not** for hyperlink actions — use `Link` for that.
- `Web` — Globe with latitude/longitude lines. Use for website or web platform context.
- `Language` — Globe variant. Use for language or localization settings.
- `Brightness` — Sun rays. Use for brightness or light mode toggle.
- `KeyboardBrightness` — Keyboard backlight. Use for keyboard or input brightness.

#### Sports, Food & Lifestyle

- `GolfFlagHole` — Golf flag in hole. Use for golf or milestone context.
- `Baseball` — Baseball. Use for baseball or sports context.
- `Basketball` — Basketball. Use for basketball or sports context.
- `BowlingBall` — Bowling ball. Use for bowling or sports context.
- `Football` — American football. Use for football or sports context.
- `Soccer` — Soccer ball. Use for soccer/football or sports context.
- `TennisBall` — Tennis ball. Use for tennis or sports context.
- `GamepadModern` — Game controller. Use for gaming or interactive features.
- `DiceFive` — Die showing five. Use for random, chance, or gaming context.
- `Ship` — Ship. Use for shipping, maritime, or transport context.
- `Bus` — Bus. Use for transit or transportation context.
- `Car` — Car. Use for automotive or driving context.
- `Train` — Train. Use for rail or transit context.
- `Plane` — Airplane. Use for flights or travel context.
- `Shirt` — T-shirt. Use for clothing or apparel context.
- `ShoePrints` — Footprints. Use for tracking, steps, or walking context.
- `BedFront` — Bed. Use for accommodation, sleep, or hotel context.
- `ForkKnife` — Fork and knife. Use for dining, restaurant, or food context.
- `PizzaSlice` — Pizza slice. Use for food or casual context.
- `BurgerFries` — Burger with fries. Use for fast food or casual dining.
- `IceCream` — Ice cream cone. Use for dessert or treats context.
- `BeerMug` — Beer mug. Use for drinks or social context.
- `Mug` — Coffee mug. Use for coffee, breaks, or cafe context.
- `Glass` — Drinking glass. Use for beverages or bar context.
- `MartiniGlassEmpty` — Martini glass. Use for cocktails or nightlife context.
- `Egg` — Egg. Use for food or Easter context.
- `FishFins` — Fish with fins. Use for seafood or aquatic context.
- `Paw` — Paw print. Use for pets or animal context.
- `Dumbbell` — Dumbbell. Use for fitness or exercise context.
- `WatchApple` — Smartwatch. Use for wearable or watch context.
- `Bandage` — Adhesive bandage. Use for injury or first-aid context.
- `Mars` — Mars symbol (♂). Use for male gender context.
- `Venus` — Venus symbol (♀). Use for female gender context.
- `MarsAndVenus` — Combined Mars and Venus symbols. Use for gender-inclusive context.
- `Transgender` — Transgender symbol. Use for transgender context.

#### Brand & Third-Party Logos

These are logos for third-party integrations. Use only when referencing the specific service. Do not use as generic icons.

`AcuityScheduling`, `Airtable`, `AssemblyLogo`, `CalCom`, `Calendly`, `Canva`, `ClickUp`, `Databox`, `Dropbox`, `Facebook`, `Figma`, `GoogleCalendar`, `GoogleDocs`, `GoogleDrive`, `GoogleSheets`, `GoogleSlides`, `HubspotMeetings`, `Instagram`, `Jotform`, `LinkedIn`, `Loom`, `Make`, `Miro`, `Monday`, `Notion`, `OneDrive`, `PowerBi`, `QuickBook`, `Slack`, `Trello`, `Typeform`, `X` (X/Twitter — **not** a close button), `Xero`, `YouTube`, `Zapier`, `Zoom`

**Rules:**
- Do not make up props. Read the component source under `components/ui/` before using a component.
- **Before defining custom types that will be passed to a component, read the component's type definitions first.** Derive the value type directly from the component's prop types rather than guessing.

## Data Fetching (Client Components)

Client components use SWR hooks from `hooks/useApi.ts`:

```
const { data, isLoading, mutate } = useApi<Response>('/api/notes', { entityId });
const { trigger, isMutating } = useApiMutation('/api/notes');
await trigger('POST', { title: 'New note', entityId, entityType });
```

Token injection is automatic via `TokenProvider` context. After mutations, related SWR cache keys are revalidated.

## Resources

- [Custom Apps Guide](https://docs.assembly.com/docs/custom-apps-overview)
- [API Reference](https://docs.assembly.com/reference/getting-started-introduction)
- [Design System Storybook](https://design-system.assembly.com/)
