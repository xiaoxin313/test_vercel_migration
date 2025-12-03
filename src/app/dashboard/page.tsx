import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function getDashboardData() {
  const supabase = createServerSupabaseClient();
  
  // Get stats
  const { data: stats } = await supabase
    .rpc('get_dashboard_stats');

  // Get projects
  const { data: projects } = await supabase
    .rpc('get_projects_with_counts');

  return {
    stats: stats?.[0] || {
      total_projects: 0,
      total_tasks: 0,
      completed_tasks: 0,
      pending_tasks: 0,
      overdue_tasks: 0,
    },
    projects: projects || [],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen animated-bg">
      {/* Header */}
      <header className="border-b border-[var(--card-border)] bg-[var(--card-bg)]/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold gradient-text">
            App
          </Link>
          <span className="text-sm text-[var(--muted)]">
            Supabase + Edge Functions
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Dashboard 📊
          </h1>
          <p className="text-[var(--muted)]">
            Here&apos;s an overview of your projects and tasks.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold text-[var(--primary)]">
              {data?.stats?.total_projects || 0}
            </div>
            <div className="text-sm text-[var(--muted)]">Projects</div>
          </div>
          <div className="card animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="text-3xl font-bold">
              {data?.stats?.total_tasks || 0}
            </div>
            <div className="text-sm text-[var(--muted)]">Total Tasks</div>
          </div>
          <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-green-500">
              {data?.stats?.completed_tasks || 0}
            </div>
            <div className="text-sm text-[var(--muted)]">Completed</div>
          </div>
          <div className="card animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <div className="text-3xl font-bold text-yellow-500">
              {data?.stats?.pending_tasks || 0}
            </div>
            <div className="text-sm text-[var(--muted)]">Pending</div>
          </div>
          <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl font-bold text-red-500">
              {data?.stats?.overdue_tasks || 0}
            </div>
            <div className="text-sm text-[var(--muted)]">Overdue</div>
          </div>
        </div>

        {/* Projects */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Projects</h2>
            <button className="btn-primary text-sm">
              + New Project
            </button>
          </div>

          {data?.projects && data.projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.projects.map((project: any, index: number) => (
                <div 
                  key={project.id} 
                  className="card animate-fade-in"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <h3 className="font-semibold mb-2">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-[var(--muted)] mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className={`badge ${project.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {project.status}
                    </span>
                    <span className="text-sm text-[var(--muted)]">
                      {project.completed_task_count}/{project.task_count} tasks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-[var(--muted)] mb-4">
                Create your first project to get started.
              </p>
              <button className="btn-primary">
                Create Project
              </button>
            </div>
          )}
        </div>

        {/* Migration Info */}
        <div className="card bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 border-[var(--primary)]/30">
          <h3 className="font-semibold mb-2">🚀 Deployment Info</h3>
          <p className="text-sm text-[var(--muted)]">
            This app runs database migrations automatically during Vercel deployment.
            All API routes use Edge Runtime for optimal performance.
          </p>
        </div>
      </main>
    </div>
  );
}
