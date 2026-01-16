# EmailJS Template Setup Guide

## Quick Setup Checklist

### 1. EmailJS Dashboard Configuration
Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)

#### Service Setup
- Service ID: `VITE_EMAILJS_SERVICE_ID` ✅ (configured)
- Connect your email provider (Gmail, Outlook, etc.)

#### Template Setup
- Template ID: `VITE_EMAILJS_TEMPLATE_ID` ✅ (configured)
- Use the template variables below

#### API Keys
- Public Key: `VITE_EMAILJS_PUBLIC_KEY` ✅ (configured)

---

## 📝 Template Variables Reference

### Available Parameters
Your EmailJS template can use these variables:

```
{{from_name}}              - Client's name
{{from_email}}             - Client's email address  
{{to_email}}               - Your email (nafix2103@gmail.com)
{{project_description}}    - Project details
{{budget}}                 - Budget or "Not specified"
{{timeline}}               - Timeline or "Not specified"
{{message}}                - Formatted message with all details
```

---

## 📧 Recommended Template Structure

### Subject Line
```
New Project Inquiry from {{from_name}}
```

### Email Body (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #FFC107; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; color: #000; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
    .field { margin-bottom: 20px; }
    .field-label { font-weight: bold; color: #555; margin-bottom: 5px; }
    .field-value { background: white; padding: 10px; border-left: 3px solid #FFC107; }
    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📬 New Inquiry Received</h1>
    </div>
    
    <div class="content">
      <div class="field">
        <div class="field-label">From:</div>
        <div class="field-value">{{from_name}}</div>
      </div>
      
      <div class="field">
        <div class="field-label">Email:</div>
        <div class="field-value"><a href="mailto:{{from_email}}">{{from_email}}</a></div>
      </div>
      
      <div class="field">
        <div class="field-label">Project Description:</div>
        <div class="field-value">{{project_description}}</div>
      </div>
      
      <div class="field">
        <div class="field-label">Budget:</div>
        <div class="field-value">{{budget}}</div>
      </div>
      
      <div class="field">
        <div class="field-label">Timeline:</div>
        <div class="field-value">{{timeline}}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>This email was sent from your portfolio website inquiry form.</p>
      <p>Reply directly to this email to contact the client.</p>
    </div>
  </div>
</body>
</html>
```

### Simple Text Version (Alternative)

```
New Project Inquiry from {{from_name}}

-----------------------------------

Client Information:
Name: {{from_name}}
Email: {{from_email}}

Project Details:
{{project_description}}

Budget: {{budget}}
Timeline: {{timeline}}

-----------------------------------

Reply to {{from_email}} to discuss this project.
```

---

## 🎨 Alternative Minimal Template

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #FFC107;">New Inquiry from {{from_name}}</h2>
  
  <p><strong>Email:</strong> <a href="mailto:{{from_email}}">{{from_email}}</a></p>
  
  <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p><strong>Project:</strong></p>
    <p>{{project_description}}</p>
  </div>
  
  <p><strong>Budget:</strong> {{budget}}</p>
  <p><strong>Timeline:</strong> {{timeline}}</p>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
  
  <p style="color: #666; font-size: 12px;">
    Sent from portfolio website inquiry form
  </p>
</div>
```

---

## 🧪 Testing Your Template

### Step 1: Test in EmailJS Dashboard
1. Go to your template in EmailJS
2. Click "Test" button
3. Fill in sample values for all variables
4. Send test email

### Step 2: Test from Website
1. Open your website
2. Click "INQUIRY" button
3. Fill out the form with test data
4. Submit and check your email

### Expected Variables in Test:
```
from_name: "Test User"
from_email: "test@example.com"
to_email: "nafix2103@gmail.com"
project_description: "This is a test inquiry"
budget: "Not specified"
timeline: "Not specified"
message: [Formatted message with all details]
```

---

## 🚨 Troubleshooting

### Email Not Received
1. **Check Spam Folder** - EmailJS emails often land in spam initially
2. **Verify Service Status** - Check EmailJS dashboard for service status
3. **Check Quota** - Free tier: 200 emails/month
4. **Review Logs** - EmailJS dashboard shows delivery logs

### Template Variables Not Working
1. Double-check variable names (case-sensitive)
2. Use `{{variable}}` syntax (double curly braces)
3. Test in EmailJS dashboard first
4. Check browser console for errors

### Common Mistakes
- ❌ `{from_name}` - Wrong (single braces)
- ✅ `{{from_name}}` - Correct (double braces)
- ❌ `{{FromName}}` - Wrong (case mismatch)
- ✅ `{{from_name}}` - Correct (exact match)

---

## 📊 Monitoring

### EmailJS Dashboard
- **Email History**: View last 30 days of sent emails
- **Quota Usage**: Track monthly email limit
- **Error Logs**: Debug failed sends

### What to Monitor
- Monthly email count (200 limit on free tier)
- Failed delivery rate
- Spam complaints

---

## 🔄 Configuration Updates

### To Change Recipient Email
Edit `src/components/home.tsx` line 272:
```javascript
to_email: 'new_email@example.com',
```

### To Add CC/BCC
Add to `templateParams` in `src/components/home.tsx`:
```javascript
cc_email: 'cc@example.com',
bcc_email: 'bcc@example.com',
```

Then configure in EmailJS template settings.

---

## ✅ Final Checklist

Before going live:
- [ ] EmailJS service is active
- [ ] Template is configured with correct variables
- [ ] Test email sent successfully
- [ ] Received test email in inbox (not spam)
- [ ] All form fields working correctly
- [ ] Success message displays properly
- [ ] Error handling tested
- [ ] Mobile responsive form tested

---

## 📞 Support Resources

- **EmailJS Docs**: https://www.emailjs.com/docs/
- **Template Guide**: https://www.emailjs.com/docs/user-guide/creating-email-template/
- **Troubleshooting**: https://www.emailjs.com/docs/faq/

---

**Current Status:** ✅ All systems configured and ready
**Recipient:** nafix2103@gmail.com
**Monthly Limit:** 200 emails (free tier)
