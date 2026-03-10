/**
 * @assembly-js/design-system — Type Schema
 *
 * Auto-generated bundled type declarations for all exported components.
 * This file is self-contained — no imports needed. It documents every
 * component's props, types, enums, and interfaces available in the
 * public API of @assembly-js/design-system.
 *
 * Generated: 2026-03-10
 *
 * USAGE: This file is meant to be read as a reference by humans or
 * AI coding assistants. It is NOT meant to be imported by TypeScript.
 * For actual type-checking, use the package's built-in .d.ts files.
 */
 
// ============================================================================
// Icon Names (391 icons)
// ============================================================================
 
type IconType = "Info" | "InfoSolid" | "Search" | "ResetZoom" | "FitToWidth" | "Ellipsis" | "MoreVertical" | "Download" | "Upload" | "Edit" | "Plus" | "Minus" | "Trash" | "ChevronRight" | "ChevronUp" | "ChevronDown" | "ChevronLeft" | "Copy" | "Duplicate" | "Automation" | "Play" | "Pause" | "Scale" | "Form" | "Message" | "Contract" | "Profile" | "Building" | "InvoicePaid" | "EditSolid" | "Archive" | "Unarchive" | "Settings" | "Link" | "Attachment" | "Close" | "Cancel" | "Smile" | "Share" | "Reply" | "Calendar" | "At" | "List" | "NumberedList" | "UnorderedList" | "Checklist" | "Tasks" | "Filter" | "Templates" | "Star" | "Email" | "EmailUnread" | "EmailRead" | "H1" | "H2" | "H3" | "Text" | "Bold" | "Italicize" | "Underline" | "Strikethrough" | "Menu" | "Inbox" | "Home" | "Notification" | "Billing" | "Dollar" | "Helpdesk" | "AppSetup" | "Gift" | "Location" | "Number" | "MobileNumber" | "Bank" | "Puzzle" | "Code" | "ArrowUpSolid" | "ArrowDownSolid" | "ArrowLeft" | "ArrowRight" | "ArrowNE" | "Dash" | "Compose" | "MassFileShare" | "Warning" | "WarningSolid" | "Failed" | "FailedSolid" | "Check" | "Success" | "SuccessSolid" | "New" | "ToDo" | "InProgress" | "Book" | "Send" | "SendFilled" | "Dot" | "SquareSolid" | "Eye" | "EyeHidden" | "Invoice" | "Comment" | "Invite" | "Spinner" | "Repeat" | "Web" | "Time" | "GraphBarSolid" | "Sidebar" | "SidebarFilled" | "Export" | "File" | "MP4" | "SVG" | "MOV" | "MP3" | "CSV" | "Excel" | "PNG" | "PDF" | "JPG" | "Doc" | "ZIP" | "Movie" | "GIF" | "Store" | "ShoppingBag" | "DragDrop" | "Image" | "ImageMissing" | "LogOut" | "Lead" | "QuestionMark" | "API" | "PlansPayments" | "Customization" | "Teams" | "AI" | "BracketsCurly" | "Callout" | "Table" | "Chart" | "Tag" | "ThumbsUp" | "ThumbsDown" | "CaretDown" | "CaretUp" | "CaretRight" | "Disconnect" | "Mention" | "Insert" | "AssemblyLogo" | "Reposition" | "Marketing" | "Gauge" | "Subtask" | "Compass" | "UnPin" | "Pin" | "Files" | "FolderLocked" | "Unlock" | "Authentication" | "LockFilled" | "Reverse" | "AuditLog" | "Subscription" | "Note" | "Accessibility" | "Plane" | "AlarmClock" | "Football" | "Aperture" | "BagShoppingPlus" | "BagShoppingMinus" | "Balloon" | "Bandage" | "Dumbbell" | "BarcodeRead" | "Baseball" | "BasketShoppingSimple" | "Basketball" | "Flask" | "BedFront" | "BeerMug" | "PersonBiking" | "Ship" | "FireSmoke" | "Bookmark" | "BowlingBall" | "Briefcase" | "WindowMaximize" | "PaintbrushFine" | "Bug" | "Wrench" | "Lightbulb" | "Bus" | "Buildings" | "Mug" | "Calculator" | "CalendarDays" | "Camera" | "CameraRotate" | "Car" | "CartShopping" | "MoneyBills" | "SignalBars" | "MessageDots" | "CommentDots" | "Messages" | "Cloud" | "CloudMoon" | "Fill" | "Palette" | "WandMagicSparkles" | "ScrewdriverWrench" | "Scissors" | "Desktop" | "DiceFive" | "BullseyeArrow" | "FileLines" | "Ear" | "EarthAmericas" | "PresentationScreen" | "Egg" | "EyeDropper" | "BurgerFries" | "Venus" | "InboxFull" | "Inboxes" | "Film" | "Fingerprint" | "FishFins" | "HeartPulse" | "Flag" | "Fire" | "BoltSlash" | "Flashlight" | "Flower" | "FolderOpen" | "Soccer" | "ShoePrints" | "GamepadModern" | "CodeBranch" | "CodeCommit" | "CodeCompare" | "CodeMerge" | "CodeFork" | "CodePullRequest" | "Glasses" | "GolfFlagHole" | "GridFourSquares" | "Hammer" | "Hand" | "Microchip" | "Headphones" | "Heart" | "HeartHalfStroke" | "LifeRing" | "SquareQuestion" | "Question" | "HourglassHalf" | "IceCream" | "IdBadge" | "ImageNotFilled" | "Images" | "Infinity" | "KeyboardBrightness" | "Key" | "Dialpad" | "Language" | "Laptop" | "LayerGroup" | "Leaf" | "LocationCrosshairs" | "Magnet" | "MarsAndVenus" | "Mars" | "PersonSimple" | "Map" | "Medal" | "Asterisk" | "BriefcaseMedical" | "Bullhorn" | "Moon" | "MusicNote" | "Music" | "LocationArrow" | "Newspaper" | "AppleWhole" | "CloudSun" | "SolarSystem" | "Paw" | "Mobile" | "Glass" | "PizzaSlice" | "PlanetRinged" | "ChartSimpleHorizontal" | "Tags" | "Print" | "WavePulse" | "Qrcode" | "RecordVinyl" | "SignalStream" | "Voicemail" | "ForkKnife" | "AwardSimple" | "Rocket" | "FaceFrownSlight" | "FloppyDisk" | "WeightScale" | "GraduationCap" | "Coins" | "ShareNodes" | "ShieldCheck" | "Shield" | "ShieldHalf" | "Shirt" | "Snowflake" | "SquareOutline" | "StarHalf" | "Stopwatch" | "Brightness" | "Autoresponder" | "RectangleWide" | "TennisBall" | "Telescope" | "TemperatureThreeQuarters" | "CloudBolt" | "Ticket" | "Timer" | "ToggleOn" | "SignPost" | "Train" | "Transgender" | "ArrowTrendDown" | "ArrowTrendUp" | "Triangle" | "Trophy" | "Tv" | "Umbrella" | "Video" | "PersonWalking" | "Wallet" | "WatchApple" | "Droplet" | "MartiniGlassEmpty" | "PersonDress" | "ImageStack" | "FontCase" | "HubspotMeetings" | "Notion" | "Loom" | "Calendly" | "Typeform" | "OneDrive" | "ClickUp" | "YouTube" | "Monday" | "Databox" | "Figma" | "PowerBi" | "Airtable" | "Zoom" | "QuickBook" | "Canva" | "Xero" | "AcuityScheduling" | "Trello" | "Slack" | "Zapier" | "Exporter" | "TokenInspector" | "Jotform" | "GoogleDrive" | "GoogleCalendar" | "CalCom" | "EmbedsLinks" | "Miro" | "Dropbox" | "Make" | "CustomApps" | "GoogleSheets" | "GoogleDocs" | "GoogleSlides" | "Instagram" | "X" | "Facebook" | "LinkedIn" | "FolderMove";
 
