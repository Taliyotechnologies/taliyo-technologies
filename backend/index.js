require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const jwt = require('jsonwebtoken');

// Debug environment variables
console.log('🔍 Environment check at startup:');
console.log('🔍 MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('🔍 MONGO_URI length:', process.env.MONGO_URI ? process.env.MONGO_URI.length : 'undefined');
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔍 PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@taliyotechnologies.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';

// Check if MongoDB URI is provided
const hasMongoDB = !!MONGO_URI;

if (!hasMongoDB) {
  console.warn('⚠️  MONGO_URI/MONGODB_URI environment variable is not set');
  console.warn('🔧 Some features (contact form, blog, analytics) will be disabled');
  console.warn('🔧 To enable full functionality, set MONGO_URI or MONGODB_URI in your environment variables');
  console.warn('🔧 Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
  console.warn('🔧 Current environment variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));
} else {
  console.log('✅ MongoDB URI found in environment variables');
  console.log('🔍 Using URI from:', process.env.MONGO_URI ? 'MONGO_URI' : 'MONGODB_URI');
}

// Middleware
app.use(cors({
  origin: [
    'https://taliyotechnologies.com',
    'https://taliyo-technologies.vercel.app',
    'https://taliyo-frontend.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: hasMongoDB ? 'connected' : 'not configured'
  });
});

// Only define schemas and models if MongoDB is available
let Contact, Subscriber, Blog, PageView, ActivityLog;

if (hasMongoDB) {
  // Schemas
  const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    service: String,
    budget: String,
    timeline: String,
    subject: String,
    message: { type: String, required: true },
    status: { type: String, enum: ['done', 'not done'], default: 'not done' },
    createdAt: { type: Date, default: Date.now }
  });

  const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
  });

  const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    tags: [String],
    publishedAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }
  });

  const pageViewSchema = new mongoose.Schema({
    page: { type: String, required: true },
    userId: String,
    timestamp: { type: Date, default: Date.now }
  });

  const activityLogSchema = new mongoose.Schema({
    user: { type: String, required: true },
    action: { type: String, required: true },
    details: String,
    ip: String,
    createdAt: { type: Date, default: Date.now }
  });

  Contact = mongoose.model('Contact', contactSchema);
  Subscriber = mongoose.model('Subscriber', subscriberSchema);
  Blog = mongoose.model('Blog', blogSchema);
  PageView = mongoose.model('PageView', pageViewSchema);
  ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
}

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your_gmail@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_gmail_app_password',
  },
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ 
        success: false, 
        message: 'Contact form is temporarily unavailable. Please try again later or contact us directly.' 
      });
    }

    const { name, email, phone, company, service, budget, timeline, subject, message } = req.body;
    const contact = new Contact({ name, email, phone, company, service, budget, timeline, subject, message });
    await contact.save();
    res.status(201).json({ success: true, message: 'Contact form submitted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ 
        success: false, 
        message: 'Subscription service is temporarily unavailable. Please try again later.' 
      });
    }

    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });
    
    const exists = await Subscriber.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Already subscribed.' });
    
    await Subscriber.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// Auth endpoints (JWT-based, no DB required)
const generateToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = { id: 'admin', email: ADMIN_EMAIL, role: 'admin', name: 'Admin' };
    const token = generateToken(user);

    // Optional: log activity if DB available
    if (hasMongoDB && ActivityLog) {
      try {
        await ActivityLog.create({ user: ADMIN_EMAIL, action: 'login', details: 'Admin logged in', ip: req.ip });
      } catch (e) {
        // ignore logging failures
      }
    }

    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

// Blog endpoints
app.get('/api/blogs', async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ 
        success: false, 
        message: 'Blog service is temporarily unavailable.' 
      });
    }

    const blogs = await Blog.find().sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ 
        success: false, 
        message: 'Blog service is temporarily unavailable.' 
      });
    }

    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin dashboard summary
