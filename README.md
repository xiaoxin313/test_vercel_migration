# Next.js + Supabase with Auto Migrations on Vercel

A production-ready Next.js application with Supabase database and automatic migrations during Vercel deployment.

## Features

- 🚀 **Automatic Database Migrations** - Migrations run during Vercel build
- ⚡ **Edge API Routes** - Ultra-fast API responses with Vercel Edge Runtime
- 📊 **Type-Safe Database** - Full TypeScript support with Supabase types
- 🎨 **Modern UI** - Beautiful dark theme with Tailwind CSS

## Project Structure

```
├── scripts/
│   ├── migrate.mjs           # Database migration runner
│   ├── create-migration.mjs  # Create new migration files
│   └── check-env.mjs         # Environment check helper
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── edge/         # Edge API routes
│   │   │       ├── projects/
│   │   │       ├── tasks/
│   │   │       └── stats/
│   │   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── actions/              # Server actions
│   │   └── project.ts
│   └── lib/
│       └── supabase/
│           ├── client.ts     # Browser Supabase client
│           ├── server.ts     # Server Supabase client
│           ├── edge.ts       # Edge Runtime client
│           └── types.ts      # Database types
├── supabase/
│   └── migrations/           # SQL migration files
├── vercel.json
└── package.json
```

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > Database** and copy the connection string
3. Go to **Settings > API** and copy your keys

### 3. Configure Environment Variables

Copy `env.example` to `.env.local` and fill in your values:

```bash
cp env.example .env.local
```

Required variables:

```env
# Supabase - Get from Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Database (for migrations) - Get from Supabase Dashboard > Settings > Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

### 4. Run Locally

```bash
npm run dev
```

## Database Migrations

### How It Works

1. Migrations are SQL files in `supabase/migrations/`
2. Files are named with timestamp: `20241203000001_migration_name.sql`
3. During `npm run build`, migrations run automatically
4. A `_migrations` table tracks which migrations have been applied

### Create a New Migration

```bash
npm run migrate:create -- add_new_table
```

This creates a new timestamped file in `supabase/migrations/`.

### Run Migrations Manually

```bash
npm run migrate
```

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Add environment variables:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
DATABASE_URL = your_database_connection_string
```

4. Deploy!

## Edge Functions

All API routes under `src/app/api/edge/` run on Vercel Edge Runtime:

- **GET /api/edge/projects** - List all projects with task counts
- **POST /api/edge/projects** - Create new project
- **GET /api/edge/tasks** - List tasks (optionally by project)
- **POST /api/edge/tasks** - Create new task
- **PATCH /api/edge/tasks** - Update task
- **DELETE /api/edge/tasks** - Delete task
- **GET /api/edge/stats** - Get dashboard statistics

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│   Next.js App   │────▶│   Supabase DB   │
│   (Vercel)      │     │   (PostgreSQL)  │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
        │
        │
        ▼
┌─────────────────┐
│  Edge Runtime   │
│  API Routes     │
└─────────────────┘
```

## Migration on Deploy

The build command in `package.json` runs migrations before building:

```json
{
  "scripts": {
    "build": "npm run migrate && next build"
  }
}
```

This ensures:
1. Migrations run during every Vercel deployment
2. Database schema is always up-to-date before the app starts
3. Failed migrations will fail the build (preventing broken deployments)

## License

MIT
