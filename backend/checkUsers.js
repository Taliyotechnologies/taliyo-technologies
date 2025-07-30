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

async function checkUsers() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    
    const users = await AdminUser.find({});
    console.log('Total users found:', users.length);
    
    users.forEach(user => {
      console.log('User:', {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: user.createdAt
      });
    });
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkUsers(); 