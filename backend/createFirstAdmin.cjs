const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taliyo';

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  rl.question('Enter admin email: ', async (email) => {
    rl.question('Enter admin password: ', async (password) => {
      const hash = await bcrypt.hash(password, 10);
      try {
        const exists = await AdminUser.findOne({ email });
        if (exists) {
          console.log('User already exists!');
        } else {
          await AdminUser.create({ email, password: hash, role: 'admin' });
          console.log('Admin user created!');
        }
      } catch (err) {
        console.error('Error:', err);
      }
      mongoose.disconnect();
      rl.close();
    });
  });
}

main(); 