// ============================================================================
// Toolbar/types
// ============================================================================
 
export type ActionConfigType = 'action' | 'dropdown' | 'group';
export interface BaseActionConfig {
    id: string;
    type: ActionConfigType;
    label: string;
    icon?: IconType;
    shortcut?: string;
    group?: string;
}
export interface SimpleActionConfig extends BaseActionConfig {
    type: 'action';
    action: string;
    /** Optional tooltip text displayed on hover. Uses the design system Tooltip component. */
    tooltip?: string;
    /** Controls where the tooltip appears relative to the button. Defaults to 'top'. */
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}
export interface DropdownOption {
    value: string | number;
    label: string;
    icon?: IconType;
}
export interface DropdownActionConfig extends BaseActionConfig {
    type: 'dropdown';
    action: string;
    options: DropdownOption[];
    placeholder?: string;
}
export interface GroupConfig {
    id: string;
    type: 'group';
    label: string;
    icon?: IconType;
    actions: ActionConfig[];
}
export type ActionConfig = SimpleActionConfig | DropdownActionConfig | GroupConfig;
export interface ActionData {
    id: string;
    action: string;
    metadata?: {
        value?: string | number;
        [key: string]: unknown;
    };
}
export interface ActionState {
    isActive: boolean;
    isDisabled: boolean;
}
export interface ToolbarProviderProps {
    config: ActionConfig[];
    onAction: (action: ActionData) => void;
    getActionState?: (actionId: string, metadata?: Record<string, unknown>) => ActionState;
    editor?: unknown;
    children: ReactNode;
}
export interface ToolbarProps {
    variant?: 'highlight' | 'sticky';
    className?: string;
    overrideActions?: string[];
}
export interface SlashMenuProps {
    className?: string;
    maxHeight?: number | string;
    showShortcuts?: boolean;
    searchable?: boolean;
    onClose?: () => void;
    overrideActions?: string[];
}
export interface ToolbarContextValue {
    config: ActionConfig[];
    onAction: (action: ActionData) => void;
    getActionState: (actionId: string, metadata?: Record<string, unknown>) => ActionState;
    editor?: unknown;
}
 
// ============================================================================
// UserCompanySelector/types
// ============================================================================
 
export type UserCompanySelectorObjectType = 'company' | 'internalUser' | 'client';
export type UserCompanySelectorOption = Prettify<{
    value: string;
    label: string;
    avatarSrc?: string;
    avatarFallbackColor?: string;
    companyId?: string;
    type: UserCompanySelectorObjectType;
}>;
export type UserCompanySelectorGroupedOption = {
    label: string;
    options: UserCompanySelectorOption[];
};
export type OptionWithCompanyMetadata = UserCompanySelectorOption & {
    companyName?: string;
    companyAvatarSrc?: string;
    companyAvatarFallbackColor?: string;
};
export type UserCompanySelectorInputValue = {
    id: string;
    companyId: string;
    object: UserCompanySelectorObjectType;
};
export type UserCompanySelectorProps = {
    autoFocus?: boolean;
    initialValue?: UserCompanySelectorOption[];
    clientUsers: UserCompanySelectorOption[];
    companies: UserCompanySelectorOption[];
    name: string;
    onChange: (inputValue: UserCompanySelectorInputValue[]) => void;
    placeholder?: string;
    ignoreCompanies?: boolean;
    grouped?: boolean;
    internalUsers?: UserCompanySelectorOption[];
    ignoreFilterClientsByCompany?: boolean;
    limitSelectedOptions?: number;
    customLabels?: {
        individualTerm: string;
        individualTermPlural: string;
        groupTerm: string;
        groupTermPlural: string;
    };
    listHeading?: string;
};
/**
 * @deprecated Use Option instead
 */
export type ComboOption = UserCompanySelectorOption;
 
// ============================================================================
// Tooltip/Tooltip
// ============================================================================
 
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipTrigger = 'hover' | 'click';
type VerticalAlignments = 'top' | 'center' | 'bottom';
type HorizontalAlignments = 'left' | 'center' | 'right';
export interface TooltipOffset {
    x?: number;
    y?: number;
}
export interface TooltipProps {
    content: React.ReactNode;
    /**
     * @deprecated The position prop is deprecated in favor of anchorOrigin and transformOrigin
     */
    position?: TooltipPosition;
    trigger?: TooltipTrigger;
    disabled?: boolean;
    triggerClassname?: string;
    tooltipClassname?: string;
    anchorOrigin?: {
        vertical: VerticalAlignments;
        horizontal: HorizontalAlignments;
    };
    transformOrigin?: {
        vertical: VerticalAlignments;
        horizontal: HorizontalAlignments;
    };
    offset?: TooltipOffset;
    baseOffset?: number;
    showDelayDuration?: number;
}
type TooltipWithAction<T, P> = {
    actionType: T;
    actionProps: P;
};
type TooltipWithoutAction = {
    actionType?: undefined;
    actionProps?: undefined;
};
export declare const Tooltip: React.FC<PropsWithChildren<TooltipProps & (TooltipWithAction<'button', ButtonProps> | TooltipWithAction<'link', TextLinkProps> | TooltipWithAction<'status', StatusProps> | TooltipWithAction<'chip', ChipProps> | TooltipWithoutAction)>>;
export {};
 
