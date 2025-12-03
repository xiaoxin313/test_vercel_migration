# Next.js + Supabase with Auto Migrations on Vercel

Next.js application with Supabase database and automatic migrations during Vercel deployment.

## Features

- 🚀 **Automatic Database Migrations** - Migrations run during Vercel build
- ⚡ **Edge API Routes** - Ultra-fast API responses with Vercel Edge Runtime

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure `.env` file

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

### 3. Run locally

```bash
npm run dev
```

## Database Migrations

Migrations are in `supabase/migrations/`. They run automatically during build.

### Create new migration

```bash
npm run migrate:create -- migration_name
```

### Run migrations manually

```bash
npm run migrate
```

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The build command runs migrations automatically before building.

## API Routes (Edge Runtime)

- `GET /api/edge/projects` - List projects
- `POST /api/edge/projects` - Create project
- `GET /api/edge/tasks` - List tasks
- `POST /api/edge/tasks` - Create task
- `PATCH /api/edge/tasks` - Update task
- `DELETE /api/edge/tasks` - Delete task
- `GET /api/edge/stats` - Dashboard stats
