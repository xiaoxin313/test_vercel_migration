/**
 * Database types generated for Supabase
 * Update these types when you change your database schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: string;
          priority: number;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: string;
          priority?: number;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: number;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      get_projects_with_counts: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          name: string;
          description: string | null;
          status: string;
          task_count: number;
          completed_task_count: number;
          created_at: string;
          updated_at: string;
        }[];
      };
      get_dashboard_stats: {
        Args: Record<string, never>;
        Returns: {
          total_projects: number;
          total_tasks: number;
          completed_tasks: number;
          pending_tasks: number;
          overdue_tasks: number;
        }[];
      };
      get_project_with_tasks: {
        Args: { p_project_id: string };
        Returns: {
          project_id: string;
          project_name: string;
          project_description: string | null;
          project_status: string;
          task_id: string | null;
          task_title: string | null;
          task_description: string | null;
          task_status: string | null;
          task_priority: number | null;
          task_due_date: string | null;
        }[];
      };
    };
  };
}

// Convenience types
export type Project = Database['public']['Tables']['projects']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];

export type InsertProject = Database['public']['Tables']['projects']['Insert'];
export type InsertTask = Database['public']['Tables']['tasks']['Insert'];

export type UpdateProject = Database['public']['Tables']['projects']['Update'];
export type UpdateTask = Database['public']['Tables']['tasks']['Update'];
