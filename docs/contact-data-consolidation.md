# Contact Data Consolidation

## Overview
Contact information has been consolidated to use **Site Settings** as the single source of truth, eliminating duplication across the CMS.

## Changes Made

### 1. Contact Page Schema
**Location:** `sanity/schemaTypes/contactPage.ts`

**Removed fields:**
- `studioInfo.companyName`
- `studioInfo.streetAddress`
- `studioInfo.cityStateZip`
- `studioInfo.phoneNumber`
- `studioInfo.emailAddress`

**Kept fields:**
- Page-specific labels and headings
- `hoursText` (optional override for business hours)
- `googleMapsUrl` (optional override for map embed)
- Display toggles and formatting options

### 2. Site Settings Schema
**Location:** `sanity/schemaTypes/siteSettings.ts`

**Added field:**
- `businessHours` - Default business hours for the contact page

**Existing fields used:**
- `contactEmail` - Primary contact email
- `contactPhone` - Primary contact phone
- `address.companyName` - Company name
- `address.street` - Street address
- `address.city` - City
- `address.state` - State
- `address.zip` - ZIP code
- `address.googleMapsUrl` - Google Maps URL

### 3. Contact Page Component
**Location:** `src/app/contact/page.tsx`

**Updated to:**
- Fetch both `contactPage` and `siteSettings` data
- Use `siteSettings` for actual contact information
- Use `contactPage` for labels, messages, and page-specific content
- Support optional overrides for business hours and Google Maps URL

### 4. Email Settings
**Location:** `sanity/schemaTypes/emailSettings.ts`

**Added notes:**
- Footer contact info should match Site Settings for consistency
- These fields remain separate for email-specific formatting needs

## Data Flow

```
Site Settings (source of truth)
├── Contact Page (displays data)
├── Footer Component (displays data via context)
└── Email Templates (separate copy for emails)
```

## Migration

A migration script is available at `scripts/migrate-contact-data.js` to:
1. Move existing contact data from Contact Page to Site Settings
2. Remove duplicate fields from Contact Page
3. Preserve any existing Site Settings values

**To run migration:**
```bash
# Ensure you have SANITY_API_TOKEN in .env.local
node scripts/migrate-contact-data.js
```

## Benefits

1. **Single Source of Truth**: Contact info managed in one place
2. **Consistency**: Same data across all pages and components
3. **Maintainability**: Easier to update contact information
4. **Flexibility**: Pages can still override specific fields if needed

## CMS Usage

### To update contact information:
1. Go to **Site Settings** in Sanity Studio
2. Update contact details in the appropriate fields
3. Changes will automatically reflect across:
   - Contact page
   - Footer
   - Any other components using `useSiteSettings()`

### Contact Page specific settings:
1. Go to **Contact Page** in Sanity Studio
2. Customize:
   - Section headings and labels
   - Form messages
   - Business hours (optional override)
   - Google Maps URL (optional override)
   - Display toggles