// ============================================================================
// Button/Base
// ============================================================================
 
declare const baseButtonVariants: (props?: ({
    variant?: "primary" | "secondary" | "minimal" | undefined;
} & ({
    class?: import("cva").ClassValue;
    className?: undefined;
} | {
    class?: undefined;
    className?: import("cva").ClassValue;
})) | undefined) => string;
export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof baseButtonVariants> {
    type?: HTMLButtonElement['type'];
}
export declare const BaseButton: ({ className, type, variant, ...props }: BaseButtonProps) => import("react").JSX.Element;
export {};
 
// ============================================================================
// Typography/Base
// ============================================================================
 
declare const VARIANT_CLASSNAMES: {
    readonly body: "cop-font-sans";
    readonly display: "cop-font-sans";
    readonly heading: "cop-font-sans";
};
declare const SIZE_CLASSNAMES: {
    readonly '3xs': "cop-text-3xs";
    readonly '2xs': "cop-text-2xs";
    readonly xs: "cop-text-xs";
    readonly sm: "cop-text-sm";
    readonly base: "cop-text-base";
    readonly lg: "cop-text-lg";
    readonly xl: "cop-text-xl";
    readonly '2xl': "cop-text-2xl";
    readonly '3xl': "cop-text-3xl";
    readonly '4xl': "cop-text-4xl";
    readonly '5xl': "cop-text-5xl";
    readonly '6xl': "cop-text-6xl";
};
declare const LEADING_CLASSNAMES: {
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
    '8': string;
    '7': string;
    '6': string;
    '5': string;
    '4': string;
    '3': string;
    '2': string;
    '1': string;
    '075': string;
    '050': string;
    '025': string;
};
export type LeadingClassNames = keyof typeof LEADING_CLASSNAMES;
declare const WEIGHT_CLASSNAMES: {
    bold: string;
    semibold: string;
    medium: string;
    regular: string;
    light: string;
};
export type WeightClassNames = keyof typeof WEIGHT_CLASSNAMES;
export declare const Base: ({ children, className, leading, size, variant, tag, weight, ...props }: {
    children: ReactNode;
    className?: string;
    leading: LeadingClassNames;
    size: keyof typeof SIZE_CLASSNAMES;
    variant: keyof typeof VARIANT_CLASSNAMES;
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span';
    weight: WeightClassNames;
    /** Used by consumers to target typography components with CSS selectors */
    'data-typography'?: string;
}) => React.JSX.Element;
export {};
 
// ============================================================================
// Avatar/Avatar
// ============================================================================
 
