/**
 * Edge API Route for Task Operations
 * This runs on Vercel Edge Runtime
 */

import { NextRequest, NextResponse } from 'next/server';
import { createEdgeSupabaseClient } from '@/lib/supabase/edge';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const supabase = createEdgeSupabaseClient({ serviceRole: true });

    let query = supabase.from('tasks').select('*');
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data: tasks, error } = await query.order('priority', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ tasks });
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
    const { project_id, title, description, priority, due_date } = body;

    if (!project_id || !title) {
      return NextResponse.json(
        { error: 'Project ID and title are required' },
        { status: 400 }
      );
    }

    const supabase = createEdgeSupabaseClient({ serviceRole: true });

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        project_id,
        title,
        description: description || null,
        priority: priority || 0,
        due_date: due_date || null,
      } as never)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Edge API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const supabase = createEdgeSupabaseClient({ serviceRole: true });

    const { data: task, error } = await supabase
      .from('tasks')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Edge API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const supabase = createEdgeSupabaseClient({ serviceRole: true });

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Edge API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
