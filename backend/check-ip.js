const https = require('https');

console.log('🔍 Checking your current IP address...');

https.get('https://api.ipify.org', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📱 Your current IP address is:', data);
    console.log('🔧 Add this IP to MongoDB Atlas Network Access');
    console.log('🌐 Go to: https://cloud.mongodb.com → Network Access → Add IP Address');
  });
}).on('error', (err) => {
  console.error('❌ Error getting IP:', err.message);
}); 