const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taliyo';

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
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

async function testBackendUser() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    
    // Test finding all users
    const allUsers = await AdminUser.find({});
    console.log('All users found:', allUsers.length);
    
    // Test finding specific user
    const user = await AdminUser.findOne({ email: 'harshbudhauliya882@gmail.com' });
    console.log('Specific user found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('User details:', {
        id: user._id,
        email: user.email,
        role: user.role
      });
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testBackendUser(); 