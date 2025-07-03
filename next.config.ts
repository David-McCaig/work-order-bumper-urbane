import type { NextConfig } from "next";
import fs from 'fs';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [],
  // Note: server config is only used for HTTPS development
  // and is not a standard Next.js config option
};

export default nextConfig;
