const mongoose = require('mongoose');
const Settings = require('../models/Settings');
require('dotenv').config();

const defaultSettings = {
  companyName: 'Taliyo Technologies',
  companyTagline: 'Top IT Company in India',
  companyDescription: 'Leading technology solutions provider specializing in web development, mobile apps, and digital transformation.',
  email: 'info@taliyo.com',
  phone: '+91 9876543210',
  address: 'Delhi, India',
  websiteUrl: 'https://taliyo.com',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: '',
  googleAnalyticsId: '',
  facebookPixelId: '',
  maintenanceMode: false,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  theme: 'dark',
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  features: {
    Analytics: true,
    Leads: true,
    SEO: true,
    Team: true,
    Logs: true,
    Subscribers: true,
    Services: true,
    webDevelopment: true,
    mobileDevelopment: true,
    cloudComputing: true,
    aiServices: true,
    digitalMarketing: true,
    consulting: true
  },
  integrations: {
    'Google Analytics': false,
    'SMTP': false,
    'Facebook': false,
    'Twitter': false
  }
};

async function initSettings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if settings already exist
    const existingSettings = await Settings.findOne();
    if (existingSettings) {
      console.log('Settings already exist, updating with defaults...');
      Object.assign(existingSettings, defaultSettings);
      await existingSettings.save();
      console.log('Settings updated successfully');
    } else {
      console.log('Creating new settings...');
      const settings = new Settings(defaultSettings);
      await settings.save();
      console.log('Settings created successfully');
    }

    console.log('Settings initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing settings:', error);
    process.exit(1);
  }
}

initSettings(); 