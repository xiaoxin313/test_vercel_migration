/**
 * Edge API Route for Dashboard Statistics
 * This runs on Vercel Edge Runtime
 */

import { NextResponse } from 'next/server';
import { createEdgeSupabaseClient } from '@/lib/supabase/edge';

export const runtime = 'edge';

export async function GET() {
  try {
    const supabase = createEdgeSupabaseClient({ serviceRole: true });

    // Get dashboard stats
    const { data: stats, error } = await supabase
      .rpc('get_dashboard_stats');

    if (error) throw error;

    return NextResponse.json({ 
      stats: stats?.[0] || {
        total_projects: 0,
        total_tasks: 0,
        completed_tasks: 0,
        pending_tasks: 0,
        overdue_tasks: 0,
      }
    });
  } catch (error) {
    console.error('Edge API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
