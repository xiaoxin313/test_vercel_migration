import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen animated-bg">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Next.js</span> + Supabase
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-8">
            Full-stack application with automatic database migrations on Vercel deploy.
            Built with Supabase Edge Functions for ultra-fast API responses.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard →
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Auto Migrations</h3>
            <p className="text-[var(--muted)]">
              Database migrations run automatically during Vercel build. 
              No manual steps required.
            </p>
          </div>

          <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Edge Functions</h3>
            <p className="text-[var(--muted)]">
              API routes run on Vercel Edge Runtime for ultra-fast response times 
              globally.
            </p>
          </div>

          <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl mb-4">🗄️</div>
            <h3 className="text-xl font-semibold mb-2">Supabase</h3>
            <p className="text-[var(--muted)]">
              PostgreSQL database with Row Level Security and 
              real-time capabilities.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold mb-8">Built with</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Next.js 14', 'Supabase', 'TypeScript', 'Tailwind CSS', 'Vercel'].map((tech) => (
              <span 
                key={tech}
                className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
