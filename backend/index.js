require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

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
// Socket.IO instance holder (assigned after server creation)
let io;

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

// Static uploads directory for images
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

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
let Contact, Subscriber, Blog, Project, PageView, ActivityLog;

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
    // Basic
    path: { type: String, required: true },
    page: { type: String }, // legacy alias
    clientId: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },

    // Referrer & UTM
    referrer: String,
    referrerHost: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String,
    sourceCategory: { type: String, enum: ['direct', 'organic', 'social', 'referral', 'paid', 'email', 'unknown'], default: 'unknown' },
    socialNetwork: String,
    isOrganic: { type: Boolean, default: false },

    // Device & agent
    userAgent: String,
    deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet', 'unknown'], default: 'unknown' },
    os: String,
    browser: String,

    // Client hints
    language: String,
    timezone: String,
    screenWidth: Number,
    screenHeight: Number,

    // IP & Geo
    ip: String,
    country: String,
    countryCode: String,
    region: String, // state/province
    regionCode: String,
    city: String
  });

  const activityLogSchema = new mongoose.Schema({
    user: { type: String, required: true },
    action: { type: String, required: true },
    details: String,
    ip: String,
    createdAt: { type: Date, default: Date.now }
  });

  const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    client: String,
    description: String,
    status: { type: String, enum: ['planning', 'in-progress', 'on-hold', 'completed'], default: 'planning' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    startDate: Date,
    endDate: Date,
    budget: { type: Number, default: 0 },
    team: [String],
    technologies: [String],
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    category: String,
    duration: String,
    liveUrl: String,
    githubUrl: String,
    image: String,
    overview: String,
    challenge: String,
    solution: String,
    features: [String],
    results: [String],
    process: [{
      phase: String,
      description: String,
      duration: String
    }],
    gallery: [String],
    tags: [String],
    year: Number,
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now }
  }, { timestamps: true });

  Contact = mongoose.model('Contact', contactSchema);
  Subscriber = mongoose.model('Subscriber', subscriberSchema);
  Blog = mongoose.model('Blog', blogSchema);
  Project = mongoose.model('Project', projectSchema);
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
    // Emit real-time event for new contact
    try {
      if (io) {
        const payload = contact?.toObject ? contact.toObject() : contact;
        io.emit('newContact', { item: payload });
      }
    } catch (e) {
      // ignore socket errors
    }
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
    
    const created = await Subscriber.create({ email });
    // Emit real-time event for new subscriber
    try {
      if (io) {
        const payload = created?.toObject ? created.toObject() : created;
        io.emit('newSubscriber', { item: payload });
      }
    } catch (e) {
      // ignore socket errors
    }
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

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9-_]/gi, '')
      .toLowerCase()
      .slice(0, 50) || 'image';
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
  return cb(new Error('Only image files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Protected image upload endpoint
app.post('/api/admin/upload', authMiddleware, (req, res) => {
  upload.single('image')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.json({ success: true, url: fileUrl, filename: req.file.filename });
  });
});

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

// Utilities for Projects
const slugify = (str = '') =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const parseBudget = (val) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const num = Number(val.replace(/[^0-9.-]+/g, ''));
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
};

const generateUniqueSlug = async (base, idToExclude) => {
  if (!hasMongoDB) return base || `project-${Date.now()}`;
  let slug = base || `project-${Date.now()}`;
  let i = 1;
  const queryOf = (s) => idToExclude ? { slug: s, _id: { $ne: idToExclude } } : { slug: s };
  // Ensure uniqueness by appending incrementing suffixes
  // Limit loop to avoid infinite attempts
  while (await Project.findOne(queryOf(slug))) {
    i += 1;
    slug = `${base}-${i}`;
    if (i > 1000) break;
  }
  return slug;
};

// Helper to generate unique slug for Blogs
const generateUniqueBlogSlug = async (base, idToExclude) => {
  if (!hasMongoDB) return base || `blog-${Date.now()}`;
  let slug = base || `blog-${Date.now()}`;
  let i = 1;
  const queryOf = (s) => idToExclude ? { slug: s, _id: { $ne: idToExclude } } : { slug: s };
  while (await Blog.findOne(queryOf(slug))) {
    i += 1;
    slug = `${base}-${i}`;
    if (i > 1000) break;
  }
  return slug;
};

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

