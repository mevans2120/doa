# Resend Email Setup Guide

The contact form is now integrated with Resend for email delivery. Follow these steps to complete the setup:

## Setup Steps

### 1. Create Resend Account
1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key
1. Navigate to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Create a new API key with "Sending access" permission
3. Copy the API key (starts with `re_`)

### 3. Verify Your Domain (Production)
For production use with your custom domain:
1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Add your domain (e.g., `departmentofart.com`)
3. Follow the DNS verification steps
4. Wait for domain verification (usually takes a few minutes)

### 4. Update Environment Variables
Update your `.env.local` file with your Resend credentials:

```env
# Replace with your actual API key
RESEND_API_KEY=re_YOUR_ACTUAL_API_KEY

# Use your verified domain email
RESEND_FROM_EMAIL=contact@departmentofart.com

# Where contact form submissions should be sent
CONTACT_FORM_TO_EMAIL=info@departmentofart.com
```

## Testing

### Local Testing
For local development, you can use Resend's test mode:
1. Use the API key from your Resend dashboard
2. Emails will be sent to Resend's test inbox (visible in your dashboard)

### Test the Contact Form
Run the test script to verify everything is working:
```bash
node scripts/test-contact-form.js
```

Or test manually:
1. Navigate to http://localhost:3000/contact
2. Fill out the form
3. Submit and check for success message
4. Check your email inbox (or Resend dashboard in test mode)

## Features Implemented

✅ **Contact Form API** (`/api/contact`)
- Validates form data
- Rate limiting (5 submissions per hour per IP)
- Sends email to admin
- Sends auto-reply to user

✅ **Email Templates**
- Admin notification email with form details
- User auto-reply confirmation

✅ **Security Features**
- Input validation
- Rate limiting
- Sanitized error messages
- CORS headers

## Troubleshooting

### Common Issues

1. **"Email service configuration error"**
   - Check that `RESEND_API_KEY` is set correctly
   - Verify the API key has "Sending access" permission

2. **Emails not being received**
   - Check spam/junk folder
   - Verify domain is properly configured in Resend
   - Check Resend dashboard for email status

3. **"Too many requests" error**
   - Rate limit exceeded (5 per hour)
   - Wait before trying again

## Production Checklist

- [ ] Create production Resend account
- [ ] Verify production domain
- [ ] Set production API key in hosting environment
- [ ] Test form submission in production
- [ ] Set up email forwarding/inbox for contact form recipient
- [ ] Consider upgrading Resend plan if needed (free tier: 3,000 emails/month)

## Support

- Resend Documentation: [https://resend.com/docs](https://resend.com/docs)
- Resend Status: [https://status.resend.com](https://status.resend.com)
- Next.js Email Guide: [https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations)