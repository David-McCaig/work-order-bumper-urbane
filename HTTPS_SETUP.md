# HTTPS Setup for Local Development

This guide explains how to set up HTTPS for your Next.js app on localhost.

## Quick Setup

1. **Generate SSL Certificates** (one-time setup):
   ```bash
   npm run generate-certs
   ```

2. **Start the development server with HTTPS**:
   ```bash
   npm run dev:https
   ```

3. **Access your app**:
   - Open your browser and go to `https://localhost:3000`
   - You'll see a security warning because it's a self-signed certificate
   - Click "Advanced" and then "Proceed to localhost (unsafe)" to continue

## What This Does

- Creates self-signed SSL certificates in the `certs/` directory
- Configures Next.js to use HTTPS in development mode
- Adds convenient npm scripts for certificate generation and HTTPS development

## Browser Security Warnings

Since we're using self-signed certificates, browsers will show security warnings. This is normal and expected for local development. You can safely proceed by:

1. Clicking "Advanced" in the security warning
2. Clicking "Proceed to localhost (unsafe)"

## Alternative Methods

### Method 2: Using mkcert (Recommended for easier setup)

If you prefer a more seamless experience, you can use `mkcert`:

1. **Install mkcert**:
   ```bash
   # macOS
   brew install mkcert
   mkcert -install
   
   # Windows
   choco install mkcert
   mkcert -install
   
   # Linux
   sudo apt install mkcert
   mkcert -install
   ```

2. **Generate certificates**:
   ```bash
   mkcert localhost 127.0.0.1 ::1
   ```

3. **Update next.config.ts**:
   ```typescript
   server: {
     https: process.env.NODE_ENV === 'development' ? {
       key: fs.readFileSync('localhost+2-key.pem'),
       cert: fs.readFileSync('localhost+2.pem'),
     } : undefined,
   },
   ```

### Method 3: Using a Reverse Proxy

You can also use tools like `ngrok` or `local-ssl-proxy` to create HTTPS tunnels to your HTTP development server.

## Troubleshooting

- **Certificate errors**: Make sure you've run `npm run generate-certs` first
- **Port conflicts**: If port 3000 is in use, Next.js will automatically try the next available port
- **Browser caching**: Clear your browser cache if you're having issues with mixed content

## Security Note

These self-signed certificates are only for local development. Never use them in production environments. 