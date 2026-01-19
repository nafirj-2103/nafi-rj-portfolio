# EmailJS Configuration Guide

## Problem Fixed
The inquiry form was showing "Failed to send. Please check your EmailJS configuration." because EmailJS was not properly initialized.

## Solution Implemented

### 1. EmailJS Initialization Added
- **File:** `src/App.tsx`
- **What it does:** Automatically initializes EmailJS when the app loads with your public key

### 2. Environment Variables Required
- **File:** `.env.local`
- Create this file in the root directory and add your EmailJS credentials

## Setup Steps

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email

### Step 2: Get Your Credentials

1. **Public Key:**
   - Go to: https://dashboard.emailjs.com/admin/account
   - Copy your "Public Key"

2. **Service ID:**
   - Go to: https://dashboard.emailjs.com/admin/services
   - Create a new email service (Gmail, SMTP, etc.) or use existing one
   - Copy the "Service ID"

3. **Template ID:**
   - Go to: https://dashboard.emailjs.com/admin/templates
   - Create a new email template OR update existing one
   - Template must have these variables:
     - `{{from_name}}` - Sender's name
     - `{{from_email}}` - Sender's email
     - `{{to_email}}` - Recipient email (nafix2103@gmail.com)
     - `{{project_description}}` - Project details
     - `{{budget}}` - Budget info
     - `{{timeline}}` - Timeline info
   - Copy the "Template ID"

### Step 3: Configure .env.local
Replace values in `.env.local`:

```env
VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
VITE_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID_HERE
VITE_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID_HERE
```

### Step 4: Test the Form
1. Restart the dev server (`npm run dev`)
2. Go to your website
3. Fill out the inquiry form
4. Click "Send Inquiry"
5. Check console (F12 > Console tab) for any errors

## Troubleshooting

### "EmailJS is not properly configured"
- Check if all three environment variables are set in `.env.local`
- Restart your dev server after editing `.env.local`

### "Failed to send inquiry"
- Check browser console (F12) for detailed error
- Verify Service ID and Template ID match your EmailJS dashboard
- Ensure your email service is activated in EmailJS

### "Invalid Public Key"
- Copy the exact public key from https://dashboard.emailjs.com/admin/account
- Make sure there are no extra spaces

### Email not received
- Check your EmailJS template has correct variable names
- Verify recipient email is correct in the template
- Check spam folder

## Email Template Example

Your EmailJS template should look something like:

```
Subject: New Inquiry from {{from_name}}

Name: {{from_name}}
Email: {{from_email}}

Project Description:
{{project_description}}

Budget: {{budget}}
Timeline: {{timeline}}

---
Send to: {{to_email}}
```

## Security Note
- `.env.local` is in `.gitignore` and won't be committed to Git
- Your EmailJS Public Key is safe to expose (it's public)
- Service ID and Template ID should not be shared publicly

## Files Modified
1. `src/App.tsx` - Added EmailJS initialization
2. `src/components/home.tsx` - Improved error messages and debugging
3. `.env.local` - Created with configuration template