type BaseProps = {
    size: '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant: 'circle' | 'rounded';
    fallbackColor?: string;
    fallbackClassName?: string;
    subAvatar?: Omit<AvatarProps, 'subAvatar' | 'size'>;
    icon?: IconType;
};
export type ImageProps = {
    src: string;
    alt: string;
} & BaseProps;
type TextProps = {
    text: string;
} & BaseProps;
type AvatarProps = TextProps | ImageProps;
declare const Avatar: React.ForwardRefExoticComponent<({
    content?: string | undefined;
    translate?: "yes" | "no" | undefined;
    prefix?: string | undefined;
    children?: React.ReactNode;
    className?: string | undefined;
    slot?: string | undefined;
    style?: React.CSSProperties | undefined;
    title?: string | undefined;
    dir?: string | undefined;
    key?: React.Key | null | undefined;
    defaultChecked?: boolean | undefined;
    defaultValue?: string | number | readonly string[] | undefined;
    suppressContentEditableWarning?: boolean | undefined;
    suppressHydrationWarning?: boolean | undefined;
    accessKey?: string | undefined;
    autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters" | (string & {}) | undefined;
    autoFocus?: boolean | undefined;
    contentEditable?: (boolean | "true" | "false") | "inherit" | undefined;
    contextMenu?: string | undefined;
    draggable?: (boolean | "true" | "false") | undefined;
    enterKeyHint?: "search" | "enter" | "done" | "go" | "next" | "previous" | "send" | undefined;
    hidden?: boolean | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    nonce?: string | undefined;
    placeholder?: string | undefined;
    spellCheck?: (boolean | "true" | "false") | undefined;
    tabIndex?: number | undefined;
    radioGroup?: string | undefined;
    role?: React.AriaRole | undefined;
    about?: string | undefined;
    datatype?: string | undefined;
    inlist?: any;
    property?: string | undefined;
    rel?: string | undefined;
    resource?: string | undefined;
    rev?: string | undefined;
    typeof?: string | undefined;
    vocab?: string | undefined;
    autoCorrect?: string | undefined;
    autoSave?: string | undefined;
    color?: string | undefined;
    itemProp?: string | undefined;
    itemScope?: boolean | undefined;
    itemType?: string | undefined;
    itemID?: string | undefined;
    itemRef?: string | undefined;
    results?: number | undefined;
    security?: string | undefined;
    unselectable?: "off" | "on" | undefined;
    inputMode?: "search" | "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | undefined;
    is?: string | undefined;
    exportparts?: string | undefined;
    part?: string | undefined;
    "aria-activedescendant"?: string | undefined;
    "aria-atomic"?: (boolean | "true" | "false") | undefined;
    "aria-autocomplete"?: "none" | "list" | "both" | "inline" | undefined;
    "aria-braillelabel"?: string | undefined;
    "aria-brailleroledescription"?: string | undefined;
    "aria-busy"?: (boolean | "true" | "false") | undefined;
    "aria-checked"?: boolean | "true" | "false" | "mixed" | undefined;
    "aria-colcount"?: number | undefined;
    "aria-colindex"?: number | undefined;
    "aria-colindextext"?: string | undefined;
    "aria-colspan"?: number | undefined;
    "aria-controls"?: string | undefined;
    "aria-current"?: boolean | "time" | "true" | "false" | "step" | "page" | "location" | "date" | undefined;
    "aria-describedby"?: string | undefined;
    "aria-description"?: string | undefined;
    "aria-details"?: string | undefined;
    "aria-disabled"?: (boolean | "true" | "false") | undefined;
    "aria-dropeffect"?: "copy" | "link" | "none" | "move" | "execute" | "popup" | undefined;
    "aria-errormessage"?: string | undefined;
    "aria-expanded"?: (boolean | "true" | "false") | undefined;
    "aria-flowto"?: string | undefined;
    "aria-grabbed"?: (boolean | "true" | "false") | undefined;
    "aria-haspopup"?: boolean | "dialog" | "menu" | "true" | "false" | "grid" | "listbox" | "tree" | undefined;
    "aria-hidden"?: (boolean | "true" | "false") | undefined;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling" | undefined;
    "aria-keyshortcuts"?: string | undefined;
    "aria-label"?: string | undefined;
    "aria-labelledby"?: string | undefined;
    "aria-level"?: number | undefined;
    "aria-live"?: "off" | "assertive" | "polite" | undefined;
    "aria-modal"?: (boolean | "true" | "false") | undefined;
    "aria-multiline"?: (boolean | "true" | "false") | undefined;
    "aria-multiselectable"?: (boolean | "true" | "false") | undefined;
    "aria-orientation"?: "horizontal" | "vertical" | undefined;
    "aria-owns"?: string | undefined;
    "aria-placeholder"?: string | undefined;
    "aria-posinset"?: number | undefined;
    "aria-pressed"?: boolean | "true" | "false" | "mixed" | undefined;
    "aria-readonly"?: (boolean | "true" | "false") | undefined;
    "aria-relevant"?: "text" | "all" | "additions" | "additions removals" | "additions text" | "removals" | "removals additions" | "removals text" | "text additions" | "text removals" | undefined;
    "aria-required"?: (boolean | "true" | "false") | undefined;
    "aria-roledescription"?: string | undefined;
    "aria-rowcount"?: number | undefined;
    "aria-rowindex"?: number | undefined;
    "aria-rowindextext"?: string | undefined;
    "aria-rowspan"?: number | undefined;
    "aria-selected"?: (boolean | "true" | "false") | undefined;
    "aria-setsize"?: number | undefined;
    "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined;
    "aria-valuemax"?: number | undefined;
    "aria-valuemin"?: number | undefined;
    "aria-valuenow"?: number | undefined;
    "aria-valuetext"?: string | undefined;
    dangerouslySetInnerHTML?: {
        __html: string | TrustedHTML;
    } | undefined;
    onCopy?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onCopyCapture?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onCut?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onCutCapture?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onPaste?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onPasteCapture?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onCompositionEnd?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onCompositionEndCapture?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onCompositionStart?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onCompositionStartCapture?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onCompositionUpdate?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onCompositionUpdateCapture?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onFocus?: React.FocusEventHandler<HTMLSpanElement> | undefined;
    onFocusCapture?: React.FocusEventHandler<HTMLSpanElement> | undefined;
    onBlur?: React.FocusEventHandler<HTMLSpanElement> | undefined;
    onBlurCapture?: React.FocusEventHandler<HTMLSpanElement> | undefined;
    onChange?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onChangeCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onBeforeInput?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onBeforeInputCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onInput?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onInputCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onReset?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onResetCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onSubmit?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onSubmitCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onInvalid?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onInvalidCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onLoad?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onError?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onErrorCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onKeyDown?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onKeyDownCapture?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onKeyPress?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onKeyPressCapture?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onKeyUp?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onKeyUpCapture?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onAbort?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onAbortCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onCanPlay?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onCanPlayCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onCanPlayThrough?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onCanPlayThroughCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onDurationChange?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onDurationChangeCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEmptied?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEmptiedCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEncrypted?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEncryptedCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEnded?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEndedCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadedData?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadedDataCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadedMetadata?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadedMetadataCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadStart?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadStartCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPause?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPauseCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPlay?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPlayCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPlaying?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPlayingCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onProgress?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onProgressCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onRateChange?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onRateChangeCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSeeked?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSeekedCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSeeking?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSeekingCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onStalled?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onStalledCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSuspend?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSuspendCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onTimeUpdate?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onTimeUpdateCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onVolumeChange?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onVolumeChangeCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onWaiting?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onWaitingCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onAuxClick?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onAuxClickCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onClick?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onClickCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onContextMenu?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onContextMenuCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onDoubleClick?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onDoubleClickCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onDrag?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragEnd?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragEndCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragEnter?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragEnterCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragExit?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragExitCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragLeave?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragLeaveCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragOver?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragOverCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragStart?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragStartCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDrop?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDropCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onMouseDown?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseDownCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseEnter?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseLeave?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseMove?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseMoveCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseOut?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseOutCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseOver?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseOverCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseUp?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseUpCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onSelect?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSelectCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onTouchCancel?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchCancelCapture?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchEnd?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchEndCapture?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchMove?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchMoveCapture?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchStart?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchStartCapture?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onPointerDown?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerDownCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerMove?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerMoveCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerUp?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerUpCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerCancel?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerCancelCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerEnter?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerLeave?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerOver?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerOverCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerOut?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerOutCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onGotPointerCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onGotPointerCaptureCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onLostPointerCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onLostPointerCaptureCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onScroll?: React.UIEventHandler<HTMLSpanElement> | undefined;
    onScrollCapture?: React.UIEventHandler<HTMLSpanElement> | undefined;
    onWheel?: React.WheelEventHandler<HTMLSpanElement> | undefined;
    onWheelCapture?: React.WheelEventHandler<HTMLSpanElement> | undefined;
    onAnimationStart?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onAnimationStartCapture?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onAnimationEnd?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onAnimationEndCapture?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onAnimationIteration?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onAnimationIterationCapture?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onTransitionEnd?: React.TransitionEventHandler<HTMLSpanElement> | undefined;
    onTransitionEndCapture?: React.TransitionEventHandler<HTMLSpanElement> | undefined;
    asChild?: boolean | undefined;
    text: string;
    size: '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant: 'circle' | 'rounded';
    fallbackColor?: string | undefined;
    fallbackClassName?: string | undefined;
    subAvatar?: Omit<AvatarProps, "size" | "subAvatar"> | undefined;
    icon?: IconType;
} | {
    content?: string | undefined;
    translate?: "yes" | "no" | undefined;
    prefix?: string | undefined;
    children?: React.ReactNode;
    className?: string | undefined;
    slot?: string | undefined;
    style?: React.CSSProperties | undefined;
    title?: string | undefined;
    dir?: string | undefined;
    key?: React.Key | null | undefined;
    defaultChecked?: boolean | undefined;
    defaultValue?: string | number | readonly string[] | undefined;
    suppressContentEditableWarning?: boolean | undefined;
    suppressHydrationWarning?: boolean | undefined;
    accessKey?: string | undefined;
    autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters" | (string & {}) | undefined;
    autoFocus?: boolean | undefined;
    contentEditable?: (boolean | "true" | "false") | "inherit" | undefined;
    contextMenu?: string | undefined;
    draggable?: (boolean | "true" | "false") | undefined;
    enterKeyHint?: "search" | "enter" | "done" | "go" | "next" | "previous" | "send" | undefined;
    hidden?: boolean | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    nonce?: string | undefined;
    placeholder?: string | undefined;
    spellCheck?: (boolean | "true" | "false") | undefined;
    tabIndex?: number | undefined;
    radioGroup?: string | undefined;
    role?: React.AriaRole | undefined;
    about?: string | undefined;
    datatype?: string | undefined;
    inlist?: any;
    property?: string | undefined;
    rel?: string | undefined;
    resource?: string | undefined;
    rev?: string | undefined;
    typeof?: string | undefined;
    vocab?: string | undefined;
    autoCorrect?: string | undefined;
    autoSave?: string | undefined;
    color?: string | undefined;
    itemProp?: string | undefined;
    itemScope?: boolean | undefined;
    itemType?: string | undefined;
    itemID?: string | undefined;
    itemRef?: string | undefined;
    results?: number | undefined;
    security?: string | undefined;
    unselectable?: "off" | "on" | undefined;
    inputMode?: "search" | "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | undefined;
    is?: string | undefined;
    exportparts?: string | undefined;
    part?: string | undefined;
    "aria-activedescendant"?: string | undefined;
    "aria-atomic"?: (boolean | "true" | "false") | undefined;
    "aria-autocomplete"?: "none" | "list" | "both" | "inline" | undefined;
    "aria-braillelabel"?: string | undefined;
    "aria-brailleroledescription"?: string | undefined;
    "aria-busy"?: (boolean | "true" | "false") | undefined;
    "aria-checked"?: boolean | "true" | "false" | "mixed" | undefined;
    "aria-colcount"?: number | undefined;
    "aria-colindex"?: number | undefined;
    "aria-colindextext"?: string | undefined;
    "aria-colspan"?: number | undefined;
    "aria-controls"?: string | undefined;
    "aria-current"?: boolean | "time" | "true" | "false" | "step" | "page" | "location" | "date" | undefined;
    "aria-describedby"?: string | undefined;
    "aria-description"?: string | undefined;
    "aria-details"?: string | undefined;
    "aria-disabled"?: (boolean | "true" | "false") | undefined;
    "aria-dropeffect"?: "copy" | "link" | "none" | "move" | "execute" | "popup" | undefined;
    "aria-errormessage"?: string | undefined;
    "aria-expanded"?: (boolean | "true" | "false") | undefined;
    "aria-flowto"?: string | undefined;
    "aria-grabbed"?: (boolean | "true" | "false") | undefined;
    "aria-haspopup"?: boolean | "dialog" | "menu" | "true" | "false" | "grid" | "listbox" | "tree" | undefined;
    "aria-hidden"?: (boolean | "true" | "false") | undefined;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling" | undefined;
    "aria-keyshortcuts"?: string | undefined;
    "aria-label"?: string | undefined;
    "aria-labelledby"?: string | undefined;
    "aria-level"?: number | undefined;
    "aria-live"?: "off" | "assertive" | "polite" | undefined;
    "aria-modal"?: (boolean | "true" | "false") | undefined;
    "aria-multiline"?: (boolean | "true" | "false") | undefined;
    "aria-multiselectable"?: (boolean | "true" | "false") | undefined;
    "aria-orientation"?: "horizontal" | "vertical" | undefined;
    "aria-owns"?: string | undefined;
    "aria-placeholder"?: string | undefined;
    "aria-posinset"?: number | undefined;
    "aria-pressed"?: boolean | "true" | "false" | "mixed" | undefined;
    "aria-readonly"?: (boolean | "true" | "false") | undefined;
    "aria-relevant"?: "text" | "all" | "additions" | "additions removals" | "additions text" | "removals" | "removals additions" | "removals text" | "text additions" | "text removals" | undefined;
    "aria-required"?: (boolean | "true" | "false") | undefined;
    "aria-roledescription"?: string | undefined;
    "aria-rowcount"?: number | undefined;
    "aria-rowindex"?: number | undefined;
    "aria-rowindextext"?: string | undefined;
    "aria-rowspan"?: number | undefined;
    "aria-selected"?: (boolean | "true" | "false") | undefined;
    "aria-setsize"?: number | undefined;
    "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined;
    "aria-valuemax"?: number | undefined;
    "aria-valuemin"?: number | undefined;
    "aria-valuenow"?: number | undefined;
    "aria-valuetext"?: string | undefined;
    dangerouslySetInnerHTML?: {
        __html: string | TrustedHTML;
    } | undefined;
    onCopy?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onCopyCapture?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onCut?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onCutCapture?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onPaste?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onPasteCapture?: React.ClipboardEventHandler<HTMLSpanElement> | undefined;
    onCompositionEnd?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onCompositionEndCapture?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onCompositionStart?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onCompositionStartCapture?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onCompositionUpdate?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onCompositionUpdateCapture?: React.CompositionEventHandler<HTMLSpanElement> | undefined;
    onFocus?: React.FocusEventHandler<HTMLSpanElement> | undefined;
    onFocusCapture?: React.FocusEventHandler<HTMLSpanElement> | undefined;
    onBlur?: React.FocusEventHandler<HTMLSpanElement> | undefined;
    onBlurCapture?: React.FocusEventHandler<HTMLSpanElement> | undefined;
    onChange?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onChangeCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onBeforeInput?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onBeforeInputCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onInput?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onInputCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onReset?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onResetCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onSubmit?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onSubmitCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onInvalid?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onInvalidCapture?: React.FormEventHandler<HTMLSpanElement> | undefined;
    onLoad?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onError?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onErrorCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onKeyDown?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onKeyDownCapture?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onKeyPress?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onKeyPressCapture?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onKeyUp?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onKeyUpCapture?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
    onAbort?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onAbortCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onCanPlay?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onCanPlayCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onCanPlayThrough?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onCanPlayThroughCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onDurationChange?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onDurationChangeCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEmptied?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEmptiedCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEncrypted?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEncryptedCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEnded?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onEndedCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadedData?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadedDataCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadedMetadata?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadedMetadataCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadStart?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onLoadStartCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPause?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPauseCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPlay?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPlayCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPlaying?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onPlayingCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onProgress?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onProgressCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onRateChange?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onRateChangeCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSeeked?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSeekedCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSeeking?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSeekingCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onStalled?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onStalledCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSuspend?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSuspendCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onTimeUpdate?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onTimeUpdateCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onVolumeChange?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onVolumeChangeCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onWaiting?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onWaitingCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onAuxClick?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onAuxClickCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onClick?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onClickCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onContextMenu?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onContextMenuCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onDoubleClick?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onDoubleClickCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onDrag?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragEnd?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragEndCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragEnter?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragEnterCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragExit?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragExitCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragLeave?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragLeaveCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragOver?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragOverCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragStart?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDragStartCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDrop?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onDropCapture?: React.DragEventHandler<HTMLSpanElement> | undefined;
    onMouseDown?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseDownCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseEnter?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseLeave?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseMove?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseMoveCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseOut?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseOutCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseOver?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseOverCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseUp?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onMouseUpCapture?: React.MouseEventHandler<HTMLSpanElement> | undefined;
    onSelect?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onSelectCapture?: React.ReactEventHandler<HTMLSpanElement> | undefined;
    onTouchCancel?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchCancelCapture?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchEnd?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchEndCapture?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchMove?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchMoveCapture?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchStart?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onTouchStartCapture?: React.TouchEventHandler<HTMLSpanElement> | undefined;
    onPointerDown?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerDownCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerMove?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerMoveCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerUp?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerUpCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerCancel?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerCancelCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerEnter?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerLeave?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerOver?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerOverCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerOut?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onPointerOutCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onGotPointerCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onGotPointerCaptureCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onLostPointerCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onLostPointerCaptureCapture?: React.PointerEventHandler<HTMLSpanElement> | undefined;
    onScroll?: React.UIEventHandler<HTMLSpanElement> | undefined;
    onScrollCapture?: React.UIEventHandler<HTMLSpanElement> | undefined;
    onWheel?: React.WheelEventHandler<HTMLSpanElement> | undefined;
    onWheelCapture?: React.WheelEventHandler<HTMLSpanElement> | undefined;
    onAnimationStart?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onAnimationStartCapture?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onAnimationEnd?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onAnimationEndCapture?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onAnimationIteration?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onAnimationIterationCapture?: React.AnimationEventHandler<HTMLSpanElement> | undefined;
    onTransitionEnd?: React.TransitionEventHandler<HTMLSpanElement> | undefined;
    onTransitionEndCapture?: React.TransitionEventHandler<HTMLSpanElement> | undefined;
    asChild?: boolean | undefined;
    src: string;
    alt: string;
    size: '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant: 'circle' | 'rounded';
    fallbackColor?: string | undefined;
    fallbackClassName?: string | undefined;
    subAvatar?: Omit<AvatarProps, "size" | "subAvatar"> | undefined;
    icon?: IconType;
}) & React.RefAttributes<HTMLSpanElement>>;
export { Avatar };
 
