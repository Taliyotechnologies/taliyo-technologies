const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://taliyo_user:Taliyo019@cluster0.kmbp5ro.mongodb.net/taliyo?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔍 Testing MongoDB connection...');
console.log('📊 URI:', MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials

mongoose.connect(MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  console.log('📊 Database:', MONGO_URI.split('/').pop().split('?')[0]);
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.error('🔧 Please check your MONGO_URI environment variable');
  process.exit(1);
}); 