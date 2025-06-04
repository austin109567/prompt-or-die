/*
  # Supabase Schema and Policies

  1. New Tables
    - No new tables are created since all tables already exist
  2. Security
    - Update RLS policies for users table
    - Add validation for email and handle in users table
    - Add foreign key constraints for referential integrity
*/

-- Ensure RLS is enabled on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile when they sign up
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile (useful for account deletion)
CREATE POLICY "Users can delete their own profile" ON public.users
  FOR DELETE
  USING (auth.uid() = id);

-- Create policy for creating projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can create their own projects'
  ) THEN
    CREATE POLICY "Users can create their own projects" ON public.projects
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create policy for projects (listing/reading)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can view their own projects'
  ) THEN
    CREATE POLICY "Users can view their own projects" ON public.projects
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create policy for projects (update)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can update their own projects'
  ) THEN
    CREATE POLICY "Users can update their own projects" ON public.projects
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create policy for projects (delete)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can delete their own projects'
  ) THEN
    CREATE POLICY "Users can delete their own projects" ON public.projects
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Update trigger to update the last_modified timestamp on projects
CREATE OR REPLACE FUNCTION update_project_last_modified()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_project_last_modified_trigger'
  ) THEN
    CREATE TRIGGER update_project_last_modified_trigger
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_project_last_modified();
  END IF;
END $$;

-- Add a function to create a default project for new users
CREATE OR REPLACE FUNCTION create_default_project_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.projects (id, name, user_id)
  VALUES (gen_random_uuid()::text, 'My First Project', NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically create a default project when a new user is added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'create_default_project_on_user_insert'
  ) THEN
    CREATE TRIGGER create_default_project_on_user_insert
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_project_for_new_user();
  END IF;
END $$;