// ============================================================================
// Avatar/UserWithCompanyAvatar
// ============================================================================
 
/// <reference types="react" />
export declare function UserWithCompanyAvatar({ size, avatarSrc, fallbackColor, text, icon, companyText, companyAvatarSrc, companyAvatarFallbackColor, companyAvatarIcon, }: {
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    avatarSrc: string;
    fallbackColor: string;
    text: string;
    icon?: IconType;
    companyText?: string;
    companyAvatarSrc?: string;
    companyAvatarIcon?: IconType;
    companyAvatarFallbackColor?: string;
}): import("react").JSX.Element;
 
// ============================================================================
// Breadcrumb/Breadcrumbs
// ============================================================================
 
type BreadcrumbItemType = {
    label: string;
    href?: string;
    active?: boolean;
};
export declare const Breadcrumbs: ({ items, separator, }: {
    items: BreadcrumbItemType[];
    separator?: IconType;
}) => React.JSX.Element;
export {};
 
// ============================================================================
// Button/index
// ============================================================================
 
/// <reference types="react" />
declare const buttonVariants: (props?: ({
    size?: "sm" | "base" | undefined;
} & ({
    class?: import("cva").ClassValue;
    className?: undefined;
} | {
    class?: undefined;
    className?: import("cva").ClassValue;
})) | undefined) => string;
type PickedBaseButtonProps = {
    [K in keyof BaseButtonProps as K extends 'children' | 'variant' ? never : K]: BaseButtonProps[K];
};
export interface ButtonProps extends PickedBaseButtonProps, VariantProps<typeof buttonVariants> {
    label: string;
    loading?: boolean;
    prefixIcon?: IconType;
    suffixIcon?: IconType;
    variant?: Exclude<BaseButtonProps['variant'], 'minimal'> | 'text';
}
export declare const Button: ({ className, label, loading, prefixIcon, size, suffixIcon, variant, ...props }: ButtonProps) => import("react").JSX.Element;
 
