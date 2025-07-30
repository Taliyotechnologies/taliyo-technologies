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
    ? [
      'https://taliyotechnologies.com',
      'https://taliyo-technologies.vercel.app',
      // ...other allowed domains
      ]
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});



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

// Update Contact model to include status
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
const Contact = mongoose.model('Contact', contactSchema);

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const adminUserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'viewer', 'hr'], default: 'viewer' },
  assignedProjects: [{ type: String }],
  resetToken: String,
  resetTokenExpires: Date,
  createdAt: { type: Date, default: Date.now }
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

const Blog = mongoose.model('Blog', blogSchema);
const Subscriber = mongoose.model('Subscriber', subscriberSchema);
const AdminUser = mongoose.model('AdminUser', adminUserSchema);
const PageView = mongoose.model('PageView', pageViewSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

// Auto-delete logs older than 7 days on server start
ActivityLog.deleteMany({ createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }).catch(() => {});

// Helper to log actions
async function logActivity({ user, action, details, ip }) {
  try {
    await ActivityLog.create({ user, action, details, ip });
  } catch {}
}

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

function roleAccess(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
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

// Blog endpoints with logging
app.post('/api/blogs', auth, roleAccess(['admin']), async (req, res) => {
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
    logActivity({ user: req.user.email, action: 'add_blog', details: `Added blog '${title}'`, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
app.put('/api/blogs/:id', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(blog);
    logActivity({ user: req.user.email, action: 'edit_blog', details: `Edited blog ${req.params.id}`, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
app.delete('/api/blogs/:id', auth, roleAccess(['admin']), async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
    logActivity({ user: req.user.email, action: 'delete_blog', details: `Deleted blog ${req.params.id}`, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
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

// Admin Authentication Routes
// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    // Find admin user
    const user = await AdminUser.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Log activity
    logActivity({ user: user.email, action: 'admin_login', details: 'Admin logged in', ip: req.ip });
    
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
    console.error('Token verification error:', err);
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
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Send reset email
    const resetUrl = `${FRONTEND_URL}/admin/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: `Taliyo Admin <${EMAIL_USER}>`,
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
    
    // Hash new password
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
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin user management routes
app.get('/api/admin/auth/users', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const users = await AdminUser.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/auth/register', auth, roleAccess(['admin']), async (req, res) => {
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

app.put('/api/admin/auth/users/:id', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await AdminUser.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/admin/auth/users/:id', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// General users endpoint (for compatibility)
app.get('/api/users', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = 'name', role = '', status = '' } = req.query;
    
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;
    if (status) filter.status = status;
    
    const sortObj = {};
    if (sort.startsWith('-')) {
      sortObj[sort.substring(1)] = -1;
    } else {
      sortObj[sort] = 1;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await AdminUser.find(filter)
      .select('-password')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await AdminUser.countDocuments(filter);
    
    res.json({
      success: true,
      data: users,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin API endpoints
// Subscribers: only admin can view
app.get('/api/admin/subscribers', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});
// Contacts: only admin can view
app.get('/api/admin/contacts', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Reply to contact and mark as done
app.post('/api/admin/contacts/:id/reply', auth, roleAccess(['admin']), async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const contact = await Contact.findById(id);
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  // Send email
  try {
    await transporter.sendMail({
      from: `Taliyo Admin <${EMAIL_USER}>`,
      to: contact.email,
      subject: 'Reply to your inquiry',
      html: `<p>${message}</p>`
    });
    contact.status = 'done';
    await contact.save();
    res.json({ success: true, message: 'Reply sent and status updated.' });
    logActivity({ user: req.user.email, action: 'reply_contact', details: `Replied to contact ${contact.email}`, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reply', error: err.message });
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

// GET logs endpoint (admin only)
app.get('/api/admin/logs', auth, roleAccess(['admin']), async (req, res) => {
  const logs = await ActivityLog.find().sort({ createdAt: -1 });
  res.json(logs);
});

// General logs endpoint (for compatibility)
app.get('/api/logs', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', level = '', sort = '-createdAt' } = req.query;
    
    const filter = {};
    if (search) {
      filter.$or = [
        { user: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } }
      ];
    }
    if (level) filter.level = level;
    
    const sortObj = {};
    if (sort.startsWith('-')) {
      sortObj[sort.substring(1)] = -1;
    } else {
      sortObj[sort] = 1;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const logs = await ActivityLog.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await ActivityLog.countDocuments(filter);
    
    res.json({
      success: true,
      data: logs,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Logs error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Project model
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  client: { type: String, required: true },
  deadline: { type: Date },
  price: { type: Number },
  techStack: { type: String }, // free text
  status: { type: String, enum: ['Ongoing', 'Completed', 'On Hold'], default: 'Ongoing' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', projectSchema);

// Add new project
app.post('/api/admin/projects', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const { title, client, deadline, price, techStack, status, notes } = req.body;
    const project = new Project({ title, client, deadline, price, techStack, status, notes });
    await project.save();
    res.status(201).json(project);
    logActivity({ user: req.user.email, action: 'add_project', details: `Added project '${title}'`, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Edit/update project
app.patch('/api/admin/projects/:id', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const update = req.body;
    const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(project);
    logActivity({ user: req.user.email, action: 'edit_project', details: `Edited project ${req.params.id}`, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Delete project
app.delete('/api/admin/projects/:id', auth, roleAccess(['admin']), async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
    logActivity({ user: req.user.email, action: 'delete_project', details: `Deleted project ${req.params.id}`, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// List/search/filter projects
app.get('/api/admin/projects', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const { client, status, from, to, q } = req.query;
    const filter = {};
    if (client) filter.client = client;
    if (status) filter.status = status;
    if (from || to) filter.deadline = {};
    if (from) filter.deadline.$gte = new Date(from);
    if (to) filter.deadline.$lte = new Date(to);
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { client: { $regex: q, $options: 'i' } },
      { techStack: { $regex: q, $options: 'i' } }
    ];
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// TeamMember model
const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'dev', 'designer', 'tester'], default: 'dev' },
  email: { type: String, required: true, unique: true },
  assignedProjects: [{ type: String }], // changed from ObjectId to String
  tasks: [{
    project: { type: String },
    status: { type: String, enum: ['Ongoing', 'Completed'], default: 'Ongoing' },
    hours: { type: Number },
    note: { type: String },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

// Add team member
app.post('/api/admin/team', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const { name, role, email, assignedProjects } = req.body;
    const member = new TeamMember({ name, role, email, assignedProjects });
    await member.save();
    res.status(201).json(member);
    logActivity({ user: req.user.email, action: 'add_team_member', details: `Added team member ${email}`, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Edit team member
app.patch('/api/admin/team/:id', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const update = req.body;
    const member = await TeamMember.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(member);
    logActivity({ user: req.user.email, action: 'edit_team_member', details: `Edited team member ${req.params.id}`, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Delete team member
app.delete('/api/admin/team/:id', auth, roleAccess(['admin']), async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted' });
    logActivity({ user: req.user.email, action: 'delete_team_member', details: `Deleted team member ${req.params.id}`, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// List team members
app.get('/api/admin/team', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const members = await TeamMember.find().populate('assignedProjects', 'title');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Log task for a member
app.post('/api/admin/team/:id/task', auth, roleAccess(['admin']), async (req, res) => {
  try {
    const { project, status, hours, note } = req.body;
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    member.tasks.push({ project, status, hours, note });
    await member.save();
    res.json(member);
    logActivity({ user: req.user.email, action: 'log_task', details: `Logged task for member ${member.email}`, ip: req.ip });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: [
  'https://taliyotechnologies.com',
  'https://taliyo-technologies.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176'
] } });

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