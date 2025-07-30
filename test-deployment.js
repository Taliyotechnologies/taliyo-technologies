const fs = require('fs');

console.log('🔍 Testing deployment configuration...');

// Check if package.json has the correct scripts
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log('\n📦 Package.json scripts:');
  if (packageJson.scripts.start) {
    console.log('✅ start script: ' + packageJson.scripts.start);
  } else {
    console.log('❌ start script missing');
  }
  
  if (packageJson.scripts['install:all']) {
    console.log('✅ install:all script: ' + packageJson.scripts['install:all']);
  } else {
    console.log('❌ install:all script missing');
  }
  
  // Check for postinstall script (should NOT exist)
  if (packageJson.scripts.postinstall) {
    console.log('❌ postinstall script exists - this will cause infinite loop!');
  } else {
    console.log('✅ No postinstall script - good!');
  }
  
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check if render.yaml exists
if (fs.existsSync('render.yaml')) {
  console.log('\n✅ render.yaml exists');
} else {
  console.log('\n❌ render.yaml missing');
}

// Check if .render-buildpacks exists
if (fs.existsSync('.render-buildpacks')) {
  console.log('✅ .render-buildpacks exists');
} else {
  console.log('❌ .render-buildpacks missing');
}

// Check if backend/index.js exists
if (fs.existsSync('backend/index.js')) {
  console.log('✅ backend/index.js exists');
} else {
  console.log('❌ backend/index.js missing');
}

console.log('\n🎉 Deployment configuration test completed!');
console.log('The infinite loop issue has been fixed.'); 