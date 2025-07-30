const mongoose = require('mongoose');
const Settings = require('../models/Settings');
require('dotenv').config();

async function testSettings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test 1: Get current settings
    console.log('\n1. Testing getCurrentSettings...');
    const settings = await Settings.getCurrentSettings();
    console.log('✓ Current settings loaded:', settings.companyName);

    // Test 2: Update settings
    console.log('\n2. Testing settings update...');
    settings.companyName = 'Taliyo Technologies - Updated';
    settings.emailNotifications = true;
    await settings.save();
    console.log('✓ Settings updated successfully');

    // Test 3: Test features toggle
    console.log('\n3. Testing features toggle...');
    settings.features.Analytics = false;
    settings.features.Leads = true;
    await settings.save();
    console.log('✓ Features toggled successfully');

    // Test 4: Test integrations
    console.log('\n4. Testing integrations...');
    settings.integrations['Google Analytics'] = true;
    settings.integrations['SMTP'] = true;
    await settings.save();
    console.log('✓ Integrations updated successfully');

    // Test 5: Test security settings
    console.log('\n5. Testing security settings...');
    settings.sessionTimeout = 60;
    settings.maxLoginAttempts = 3;
    settings.maintenanceMode = false;
    await settings.save();
    console.log('✓ Security settings updated successfully');

    // Test 6: Test notification settings
    console.log('\n6. Testing notification settings...');
    settings.emailNotifications = true;
    settings.smsNotifications = false;
    settings.pushNotifications = true;
    await settings.save();
    console.log('✓ Notification settings updated successfully');

    // Test 7: Test appearance settings
    console.log('\n7. Testing appearance settings...');
    settings.theme = 'dark';
    await settings.save();
    console.log('✓ Appearance settings updated successfully');

    // Test 8: Test email settings
    console.log('\n8. Testing email settings...');
    settings.smtpHost = 'smtp.gmail.com';
    settings.smtpPort = 587;
    settings.smtpUser = 'test@example.com';
    settings.smtpPassword = 'testpassword';
    await settings.save();
    console.log('✓ Email settings updated successfully');

    // Test 9: Test analytics settings
    console.log('\n9. Testing analytics settings...');
    settings.googleAnalyticsId = 'GA-123456789';
    settings.facebookPixelId = 'FB-987654321';
    await settings.save();
    console.log('✓ Analytics settings updated successfully');

    // Test 10: Verify all settings
    console.log('\n10. Verifying all settings...');
    const finalSettings = await Settings.getCurrentSettings();
    console.log('✓ Company Name:', finalSettings.companyName);
    console.log('✓ Email:', finalSettings.email);
    console.log('✓ Theme:', finalSettings.theme);
    console.log('✓ Maintenance Mode:', finalSettings.maintenanceMode);
    console.log('✓ Features:', Object.keys(finalSettings.features).filter(k => finalSettings.features[k]));
    console.log('✓ Integrations:', Object.keys(finalSettings.integrations).filter(k => finalSettings.integrations[k]));

    console.log('\n🎉 All settings tests passed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Settings test failed:', error);
    process.exit(1);
  }
}

testSettings(); 