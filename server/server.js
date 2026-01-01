import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for inquiries (temporary, until MongoDB is set up)
let inquiriesStorage = [];
let adminsStorage = [];

// MongoDB Connection (with fallback to in-memory)
let mongoConnected = false;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nafi-portfolio')
  .then(() => {
    console.log('✅ MongoDB connected');
    mongoConnected = true;
  })
  .catch(err => {
    console.log('⚠️ MongoDB not available - using in-memory storage');
    console.log('Error:', err.message);
    mongoConnected = false;
  });

// Inquiry Schema
const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  budget: String,
  timeline: String,
  status: { type: String, enum: ['new', 'replied', 'closed'], default: 'new' },
  replies: [{
    adminMessage: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

// Admin Schema (for authentication)
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

// Email transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

// ============ INQUIRY ENDPOINTS ============

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongoConnected: mongoConnected,
    storage: mongoConnected ? 'MongoDB' : 'In-memory',
    inquiriesCount: mongoConnected ? 'check MongoDB' : inquiriesStorage.length,
    timestamp: new Date()
  });
});

// Submit inquiry from website
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, description, budget, timeline } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({ error: 'Name, email, and description are required' });
    }

    let inquiryId;
    
    if (mongoConnected) {
      // Save to MongoDB
      const inquiry = new Inquiry({
        name,
        email,
        description,
        budget,
        timeline,
        status: 'new'
      });
      await inquiry.save();
      inquiryId = inquiry._id;
    } else {
      // Save to in-memory storage
      const inquiry = {
        _id: Date.now().toString(),
        name,
        email,
        description,
        budget,
        timeline,
        status: 'new',
        replies: [],
        createdAt: new Date()
      };
      inquiriesStorage.push(inquiry);
      inquiryId = inquiry._id;
    }

    // Try to send email to admin (optional if credentials not set)
    if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD && process.env.ADMIN_EMAIL) {
      try {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `New Inquiry from ${name}`,
          html: `
            <h2>New Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
            <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
            <p><a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:3000/admin'}">View in Admin Panel</a></p>
          `
        });

        // Send confirmation email to client
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'We received your inquiry - NAFI Creations',
          html: `
            <h2>Thank you for your inquiry, ${name}!</h2>
            <p>We have received your inquiry and will review it shortly.</p>
            <p>We'll get back to you within 24-48 hours.</p>
            <p>Best regards,<br/>NAFI Creations</p>
          `
        });
      } catch (emailError) {
        console.log('⚠️ Email not sent (Gmail credentials may not be configured):', emailError.message);
      }
    }

    res.status(201).json({ 
      success: true, 
      message: 'Inquiry submitted successfully',
      inquiryId: inquiryId,
      note: mongoConnected ? 'Saved to database' : 'Saved to temporary storage (set up MongoDB for persistence)'
    });

  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry: ' + error.message });
  }
});

// Get all inquiries (admin only)
app.get('/api/inquiries', authenticateToken, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Get single inquiry
app.get('/api/inquiries/:id', authenticateToken, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiry' });
  }
});

// Reply to inquiry
app.post('/api/inquiries/:id/reply', authenticateToken, async (req, res) => {
  try {
    const { adminMessage } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    // Add reply
    inquiry.replies.push({ adminMessage });
    inquiry.status = 'replied';
    await inquiry.save();

    // Send email to client
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: inquiry.email,
      subject: `Reply to your inquiry - NAFI Creations`,
      html: `
        <h2>Hi ${inquiry.name},</h2>
        <p>${adminMessage}</p>
        <p>Best regards,<br/>NAFI Creations</p>
      `
    });

    res.json({ success: true, message: 'Reply sent successfully' });

  } catch (error) {
    console.error('Error replying to inquiry:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

// ============ ADMIN AUTH ENDPOINTS ============

// Register admin (only once or with secret key)
app.post('/api/admin/register', async (req, res) => {
  try {
    const { username, email, password, secretKey } = req.body;

    // Verify secret key
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ error: 'Invalid secret key' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const admin = new Admin({
      username,
      email,
      password: hashedPassword
    });

    await admin.save();
    res.status(201).json({ success: true, message: 'Admin registered' });

  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'Failed to register admin' });
  }
});

// Login admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcryptjs.compare(password, admin.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ adminId: admin._id, email: admin.email }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    res.json({ success: true, token, admin: { id: admin._id, username: admin.username, email: admin.email } });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============ MIDDLEWARE ============

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, admin) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.admin = admin;
    next();
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