// ============================================================================
// Button/Icon
// ============================================================================
 
/// <reference types="react" />
declare const iconButtonVariants: (props?: ({
    size?: "sm" | "base" | undefined;
} & ({
    class?: import("cva").ClassValue;
    className?: undefined;
} | {
    class?: undefined;
    className?: import("cva").ClassValue;
})) | undefined) => string;
type PickedBaseButtonProps = {
    [K in keyof BaseButtonProps as K extends 'children' ? never : K]: BaseButtonProps[K];
};
export interface IconButtonProps extends PickedBaseButtonProps, VariantProps<typeof iconButtonVariants> {
    icon: IconType;
    label?: string;
}
export declare const IconButton: ({ className, icon, label, size, ...props }: IconButtonProps) => import("react").JSX.Element;
export {};
 
// ============================================================================
// Checkbox/Checkbox
// ============================================================================
 
export declare enum CheckboxSize {
    DEFAULT = "default",
    LARGE = "lg"
}
export interface CheckboxClasses {
    root?: string;
    input?: string;
}
export interface CheckboxProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'size'> {
    label: string;
    description?: string;
    tooltipProps?: TooltipProps;
    checked?: boolean;
    /**
     * Displays a dash icon with filled background, representing a "partially
     * selected" state. Takes visual and semantic precedence over `checked` —
     * when `true`, the checkbox renders as indeterminate regardless of `checked`.
     *
     * Sets `aria-checked="mixed"` and the native `input.indeterminate` DOM
     * property. This is a controlled prop — on click, `onChange` fires and the
     * parent should recompute both `checked` and `indeterminate` from state.
     *
     * @default false
     */
    indeterminate?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    size?: CheckboxSize;
    classes?: CheckboxClasses;
}
export declare const Checkbox: React.ForwardRefExoticComponent<Omit<CheckboxProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
 
