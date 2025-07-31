const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://taliyo_user:Taliyo019@cluster0.kmbp5ro.mongodb.net/taliyo?retryWrites=true&w=majority&appName=Cluster0';
const JWT_SECRET = process.env.JWT_SECRET || 'mySuperSecretKey123!';

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://taliyotechnologies.com', 'https://taliyo-technologies.vercel.app']
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// MongoDB Models
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  service: String,
  budget: String,
  timeline: String,
  subject: String,
  message: String,
  status: { type: String, enum: ['done', 'not done'], default: 'not done' },
  createdAt: { type: Date, default: Date.now }
});

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const adminUserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
  resetToken: String,
  resetTokenExpires: Date,
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

const Contact = mongoose.model('Contact', contactSchema);
const Subscriber = mongoose.model('Subscriber', subscriberSchema);
const AdminUser = mongoose.model('AdminUser', adminUserSchema);
const Blog = mongoose.model('Blog', blogSchema);
const PageView = mongoose.model('PageView', pageViewSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

// Auth middleware
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
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

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify admin token
app.get('/api/admin/verify-token', auth, async (req, res) => {
  try {
    const user = await AdminUser.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin forgot password
app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset-password?token=${resetToken}`;
    
    await transporter.sendMail({
      from: `Taliyo Admin <${process.env.EMAIL_USER || 'your_gmail@gmail.com'}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link expires in 1 hour.</p>
      `
    });
    
    res.json({ success: true, message: 'Reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin reset password
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and password are required' });
    }
    
    const user = await AdminUser.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
    
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin change password
app.post('/api/admin/auth/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }
    
    const user = await AdminUser.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin user management
app.get('/api/admin/auth/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await AdminUser.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/auth/register', auth, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new AdminUser({
      name,
      email,
      password: hashedPassword,
      role: role || 'viewer'
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin data endpoints
app.get('/api/admin/subscribers', auth, adminOnly, async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

app.get('/api/admin/contacts', auth, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Analytics endpoints (without auth for now)
app.get('/api/admin/analytics/stats', async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 1;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const totalViews = await PageView.countDocuments({ timestamp: { $gte: startDate } });
    const uniqueUsers = await PageView.distinct('userId', { timestamp: { $gte: startDate } });
    
    res.json({
      visitors: totalViews,
      uniqueUsers: uniqueUsers.length,
      pageviews: totalViews,
      sessions: Math.floor(totalViews * 0.8),
      bounceRate: Math.floor(Math.random() * 30) + 20,
      avgSession: `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      conversionRate: Math.floor(Math.random() * 5) + 1,
      liveUsers: Math.floor(Math.random() * 10) + 1,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      goalCompletions: Math.floor(Math.random() * 50) + 10,
      pageLoadTime: (Math.random() * 2 + 0.5).toFixed(1),
      serverResponseTime: Math.floor(Math.random() * 200) + 50
    });
  } catch (err) {
    console.error('Analytics stats error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/analytics/chart', async (req, res) => {
  try {
    const { period = '7d', type = 'visitors' } = req.query;
    
    let data = [];
    if (type === 'visitors') {
      data = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100) + 10);
    } else if (type === 'conversions') {
      data = Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 1);
    } else if (type === 'revenue') {
      data = Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000) + 100);
    }
    
    res.json(data);
  } catch (err) {
    console.error('Analytics chart error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/analytics/geography', async (req, res) => {
  try {
    const geography = [
      { country: 'India', visitors: 45, percentage: 85, users: 45, growth: 12 },
      { country: 'United States', visitors: 5, percentage: 9, users: 5, growth: 8 },
      { country: 'United Kingdom', visitors: 2, percentage: 4, users: 2, growth: 5 },
      { country: 'Canada', visitors: 1, percentage: 2, users: 1, growth: 3 }
    ];
    
    res.json(geography);
  } catch (err) {
    console.error('Analytics geography error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/analytics/pages', async (req, res) => {
  try {
    const pages = [
      { name: '/', views: 25, avgTime: '2:30', bounce: 15 },
      { name: '/about', views: 15, avgTime: '1:45', bounce: 25 },
      { name: '/contact', views: 10, avgTime: '3:20', bounce: 10 },
      { name: '/services', views: 8, avgTime: '2:15', bounce: 20 },
      { name: '/portfolio', views: 6, avgTime: '1:30', bounce: 30 }
    ];
    
    res.json(pages);
  } catch (err) {
    console.error('Analytics pages error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/analytics/realtime', async (req, res) => {
  try {
    const realtime = {
      currentVisitors: [
        { id: 1, page: '/', time: '2 min ago', country: 'India', device: 'Desktop', browser: 'Chrome', source: 'Direct' },
        { id: 2, page: '/about', time: '5 min ago', country: 'India', device: 'Mobile', browser: 'Safari', source: 'Google' },
        { id: 3, page: '/contact', time: '1 min ago', country: 'India', device: 'Desktop', browser: 'Firefox', source: 'Social' }
      ],
      recentEvents: [
        { type: 'pageview', page: '/', time: '2 min ago' },
        { type: 'click', element: 'Contact Button', time: '3 min ago' },
        { type: 'form_submit', form: 'Contact Form', time: '5 min ago' }
      ]
    };
    
    res.json(realtime);
  } catch (err) {
    console.error('Analytics realtime error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/analytics/devices', async (req, res) => {
  try {
    const devices = [
      { device: 'Desktop', visitors: 35, percentage: 66 },
      { device: 'Mobile', visitors: 15, percentage: 28 },
      { device: 'Tablet', visitors: 3, percentage: 6 }
    ];
    
    res.json(devices);
  } catch (err) {
    console.error('Analytics devices error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/analytics/browsers', async (req, res) => {
  try {
    const browsers = [
      { browser: 'Chrome', visitors: 25, percentage: 47 },
      { browser: 'Safari', visitors: 12, percentage: 23 },
      { browser: 'Firefox', visitors: 8, percentage: 15 },
      { browser: 'Edge', visitors: 5, percentage: 9 },
      { browser: 'Others', visitors: 3, percentage: 6 }
    ];
    
    res.json(browsers);
  } catch (err) {
    console.error('Analytics browsers error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/analytics/sources', async (req, res) => {
  try {
    const sources = [
      { source: 'Direct', visitors: 20, percentage: 38 },
      { source: 'Google', visitors: 15, percentage: 28 },
      { source: 'Social Media', visitors: 10, percentage: 19 },
      { source: 'Referral', visitors: 5, percentage: 9 },
      { source: 'Email', visitors: 3, percentage: 6 }
    ];
    
    res.json(sources);
  } catch (err) {
    console.error('Analytics sources error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Blog endpoints
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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
  console.log(`Server running on port ${PORT}`);
}); 