// Blogs - Admin (JWT protected)
app.get('/api/admin/blogs', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Blog service is temporarily unavailable.' });
    }
    const items = await Blog.find().sort({ publishedAt: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Analytics Tracking & Summary ---
// Helper: categorize source (robust)
const categorizeSource = ({ referrerHost = '', utmSource = '', utmMedium = '', path = '' }) => {
  const host = (referrerHost || '').toLowerCase();
  const medium = (utmMedium || '').toLowerCase();
  const source = (utmSource || '').toLowerCase();

  // Parse query params from path to detect ads (e.g., gclid)
  let hasGclid = false;
  try {
    const url = new URL(path.startsWith('http') ? path : `http://local${path.startsWith('/') ? path : '/' + path}`);
    const sp = url.searchParams;
    hasGclid = !!(sp.get('gclid') || sp.get('gclsrc'));
  } catch {}

  const isDirect = !host && !source;

  // Identify search engine
  const isSearch = (
    host.includes('google.') || source === 'google' ||
    host.includes('bing.') || source === 'bing' ||
    host.includes('yahoo.') || source === 'yahoo' ||
    host.includes('duckduckgo') || source === 'duckduckgo'
  );

  // Identify social platform (by host or utm_source)
  const isLinkedIn = host.includes('linkedin.') || host.includes('lnkd.') || source === 'linkedin';
  const isFacebook = host.includes('facebook.') || host.includes('fb.') || host.includes('l.facebook.') || host.includes('lm.facebook.') || source === 'facebook' || source === 'fb';
  const isInstagram = host.includes('instagram.') || host.includes('instagr.am') || host.includes('l.instagram.') || source === 'instagram' || source === 'ig';
  const isTwitter = host.includes('twitter.') || host.includes('t.co') || host.includes('x.com') || source === 'twitter' || source === 'x';
  const isYouTube = host.includes('youtube.') || host.includes('youtu.be') || source === 'youtube';
  const isPinterest = host.includes('pinterest.') || source === 'pinterest';
  const isReddit = host.includes('reddit.') || source === 'reddit';

  let socialNetwork = undefined;
  if (isLinkedIn) socialNetwork = 'linkedin';
  else if (isFacebook) socialNetwork = 'facebook';
  else if (isInstagram) socialNetwork = 'instagram';
  else if (isTwitter) socialNetwork = 'twitter';
  else if (isYouTube) socialNetwork = 'youtube';
  else if (isPinterest) socialNetwork = 'pinterest';
  else if (isReddit) socialNetwork = 'reddit';

  // Paid detection
  const isPaid = ['cpc','ppc','paid','ads','sem','display','cpm'].some(k => medium.includes(k)) || hasGclid;

  // Categorization priority: Social > Paid > Organic (search) > Email > Direct > Referral > Unknown
  let category = 'unknown';
  if (socialNetwork) category = 'social';
  else if (isPaid) category = 'paid';
  else if (isSearch) category = 'organic';
  else if (medium === 'email') category = 'email';
  else if (isDirect) category = 'direct';
  else if (host) category = 'referral';

  const isOrganic = category === 'organic';
  return { category, socialNetwork, isOrganic };
};

// Helper: naive user-agent parsing
const parseUA = (ua = '') => {
  const s = ua.toLowerCase();
  let deviceType = 'unknown';
  if (/mobile|iphone|android.+mobile/.test(s)) deviceType = 'mobile';
  else if (/ipad|tablet/.test(s)) deviceType = 'tablet';
  else if (s) deviceType = 'desktop';

  let os = 'unknown';
  if (s.includes('windows')) os = 'windows';
  else if (s.includes('mac os') || s.includes('macintosh')) os = 'macos';
  else if (s.includes('android')) os = 'android';
  else if (s.includes('ios') || s.includes('iphone') || s.includes('ipad')) os = 'ios';
  else if (s.includes('linux')) os = 'linux';

  let browser = 'unknown';
  if (s.includes('edg/')) browser = 'edge';
  else if (s.includes('chrome/')) browser = 'chrome';
  else if (s.includes('safari') && !s.includes('chrome')) browser = 'safari';
  else if (s.includes('firefox')) browser = 'firefox';

  return { deviceType, os, browser };
};

// Helper: best-effort IP extraction
const getIp = (req) => {
  const xf = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return xf || req.socket?.remoteAddress || req.ip || '';
};

// Helper: optional geo-lookup (best-effort, timeout)
const shouldGeoLookup = (process.env.ENABLE_GEOIP || 'true') === 'true';
const geoLookup = async (ip) => {
  if (!ip || !shouldGeoLookup || typeof fetch !== 'function') return {};
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 1500);
    const resp = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, { signal: controller.signal });
    clearTimeout(t);
    if (!resp.ok) return {};
    const d = await resp.json();
    return {
      country: d.country_name,
      countryCode: d.country,
      region: d.region,
      regionCode: d.region_code,
      city: d.city
    };
  } catch {
    return {};
  }
};

