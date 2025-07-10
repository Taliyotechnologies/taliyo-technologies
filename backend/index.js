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
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taliyo';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app', 'https://your-frontend-domain.netlify.app']
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Models
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
  createdAt: { type: Date, default: Date.now }
});

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  resetToken: String,
  resetTokenExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

const pageViewSchema = new mongoose.Schema({
  page: { type: String, required: true },
  userId: String,
  timestamp: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);
const Contact = mongoose.model('Contact', contactSchema);
const Subscriber = mongoose.model('Subscriber', subscriberSchema);
const AdminUser = mongoose.model('AdminUser', adminUserSchema);
const PageView = mongoose.model('PageView', pageViewSchema);

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

// Setup Nodemailer transporter (Gmail)
const EMAIL_USER = process.env.EMAIL_USER || 'your_gmail@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your_gmail_app_password';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Blog API endpoints
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
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/blogs', auth, adminOnly, async (req, res) => {
  try {
    const { title, content, excerpt, author, image, category, tags, featured } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      author,
      image,
      category,
      tags,
      featured
    });
    
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/blogs/:id', auth, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/blogs/:id', auth, adminOnly, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin authentication endpoints
app.post('/api/admin/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await AdminUser.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token, user: { email: user.email, role: user.role } });
});

app.post('/api/admin/auth/register', auth, adminOnly, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new AdminUser({
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/admin/auth/forgot', async (req, res) => {
  const { email } = req.body;
  const user = await AdminUser.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If user exists, email sent' });
  
  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour
  await user.save();
  
  // Send email with reset link
  const resetUrl = `${FRONTEND_URL}/admin/reset/${token}`;
  try {
    await transporter.sendMail({
      from: `Taliyo Admin <${EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset for your Taliyo admin account.</p><p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, you can ignore this email.</p>`
    });
    res.json({ message: 'Reset link sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
});

app.post('/api/admin/auth/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  const user = await AdminUser.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  
  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  
  res.json({ message: 'Password reset successful' });
});

// Change password endpoint
app.post('/api/admin/auth/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }
    const user = await AdminUser.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// User management endpoints
app.get('/api/admin/auth/users', auth, adminOnly, async (req, res) => {
  const users = await AdminUser.find({}, '-password -resetToken -resetTokenExpires');
  res.json(users);
});

app.delete('/api/admin/auth/users/:id', auth, adminOnly, async (req, res) => {
  const { id } = req.params;
  if (req.user.id === id) return res.status(400).json({ message: 'Cannot delete self' });
  await AdminUser.findByIdAndDelete(id);
  res.json({ message: 'User deleted' });
});

app.patch('/api/admin/auth/users/:id', auth, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { role, password } = req.body;
  const update = {};
  if (role) update.role = role;
  if (password) update.password = await bcrypt.hash(password, 10);
  
  const user = await AdminUser.findByIdAndUpdate(id, update, { new: true, select: '-password -resetToken -resetTokenExpires' });
  res.json(user);
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

// Admin API endpoints
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

// Analytics endpoints
app.get('/api/admin/analytics/range', async (req, res) => {
  const { start, end } = req.query;
  const match = {};
  if (start) match.timestamp = { $gte: new Date(start) };
  if (end) match.timestamp = { ...(match.timestamp || {}), $lte: new Date(end) };

  // Group by day (YYYY-MM-DD)
  const data = await PageView.aggregate([
    { $match: match },
    { $addFields: {
        day: {
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
        }
      }
    },
    { $group: {
        _id: "$day",
        views: { $sum: 1 },
        uniqueUsers: { $addToSet: "$userId" }
      }
    },
    { $project: {
        date: "$_id",
        views: 1,
        unique: { $size: "$uniqueUsers" },
        _id: 0
      }
    },
    { $sort: { date: 1 } }
  ]);

  res.json(data);
});

// Grand Totals endpoint for all-time analytics
app.get('/api/admin/analytics/total', async (req, res) => {
  try {
    const data = await PageView.aggregate([
      { $group: {
          _id: "$page",
          views: { $sum: 1 },
          uniqueUserIds: { $addToSet: "$userId" }
        }
      },
      { $project: {
          page: "$_id",
          views: 1,
          unique: { $size: "$uniqueUserIds" },
          uniqueUserIds: 1,
          _id: 0
        }
      },
      { $sort: { views: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Newsletter sending endpoint
app.post('/api/admin/send-newsletter', auth, adminOnly, async (req, res) => {
  try {
    const { subject, content } = req.body;
    
    if (!subject || !content) {
      return res.status(400).json({ success: false, message: 'Subject and content are required' });
    }
    
    // Get all subscribers
    const subscribers = await Subscriber.find();
    
    if (subscribers.length === 0) {
      return res.status(400).json({ success: false, message: 'No subscribers found' });
    }
    
    // Send email to each subscriber
    const emailPromises = subscribers.map(subscriber => {
      return transporter.sendMail({
        from: `Taliyo Technologies <${EMAIL_USER}>`,
        to: subscriber.email,
        subject: subject,
        html: content,
      });
    });
    
    await Promise.all(emailPromises);
    
    res.json({ 
      success: true, 
      message: `Newsletter sent successfully to ${subscribers.length} subscribers` 
    });
  } catch (err) {
    console.error('Newsletter sending error:', err);
    res.status(500).json({ success: false, message: 'Failed to send newsletter' });
  }
});

// System logs endpoint
app.get('/api/admin/logs', auth, adminOnly, async (req, res) => {
  try {
    // For now, return sample logs. In a real system, you'd store logs in database
    const sampleLogs = [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        level: 'info',
        message: 'Admin user logged in successfully'
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        level: 'info',
        message: 'New contact form submission received'
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        level: 'info',
        message: 'Newsletter subscriber added'
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        level: 'warning',
        message: 'High memory usage detected'
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        level: 'info',
        message: 'Database backup completed'
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        level: 'error',
        message: 'Failed to send email notification'
      }
    ];
    
    res.json(sampleLogs);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch logs' });
  }
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

// In-memory visitor/session tracking
let liveVisitors = 0;
const pageVisitors = {}; // { '/blog/slug': { count, users: Set, durations: [] } }

io.on('connection', (socket) => {
  liveVisitors++;
  io.emit('liveVisitors', liveVisitors);

  socket.on('pageView', async ({ page, userId }) => {
    if (!pageVisitors[page]) pageVisitors[page] = { count: 0, users: new Set(), durations: [] };
    pageVisitors[page].count++;
    pageVisitors[page].users.add(userId);
    io.emit('pageStats', getPageStats());
    socket.page = page;
    socket.userId = userId;
    socket.startTime = Date.now();
    
    // Save to MongoDB for analytics
    try {
      await PageView.create({ page, userId });
    } catch (err) {
      console.error('Failed to save page view:', err);
    }
  });

  socket.on('disconnect', () => {
    liveVisitors--;
    io.emit('liveVisitors', liveVisitors);
    
    // Calculate duration for this user on the page
    if (socket.page && socket.userId && socket.startTime) {
      const duration = Math.floor((Date.now() - socket.startTime) / 1000);
      if (pageVisitors[socket.page]) {
        pageVisitors[socket.page].durations.push(duration);
        pageVisitors[socket.page].users.delete(socket.userId);
        io.emit('pageStats', getPageStats());
      }
    }
  });
});

function getPageStats() {
  // Returns { page: { count, unique, avgDuration } }
  const stats = {};
  for (const [page, data] of Object.entries(pageVisitors)) {
    const avgDuration = data.durations.length
      ? Math.round(data.durations.reduce((a, b) => a + b, 0) / data.durations.length)
      : 0;
    stats[page] = {
      views: data.count,
      unique: data.users.size,
      avgDuration,
    };
  }
  return stats;
}

app.get('/api/admin/blog-analytics', (req, res) => {
  res.json(getPageStats());
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 