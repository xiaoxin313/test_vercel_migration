#!/usr/bin/env node

/**
 * Create a new migration file
 * Usage: npm run migrate:create -- migration_name
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationName = process.argv[2] || 'unnamed_migration';

// Generate timestamp
const now = new Date();
const timestamp = now.toISOString()
  .replace(/[-:T]/g, '')
  .slice(0, 14);

const fileName = `${timestamp}_${migrationName}.sql`;
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

// Create migrations directory if it doesn't exist
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const filePath = path.join(migrationsDir, fileName);

const template = `-- Migration: ${migrationName}
-- Created at: ${now.toISOString()}

-- Write your migration SQL here
-- Example:
-- CREATE TABLE example (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

`;

fs.writeFileSync(filePath, template);

console.log(`✅ Created migration: supabase/migrations/${fileName}`);