// Public tracking endpoint
app.post('/api/track', async (req, res) => {
  try {
    if (!hasMongoDB) return res.json({ success: true, skipped: true });
    const ua = String(req.headers['user-agent'] || '');
    const { deviceType, os, browser } = parseUA(ua);
    const ip = getIp(req);
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const path = body.path || body.page || '/';
    const clientId = body.clientId;
    const referrer = body.referrer;
    const utmSource = body.utmSource;
    const utmMedium = body.utmMedium;
    const utmCampaign = body.utmCampaign;
    const utmTerm = body.utmTerm;
    const utmContent = body.utmContent;
    const language = body.language;
    const timezone = body.timezone;
    const screenWidth = body.screenWidth;
    const screenHeight = body.screenHeight;

    let referrerHost = '';
    if (typeof referrer === 'string' && referrer) {
      try {
        const parsed = new URL(referrer);
        referrerHost = parsed.hostname || '';
      } catch {
        const m = referrer.match(/^https?:\/\/([^/]+)/i);
        referrerHost = m ? m[1] : '';
      }
    }
    const { category: sourceCategory, socialNetwork, isOrganic } = categorizeSource({ referrerHost, utmSource, utmMedium, path });

    const geo = await geoLookup(ip);

    const payload = {
      path,
      page: path,
      clientId,
      createdAt: new Date(),
      referrer,
      referrerHost,
      utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
      sourceCategory,
      socialNetwork,
      isOrganic,
      userAgent: ua,
      deviceType, os, browser,
      language, timezone, screenWidth, screenHeight,
      ip,
      ...geo
    };

    const created = await PageView.create(payload);
    try { if (io) io.emit('pageView', { item: created.toObject ? created.toObject() : created }); } catch {}
    return res.json({ success: true });
  } catch (err) {
    return res.status(200).json({ success: true }); // never break pages due to analytics
  }
});

