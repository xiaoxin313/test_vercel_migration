-- RPC Functions for Edge Function compatibility
-- These functions can be called from Supabase Edge Functions

-- Function to get projects with task counts
CREATE OR REPLACE FUNCTION get_projects_with_counts()
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    status VARCHAR,
    task_count BIGINT,
    completed_task_count BIGINT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        COUNT(t.id) as task_count,
        COUNT(t.id) FILTER (WHERE t.status = 'completed') as completed_task_count,
        p.created_at,
        p.updated_at
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC;
END;
$$;

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    total_projects BIGINT,
    total_tasks BIGINT,
    completed_tasks BIGINT,
    pending_tasks BIGINT,
    overdue_tasks BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM tasks) as total_tasks,
        (SELECT COUNT(*) FROM tasks WHERE status = 'completed') as completed_tasks,
        (SELECT COUNT(*) FROM tasks WHERE status = 'pending') as pending_tasks,
        (SELECT COUNT(*) FROM tasks WHERE status != 'completed' AND due_date < NOW()) as overdue_tasks;
END;
$$;

-- Function to get project by ID with tasks
CREATE OR REPLACE FUNCTION get_project_with_tasks(p_project_id UUID)
RETURNS TABLE (
    project_id UUID,
    project_name VARCHAR,
    project_description TEXT,
    project_status VARCHAR,
    task_id UUID,
    task_title VARCHAR,
    task_description TEXT,
    task_status VARCHAR,
    task_priority INTEGER,
    task_due_date TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as project_id,
        p.name as project_name,
        p.description as project_description,
        p.status as project_status,
        t.id as task_id,
        t.title as task_title,
        t.description as task_description,
        t.status as task_status,
        t.priority as task_priority,
        t.due_date as task_due_date
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    WHERE p.id = p_project_id
    ORDER BY t.priority DESC, t.created_at ASC;
END;
$$;
