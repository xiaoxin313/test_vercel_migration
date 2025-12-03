'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Create a new project
 */
export async function createProject(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;

  if (!name) {
    throw new Error('Project name is required');
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .insert({
      name,
      description,
    } as never)
    .select()
    .single();

  if (error) {
    console.error('Failed to create project:', error);
    throw new Error('Failed to create project');
  }

  revalidatePath('/dashboard');
  return data;
}

/**
 * Update a project
 */
export async function updateProject(projectId: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;
  const status = formData.get('status') as string | null;

  const supabase = createServerSupabaseClient();

  const updates: Record<string, unknown> = {};
  if (name) updates.name = name;
  if (description !== null) updates.description = description;
  if (status) updates.status = status;

  const { data, error } = await supabase
    .from('projects')
    .update(updates as never)
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Failed to update project:', error);
    throw new Error('Failed to update project');
  }

  revalidatePath('/dashboard');
  return data;
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Failed to delete project:', error);
    throw new Error('Failed to delete project');
  }

  revalidatePath('/dashboard');
}

/**
 * Create a new task
 */
export async function createTask(formData: FormData) {
  const project_id = formData.get('project_id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const priority = parseInt(formData.get('priority') as string) || 0;
  const due_date = formData.get('due_date') as string | null;

  if (!project_id || !title) {
    throw new Error('Project ID and title are required');
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      project_id,
      title,
      description,
      priority,
      due_date,
    } as never)
    .select()
    .single();

  if (error) {
    console.error('Failed to create task:', error);
    throw new Error('Failed to create task');
  }

  revalidatePath('/dashboard');
  return data;
}

/**
 * Update task status
 */
export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('tasks')
    .update({ status } as never)
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Failed to update task:', error);
    throw new Error('Failed to update task');
  }

  revalidatePath('/dashboard');
  return data;
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Failed to delete task:', error);
    throw new Error('Failed to delete task');
  }

  revalidatePath('/dashboard');
}