app.get('/api/admin/dashboard/summary', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.json({
        success: true,
        dbConfigured: false,
        summary: {
          totalSubscribers: 0,
          totalContacts: 0,
          totalBlogs: 0,
          totalPageViews: 0,
          totalActivity: 0,
          revenueTotal: 0
        },
        changes: {
          subscribers: 0,
          contacts: 0,
          blogs: 0,
          pageViews: 0,
          activity: 0,
          revenue: 0
        },
        recentActivities: []
      });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevSevenDaysStart = new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevSevenDaysEnd = sevenDaysAgo;

    const countInRange = (Model, field, start, end) =>
      Model ? Model.countDocuments({ [field]: { $gte: start, $lt: end } }) : Promise.resolve(0);

    const [
      totalSubscribers,
      totalContacts,
      totalBlogs,
      totalPageViews,
      totalActivity
    ] = await Promise.all([
      Subscriber ? Subscriber.countDocuments() : 0,
      Contact ? Contact.countDocuments() : 0,
      Blog ? Blog.countDocuments() : 0,
      PageView ? PageView.countDocuments() : 0,
      ActivityLog ? ActivityLog.countDocuments() : 0
    ]);

    const [
      subs7, subsPrev7,
      contacts7, contactsPrev7,
      blogs7, blogsPrev7,
      views7, viewsPrev7,
      activity7, activityPrev7
    ] = await Promise.all([
      countInRange(Subscriber, 'createdAt', sevenDaysAgo, now), countInRange(Subscriber, 'createdAt', prevSevenDaysStart, prevSevenDaysEnd),
      countInRange(Contact, 'createdAt', sevenDaysAgo, now), countInRange(Contact, 'createdAt', prevSevenDaysStart, prevSevenDaysEnd),
      countInRange(Blog, 'publishedAt', sevenDaysAgo, now), countInRange(Blog, 'publishedAt', prevSevenDaysStart, prevSevenDaysEnd),
      countInRange(PageView, 'timestamp', sevenDaysAgo, now), countInRange(PageView, 'timestamp', prevSevenDaysStart, prevSevenDaysEnd),
      countInRange(ActivityLog, 'createdAt', sevenDaysAgo, now), countInRange(ActivityLog, 'createdAt', prevSevenDaysStart, prevSevenDaysEnd)
    ]);

    const pctChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const recentActivities = ActivityLog
      ? await ActivityLog.find().sort({ createdAt: -1 }).limit(10).select('user action details createdAt')
      : [];

    return res.json({
      success: true,
      dbConfigured: true,
      summary: {
        totalSubscribers,
        totalContacts,
        totalBlogs,
        totalPageViews,
        totalActivity,
        revenueTotal: 0
      },
      changes: {
        subscribers: pctChange(subs7, subsPrev7),
        contacts: pctChange(contacts7, contactsPrev7),
        blogs: pctChange(blogs7, blogsPrev7),
        pageViews: pctChange(views7, viewsPrev7),
        activity: pctChange(activity7, activityPrev7),
        revenue: 0
      },
      recentActivities
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Connect to MongoDB only if URI is provided
if (hasMongoDB) {
  console.log('🔍 Attempting to connect to MongoDB...');
  console.log(`🔍 MONGO_URI length: ${MONGO_URI.length}`);
  console.log(`🔍 MONGO_URI starts with: ${MONGO_URI.substring(0, 20)}...`);
  
  mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Increased timeout
    socketTimeoutMS: 45000,
    bufferCommands: false,
    maxPoolSize: 10,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${MONGO_URI.split('/').pop().split('?')[0]}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('🔧 Error details:', err);
    console.error('🔧 Please check your MONGO_URI environment variable');
    console.error('🔧 Make sure your MongoDB Atlas cluster is accessible');
    // Don't exit process, just log the error
  });
} else {
  console.log('ℹ️  MongoDB not configured - running in limited mode');
  console.log('🔍 MONGO_URI value:', MONGO_URI);
}

const server = http.createServer(app);
const io = new SocketIOServer(server, { 
  cors: { 
    origin: ['https://taliyotechnologies.com', 'https://taliyo-technologies.vercel.app', 'http://localhost:5173'] 
  } 
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${hasMongoDB ? 'MongoDB configured' : 'No database configured'}`);
}); 