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
let webpush = null;
try {
  webpush = require('web-push');
} catch (e) {
  console.warn('⚠️  web-push module not available:', e?.message || e);
}

// Enrichment runs later after models and sample data are initialized.

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

// Web Push (VAPID) setup
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
let EPHEMERAL_VAPID = null;
if (webpush) {
  if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    try {
      webpush.setVapidDetails(`mailto:${ADMIN_EMAIL}`, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    } catch (e) {
      console.warn('⚠️  Failed to set VAPID details from env:', e?.message || e);
    }
  } else {
    try {
      EPHEMERAL_VAPID = webpush.generateVAPIDKeys();
      webpush.setVapidDetails(`mailto:${ADMIN_EMAIL}`, EPHEMERAL_VAPID.publicKey, EPHEMERAL_VAPID.privateKey);
      console.warn('⚠️  VAPID keys not set in env. Generated ephemeral keys for this process.');
    } catch (e) {
      console.warn('⚠️  Failed to generate VAPID keys:', e?.message || e);
    }
  }
} else {
  console.warn('⚠️  Push notifications disabled: web-push unavailable');
}
// In-memory subscription store when DB is unavailable
const memorySubscriptions = new Map(); // endpoint -> subscription JSON

// Site settings defaults and in-memory store (when DB unavailable)
const defaultSettings = {
  companyName: 'Taliyo Technologies',
  websiteUrl: 'https://taliyotechnologies.com',
  timezone: 'Asia/Kolkata',
  language: 'en',
  maintenanceMode: false,
  maintenanceMessage: "We'll be back soon.",
};
let memorySettings = { ...defaultSettings };

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
// Robust CORS handling (explicit origins + preflight)
const allowedOrigins = [
  'https://taliyotechnologies.com',
  'https://www.taliyotechnologies.com',
  'https://taliyo-technologies.vercel.app',
  'https://taliyo-frontend.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

const corsOptions = {
  // Temporarily allow any Origin to prevent preflight failures; responses will Vary: Origin
  origin: function (_, callback) { callback(null, true); },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// Ensure proxies/cache key vary by Origin
app.use((req, res, next) => { res.header('Vary', 'Origin'); next(); });
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

// Push Notifications endpoints
app.get('/api/push/public-key', (req, res) => {
  try {
    const pub = (VAPID_PUBLIC_KEY || EPHEMERAL_VAPID?.publicKey || '').toString().trim();
    if (!pub) {
      return res.status(500).json({ message: 'VAPID public key not configured' });
    }
    // Catch common misconfiguration where VAPID_PUBLIC_KEY is set to the endpoint URL by mistake
    if (/^https?:\/\//i.test(pub)) {
      console.warn('⚠️  VAPID_PUBLIC_KEY looks like a URL, this is misconfigured:', pub);
      return res.status(500).json({ message: 'Server VAPID key misconfigured' });
    }
    // Warn if it contains non-base64url characters; frontend sanitizes but we surface a warning for logs
    if (!/^[A-Za-z0-9_\-]+$/.test(pub)) {
      console.warn('⚠️  VAPID_PUBLIC_KEY may have invalid characters (expected base64url)');
    }
    return res.json({ publicKey: pub });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Global error handlers to avoid crashing without logs
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err?.stack || err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

app.post('/api/push/subscribe', async (req, res) => {
  try {
    const sub = req.body || {};
    if (!sub || !sub.endpoint) {
      return res.status(400).json({ message: 'Invalid subscription' });
    }
    if (hasMongoDB && PushSubscription) {
      await PushSubscription.updateOne(
        { endpoint: sub.endpoint },
        { $set: { endpoint: sub.endpoint, keys: sub.keys || {} } },
        { upsert: true }
      );
    } else {
      memorySubscriptions.set(sub.endpoint, sub);
    }
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/push/subscribe', async (req, res) => {
  try {
    const { endpoint } = req.body || {};
    if (!endpoint) return res.status(400).json({ message: 'Endpoint required' });
    if (hasMongoDB && PushSubscription) {
      await PushSubscription.deleteOne({ endpoint }).catch(() => {});
    }
    memorySubscriptions.delete(endpoint);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/admin/push/test', authMiddleware, async (req, res) => {
  try {
    if (!webpush) {
      return res.status(503).json({ success: false, message: 'Push service unavailable on server (web-push not installed)' });
    }
    const payload = req.body && typeof req.body === 'object' ? req.body : {};
    const notification = {
      title: payload.title || 'Taliyo Notification',
      body: payload.body || 'This is a test notification from Admin Settings',
      data: { url: payload.url || '/' }
    };

    let subs = [];
    if (hasMongoDB && PushSubscription) {
      subs = await PushSubscription.find().limit(100).lean();
    } else {
      subs = Array.from(memorySubscriptions.values()).slice(0, 100);
    }

    let sent = 0, removed = 0, failed = 0;
    const deletions = [];
    await Promise.all(subs.map(async (s) => {
      try {
        await webpush.sendNotification(s, JSON.stringify(notification));
        sent += 1;
      } catch (err) {
        failed += 1;
        const statusCode = err?.statusCode || err?.status || 0;
        if (statusCode === 404 || statusCode === 410) {
          removed += 1;
          if (hasMongoDB && PushSubscription) deletions.push(PushSubscription.deleteOne({ endpoint: s.endpoint }).catch(() => {}));
          memorySubscriptions.delete(s.endpoint);
        }
      }
    }));
    await Promise.all(deletions);
    return res.json({ success: true, sent, removed, failed, total: subs.length });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Only define schemas and models if MongoDB is available
let Contact, Subscriber, Blog, Project, PageView, ActivityLog, PushSubscription, SiteSettings;

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
    keywords: [String],
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

  const pushSubscriptionSchema = new mongoose.Schema({
    endpoint: { type: String, required: true, unique: true, index: true },
    keys: {
      p256dh: String,
      auth: String
    },
    createdAt: { type: Date, default: Date.now }
  });

  const siteSettingsSchema = new mongoose.Schema({
    companyName: { type: String, default: defaultSettings.companyName },
    websiteUrl: { type: String, default: defaultSettings.websiteUrl },
    timezone: { type: String, default: defaultSettings.timezone },
    language: { type: String, default: defaultSettings.language },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: defaultSettings.maintenanceMessage },
  }, { timestamps: true });

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
  PushSubscription = mongoose.model('PushSubscription', pushSubscriptionSchema);
  SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
}

// If MongoDB is configured, seed 10 sample projects when the collection is empty
if (hasMongoDB && typeof Project !== 'undefined' && Project && !global.__projectsSeedAttempted) {
  global.__projectsSeedAttempted = true;
  (async () => {
    try {
      const count = await Project.estimatedDocumentCount();
      if (count === 0) {
        const now = new Date();
        const year = now.getFullYear();
        const slugify = (s) => String(s || '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        const img = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
        const base = [
          { title: 'E‑commerce Fashion Store', description: 'High‑performance ecommerce site with personalized recommendations and seamless checkout.', category: 'ecommerce', tags: ['Ecommerce', 'Next.js', 'Stripe'], technologies: ['React', 'Next.js', 'Node.js', 'Stripe'] },
          { title: 'Food Delivery Mobile App', description: 'Real‑time order tracking, geolocation, and restaurant discovery for a city‑wide network.', category: 'mobile', tags: ['Mobile', 'Maps', 'Realtime'], technologies: ['React Native', 'Socket.IO', 'Node.js'] },
          { title: 'SaaS CRM Dashboard', description: 'Multi‑tenant CRM with analytics, role‑based access, and billing integration.', category: 'saas', tags: ['SaaS', 'Analytics', 'Dashboard'], technologies: ['React', 'Chart.js', 'Express', 'MongoDB'] },
          { title: 'Healthcare Appointment System', description: 'HIPAA‑aware scheduling platform with reminders and telemedicine integration.', category: 'healthcare', tags: ['Healthcare', 'Scheduling'], technologies: ['Node.js', 'React', 'Twilio'] },
          { title: 'Fintech Payments Gateway', description: 'Secure payment orchestration with fraud detection and dynamic routing.', category: 'fintech', tags: ['Fintech', 'Payments', 'Security'], technologies: ['Node.js', 'NestJS', 'PostgreSQL'] },
          { title: 'Real Estate Listing Portal', description: 'Advanced search, map filters, and agent dashboards for property management.', category: 'real-estate', tags: ['Portal', 'Search', 'Maps'], technologies: ['React', 'Elasticsearch', 'Leaflet'] },
          { title: 'Education LMS Platform', description: 'Course authoring, quizzes, and progress tracking for remote learning.', category: 'education', tags: ['LMS', 'Video', 'Quizzes'], technologies: ['React', 'Node.js', 'MongoDB'] },
          { title: 'Travel Booking Website', description: 'Hotel and flight aggregation with price alerts and user reviews.', category: 'travel', tags: ['Travel', 'Booking'], technologies: ['Next.js', 'Node.js', 'Redis'] },
          { title: 'Restaurant Ordering System', description: 'QR‑based table ordering, kitchen screens, and POS integration.', category: 'restaurant', tags: ['Ordering', 'POS'], technologies: ['React', 'WebSockets', 'MySQL'] },
          { title: 'Agency Portfolio Website', description: 'Animated case studies with SEO‑optimized pages and blazing performance.', category: 'portfolio', tags: ['Portfolio', 'SEO', 'Animations'], technologies: ['Vite', 'React', 'GSAP'] },
        ];

        const docs = base.map((p, i) => ({
          ...p,
          slug: `${slugify(p.title)}-${i + 1}`,
          status: 'completed',
          progress: 100,
          startDate: new Date(year - 1, (i % 12), 1),
          endDate: new Date(year - 1, (i % 12) + 1, 1),
          budget: 0,
          team: [],
          priority: 'medium',
          duration: '4-8 weeks',
          liveUrl: '',
          githubUrl: '',
          image: img(p.title),
          overview: p.description,
          features: ['Responsive UI', 'Fast performance', 'Secure auth'],
          results: ['Improved conversions', 'Reduced bounce rate'],
          year: year - (i % 2),
          isPublished: true,
          publishedAt: new Date(year - (i % 2), (i % 12), 10),
          createdAt: new Date(year - (i % 2), (i % 12), 5),
          updatedAt: new Date(year - (i % 2), (i % 12), 12),
        }));

        await Project.insertMany(docs, { ordered: false });
        console.log('✅ Seeded sample projects:', docs.length);
      }
    } catch (e) {
      console.warn('⚠️  Skipping project seed:', e?.message || e);
    }
  })();
}

// -----------------------------
// Dynamic Sitemaps (XML)
// -----------------------------
const DEFAULT_SITE_URL = 'https://taliyotechnologies.com';
const siteBase = (req) => String((process.env.SITE_URL || process.env.FRONTEND_URL || DEFAULT_SITE_URL) || '').replace(/\/$/, '');
const ymd = (d) => {
  try { return new Date(d).toISOString().slice(0, 10); } catch { return new Date().toISOString().slice(0, 10); }
};

// Sitemap Index
app.get(['/sitemap.xml', '/sitemap'], (req, res) => {
  try {
    const base = siteBase(req);
    const today = ymd(new Date());
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      `<sitemap><loc>${base}/pages-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>` +
      `<sitemap><loc>${base}/blog-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>` +
      `<sitemap><loc>${base}/projects-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>` +
      `<sitemap><loc>${base}/services-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>` +
      `<sitemap><loc>${base}/solutions-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>` +
      `</sitemapindex>`;
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    return res.send(xml);
  } catch (e) {
    return res.status(500).send('');
  }
});

// Pages sitemap (static list of core pages)
app.get(['/pages-sitemap.xml', '/sitemap-pages.xml'], async (req, res) => {
  try {
    const base = siteBase(req);
    const today = ymd(new Date());
    const pages = [
      '/', '/about', '/services', '/projects', '/blog', '/contact', '/testimonials', '/faq', '/book', '/privacy-policy', '/terms-conditions'
    ];
    const urls = pages.map(p => `<url><loc>${base}${p}</loc><lastmod>${today}</lastmod><changefreq>${p==='/'?'weekly':'monthly'}</changefreq><priority>${p==='/'?'1.0':'0.8'}</priority></url>`).join('');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    return res.send(xml);
  } catch (e) {
    return res.status(500).send('');
  }
});

// Blog sitemap (DB or in-memory)
app.get(['/blog-sitemap.xml', '/sitemap-blogs.xml'], async (req, res) => {
  try {
    const base = siteBase(req);
    let list = [];
    if (hasMongoDB && Blog) {
      list = await Blog.find({}, 'slug updatedAt publishedAt').sort({ publishedAt: -1 }).limit(2000).lean();
    } else {
      list = Array.isArray(global.__memoryBlogs) ? global.__memoryBlogs : [];
    }
    const urls = list.map(b => {
      const last = b.updatedAt || b.publishedAt || new Date();
      return `<url><loc>${base}/blog/${b.slug}</loc><lastmod>${ymd(last)}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
    }).join('');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=1800');
    return res.send(xml);
  } catch (e) {
    return res.status(500).send('');
  }
});

// Projects sitemap (DB or in-memory)
app.get(['/projects-sitemap.xml', '/sitemap-projects.xml'], async (req, res) => {
  try {
    const base = siteBase(req);
    let list = [];
    if (hasMongoDB && Project) {
      list = await Project.find({ isPublished: { $ne: false } }, 'slug updatedAt publishedAt').sort({ publishedAt: -1 }).limit(2000).lean();
    } else {
      list = Array.isArray(global.__memoryProjects) ? global.__memoryProjects : [];
    }
    const urls = list.map(p => {
      const last = p.updatedAt || p.publishedAt || new Date();
      return `<url><loc>${base}/projects/${p.slug}</loc><lastmod>${ymd(last)}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`;
    }).join('');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=1800');
    return res.send(xml);
  } catch (e) {
    return res.status(500).send('');
  }
});

// Services sitemap (static list of service slugs)
app.get(['/services-sitemap.xml', '/sitemap-services.xml'], async (req, res) => {
  try {
    const base = siteBase(req);
    const today = ymd(new Date());
    const services = [
      'web-development','app-development','graphic-design','digital-marketing','ai-solutions','cloud-computing','ecommerce-development','wordpress-development','react-development','nodejs-development','python-development','php-development'
    ];
    const urls = services.map(s => `<url><loc>${base}/services/${s}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join('');
    const xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">${urls}</urlset>`;
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(xml);
  } catch (e) {
    return res.status(500).send('');
  }
});

// Solutions sitemap (SEO landing pages)
app.get(['/solutions-sitemap.xml', '/sitemap-solutions.xml'], async (req, res) => {
  try {
    const base = siteBase(req);
    const today = ymd(new Date());
    const slugs = [
      'custom-software-development-small-business-india',
      'affordable-app-development-company-delhi',
      'web-application-development-startups',
      'hire-mern-stack-developer-india',
      'top-software-agency-ecommerce',
      'affordable-logo-design-company-india',
      'brochure-design-services-delhi-ncr',
      'ui-ux-design-agency-startups',
      'creative-graphic-design-social-media',
      'custom-packaging-design-services-india',
      'digital-marketing-agency-small-business-delhi',
      'seo-services-startups-india',
      'social-media-marketing-company-delhi-ncr',
      'affordable-ppc-management-india',
      'content-marketing-services-ecommerce'
    ];
    const urls = slugs.map(s => `<url><loc>${base}/solutions/${s}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`).join('');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(xml);
  } catch (e) {
    return res.status(500).send('');
  }
});

// If MongoDB is configured, seed 15 sample blogs when the collection is empty
if (hasMongoDB && typeof Blog !== 'undefined' && Blog && !global.__blogsSeedAttempted) {
  global.__blogsSeedAttempted = true;
  (async () => {
    try {
      const count = await Blog.estimatedDocumentCount();
      if (count === 0) {
        const now = new Date();
        const year = now.getFullYear();
        const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const img = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/630`;
        const base = buildSampleBlogs();
        const docs = base.map((b, i) => ({
          ...b,
          slug: `${slugify(b.title)}-${i + 1}`,
          image: b.image || img(b.title),
          publishedAt: b.publishedAt || new Date(year, (i % 12), 10),
          excerpt: b.excerpt || b.description || '',
        }));
        await Blog.insertMany(docs, { ordered: false });
        console.log('✅ Seeded sample blogs:', docs.length);
      }
    } catch (e) {
      console.warn('⚠️  Skipping blog seed:', e?.message || e);
    }
  })();
}

// Admin Settings endpoints
app.get('/api/admin/settings', authMiddleware, async (req, res) => {
  try {
    if (hasMongoDB && SiteSettings) {
      let doc = await SiteSettings.findOne();
      if (!doc) doc = await SiteSettings.create(defaultSettings);
      return res.json({ success: true, settings: doc });
    }
    return res.json({ success: true, settings: memorySettings, dbConfigured: false });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.patch('/api/admin/settings', authMiddleware, async (req, res) => {
  try {
    const allowed = ['companyName', 'websiteUrl', 'timezone', 'language', 'maintenanceMode', 'maintenanceMessage'];
    const body = req.body || {};
    const updates = {};
    for (const k of allowed) if (Object.prototype.hasOwnProperty.call(body, k)) updates[k] = body[k];

    if (hasMongoDB && SiteSettings) {
      let doc = await SiteSettings.findOne();
      if (!doc) doc = new SiteSettings(defaultSettings);
      Object.assign(doc, updates);
      await doc.save();
      if (ActivityLog) {
        ActivityLog.create({ user: req.user?.email || 'admin', action: 'update_settings', details: 'Updated site settings', ip: req.ip }).catch(() => {});
      }
      return res.json({ success: true, settings: doc });
    }

    memorySettings = { ...memorySettings, ...updates };
    return res.json({ success: true, settings: memorySettings, dbConfigured: false });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Public settings (used by frontend to show maintenance page)
app.get('/api/settings/public', async (req, res) => {
  try {
    if (hasMongoDB && SiteSettings) {
      const doc = await SiteSettings.findOne().lean();
      const s = doc || defaultSettings;
      return res.json({
        maintenanceMode: !!s.maintenanceMode,
        maintenanceMessage: s.maintenanceMessage || defaultSettings.maintenanceMessage,
        companyName: s.companyName || defaultSettings.companyName,
        websiteUrl: s.websiteUrl || defaultSettings.websiteUrl,
      });
    }
    const s = memorySettings || defaultSettings;
    return res.json({
      maintenanceMode: !!s.maintenanceMode,
      maintenanceMessage: s.maintenanceMessage,
      companyName: s.companyName,
      websiteUrl: s.websiteUrl,
    });
  } catch (err) {
    return res.json({ maintenanceMode: false });
  }
});

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

function authMiddleware(req, res, next) {
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
}

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

// Blog endpoints (public)
app.get('/api/blogs', async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 15, 50);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    // In-memory fallback when DB is unavailable
    if (!hasMongoDB) {
      let items = (global.__memoryBlogs || []);
      if (category) items = items.filter(b => (b.category || '').toLowerCase() === String(category).toLowerCase());
      if (tag) items = items.filter(b => Array.isArray(b.tags) && b.tags.map(t => t.toLowerCase()).includes(String(tag).toLowerCase()));
      if (search) {
        const r = new RegExp(search, 'i');
        items = items.filter(b => r.test(b.title) || r.test(b.excerpt || '') || r.test(b.content || ''));
      }
      const total = items.length;
      const paged = items.slice(skip, skip + limit);
      return res.json(paged);
    }

    // DB path with graceful fallback if empty
    const dbFilter = {};
    if (category) dbFilter.category = category;
    if (tag) dbFilter.tags = { $in: [tag] };
    if (search) {
      const r = new RegExp(search, 'i');
      dbFilter.$or = [{ title: r }, { excerpt: r }, { content: r }, { category: r }, { tags: r }];
    }
    const [items, total] = await Promise.all([
      Blog.find(dbFilter).sort({ publishedAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(dbFilter)
    ]);

    if (total === 0 && Array.isArray(global.__memoryBlogs) && global.__memoryBlogs.length) {
      let mem = global.__memoryBlogs;
      if (category) mem = mem.filter(b => (b.category || '').toLowerCase() === String(category).toLowerCase());
      if (tag) mem = mem.filter(b => Array.isArray(b.tags) && b.tags.map(t => t.toLowerCase()).includes(String(tag).toLowerCase()));
      if (search) {
        const r = new RegExp(search, 'i');
        mem = mem.filter(b => r.test(b.title) || r.test(b.excerpt || '') || r.test(b.content || ''));
      }
      const totalMem = mem.length;
      const pagedMem = mem.slice(skip, skip + limit);
      return res.json(pagedMem);
    }

    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Blog by slug (public)
app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    if (!hasMongoDB) {
      const item = (global.__memoryBlogs || []).find(b => b.slug === slug);
      if (!item) return res.status(404).json({ message: 'Blog not found' });
      return res.json(item);
    }
    const item = await Blog.findOne({ slug });
    if (!item) {
      if (Array.isArray(global.__memoryBlogs)) {
        const mem = global.__memoryBlogs.find(b => b.slug === slug);
        if (mem) return res.json(mem);
      }
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
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
const parseUA = (ua = '') =>
  String(ua)
    .toLowerCase()
    .replace(/mobile|iphone|android.+mobile/g, 'mobile')
    .replace(/ipad|tablet/g, 'tablet')
    .replace(/windows|macintosh|linux/g, (match) => match);

const parseUAExtended = (ua = '') => {
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
    const { deviceType, os, browser } = parseUAExtended(ua);
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
      // In-memory demo projects
      const limit = Math.min(parseInt(req.query.limit) || 50, 100);
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const skip = (page - 1) * limit;

      const { status, tag, category, search } = req.query;
      let items = (global.__memoryProjects || []).filter(p => p.isPublished !== false);
      if (status) items = items.filter(p => p.status === status);
      if (category) items = items.filter(p => (p.category || '').toLowerCase() === String(category).toLowerCase());
      if (tag) items = items.filter(p => Array.isArray(p.tags) && p.tags.includes(tag));
      if (search) {
        const r = new RegExp(search, 'i');
        items = items.filter(p => r.test(p.title) || r.test(p.description || '') || r.test(p.client || '') || (Array.isArray(p.technologies) && p.technologies.some(t => r.test(t))) || (Array.isArray(p.tags) && p.tags.some(t => r.test(t))));
      }
      items = items.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
      const total = items.length;
      const paged = items.slice(skip, skip + limit);
      return res.json({ success: true, items: paged, total, page, limit });
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

    // If DB has no projects yet, fall back to in-memory samples (if present)
    if (total === 0 && Array.isArray(global.__memoryProjects) && global.__memoryProjects.length) {
      let mem = global.__memoryProjects.filter(p => p.isPublished !== false);
      if (status) mem = mem.filter(p => p.status === status);
      if (category) mem = mem.filter(p => (p.category || '').toLowerCase() === String(category).toLowerCase());
      if (tag) mem = mem.filter(p => Array.isArray(p.tags) && p.tags.includes(tag));
      if (search) {
        const r = new RegExp(search, 'i');
        mem = mem.filter(p => r.test(p.title) || r.test(p.description || '') || r.test(p.client || '') || (Array.isArray(p.technologies) && p.technologies.some(t => r.test(t))) || (Array.isArray(p.tags) && p.tags.some(t => r.test(t))));
      }
      mem = mem.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
      const totalMem = mem.length;
      const pagedMem = mem.slice(skip, skip + limit);
      return res.json({ success: true, items: pagedMem, total: totalMem, page, limit });
    }

    return res.json({ success: true, items, total, page, limit });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/projects/:slug', async (req, res) => {
  try {
    if (!hasMongoDB) {
      const item = (global.__memoryProjects || []).find(p => p.slug === req.params.slug && p.isPublished !== false);
      if (!item) return res.status(404).json({ message: 'Project not found' });
      return res.json(item);
    }

    const project = await Project.findOne({ slug: req.params.slug, isPublished: true });
    if (!project) {
      if (Array.isArray(global.__memoryProjects) && global.__memoryProjects.length) {
        const mem = global.__memoryProjects.find(p => p.slug === req.params.slug && p.isPublished !== false);
        if (mem) return res.json(mem);
      }
      return res.status(404).json({ message: 'Project not found' });
    }
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

// ---------------------------
// Sample projects helpers
// ---------------------------
function slugifyText(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildSampleProjects() {
  const now = new Date();
  const year = now.getFullYear();
  const img = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
  const base = [
    { title: 'E‑commerce Fashion Store', description: 'High‑performance ecommerce site with personalized recommendations and seamless checkout.', category: 'ecommerce', tags: ['Ecommerce', 'Next.js', 'Stripe'], technologies: ['React', 'Next.js', 'Node.js', 'Stripe'] },
    { title: 'Food Delivery Mobile App', description: 'Real‑time order tracking, geolocation, and restaurant discovery for a city‑wide network.', category: 'mobile', tags: ['Mobile', 'Maps', 'Realtime'], technologies: ['React Native', 'Socket.IO', 'Node.js'] },
    { title: 'SaaS CRM Dashboard', description: 'Multi‑tenant CRM with analytics, role‑based access, and billing integration.', category: 'saas', tags: ['SaaS', 'Analytics', 'Dashboard'], technologies: ['React', 'Chart.js', 'Express', 'MongoDB'] },
    { title: 'Healthcare Appointment System', description: 'HIPAA‑aware scheduling platform with reminders and telemedicine integration.', category: 'healthcare', tags: ['Healthcare', 'Scheduling'], technologies: ['Node.js', 'React', 'Twilio'] },
    { title: 'Fintech Payments Gateway', description: 'Secure payment orchestration with fraud detection and dynamic routing.', category: 'fintech', tags: ['Fintech', 'Payments', 'Security'], technologies: ['Node.js', 'NestJS', 'PostgreSQL'] },
    { title: 'Real Estate Listing Portal', description: 'Advanced search, map filters, and agent dashboards for property management.', category: 'real-estate', tags: ['Portal', 'Search', 'Maps'], technologies: ['React', 'Elasticsearch', 'Leaflet'] },
    { title: 'Education LMS Platform', description: 'Course authoring, quizzes, and progress tracking for remote learning.', category: 'education', tags: ['LMS', 'Video', 'Quizzes'], technologies: ['React', 'Node.js', 'MongoDB'] },
    { title: 'Travel Booking Website', description: 'Hotel and flight aggregation with price alerts and user reviews.', category: 'travel', tags: ['Travel', 'Booking'], technologies: ['Next.js', 'Node.js', 'Redis'] },
    { title: 'Restaurant Ordering System', description: 'QR‑based table ordering, kitchen screens, and POS integration.', category: 'restaurant', tags: ['Ordering', 'POS'], technologies: ['React', 'WebSockets', 'MySQL'] },
    { title: 'Agency Portfolio Website', description: 'Animated case studies with SEO‑optimized pages and blazing performance.', category: 'portfolio', tags: ['Portfolio', 'SEO', 'Animations'], technologies: ['Vite', 'React', 'GSAP'] },
  ];
  return base.map((p, i) => ({
    ...p,
    slug: `${slugifyText(p.title)}-${i + 1}`,
    client: undefined,
    status: 'completed',
    progress: 100,
    startDate: new Date(year - 1, (i % 12), 1),
    endDate: new Date(year - 1, (i % 12) + 1, 1),
    budget: 0,
    team: [],
    priority: 'medium',
    duration: '4-8 weeks',
    liveUrl: '',
    githubUrl: '',
    image: img(p.title),
    overview: p.description,
    features: ['Responsive UI', 'Fast performance', 'Secure auth'],
    results: ['Improved conversions', 'Reduced bounce rate'],
    tags: p.tags,
    technologies: p.technologies,
    year: year - (i % 2),
    isPublished: true,
    publishedAt: new Date(year - (i % 2), (i % 12), 10),
    createdAt: new Date(year - (i % 2), (i % 12), 5),
    updatedAt: new Date(year - (i % 2), (i % 12), 12),
  }));
}

// In-memory sample projects (only set once to keep consistency across fallbacks)
if (!global.__memoryProjects) {
  global.__memoryProjects = buildSampleProjects();
}

function buildSampleBlogs() {
  const now = new Date();
  const year = now.getFullYear();
  const img = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/630`;

  // Helper to generate long, SEO‑friendly HTML for any topic
  const generateBlogContent = (b) => {
    const topic = b.title;
    const cat = (b.category || 'General');
    const heroAlt = `${topic} – ${cat} insights`;
    const t1 = 'What Is ' + topic + '?';
    const t2 = 'Key Benefits & Business Impact';
    const t3 = 'Core Concepts and Architecture';
    const t4 = 'Best Practices & Implementation Guide';
    const t5 = 'Common Pitfalls to Avoid';
    const t6 = 'Real‑World Use Cases';
    const t7 = 'Step‑by‑Step Checklist';
    const t8 = 'Tools & Technology Stack';
    const t9 = 'Measuring ROI & KPIs';
    const t10 = 'Roadmap & Next Steps';
    const t11 = 'Frequently Asked Questions';
    const t12 = 'Conclusion';

    const section = (id, title, body) => `
      <section id="${slugifyText(id)}">
        <h2>${title}</h2>
        ${body}
      </section>
    `;

    const toc = [t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12]
      .map(h => `<li><a href="#${slugifyText(h)}">${h}</a></li>`)
      .join('');

    return `
      <figure>
        <img src="${img(topic + '-cover')}" alt="${heroAlt}" style="width:100%;height:auto;border-radius:12px"/>
        <figcaption style="color:#9ca3af;margin-top:6px">An overview of ${topic} in the context of ${cat}.</figcaption>
      </figure>

      <nav aria-label="Table of contents" style="margin:22px 0;padding:16px;border:1px solid #1f2937;border-radius:12px;background:#0b1220">
        <h3>Table of Contents</h3>
        <ol>${toc}</ol>
      </nav>

      ${section(t1, t1, `
        <p>${topic} refers to modern approaches within ${cat} that help teams improve performance, reliability, and business outcomes. In this guide, we unpack the concepts, share real‑world examples, and provide a practical playbook you can apply today.</p>
        <p>Whether you are a founder, product manager, or engineer, this article equips you with a clear mental model and actionable steps.</p>
      `)}

      ${section(t2, t2, `
        <ul>
          <li><strong>Speed:</strong> Launch features faster with streamlined workflows.</li>
          <li><strong>Scalability:</strong> Design systems that grow with traffic and data.</li>
          <li><strong>Security:</strong> Bake in security controls from day one.</li>
          <li><strong>Cost Efficiency:</strong> Optimize infra and operations for ROI.</li>
          <li><strong>Customer Experience:</strong> Deliver smooth, reliable, and accessible journeys.</li>
        </ul>
      `)}

      ${section(t3, t3, `
        <p>At a high level, ${topic} is organized into layers: presentation, application, data, and infrastructure. Each layer plays a role in latency, resilience, and maintainability.</p>
        <h3>Typical Reference Architecture</h3>
        <ul>
          <li>CDN/Edge with caching and security controls</li>
          <li>API gateway and microservices or a modular monolith</li>
          <li>Data stores tuned for workload (SQL/NoSQL/search/analytics)</li>
          <li>Event streams and background workers</li>
          <li>Observability: logs, traces, metrics, and alerts</li>
        </ul>
        <figure>
          <img src="${img(topic + '-diagram')}" alt="${topic} reference architecture" style="width:100%;height:auto;border-radius:12px"/>
          <figcaption style="color:#9ca3af;margin-top:6px">High‑level reference architecture for ${topic}.</figcaption>
        </figure>
      `)}

      ${section(t4, t4, `
        <ol>
          <li>Define goals, KPIs, and non‑functional requirements.</li>
          <li>Choose an MVP slice and validate architecture with a pilot.</li>
          <li>Automate testing and CI/CD from the start.</li>
          <li>Implement monitoring, tracing, and error budgets.</li>
          <li>Document decisions, trade‑offs, and runbooks.</li>
        </ol>
      `)}

      ${section(t5, t5, `
        <ul>
          <li>Over‑engineering early; prefer simplicity first.</li>
          <li>Ignoring cost visibility—enable budgets and alerts.</li>
          <li>Under‑investing in security and backups.</li>
          <li>Poor observability leading to blind spots.</li>
        </ul>
      `)}

      ${section(t6, t6, `
        <p>Companies use ${topic} to accelerate product delivery, reduce time‑to‑market, and improve reliability. Typical applications include customer portals, analytics platforms, internal tools, and API products.</p>
      `)}

      ${section(t7, t7, `
        <ul>
          <li>Audit current stack and performance baselines.</li>
          <li>Prioritize improvements with highest ROI.</li>
          <li>Ship iteratively; measure and learn.</li>
          <li>Harden with security reviews and chaos drills.</li>
        </ul>
      `)}

      ${section(t8, t8, `
        <p>Pick tools that match your team’s skills and business goals. Favor managed services where possible to reduce ops toil.</p>
        <ul>
          <li>Frameworks & runtimes appropriate to ${cat}</li>
          <li>Managed databases with autoscaling</li>
          <li>CI/CD with quality gates and security scans</li>
          <li>End‑to‑end monitoring</li>
        </ul>
      `)}

      ${section(t9, t9, `
        <p>Track a small set of KPIs tied to customer value—latency, availability, error rate, conversion, retention, and unit economics. Visualize trends and share ownership across teams.</p>
      `)}

      ${section(t10, t10, `
        <p>Create a 90‑day plan with monthly milestones. Invest in documentation, training, and a culture of continuous improvement.</p>
      `)}

      ${section(t11, t11, `
        <h3>Is ${topic} suitable for small teams?</h3>
        <p>Yes—start simple. A well‑structured foundation avoids rework later.</p>
        <h3>How long does adoption take?</h3>
        <p>Initial wins are possible in weeks; maturity builds over quarters.</p>
        <h3>How does it improve SEO or performance?</h3>
        <p>Faster pages, better stability, and accessible UX lead to higher engagement and rankings.</p>
      `)}

      ${section(t12, t12, `
        <p>${topic} can be a force multiplier for your business. Start small, focus on outcomes, and iterate with data‑driven decisions.</p>
        <p><em>Need expert help?</em> Taliyo Technologies partners with teams to design, build, and scale solutions across ${cat}. Contact us to discuss your roadmap.</p>
      `)}
    `;
  };

  const base = [
    {
      title: 'Web Development Trends 2025',
      category: 'web',
      tags: ['Web', 'Next.js', 'Edge', 'AI'],
      author: 'Taliyo Team',
      excerpt: 'From edge rendering to AI‑assisted development, here are the web trends you should prepare for in 2025.',
      content: `<h2>Overview</h2><p>The modern web is shifting to the edge, prioritizing performance, security, and developer velocity. In 2025, expect server components, streaming UI, and AI copilots to be standard.</p><h2>Key Trends</h2><ul><li>Edge & serverless by default</li><li>AI‑assisted DX and testing</li><li>WebAssembly for performance‑critical modules</li><li>Server Components and partial hydration</li></ul><h2>What to Do Now</h2><p>Audit your Core Web Vitals, adopt SSR/SSG where it helps, and experiment with AI tools that accelerate delivery without compromising quality.</p>`
    },
    {
      title: 'Cloud Cost Optimization: A Practical Guide',
      category: 'cloud',
      tags: ['Cloud', 'FinOps', 'AWS', 'GCP', 'Azure'],
      author: 'Taliyo Team',
      excerpt: 'Control your cloud bill with FinOps principles, right‑sizing, autoscaling, and architecture changes that pay for themselves.',
      content: `<h2>Why Costs Grow</h2><p>Orphaned resources, over‑provisioned instances, and chatty microservices add up. Without guardrails, spend balloons.</p><h2>Quick Wins</h2><ul><li>Right size compute & enable autoscaling</li><li>Turn on lifecycle rules for storage</li><li>Use managed DB tiers with autoscale</li><li>Prefer pub/sub over polling</li></ul><h2>FinOps Culture</h2><p>Make cost a shared KPI. Add dashboards, budgets, and alerts so teams own efficiency.</p>`
    },
    {
      title: 'eCommerce SEO: Technical Checklist that Works',
      category: 'marketing',
      tags: ['SEO', 'eCommerce', 'Performance'],
      author: 'Taliyo Team',
      excerpt: 'A battle‑tested technical SEO checklist for online stores to improve rankings and conversions.',
      content: `<h2>Core Signals</h2><ul><li>Fast LCP: optimize images & critical CSS</li><li>Clean URLs with canonical tags</li><li>Structured data for products</li><li>XML sitemaps & robots best‑practices</li></ul><h2>Content</h2><p>Create category guides and comparison pages that answer high‑intent queries. Add FAQs and internal links.</p>`
    },
    {
      title: 'Mobile App Architecture in 2025',
      category: 'mobile',
      tags: ['Mobile', 'React Native', 'Flutter'],
      author: 'Taliyo Team',
      excerpt: 'How to structure modern mobile apps for performance, reliability, and rapid iteration.',
      content: `<h2>Architecture</h2><p>Use modular feature folders, a typed API layer, offline‑first storage, and background sync. Invest in CI with fast lanes.</p><h2>Observability</h2><p>Crash analytics, performance traces, and session replays reveal real issues before reviews do.</p>`
    },
    {
      title: 'DevSecOps: Security Built into Your Pipeline',
      category: 'devops',
      tags: ['DevOps', 'Security', 'CI/CD'],
      author: 'Taliyo Team',
      excerpt: 'Shift security left with SAST, DAST, dependency scanning, and signed releases.',
      content: `<h2>Pipeline Controls</h2><ul><li>SAST on PRs with gating</li><li>Dependency scanning & SBOM</li><li>Secrets scanning</li><li>Signed containers & provenance (SLSA)</li></ul><h2>Runtime</h2><p>Least privilege IAM, network policies, and WAF/CDN to stop abuse early.</p>`
    },
    {
      title: 'Design Systems that Scale',
      category: 'design',
      tags: ['UI/UX', 'Design System', 'Accessibility'],
      author: 'Taliyo Team',
      excerpt: 'Build accessible, consistent interfaces with tokens, components, and usage guidelines.',
      content: `<h2>Foundations</h2><p>Define color, type, spacing tokens. Provide coded components with docs and usage do/don'ts. Bake in a11y checks.</p>`
    },
    {
      title: 'Data Analytics for Founders',
      category: 'data',
      tags: ['Analytics', 'Product', 'Growth'],
      author: 'Taliyo Team',
      excerpt: 'What to instrument, how to model events, and which dashboards matter at each stage.',
      content: `<h2>North‑Star Metrics</h2><p>Define activation, retention, and revenue KPIs. Start with simple funnels; evolve to cohorts and LTV.</p>`
    },
    {
      title: 'Content Strategy that Ranks in 2025',
      category: 'marketing',
      tags: ['SEO', 'Content'],
      author: 'Taliyo Team',
      excerpt: 'Topical authority beats thin posts. Build hubs, interlink, and refresh winners quarterly.',
      content: `<h2>Plan</h2><p>Map topics, cluster keywords, and create pillar pages with supporting articles. Add schema, FAQs, and media.</p>`
    },
    {
      title: 'SaaS Pricing: Models and Experiments',
      category: 'saas',
      tags: ['SaaS', 'Pricing', 'Growth'],
      author: 'Taliyo Team',
      excerpt: 'Freemium, usage‑based, or tiered? How to test and measure pricing changes safely.',
      content: `<h2>Playbook</h2><p>Start with simple tiers; add usage add‑ons later. A/B price pages and monitor conversion, ARPU, churn.</p>`
    },
    {
      title: 'PWAs vs Native Apps',
      category: 'web',
      tags: ['PWA', 'Mobile', 'Web'],
      author: 'Taliyo Team',
      excerpt: 'When to choose a Progressive Web App and when native still wins.',
      content: `<h2>Trade‑offs</h2><p>PWAs shine for discoverability and cost; native still wins for deep OS integrations and performance for certain workloads.</p>`
    },
    {
      title: 'Microservices vs Monolith: 2025 Reality Check',
      category: 'architecture',
      tags: ['Microservices', 'Monolith', 'Architecture'],
      author: 'Taliyo Team',
      excerpt: 'Most teams need a modular monolith before microservices. Here’s how to choose.',
      content: `<h2>When to Split</h2><p>Split on clear bounded contexts, team ownership, and scaling hotspots. Avoid premature complexity.</p>`
    },
    {
      title: 'Headless CMS: Pros, Cons, and Picks',
      category: 'cms',
      tags: ['Headless', 'CMS', 'Content'],
      author: 'Taliyo Team',
      excerpt: 'Why headless can speed up teams—and when a traditional CMS is simpler.',
      content: `<h2>Evaluation</h2><p>Consider roles/permissions, workflows, localization, and API limits. Start with a pilot space.</p>`
    },
    {
      title: 'Performance Optimization for Core Web Vitals',
      category: 'web',
      tags: ['Performance', 'CWV'],
      author: 'Taliyo Team',
      excerpt: 'Win on LCP, CLS, and INP with practical front‑end and backend fixes.',
      content: `<h2>Checklist</h2><ul><li>Preload hero images and critical fonts</li><li>Eliminate layout shifts</li><li>Reduce JS by code‑splitting</li><li>Cache at the edge</li></ul>`
    },
    {
      title: 'AI in Digital Marketing: Playbook',
      category: 'marketing',
      tags: ['AI', 'Marketing'],
      author: 'Taliyo Team',
      excerpt: 'Use AI for research, drafts, ad variations, and analytics—but keep human oversight.',
      content: `<h2>Workflows</h2><p>Generate outlines, test copy variants, and summarize results. Build review steps for brand and facts.</p>`
    },
    {
      title: 'Cybersecurity Basics for SMEs',
      category: 'security',
      tags: ['Security', 'SMB'],
      author: 'Taliyo Team',
      excerpt: 'Practical steps to secure your small business without enterprise budgets.',
      content: `<h2>Essentials</h2><ul><li>MFA everywhere</li><li>Backups with restore drills</li><li>Patch cycles</li><li>Least privilege & audits</li></ul>`
    },
    {
      title: 'Analytics Setup: From Events to Insights',
      category: 'data',
      tags: ['Analytics', 'Product'],
      author: 'Taliyo Team',
      excerpt: 'Instrument events, model funnels, and connect decisions to data.',
      content: `<h2>Steps</h2><p>Define events, standardize properties, and build dashboards that answer product questions—not vanity metrics.</p>`
    }
  ];
  return base.map((b, i) => {
    const content = generateBlogContent(b);
    const keywords = Array.from(new Set([...(b.tags || []), b.category, 'technology', 'IT services', 'Taliyo Technologies'].filter(Boolean)));
    return {
      ...b,
      slug: `${slugifyText(b.title)}-${i + 1}`,
      image: img(b.title),
      publishedAt: new Date(year, (i % 12), 10),
      content,
      keywords,
    };
  });
}

if (!global.__memoryBlogs) {
  global.__memoryBlogs = buildSampleBlogs();
}

// Enrich existing blogs in DB with long SEO content/keywords if they are short or missing
if (hasMongoDB && typeof Blog !== 'undefined' && Blog && !global.__blogsEnriched) {
  global.__blogsEnriched = true;
  (async () => {
    try {
      const mem = Array.isArray(global.__memoryBlogs) ? global.__memoryBlogs : [];
      if (!mem.length) return;
      const memBySlug = new Map(mem.map(m => [m.slug, m]));
      const docs = await Blog.find({}, 'slug title content excerpt image keywords category publishedAt').limit(500);
      let updated = 0;
      for (const d of docs) {
        const isShort = !d.content || String(d.content).length < 1200; // ensure long, SEO‑ready content
        const missingKW = !Array.isArray(d.keywords) || d.keywords.length < 3;
        if (isShort || missingKW) {
          const m = memBySlug.get(d.slug) || mem.find(x => slugifyText(x.title) === slugifyText(d.title));
          if (m) {
            if (isShort) d.content = m.content;
            if (!d.excerpt) d.excerpt = m.excerpt || d.excerpt;
            if (!d.image && m.image) d.image = m.image;
            if (missingKW) d.keywords = m.keywords || d.keywords;
            await d.save();
            updated += 1;
          }
        }
      }
      if (updated) console.log('✅ Enriched blog posts:', updated);
    } catch (e) {
      console.warn('⚠️  Blog enrichment skipped:', e?.message || e);
    }
  })();
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