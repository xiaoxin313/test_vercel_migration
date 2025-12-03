/**
 * Edge API Route for Project Operations
 * This runs on Vercel Edge Runtime
 */

import { NextRequest, NextResponse } from 'next/server';
import { createEdgeSupabaseClient } from '@/lib/supabase/edge';

export const runtime = 'edge';

export async function GET() {
  try {
    const supabase = createEdgeSupabaseClient({ serviceRole: true });

    // Get projects with task counts
    const { data: projects, error } = await supabase
      .rpc('get_projects_with_counts');

    if (error) throw error;

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Edge API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const supabase = createEdgeSupabaseClient({ serviceRole: true });

    // Create project using raw query to avoid type issues
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name,
        description: description || null,
      } as never)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Edge API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