// ============================================================================
// CheckboxGroup/CheckboxGroup
// ============================================================================
 
export interface CheckboxGroupProps {
    label: string;
    description?: string;
    error?: string;
    helperText?: string;
    direction?: ChoiceGroupDirection;
    layout?: ChoiceGroupColumns;
    value: string[];
    onChange: (e: string[]) => void;
    children: React.ReactNode;
    className?: string;
    tooltipProps?: TooltipProps;
}
export declare const useCheckboxGroup: () => {
    value: string[];
    onChange: (e: string) => void;
} | null;
export declare const CheckboxGroup: React.FC<CheckboxGroupProps>;
 
// ============================================================================
// Chip/Chip
// ============================================================================
 
declare const chipStyles: (props?: ({
    variant?: "default" | "filled" | "outlined" | undefined;
    size?: "sm" | "lg" | "md" | undefined;
    disabled?: boolean | undefined;
} & ({
    class?: import("cva").ClassValue;
    className?: undefined;
} | {
    class?: undefined;
    className?: import("cva").ClassValue;
})) | undefined) => string;
export interface ChipProps extends VariantProps<typeof chipStyles> {
    label: string;
    className?: string;
    prefixIcon?: IconType | Exclude<React.ReactNode, string>;
    onClick?: (event: React.KeyboardEvent | React.MouseEvent) => void;
    onClose?: (event: React.KeyboardEvent | React.MouseEvent | React.TouchEvent) => void;
    'aria-pressed'?: AriaAttributes['aria-pressed'];
}
export declare const Chip: ({ color, variant, label, size, className, prefixIcon, disabled, onClick, onClose, "aria-pressed": ariaPressed, }: ChipProps & {
    color?: string;
}) => React.JSX.Element;
export {};
 
// ============================================================================
// Icon
// ============================================================================
 
export type IconType = keyof typeof icons;
export declare const Icon: ({ icon, ...props }: {
    icon: IconType;
} & SVGProps<SVGSVGElement>) => import("react").JSX.Element | null;
 
// ============================================================================
// Input/Input
// ============================================================================
 
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string | undefined;
    label?: string | undefined;
    containerClassName?: string | undefined;
    errorClassName?: string | undefined;
    labelClassName?: string | undefined;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export { Input };
 
// ============================================================================
// Input/Textarea
// ============================================================================
 
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string | undefined;
    label?: string | undefined;
    containerClassName?: string | undefined;
    errorClassName?: string | undefined;
    labelClassName?: string | undefined;
}
declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
export { Textarea };
 
// ============================================================================
// Input/TagInput
// ============================================================================
 
export declare function MultiValueComponent<OptionProps extends TagProps & {
    value: string;
}, GroupProps extends GroupBase<OptionProps> = GroupBase<OptionProps>>(props: MultiValueProps<OptionProps, true, GroupProps>): React.JSX.Element;
export declare function OptionComponent<_OptionProps extends TagProps & {
    value: string;
}, GroupProps extends GroupBase<_OptionProps> = GroupBase<_OptionProps>>(props: OptionProps<_OptionProps, true, GroupProps>): React.JSX.Element;
export interface TagInputProps<Option, Group extends GroupBase<Option> = GroupBase<Option>> extends Props<Option, true, Group> {
    error?: string | undefined;
    label?: string | undefined;
    labelClassName?: string | undefined;
    containerClassName?: string | undefined;
    errorClassName?: string | undefined;
}
export declare function TagInput<OptionProps extends TagProps & {
    value: string;
}, GroupProps extends GroupBase<OptionProps> = GroupBase<OptionProps>>({ label, error, isDisabled, labelClassName, errorClassName, containerClassName, ...props }: TagInputProps<OptionProps, GroupProps>): React.JSX.Element;
 
// ============================================================================
// Search/Search
// ============================================================================
 
/// <reference types="react" />
export declare function Search({ align, onSearch, }: {
    align?: 'left' | 'right';
    onSearch: (query: string) => void;
}): import("react").JSX.Element;
 
// ============================================================================
// Spinner
// ============================================================================
 
/**
 * Spinner component is used to indicate a loading state of a component or page.
 */
export declare const Spinner: ({ size }: {
    size: 10 | 5;
}) => React.JSX.Element;
 
// ============================================================================
// Status/Status
// ============================================================================
 
export type StatusProps = {
    label: string;
    status?: 'info' | 'success' | 'warning' | 'error' | 'neutral' | 'highlight';
    showIcon?: boolean;
    className?: string;
    icon?: IconType;
};
export declare const Status: ({ label, status, showIcon, className, icon, }: StatusProps) => React.JSX.Element;
 
// ============================================================================
// Tag/Tag
// ============================================================================
 
