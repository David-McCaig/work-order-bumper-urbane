const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const certsDir = path.join(__dirname, 'certs');

// Create certs directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

console.log('Generating self-signed certificates for localhost...');

// Generate private key
execSync(
  'openssl genrsa -out certs/localhost-key.pem 2048',
  { stdio: 'inherit' }
);

// Generate certificate signing request
execSync(
  'openssl req -new -key certs/localhost-key.pem -out certs/localhost.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"',
  { stdio: 'inherit' }
);

// Generate self-signed certificate
execSync(
  'openssl x509 -req -in certs/localhost.csr -signkey certs/localhost-key.pem -out certs/localhost.pem -days 365',
  { stdio: 'inherit' }
);

// Clean up CSR file
fs.unlinkSync(path.join(certsDir, 'localhost.csr'));

console.log('✅ Certificates generated successfully!');
console.log('📁 Certificates saved in:', certsDir);
console.log('🔒 You can now run: npm run dev:https'); 