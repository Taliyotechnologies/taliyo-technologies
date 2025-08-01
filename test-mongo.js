const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://taliyo_user:Taliyo019@cluster0.kmbp5ro.mongodb.net/taliyo?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔍 Testing MongoDB connection...');
console.log(`🔍 MONGO_URI: ${MONGO_URI}`);
console.log(`🔍 Environment: ${process.env.NODE_ENV || 'development'}`);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
})
.then(() => {
  console.log('✅ MongoDB connection successful!');
  console.log(`📊 Database: ${MONGO_URI.split('/').pop().split('?')[0]}`);
  
  // Test creating a simple document
  const TestSchema = new mongoose.Schema({
    test: String,
    timestamp: { type: Date, default: Date.now }
  });
  
  const Test = mongoose.model('Test', TestSchema);
  
  return Test.create({ test: 'connection_test' });
})
.then(() => {
  console.log('✅ Database write test successful!');
  return mongoose.connection.close();
})
.then(() => {
  console.log('✅ Connection closed successfully');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection failed:');
  console.error('Error message:', err.message);
  console.error('Full error:', err);
  process.exit(1);
}); 