# Star Flow - Project Handoff & Context

**Project Name:** Star Flow
**Description:** A B2B SaaS application that enables local businesses to collect customer reviews via a frictionless QR code experience. It intelligently filters feedback (4-5 stars are pushed to Google Reviews; 1-3 stars are diverted to a private dashboard). It also includes an "AI Content Studio" that converts 5-star Google Reviews into beautiful, downloadable social media graphics.

## Tech Stack & Architecture
* **Frontend Framework:** React 18+ via Vite.
* **Routing:** `react-router-dom` (Current routes setup in `App.jsx`: `/` Landing Page, `/rate/:shopId` Mobile Scan Experience, `/login` Merchant Auth, `/dashboard/*` Merchant Dashboard).
* **Styling Strategy:** Vanilla CSS using CSS Modules (`index.css` holds core variables and global utility classes). The application relies heavily on custom Glassmorphism, CSS Grid/Flexbox layouts, and a very specific gradient color palette.
* **Theme / Aesthetic:** Premium "Dark Mode" aesthetic. The primary colors are sophisticated HSL gradients (Dark Purples, Vibrant Blues, and Neon Pinks), extensive use of `backdrop-filter: blur`, white typography, and subtle CSS glow orb effects placed via absolute positioning (`bg-glow` utility classes). NO "Neon Green" or generic colors.
* **Animations:** `framer-motion` is used extensively for page transitions, interactive hover states, animated SVG dashed lines, and custom simulated app interface graphics.
* **Icons:** `lucide-react` library.
* **Core Dependencies Installed:**
  * `react-router-dom`
  * `framer-motion`
  * `lucide-react`
  * `html-to-image` (Used in the Content Studio to render React DOM nodes into downloadable `.png` templates).
  * `react-qr-code` (Used for rendering the merchant's physical asset QR codes on the dashboard).

## Application Domains & Current Status

### 1. Marketing Site (`/` root)
* **Status:** Complete MVP.
* **Key Components (`/src/components/landing/`):** 
  * `Header.jsx`: Floating glassmorphic navigation. 
  * `Hero.jsx`: Features an animated SVG workflow curve.
  * `Stats.jsx`: 3-column glowing metrics grid.
  * `Features.jsx`: "How it works" section featuring custom, pure CSS/Motion animated graphics mimicking the actual application (Scanning QR, 5-Star Filter, Content Studio).
  * `Campaigns.jsx`: A dark UI pricing/feature comparison table.

### 2. Customer Scan Experience (`/rate/:shopId`)
* **Status:** Complete UI/UX Logic Mockup. Needs Backend Integration.
* **Component (`/src/pages/ScanExperience.jsx`):** 
  * A 100% mobile-first interface designed to look premium.
  * **Current Logic State:** 
    * User selects 1-5 stars.
    * If 4-5 stars: Displays a Google Review redirect prompt card.
    * If 1-3 stars: Displays a custom textarea for private feedback submission.

### 3. Merchant Dashboard (`/dashboard/*`)
* **Status:** Complete UI Layout MVP. Needs Backend/Database Integration.
* **Layout (`/src/pages/dashboard/Layout.jsx`):** Sidebar navigation utilizing `lucide-react` icons and a main scrollable content area.
* **Pages:**
  * `Overview.jsx`: Key metrics (Total Scans, Reviews Gained, Blocked Feedback).
  * `ContentStudio.jsx`: Uses `html-to-image`. Currently populated with mock Google reviews. Renders those reviews into 3 distinct templates (Modern Glass, Bold Typography, Elegant Minimal) which business owners can download as PNGs.
  * `QRManagement.jsx`: Renders an SVG digital QR code.
  * `Settings.jsx`: Form inputs for Google Maps URL and Place ID data.

## Backend Strategy (Pending Implementation)
* **Backend as a Service:** Supabase.
* **Database Needs:** 
  1. `shops` (id, name, google_maps_url, place_id, user_id).
  2. `feedback` (id, shop_id, rating, message, created_at) - for storing the 1-3 star intercepted reviews.
* **Authentication:** Supabase Auth (Currently UI only at `/login`).
* **External APIs required:** 
  * Google Places API (Needs to be firmly integrated to accurately scrape the shop's 5-star reviews and user profile photos to populate the `ContentStudio.jsx` feed). This will likely require setting up Supabase Edge Functions to act as a secure proxy to the Google API to avoid exposing API keys on the frontend.

## Immediate Next Steps & Action Items for Agent
1. **Initialize Supabase Backend:** Configure the local or cloud Supabase instance.
2. **Database Schema:** Create the user, shops, and private feedback SQL schema.
3. **Hook up Authentication:** Wire up the `/login` page to Supabase Auth and protect the `/dashboard` routes.
4. **Google Places API Integration:** Build the Edge Function or backend route to fetch recent 5-star reviews for the logged-in merchant's Place ID to replace the `mockReviews` array in `ContentStudio.jsx`.
5. **Dynamic Routing:** Update `ScanExperience.jsx` to dynamically fetch the actual `shop` details from Supabase using the `:shopId` URL parameter, rather than leveraging the `setTimeout` mock we currently use.
6. **Submit Feedback:** Hook up the "Submit Private Feedback" form in `ScanExperience.jsx` to push records directly into the Supabase `feedback` table.

## Important Design Rules
If adding any new components, forms, or pages:
* Always use `class="glass-panel"` for cards.
* Buttons should be `class="btn-primary"`.
* Text fields must match the transparent glass aesthetic (`background: rgba(255,255,255,0.05)`, border styling, and white text).
* Inject `class="bg-glow purple|pink|blue"` for ambient background glows.
* Keep all borders mapped to `var(--glass-border)`.
