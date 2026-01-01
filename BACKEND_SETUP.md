# NAFI Portfolio - Backend Setup Guide

## What I Created

1. **Express Backend Server** (server.js)
   - API endpoints for inquiries
   - Admin authentication (login/register)
   - Email notifications

2. **Database Connection** (MongoDB)
   - Store inquiries with replies
   - Admin user management

3. **Email Service** (Gmail SMTP)
   - Send inquiry confirmation to client
   - Send notification to admin
   - Send replies to client

## Quick Start

### Step 1: Install Backend Dependencies
```powershell
cd server
npm install
```

### Step 2: Create .env File
Create `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nafi-portfolio
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@gmail.com
ADMIN_SECRET_KEY=first-admin-secret-123
JWT_SECRET=your-jwt-secret
ADMIN_PANEL_URL=http://localhost:3000/admin
```

### Step 3: Setup Gmail App Password
1. Go to https://myaccount.google.com/
2. Security → 2-Step Verification (enable if not)
3. App passwords → Select Mail + Windows Computer
4. Copy the 16-character password
5. Paste in `.env` as GMAIL_PASSWORD

### Step 4: Install MongoDB (Local)
```powershell
# Download from https://www.mongodb.com/try/download/community
# Or use MongoDB Atlas (cloud) and update MONGODB_URI
```

### Step 5: Start Backend Server
```powershell
npm run dev
# Server runs on http://localhost:5000
```

### Step 6: Update Frontend API URL
In `src/components/home.tsx`, update inquiry submission to call:
```
POST http://localhost:5000/api/inquiries
```

## Next Step: Create Admin Panel

I'll create a React admin dashboard where you can:
- See all inquiries
- Reply to messages
- Update inquiry status

Want me to build the admin panel now? 🚀
