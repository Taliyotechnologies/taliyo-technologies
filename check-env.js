console.log('🔍 Checking environment variables...');
console.log('🔍 All environment variables:');
console.log(process.env);

console.log('\n🔍 Specific checks:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('MONGO_URI type:', typeof process.env.MONGO_URI);
console.log('MONGO_URI length:', process.env.MONGO_URI ? process.env.MONGO_URI.length : 'undefined');

console.log('\n🔍 Other important vars:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Test if it's a timing issue
setTimeout(() => {
  console.log('\n🔍 After 2 seconds:');
  console.log('MONGO_URI:', process.env.MONGO_URI);
}, 2000); 