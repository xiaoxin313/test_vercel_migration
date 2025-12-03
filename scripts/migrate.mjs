#!/usr/bin/env node

/**
 * Database Migration Script for Supabase
 * This script runs during Vercel build process
 * It connects to your Supabase database and applies pending migrations
 */

import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    log('⚠️  DATABASE_URL not found. Skipping migrations.', 'yellow');
    log('   Set DATABASE_URL in your environment variables to enable migrations.', 'yellow');
    process.exit(0);
  }

  log('🚀 Starting database migrations...', 'cyan');

  const sql = postgres(databaseUrl, {
    ssl: 'require',
    connection: {
      application_name: 'nextjs-migration',
    },
  });

  try {
    // Create migrations table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    log('✅ Migrations table ready', 'green');

    // Get list of executed migrations
    const executedMigrations = await sql`
      SELECT name FROM _migrations ORDER BY id
    `;
    const executedNames = new Set(executedMigrations.map((m) => m.name));

    // Get migration files
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      log('📁 No migrations directory found. Creating...', 'yellow');
      fs.mkdirSync(migrationsDir, { recursive: true });
      log('✅ Created supabase/migrations directory', 'green');
      await sql.end();
      return;
    }

    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      log('📭 No migration files found.', 'yellow');
      await sql.end();
      return;
    }

    log(`📋 Found ${migrationFiles.length} migration file(s)`, 'blue');

    // Run pending migrations
    let appliedCount = 0;
    for (const file of migrationFiles) {
      if (executedNames.has(file)) {
        log(`  ⏭️  Skipping: ${file} (already applied)`, 'yellow');
        continue;
      }

      log(`  🔄 Applying: ${file}`, 'blue');

      const filePath = path.join(migrationsDir, file);
      const migrationSql = fs.readFileSync(filePath, 'utf-8');

      try {
        // Run migration in a transaction
        await sql.begin(async (tx) => {
          await tx.unsafe(migrationSql);
          await tx`
            INSERT INTO _migrations (name) VALUES (${file})
          `;
        });

        log(`  ✅ Applied: ${file}`, 'green');
        appliedCount++;
      } catch (error) {
        log(`  ❌ Failed: ${file}`, 'red');
        log(`     Error: ${error.message}`, 'red');
        throw error;
      }
    }

    if (appliedCount === 0) {
      log('✨ All migrations are up to date!', 'green');
    } else {
      log(`✨ Successfully applied ${appliedCount} migration(s)!`, 'green');
    }

    await sql.end();
  } catch (error) {
    log('❌ Migration failed!', 'red');
    console.error(error);
    await sql.end();
    process.exit(1);
  }
}

runMigrations();

