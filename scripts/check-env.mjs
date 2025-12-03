#!/usr/bin/env node

/**
 * Check environment variables after install
 * This script helps developers set up their environment correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, 'env.example');

// Skip in CI/CD environments
if (process.env.CI || process.env.VERCEL) {
  process.exit(0);
}

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('\n📋 Environment Setup Required\n');
  console.log('   Copy env.example to .env and fill in your values:');
  console.log('   cp env.example .env\n');
  console.log('   Required variables:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  console.log('   - DATABASE_URL (for migrations)\n');
}
