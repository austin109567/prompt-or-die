
import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  name: string;
  created_at: string;
  last_modified: string;
  user_id: string;
}

export const useProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalBlocks, setTotalBlocks] = useState(0);

  const fetchProjects = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (projectsError) throw projectsError;
      
      setProjects(projectsData || []);
      
      // Fetch total prompt blocks count
      const { count, error: blocksError } = await supabase
        .from('prompt_blocks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (blocksError) throw blocksError;
      
      setTotalBlocks(count || 0);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error fetching projects",
        description: error.message || "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!user) return;
    
    try {
      // Delete project blocks first
      const { error: deleteBlocksError } = await supabase
        .from('prompt_blocks')
        .delete()
        .eq('project_id', projectId);
        
      if (deleteBlocksError) throw deleteBlocksError;
      
      // Then delete the project
      const { error: deleteProjectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);
        
      if (deleteProjectError) throw deleteProjectError;
      
      // Update state
      setProjects(projects.filter(project => project.id !== projectId));
      
      toast({
        title: "Project deleted",
        description: "Project and associated blocks have been deleted"
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error deleting project",
        description: error.message || "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  return {
    projects,
    totalBlocks,
    isLoading,
    deleteProject,
    refetchProjects: fetchProjects
  };
};
