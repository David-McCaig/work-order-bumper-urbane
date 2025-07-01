import type { NextConfig } from "next";
import fs from 'fs';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  server: process.argv.includes('--experimental-https') && fs.existsSync(path.join(process.cwd(), 'certs', 'localhost-key.pem')) ? {
    https: {
      key: fs.readFileSync(path.join(process.cwd(), 'certs', 'localhost-key.pem')),
      cert: fs.readFileSync(path.join(process.cwd(), 'certs', 'localhost.pem')),
    },
  } : undefined,
};

export default nextConfig;