declare const ColorVariantToBgColors: {
    default: string;
    info: string;
    success: string;
    warning: string;
    danger: string;
};
type ImgSrc = string;
export interface TagProps {
    text: string;
    color?: keyof typeof ColorVariantToBgColors;
    prefix?: 'ChevronDown' | 'Plus' | ImgSrc;
    onRemove?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    onFocus?: React.FocusEventHandler<HTMLButtonElement> | undefined;
    className?: string;
}
export declare const Tag: React.FC<TagProps>;
export {};
 
// ============================================================================
// TextLink/TextLink
// ============================================================================
 
export type TextLinkProps = PropsWithChildren<{
    disabled?: boolean;
    /**
     * @deprecated The external prop is deprecated.
     */
    external?: boolean;
    variant?: 'default' | 'secondary' | 'minimal';
} & React.AnchorHTMLAttributes<HTMLAnchorElement>>;
export declare function TextLink({ children, variant, className, disabled, href, ...props }: TextLinkProps): React.JSX.Element;
 
// ============================================================================
// Typography/Body
// ============================================================================
 
export declare function Body({ children, className, tag, size, }: {
    children: ReactNode;
    className?: string;
    tag?: 'p' | 'div' | 'span';
    size?: 'xs' | 'sm' | 'base' | 'lg';
}): React.JSX.Element;
 
// ============================================================================
// Typography/Heading
// ============================================================================
 
export declare function Heading({ children, className, tag, size, }: {
    children: ReactNode;
    className?: string;
    /**
     * Do not use `span` unless you absolutely need this component's styles
     * without the semantics of a heading tag.
     */
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
    size?: '3xs' | '2xs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
}): React.JSX.Element;
 
// ============================================================================
// Toggle/Toggle
// ============================================================================
 
export declare enum ToggleSize {
    DEFAULT = "default",
    LARGE = "lg"
}
export interface ToggleProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'size'> {
    label: string;
    description?: string;
    tooltipProps?: TooltipProps;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    size?: ToggleSize;
}
export declare const Toggle: React.ForwardRefExoticComponent<Omit<ToggleProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
 
// ============================================================================
// Radio/Radio
// ============================================================================
 
export declare enum RadioSize {
    DEFAULT = "default",
    LARGE = "lg"
}
export interface RadioClasses {
    root?: string;
    input?: string;
}
export interface RadioProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'size'> {
    label: string;
    description?: string;
    tooltipProps?: TooltipProps;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    size?: RadioSize;
    classes?: RadioClasses;
}
export declare const Radio: React.ForwardRefExoticComponent<Omit<RadioProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
 
// ============================================================================
// RadioGroup/RadioGroup
// ============================================================================
 
export interface RadioGroupProps {
    label: string;
    description?: string;
    error?: string;
    helperText?: string;
    direction?: ChoiceGroupDirection;
    layout?: ChoiceGroupColumns;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children: React.ReactNode;
    className?: string;
    tooltipProps?: TooltipProps;
}
export declare const useRadioGroup: () => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} | null;
export declare const RadioGroup: React.FC<RadioGroupProps>;
 
// ============================================================================
// Callout/Callout
// ============================================================================
 
type CalloutProps = {
    title?: React.ReactNode;
    description?: React.ReactNode;
    variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral' | 'highlight';
    onClose?: () => void;
    /**
     * @deprecated Use actionProps instead
     */
    actionLabel?: string;
    /**
     * @deprecated Use actionProps instead
     */
    onActionClick?: () => void;
    actionProps?: ButtonProps;
    footerAction?: TextLinkProps;
    icon?: IconType;
};
export declare const Callout: ({ title, description, variant, onClose, actionLabel, onActionClick, actionProps, footerAction, icon, }: CalloutProps) => React.JSX.Element;
export {};
 
// ============================================================================
// Toolbar/Toolbar
// ============================================================================
 
/// <reference types="react" />
export declare const Toolbar: ({ variant, className, overrideActions, }: ToolbarProps) => import("react").JSX.Element;
 
// ============================================================================
// Toolbar/SlashMenu
// ============================================================================
 
/// <reference types="react" />
export declare const SlashMenu: ({ className, onClose, overrideActions, }: SlashMenuProps) => import("react").JSX.Element;
 
// ============================================================================
// Toolbar/ToolbarContext
// ============================================================================
 
/// <reference types="react" />
export declare const ToolbarProvider: ({ config, onAction, getActionState, editor, children, }: ToolbarProviderProps) => import("react").JSX.Element;
export declare const useToolbar: () => ToolbarContextValue;
 
// ============================================================================
// UserCompanySelector/UserCompanySelector
// ============================================================================
 
export declare const UserCompanySelector: FC<UserCompanySelectorProps & Omit<Props<UserCompanySelectorOption, true, UserCompanySelectorGroupedOption>, 'onChange'>>;
 
// ============================================================================
// Toast/useToast
// ============================================================================
 
type ToasterToast = ToastProps & {
    id: string;
    title?: string;
    description?: string | React.ReactNode;
    action?: string;
    actionHref?: string;
};
declare const actionTypes: {
    readonly ADD_TOAST: "ADD_TOAST";
    readonly UPDATE_TOAST: "UPDATE_TOAST";
    readonly DISMISS_TOAST: "DISMISS_TOAST";
    readonly REMOVE_TOAST: "REMOVE_TOAST";
};
type ActionType = typeof actionTypes;
type Action = {
    type: ActionType['ADD_TOAST'];
    toast: ToasterToast;
} | {
    type: ActionType['UPDATE_TOAST'];
    toast: Partial<ToasterToast>;
} | {
    type: ActionType['DISMISS_TOAST'];
    toastId?: ToasterToast['id'];
} | {
    type: ActionType['REMOVE_TOAST'];
    toastId?: ToasterToast['id'];
};
interface State {
    toasts: ToasterToast[];
}
export declare const reducer: (state: State, action: Action) => State;
type Toast = Omit<ToasterToast, 'id'>;
declare function toast({ ...props }: Toast): {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
};
declare function useToast(): {
    toast: typeof toast;
    dismiss: (toastId?: string) => void;
    update: (toast: Partial<ToasterToast>) => void;
    toasts: ToasterToast[];
};
export { useToast, toast };