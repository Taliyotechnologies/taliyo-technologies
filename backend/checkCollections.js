const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taliyo';

async function checkCollections() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log('-', collection.name);
    });
    
    // Check adminusers collection specifically
    const adminUsers = await mongoose.connection.db.collection('adminusers').find({}).toArray();
    console.log('\nAdminUsers collection has', adminUsers.length, 'documents');
    
    adminUsers.forEach(user => {
      console.log('User:', {
        id: user._id,
        email: user.email,
        role: user.role
      });
    });
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkCollections(); 