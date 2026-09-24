# Software Requirements Document (SRD)

## 1. Project Overview
- Project Name: Rubexy Designs Limited Website
- Type: Marketing and lead-generation website for a design and media company
- Stack: React + TypeScript + Vite, Tailwind CSS, React Router, TanStack Query, Supabase, shadcn/ui
- Primary Goal: Present the brand professionally and convert visitors into enquiries, quote requests, and client contact

## 2. Business Objective
The website must:
- Establish Rubexy Designs Limited as a credible brand, print, and media company
- Showcase services, projects, certifications, clients, and company profile
- Provide a clear inquiry and quote request process
- Support editable content management through an admin interface

## 3. Scope
### In scope
- Responsive marketing website
- Portfolio showcase
- Service and company profile pages
- Contact and RFQ forms
- Admin login and content editing
- Supabase-backed storage and CMS-like content management

### Out of scope
- Ecommerce features
- Full multi-role admin system
- Complex backend operations unrelated to marketing and lead generation

## 4. Users and Roles
### Visitor
- Views pages and business information
- Submits contact or RFQ messages
- Navigates the site across all public pages

### Admin
- Logs in via admin area
- Updates text and media content
- Adds or edits portfolio cards
- Manages which cards are featured

## 5. Functional Requirements
### 5.1 Public Website
The site shall provide pages for:
- Home
- Company Profile
- About
- Services
- Portfolio
- Clients
- Certifications
- Contact
- RFQ
- Privacy
- Admin Login

### 5.2 Homepage
The homepage must:
- Display a strong hero section
- Highlight key services
- Showcase featured work
- Present trust and credibility elements
- Avoid stale or hardcoded fallback content when editable data is unavailable

### 5.3 Portfolio System
The portfolio must:
- Render card data from stored content
- Support admin-managed featured selection
- Support multiple images per card
- Allow project descriptions, categories, and client labels
- Support admin editing and deletion without leaving stale placeholders
- Show no cards when no valid portfolio entries exist

### 5.4 Contact and RFQ Forms
The forms must:
- Accept user inquiries with validation
- Allow a user to choose delivery via email or WhatsApp
- Pre-fill the message body with captured form content
- Maintain a user-friendly experience on mobile and desktop

### 5.5 Admin Content Management
The admin system must:
- Authenticate the correct admin user
- Allow content edits without direct code changes
- Support image uploads and portfolio item management
- Refresh content immediately after updates

## 6. Non-Functional Requirements
- Responsive layout across devices
- High readability and clean visual hierarchy
- Accessibility-conscious design
- SEO-friendly structure and metadata
- Performance-sensitive frontend build
- Maintainable TypeScript architecture
- Content should be driven by stored data, not hardcoded fallback defaults

## 7. Data Model
The application depends on:
- Supabase auth for admin access
- Supabase storage for uploaded images
- Supabase content tables for portfolio and site text
- Portfolio fields such as title, category, description, client, images, and featured status

## 8. Key Integrations
- Supabase Auth
- Supabase Storage
- WhatsApp deep-linking for message handoff
- Email-based inquiry delivery
- React Query for data freshness and synchronization

## 9. Constraints and Assumptions
- The site is primarily a frontend marketing website with a CMS-like content layer
- Production hosting may be separated between the frontend and the backend/database
- Portfolio and site content must be editable without code changes
- The app should not rely on hardcoded fallback content that conflicts with admin updates

## 10. Current Implementation Notes
- Routing and shared layout are centralized in [src/App.tsx](src/App.tsx)
- Public pages are organized under [src/pages](src/pages)
- Reusable UI is under [src/components](src/components)
- Content hooks and data retrieval live in [src/hooks](src/hooks)
- Database schema is defined in [supabase/schema.sql](supabase/schema.sql)

## 11. Acceptance Criteria
The project is successful when:
- All primary pages render correctly
- Featured work reflects the actual saved portfolio data
- No legacy fallback cards or stale content remain
- Contact and RFQ forms deliver the captured information correctly
- Admin-managed content updates appear immediately without requiring a refresh workaround
- Production build remains successful and stable

## 12. Update Log
### 2026-09-24
- Initial SRD created for the project
- Documented project purpose, scope, requirements, and current implementation structure
- Captured admin/content management expectations and lead-generation requirements
- Replaced the About page CSR text section with an admin-managed image slider that supports uploaded gallery images through the admin panel
- Added an admin-uploadable image slider above the CSR section on the Company Profile page

## 13. Next Review
This SRD should be updated whenever:
- New pages or route structure are added
- New forms or integrations are introduced
- Admin content rules or portfolio requirements change
- New deployment or environment requirements are established
