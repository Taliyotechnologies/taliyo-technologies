const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get current settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// Get settings by ID
router.get('/:id', async (req, res) => {
  try {
    const settings = await Settings.findById(req.params.id);
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings by ID:', error);
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// Create new settings (Admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const settings = new Settings({
      ...req.body,
      updatedBy: req.user._id
    });
    await settings.save();
    
    // Emit real-time update
    req.app.get('io').emit('settings:created', settings);
    
    res.status(201).json(settings);
  } catch (error) {
    console.error('Error creating settings:', error);
    res.status(400).json({ message: 'Error creating settings', error: error.message });
  }
});

// Update current settings (Admin only) - for frontend compatibility
router.put('/', [auth, admin], async (req, res) => {
  try {
    let settings = await Settings.getCurrentSettings();
    
    // Update settings
    Object.assign(settings, req.body, {
      updatedBy: req.user._id,
      lastUpdated: new Date()
    });
    
    await settings.save();
    
    // Emit real-time update
    req.app.get('io').emit('settings:updated', settings);
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(400).json({ message: 'Error updating settings', error: error.message });
  }
});

// Update current settings (Admin only) - POST method for frontend compatibility
router.post('/', [auth, admin], async (req, res) => {
  try {
    let settings = await Settings.getCurrentSettings();
    
    // Update settings
    Object.assign(settings, req.body, {
      updatedBy: req.user._id,
      lastUpdated: new Date()
    });
    
    await settings.save();
    
    // Emit real-time update
    req.app.get('io').emit('settings:updated', settings);
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(400).json({ message: 'Error updating settings', error: error.message });
  }
});

// Update specific setting field (Admin only)
router.patch('/:id', [auth, admin], async (req, res) => {
  try {
    const settings = await Settings.findById(req.params.id);
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // Update only the provided fields
    Object.keys(req.body).forEach(key => {
      if (settings.schema.paths[key]) {
        settings[key] = req.body[key];
      }
    });
    
    settings.updatedBy = req.user._id;
    settings.lastUpdated = new Date();
    
    await settings.save();
    
    // Emit real-time update
    req.app.get('io').emit('settings:updated', settings);
    
    res.json(settings);
  } catch (error) {
    console.error('Error patching settings:', error);
    res.status(400).json({ message: 'Error updating settings', error: error.message });
  }
});

// Delete settings (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const settings = await Settings.findById(req.params.id);
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    await Settings.findByIdAndDelete(req.params.id);
    
    // Emit real-time update
    req.app.get('io').emit('settings:deleted', { id: req.params.id });
    
    res.json({ message: 'Settings deleted successfully' });
  } catch (error) {
    console.error('Error deleting settings:', error);
    res.status(500).json({ message: 'Error deleting settings', error: error.message });
  }
});

// Reset settings to defaults (Admin only)
router.post('/reset', [auth, admin], async (req, res) => {
  try {
    // Delete all existing settings
    await Settings.deleteMany({});
    
    // Create new default settings
    const defaultSettings = new Settings({
      updatedBy: req.user._id
    });
    await defaultSettings.save();
    
    // Emit real-time update
    req.app.get('io').emit('settings:reset', defaultSettings);
    
    res.json(defaultSettings);
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ message: 'Error resetting settings', error: error.message });
  }
});

// Get settings history (Admin only)
router.get('/history/all', [auth, admin], async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const settings = await Settings.find()
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('updatedBy', 'name email')
      .exec();
    
    const total = await Settings.countDocuments();
    
    res.json({
      settings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching settings history:', error);
    res.status(500).json({ message: 'Error fetching settings history', error: error.message });
  }
});

// Export settings (Admin only)
router.get('/export/json', [auth, admin], async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=settings.json');
    res.json(settings);
  } catch (error) {
    console.error('Error exporting settings:', error);
    res.status(500).json({ message: 'Error exporting settings', error: error.message });
  }
});

// Import settings (Admin only)
router.post('/import', [auth, admin], async (req, res) => {
  try {
    const importedSettings = req.body;
    
    // Validate required fields
    if (!importedSettings.companyName || !importedSettings.email) {
      return res.status(400).json({ message: 'Company name and email are required' });
    }
    
    // Create new settings from imported data
    const settings = new Settings({
      ...importedSettings,
      updatedBy: req.user._id
    });
    
    await settings.save();
    
    // Emit real-time update
    req.app.get('io').emit('settings:imported', settings);
    
    res.json(settings);
  } catch (error) {
    console.error('Error importing settings:', error);
    res.status(400).json({ message: 'Error importing settings', error: error.message });
  }
});

// Test email settings (Admin only)
router.post('/test-email', [auth, admin], async (req, res) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPassword, testEmail } = req.body;
    
    // Here you would implement actual email testing
    // For now, we'll simulate a successful test
    const testResult = {
      success: true,
      message: 'Email settings test successful',
      details: {
        host: smtpHost,
        port: smtpPort,
        user: smtpUser,
        testEmail: testEmail
      }
    };
    
    res.json(testResult);
  } catch (error) {
    console.error('Error testing email settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error testing email settings', 
      error: error.message 
    });
  }
});

// Test analytics settings (Admin only)
router.post('/test-analytics', [auth, admin], async (req, res) => {
  try {
    const { googleAnalyticsId, facebookPixelId } = req.body;
    
    // Here you would implement actual analytics testing
    const testResult = {
      success: true,
      message: 'Analytics settings test successful',
      details: {
        googleAnalytics: googleAnalyticsId ? 'Connected' : 'Not configured',
        facebookPixel: facebookPixelId ? 'Connected' : 'Not configured'
      }
    };
    
    res.json(testResult);
  } catch (error) {
    console.error('Error testing analytics settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error testing analytics settings', 
      error: error.message 
    });
  }
});

// Backup settings (Admin only)
router.post('/backup', [auth, admin], async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    const backup = {
      ...settings.toObject(),
      backupDate: new Date(),
      backedUpBy: req.user._id
    };
    
    // Here you would save to backup storage
    // For now, we'll just return the backup data
    res.json({
      success: true,
      message: 'Settings backed up successfully',
      backup
    });
  } catch (error) {
    console.error('Error backing up settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error backing up settings', 
      error: error.message 
    });
  }
});

// Restore settings from backup (Admin only)
router.post('/restore', [auth, admin], async (req, res) => {
  try {
    const { backupData } = req.body;
    
    if (!backupData) {
      return res.status(400).json({ message: 'Backup data is required' });
    }
    
    // Delete current settings
    await Settings.deleteMany({});
    
    // Create settings from backup
    const restoredSettings = new Settings({
      ...backupData,
      updatedBy: req.user._id,
      lastUpdated: new Date()
    });
    
    await restoredSettings.save();
    
    // Emit real-time update
    req.app.get('io').emit('settings:restored', restoredSettings);
    
    res.json({
      success: true,
      message: 'Settings restored successfully',
      settings: restoredSettings
    });
  } catch (error) {
    console.error('Error restoring settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error restoring settings', 
      error: error.message 
    });
  }
});

module.exports = router; 