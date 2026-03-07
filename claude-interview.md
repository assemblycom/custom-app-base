# Interview Transcript

## Q1: Internal User Overview View

**Question:** For the internal user overview view, what data should be shown?

**Answer:** Client/company list with picker - a table or list of clients and companies with search/filter, click to drill into details.

## Q2: Client View

**Question:** For the client view, what should a client see when they open the app?

**Answer:** Their profile + company info - client sees their own details, company info, and related resources (notes, tasks, files).

## Q3: SDK Mutations to Demonstrate

**Question:** Which SDK mutations should we demonstrate?

**Answer:** Notes + tasks + files - full suite showing text content (notes CRUD), workflow status (task management), and file uploads.

## Q4: Details View Architecture

**Question:** For the details view (internal user viewing a specific client/company), should this be a separate page/route or token-driven?

**Answer:** Hybrid approach, but be mindful that the app won't pass in id as a path param. Instead it will have a query param for token. The Assembly platform requests URLs during app setup. There is an internal URL and a client URL that can be provided. These URLs are set once and they get a token query param that has information the app can use to check for who this context is related to. The platform will not pass in a token that has internal user info to the client URL. So we don't have to worry that the client portal view will have the incorrect session.

**Key insight:** Two separate entry URLs (internal + client), both receive token query param. Token determines context. No path-based user identification needed.

## Q5: Existing Example Content

**Question:** How much should we preserve from the current getting-started/example content?

**Answer:** Keep as a separate /examples page. Move current demo sections to a dedicated page, keep the main app realistic.

## Q6: AGENTS.md Improvements

**Question:** For the AGENTS.md improvements, what's most important to guide developers on?

**Answer:** Both view architecture patterns and SDK usage patterns + app-bridge patterns. But don't be overly verbose with long descriptions and long code examples.

## Q7: In-App Navigation

**Question:** For internal user navigation within the app (e.g., clicking a client in the list to see their details), should we use Next.js client-side routing with the app-bridge breadcrumbs?

**Answer:** Client-side routing + breadcrumbs - use Next.js router to navigate between views, update bridge breadcrumbs to reflect current location.

## Q8: Data Freshness

**Question:** Should the app demonstrate any real-time or polling patterns?

**Answer:** Up to you - whatever makes the best example.
