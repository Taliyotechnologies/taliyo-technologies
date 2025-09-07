#!/usr/bin/env node
/*
  Generate VAPID key pair for Web Push.
  Usage:
    node scripts/generateVapid.js
  Output:
    VAPID_PUBLIC_KEY=...
    VAPID_PRIVATE_KEY=...
*/

const webpush = require('web-push');

try {
  const keys = webpush.generateVAPIDKeys();
  console.log('VAPID_PUBLIC_KEY=' + keys.publicKey);
  console.log('VAPID_PRIVATE_KEY=' + keys.privateKey);
  console.log('\nSet these as environment variables on Render (backend service):');
  console.log('  VAPID_PUBLIC_KEY');
  console.log('  VAPID_PRIVATE_KEY');
  console.log('\nImportant: Do not commit these keys to source control.');
} catch (e) {
  console.error('Failed to generate VAPID keys:', e?.message || e);
  process.exit(1);
}