// Admin analytics summary (JWT)
app.get('/api/admin/analytics/summary', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.json({ success: true, dbConfigured: false, summary: {}, breakdowns: {} });
    }
    // If DB is still connecting (cold start), avoid 500 and return empty summary
    if (!mongoose?.connection || mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        dbConfigured: true,
        range: {},
        summary: { totalVisitors: 0, totalPageViews: 0 },
        breakdowns: {
          byDevice: [], byCountry: [], byCity: [], inStates: [], usStates: [],
          sources: [], social: [], topReferrers: [], topPages: [], organic: 0, nonOrganic: 0
        },
        timeseries: []
      });
    }
    const now = new Date();
    const defaultStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    let start = req.query.start ? new Date(req.query.start) : defaultStart;
    let end = req.query.end ? new Date(req.query.end) : now;
    if (isNaN(start.getTime())) start = defaultStart;
    if (isNaN(end.getTime())) end = now;

    const match = { createdAt: { $gte: start, $lt: end } };

    const safe = async (p, fallback) => {
      try { return await p; } catch (e) { console.error('Analytics error:', e?.message || e); return fallback; }
    };

    const [totalPageViews, clientIds, ips] = await Promise.all([
      safe(PageView.countDocuments(match), 0),
      safe(PageView.distinct('clientId', match), []),
      safe(PageView.distinct('ip', match), []),
    ]);
    const totalVisitors = (clientIds.filter(Boolean).length) || (ips.filter(Boolean).length);

    const byDevice = await safe(PageView.aggregate([
      { $match: match },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]), []);

    const byCountry = await safe(PageView.aggregate([
      { $match: match },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]), []);

    const byCity = await safe(PageView.aggregate([
      { $match: match },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]), []);

    const topReferrers = await safe(PageView.aggregate([
      { $match: match },
      { $group: { _id: '$referrerHost', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]), []);

    const topPages = await safe(PageView.aggregate([
      { $match: match },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]), []);

    const sources = await safe(PageView.aggregate([
      { $match: match },
      { $group: { _id: '$sourceCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]), []);

    const social = await safe(PageView.aggregate([
      { $match: { ...match, socialNetwork: { $exists: true, $ne: null } } },
      { $group: { _id: '$socialNetwork', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]), []);

    const organicCount = await safe(PageView.countDocuments({ ...match, isOrganic: true }), 0);
    const nonOrganicCount = Math.max(totalPageViews - organicCount, 0);

    // Explicit source summary counts
    const [
      directCount,
      googleCount,
      googleOrganicCount,
      googlePaidCount,
      linkedinCount,
      instagramCount,
      facebookCount,
      twitterCount,
      otherSocialCount,
      referralCount,
      emailCount,
      paidCount
    ] = await Promise.all([
      safe(PageView.countDocuments({ ...match, sourceCategory: 'direct' }), 0),
      safe(PageView.countDocuments({
        ...match,
        $or: [
          { referrerHost: /google\./i },
          { utmSource: /^google$/i }
        ]
      }), 0),
      safe(PageView.countDocuments({
        ...match,
        isOrganic: true,
        $or: [ { referrerHost: /google\./i }, { utmSource: /^google$/i } ]
      }), 0),
      safe(PageView.countDocuments({
        ...match,
        sourceCategory: 'paid',
        $or: [ { referrerHost: /google\./i }, { utmSource: /^google$/i } ]
      }), 0),
      safe(PageView.countDocuments({ ...match, socialNetwork: 'linkedin' }), 0),
      safe(PageView.countDocuments({ ...match, socialNetwork: 'instagram' }), 0),
      safe(PageView.countDocuments({ ...match, socialNetwork: 'facebook' }), 0),
      safe(PageView.countDocuments({ ...match, socialNetwork: 'twitter' }), 0),
      safe(PageView.countDocuments({ ...match, socialNetwork: { $exists: true, $nin: ['linkedin', 'instagram', 'facebook', 'twitter'] } }), 0),
      safe(PageView.countDocuments({ ...match, sourceCategory: 'referral' }), 0),
      safe(PageView.countDocuments({ ...match, sourceCategory: 'email' }), 0),
      safe(PageView.countDocuments({ ...match, sourceCategory: 'paid' }), 0)
    ]);

    // States for India and USA
    const inStates = await safe(PageView.aggregate([
      { $match: { ...match, countryCode: 'IN' } },
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]), []);
    const usStates = await safe(PageView.aggregate([
      { $match: { ...match, countryCode: 'US' } },
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]), []);

    // Timeseries by day
    const timeseries = await safe(PageView.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]), []);

    return res.json({
      success: true,
      dbConfigured: true,
      range: { start, end },
      summary: { totalVisitors, totalPageViews },
      breakdowns: {
        byDevice,
        byCountry,
        byCity,
        inStates,
        usStates,
        sources,
        social,
        topReferrers,
        topPages,
        organic: organicCount,
        nonOrganic: nonOrganicCount,
        sourceSummary: {
          direct: directCount,
          google: googleCount,
          googleOrganic: googleOrganicCount,
          googlePaid: googlePaidCount,
          linkedin: linkedinCount,
          instagram: instagramCount,
          facebook: facebookCount,
          twitter: twitterCount,
          otherSocial: otherSocialCount,
          referral: referralCount,
          email: emailCount,
          paid: paidCount
        }
      },
      timeseries
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/blogs', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Blog service is temporarily unavailable.' });
    }

    const body = req.body || {};
    const required = ['title', 'content', 'excerpt', 'author', 'image', 'category'];
    for (const field of required) {
      if (!body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const baseSlug = slugify(body.slug || body.title) || `blog-${Date.now()}`;
    const slug = await generateUniqueBlogSlug(baseSlug);

    const created = await Blog.create({ ...body, slug });

    if (ActivityLog) {
      ActivityLog.create({ user: req.user?.email || 'admin', action: 'create_blog', details: `Created blog "${created.title}"`, ip: req.ip }).catch(() => {});
    }

    return res.status(201).json({ success: true, item: created });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/admin/blogs/:id', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Blog service is temporarily unavailable.' });
    }
    const { id } = req.params;
    const body = req.body || {};

    const existing = await Blog.findById(id);
    if (!existing) return res.status(404).json({ message: 'Blog not found' });

    // Handle slug change if title or slug updated
    let needSlugUpdate = false;
    let newBaseSlug = existing.slug;
    if (typeof body.slug === 'string' && slugify(body.slug) !== existing.slug) {
      needSlugUpdate = true;
      newBaseSlug = slugify(body.slug);
    } else if (typeof body.title === 'string' && slugify(body.title) !== slugify(existing.title)) {
      needSlugUpdate = true;
      newBaseSlug = slugify(body.title);
    }

    if (needSlugUpdate) {
      body.slug = await generateUniqueBlogSlug(newBaseSlug, existing._id);
    }

    const updated = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (ActivityLog) {
      ActivityLog.create({ user: req.user?.email || 'admin', action: 'update_blog', details: `Updated blog "${updated.title}"`, ip: req.ip }).catch(() => {});
    }
    return res.json({ success: true, item: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/admin/blogs/:id', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Blog service is temporarily unavailable.' });
    }
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Blog not found' });
    if (ActivityLog) {
      ActivityLog.create({ user: req.user?.email || 'admin', action: 'delete_blog', details: `Deleted blog "${deleted.title}"`, ip: req.ip }).catch(() => {});
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Projects - Public Endpoints
app.get('/api/projects', async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Project service is temporarily unavailable.' });
    }

    const { status, tag, category, search } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const filter = { isPublished: true };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
      const r = new RegExp(search, 'i');
      filter.$or = [
        { title: r },
        { description: r },
        { client: r },
        { technologies: r },
        { tags: r }
      ];
    }

    const [items, total] = await Promise.all([
      Project.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(filter)
    ]);

    return res.json({ success: true, items, total, page, limit });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/projects/:slug', async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Project service is temporarily unavailable.' });
    }

    const project = await Project.findOne({ slug: req.params.slug, isPublished: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.json(project);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Projects - Admin (JWT protected)
app.get('/api/admin/projects', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Project service is temporarily unavailable.' });
    }
    const items = await Project.find().sort({ createdAt: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/projects', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Project service is temporarily unavailable.' });
    }

    const body = req.body || {};
    if (!body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    body.budget = body.budget !== undefined ? parseBudget(body.budget) : 0;

    const baseSlug = slugify(body.slug || body.title) || `project-${Date.now()}`;
    const slug = await generateUniqueSlug(baseSlug);

    const created = await Project.create({ ...body, slug });

    if (ActivityLog) {
      ActivityLog.create({ user: req.user?.email || 'admin', action: 'create_project', details: `Created project "${created.title}"`, ip: req.ip }).catch(() => {});
    }

    return res.status(201).json({ success: true, item: created });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/admin/projects/:id', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Project service is temporarily unavailable.' });
    }
    const { id } = req.params;
    const body = req.body || {};
    if (body.budget !== undefined) body.budget = parseBudget(body.budget);

    const existing = await Project.findById(id);
    if (!existing) return res.status(404).json({ message: 'Project not found' });

    // Handle slug change if title or slug updated
    let needSlugUpdate = false;
    let newBaseSlug = existing.slug;
    if (typeof body.slug === 'string' && slugify(body.slug) !== existing.slug) {
      needSlugUpdate = true;
      newBaseSlug = slugify(body.slug);
    } else if (typeof body.title === 'string' && slugify(body.title) !== slugify(existing.title)) {
      needSlugUpdate = true;
      newBaseSlug = slugify(body.title);
    }

    if (needSlugUpdate) {
      body.slug = await generateUniqueSlug(newBaseSlug, existing._id);
    }

    const updated = await Project.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (ActivityLog) {
      ActivityLog.create({ user: req.user?.email || 'admin', action: 'update_project', details: `Updated project "${updated.title}"`, ip: req.ip }).catch(() => {});
    }
    return res.json({ success: true, item: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/admin/projects/:id', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Project service is temporarily unavailable.' });
    }
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    if (ActivityLog) {
      ActivityLog.create({ user: req.user?.email || 'admin', action: 'delete_project', details: `Deleted project "${deleted.title}"`, ip: req.ip }).catch(() => {});
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Contacts - Admin (JWT protected)
app.get('/api/admin/contacts', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Contact service is temporarily unavailable.' });
    }
    const items = await Contact.find().sort({ createdAt: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Subscribers - Admin (JWT protected)
app.get('/api/admin/subscribers', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Subscription service is temporarily unavailable.' });
    }
    const items = await Subscriber.find().sort({ createdAt: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update contact status (done/not done) - Admin (JWT protected)
app.patch('/api/admin/contacts/:id/status', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Contact service is temporarily unavailable.' });
    }
    const { id } = req.params;
    const { status } = req.body || {};
    const allowed = ['done', 'not done'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Allowed: done | not done' });
    }
    const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Contact not found' });
    return res.json({ success: true, item: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete a subscriber - Admin (JWT protected)
app.delete('/api/admin/subscribers/:id', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Subscription service is temporarily unavailable.' });
    }
    const { id } = req.params;
    const deleted = await Subscriber.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Subscriber not found' });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Blogs - Admin (JWT protected)
app.get('/api/admin/blogs', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Blog service is temporarily unavailable.' });
    }
    const items = await Blog.find().sort({ publishedAt: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/blogs', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Blog service is temporarily unavailable.' });
    }

    const body = req.body || {};
    const required = ['title', 'content', 'excerpt', 'author', 'image', 'category'];
    for (const field of required) {
      if (!body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const baseSlug = slugify(body.slug || body.title) || `blog-${Date.now()}`;
    const slug = await generateUniqueBlogSlug(baseSlug);

    const created = await Blog.create({ ...body, slug });

    if (ActivityLog) {
      ActivityLog.create({ user: req.user?.email || 'admin', action: 'create_blog', details: `Created blog "${created.title}"`, ip: req.ip }).catch(() => {});
    }

    return res.status(201).json({ success: true, item: created });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/admin/blogs/:id', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Blog service is temporarily unavailable.' });
    }
    const { id } = req.params;
    const body = req.body || {};

    const existing = await Blog.findById(id);
    if (!existing) return res.status(404).json({ message: 'Blog not found' });

    // Handle slug change if title or slug updated
    let needSlugUpdate = false;
    let newBaseSlug = existing.slug;
    if (typeof body.slug === 'string' && slugify(body.slug) !== existing.slug) {
      needSlugUpdate = true;
      newBaseSlug = slugify(body.slug);
    } else if (typeof body.title === 'string' && slugify(body.title) !== slugify(existing.title)) {
      needSlugUpdate = true;
      newBaseSlug = slugify(body.title);
    }

    if (needSlugUpdate) {
      body.slug = await generateUniqueBlogSlug(newBaseSlug, existing._id);
    }

    const updated = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (ActivityLog) {
      ActivityLog.create({ user: req.user?.email || 'admin', action: 'update_blog', details: `Updated blog "${updated.title}"`, ip: req.ip }).catch(() => {});
    }
    return res.json({ success: true, item: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/admin/blogs/:id', authMiddleware, async (req, res) => {
  try {
    if (!hasMongoDB) {
      return res.status(503).json({ success: false, message: 'Blog service is temporarily unavailable.' });
    }
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Blog not found' });
    if (ActivityLog) {
      ActivityLog.create({ user: req.user?.email || 'admin', action: 'delete_blog', details: `Deleted blog "${deleted.title}"`, ip: req.ip }).catch(() => {});
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
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
      countInRange(PageView, 'createdAt', sevenDaysAgo, now), countInRange(PageView, 'createdAt', prevSevenDaysStart, prevSevenDaysEnd),
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
io = new SocketIOServer(server, { 
  cors: { 
    origin: ['https://taliyotechnologies.com', 'https://taliyo-technologies.vercel.app', 'https://taliyo-frontend.onrender.com', 'http://localhost:5173'] 
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