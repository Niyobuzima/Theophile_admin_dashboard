import { generateKeyPairSync } from 'node:crypto';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { config } from 'dotenv';

config();
console.log('🔐 Generating RSA-PSS 2048-bit keypair...');

if (process.env.NODE_ENV !== 'development') {
  console.error('Key generation is disabled outside development');
  process.exit(1);
}
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

if (!existsSync('keys')) {
  mkdirSync('keys', { recursive: true });
}

writeFileSync('keys/private.pem', privateKey, { mode: 0o600 });
writeFileSync('keys/public.pem', publicKey, { mode: 0o644 });

console.log('RSA keys generated successfully!');
console.log('Location: keys/');
console.log('   - private.pem (NEVER commit this!)');
console.log('   - public.pem (exposed via /keys/public)');
console.log('');
console.log('IMPORTANT: Add keys/ to .gitignore');
