const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taliyo';

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

async function testLogin() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    
    const email = 'harshbudhauliya882@gmail.com';
    const password = 'admin123';
    
    // Find the user
    const user = await AdminUser.findOne({ email });
    if (!user) {
      console.log('User not found!');
      return;
    }
    
    console.log('User found:', { email: user.email, role: user.role });
    
    // Test password
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);
    
    if (match) {
      console.log('Login successful!');
      console.log('You can now use the admin dashboard with:');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      console.log('Password is incorrect!');
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testLogin(); 