# NAFI Portfolio Backend

## Environment Variables (.env)

Create a `.env` file in the server directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nafi-portfolio

# Gmail
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@gmail.com

# Admin
ADMIN_SECRET_KEY=your-secret-key-for-first-admin-registration
JWT_SECRET=your-jwt-secret-key

# Frontend
ADMIN_PANEL_URL=http://localhost:3000/admin
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Gmail
- Go to Google Account settings
- Enable 2-factor authentication
- Generate an App Password for SMTP
- Use that password in `.env` file

### 3. Setup MongoDB
- Install MongoDB locally OR use MongoDB Atlas (cloud)
- Update `MONGODB_URI` in `.env`

### 4. Run Server
```bash
npm run dev
```

Server will run on http://localhost:5000

## API Endpoints

### Submit Inquiry (Public)
```
POST /api/inquiries
Body: { name, email, description, budget, timeline }
```

### Get All Inquiries (Admin Only)
```
GET /api/inquiries
Headers: Authorization: Bearer <token>
```

### Get Single Inquiry (Admin Only)
```
GET /api/inquiries/:id
Headers: Authorization: Bearer <token>
```

### Reply to Inquiry (Admin Only)
```
POST /api/inquiries/:id/reply
Headers: Authorization: Bearer <token>
Body: { adminMessage }
```

### Admin Register
```
POST /api/admin/register
Body: { username, email, password, secretKey }
```

### Admin Login
```
POST /api/admin/login
Body: { email, password }
Returns: { token, admin }
```
