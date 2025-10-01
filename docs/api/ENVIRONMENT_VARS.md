# Environment Variables Documentation

This document details all environment variables used in the Department of Art website application.

## Overview

Environment variables are stored in `.env.local` for local development and must be configured in your hosting platform for production.

## Required Variables

These variables MUST be set for the application to function properly.

### Sanity CMS

#### `NEXT_PUBLIC_SANITY_PROJECT_ID`
- **Type**: String
- **Required**: Yes
- **Example**: `vc89ievx`
- **Description**: Unique identifier for your Sanity project
- **Where to find**: Sanity project dashboard → Settings → Project ID
- **Used by**: Client-side and server-side Sanity queries

#### `NEXT_PUBLIC_SANITY_DATASET`
- **Type**: String  
- **Required**: Yes
- **Default**: `production`
- **Options**: `production`, `development`, `staging`
- **Description**: Sanity dataset to query
- **Used by**: All Sanity data fetching

#### `SANITY_API_TOKEN`
- **Type**: String
- **Required**: Yes
- **Example**: `skaPyaLCJUG16H26w6...`
- **Description**: API token for authenticated Sanity requests
- **Where to find**: Sanity dashboard → Settings → API → Tokens
- **Permissions needed**: Read (minimum)
- **Security**: Keep secret, never commit to git
- **Used by**: Server-side data fetching, content migrations

## Optional Variables

These variables enhance functionality but the app will work without them.

### Email Service (Resend)

#### `RESEND_API_KEY`
- **Type**: String
- **Required**: No (contact form won't send emails without it)
- **Example**: `re_CWsm9Mqa_B7fPd2mMeGW...`
- **Description**: API key for Resend email service
- **Where to find**: [Resend Dashboard](https://resend.com/api-keys)
- **Used by**: Contact form API endpoint

#### `RESEND_FROM_EMAIL`
- **Type**: Email
- **Required**: No
- **Default**: `onboarding@resend.dev` (for testing)
- **Production**: `contact@yourdomain.com`
- **Description**: Sender email address
- **Note**: Must be verified domain in production
- **Used by**: Contact form email sender

#### `CONTACT_FORM_TO_EMAIL`
- **Type**: Email
- **Required**: No
- **Default**: Uses `RESEND_FROM_EMAIL` if not set
- **Example**: `info@departmentofart.com`
- **Description**: Where contact form submissions are sent
- **Used by**: Contact form recipient

## Environment-Specific Variables

### Development Only

#### `NEXT_PUBLIC_DEV_MODE`
- **Type**: Boolean
- **Required**: No
- **Default**: `false`
- **Description**: Enables development features like debug logging
- **Warning**: Never enable in production

### Production Only

#### `VERCEL_URL`
- **Type**: String
- **Required**: No (auto-set by Vercel)
- **Description**: Deployment URL, automatically set by Vercel
- **Used by**: Generating absolute URLs for meta tags

#### `NEXT_PUBLIC_SITE_URL`
- **Type**: URL
- **Required**: Recommended for production
- **Example**: `https://departmentofart.com`
- **Description**: Production site URL for SEO and social sharing
- **Used by**: Meta tags, sitemap generation

## Setting Up Environment Variables

### Local Development

1. **Create `.env.local` file**
```bash
cp .env.example .env.local
```

2. **Edit `.env.local`**
```env
# Sanity (Required)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token

# Resend (Optional)
RESEND_API_KEY=re_your_key
RESEND_FROM_EMAIL=contact@yourdomain.com
CONTACT_FORM_TO_EMAIL=info@yourdomain.com
```

### Vercel Production

1. **Navigate to Project Settings**
   - Go to Vercel Dashboard
   - Select your project
   - Click "Settings" → "Environment Variables"

2. **Add Variables**
   - Add each variable individually
   - Select appropriate environments (Production/Preview/Development)
   - Sensitive variables should only be in Production

3. **Redeploy**
   - Trigger new deployment for changes to take effect

### Other Hosting Platforms

#### Netlify
```toml
# netlify.toml
[build.environment]
  NEXT_PUBLIC_SANITY_PROJECT_ID = "your_project_id"
  NEXT_PUBLIC_SANITY_DATASET = "production"
```

#### Heroku
```bash
heroku config:set NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
heroku config:set SANITY_API_TOKEN=your_token
```

#### Docker
```dockerfile
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
ENV NEXT_PUBLIC_SANITY_DATASET=production
```

## Security Best Practices

### Do's ✅
- Keep `.env.local` in `.gitignore`
- Use different API tokens for dev/staging/production
- Rotate API keys regularly
- Use read-only tokens when possible
- Store sensitive vars only in production environment

### Don'ts ❌
- Never commit `.env.local` to git
- Don't share API tokens in documentation
- Avoid logging environment variables
- Don't use production tokens in development
- Never expose sensitive vars to client-side code

## Validation

### Checking Variables Are Set

```javascript
// utils/env-check.js
const requiredEnvVars = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_API_TOKEN'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});
```

### Runtime Validation

The application validates critical environment variables at:
1. Build time - Next.js build will fail if public vars are missing
2. Runtime - API routes check for required vars before executing
3. Development - Console warnings for missing optional vars

## Troubleshooting

### Variable Not Working

1. **Check spelling** - Variable names are case-sensitive
2. **Restart server** - Changes to `.env.local` require restart
3. **Clear cache** - `rm -rf .next` and rebuild
4. **Check prefix** - Client-side vars need `NEXT_PUBLIC_` prefix

### Sanity Connection Issues

```bash
# Test your Sanity configuration
curl https://[PROJECT_ID].api.sanity.io/v2021-10-21/data/query/[DATASET]?query=*[_type==\"project\"][0]
```

### Email Not Sending

1. Verify Resend API key is valid
2. Check sender email is verified
3. Review Resend dashboard for errors
4. Test with curl:

```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

## Environment Variable Reference

| Variable | Required | Type | Default | Environment |
|----------|----------|------|---------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | String | - | All |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | String | production | All |
| `SANITY_API_TOKEN` | ✅ | String | - | Server only |
| `RESEND_API_KEY` | ❌ | String | - | Server only |
| `RESEND_FROM_EMAIL` | ❌ | Email | onboarding@resend.dev | Server only |
| `CONTACT_FORM_TO_EMAIL` | ❌ | Email | - | Server only |
| `NEXT_PUBLIC_SITE_URL` | ❌ | URL | http://localhost:3000 | All |

## Migration Guide

When adding new environment variables:

1. **Update `.env.example`** with new variable (without value)
2. **Document** in this file
3. **Add validation** if required variable
4. **Update deployment docs** with configuration steps
5. **Notify team** of required changes

---

Last Updated: December 2024
Version: 1.0.0