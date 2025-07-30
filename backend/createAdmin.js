const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://taliyo_user:Taliyo019@cluster0.kmbp5ro.mongodb.net/taliyo?retryWrites=true&w=majority&appName=Cluster0';

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

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    
    const email = 'harshbudhauliya882@gmail.com';
    const password = 'admin123';
    
    // Delete existing user if exists
    await AdminUser.deleteOne({ email });
    console.log('Deleted existing user');
    
    // Create new user
    const hash = await bcrypt.hash(password, 10);
    await AdminUser.create({ email, password: hash, role: 'admin' });
    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Verify the user
    const user = await AdminUser.findOne({ email });
    const match = await bcrypt.compare(password, user.password);
    console.log('Password verification:', match);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdmin(); 