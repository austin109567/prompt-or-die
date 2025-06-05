
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowRight, Copy, FileText, Plus, Share2, Trash2, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import PromptSharing from '@/components/PromptSharing';

interface Project {
  id: string;
  name: string;
  created_at: string;
  last_modified: string;
  user_id: string;
}

const UserDashboard = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalBlocks, setTotalBlocks] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      fetchProjects();
    }
  }, [user, isAuthenticated, navigate, authLoading]);
  
  const fetchProjects = async () => {
    setIsLoading(true);
    
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, created_at, last_modified, user_id')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (projectsError) throw projectsError;
      
      setProjects(projectsData || []);
      
      // Fetch total prompt blocks count
      const { count, error: blocksError } = await supabase
        .from('prompt_blocks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
        
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
  
  const handleDeleteProject = async (projectId: string) => {
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

  if (authLoading) {
    return <div className="text-center text-lg">Loading user session...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {user?.email}! Here's an overview of your projects.
          </p>
        </div>
        <Button onClick={() => navigate('/projects/new')} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create New Project
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">
                  +{projects.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prompt Blocks</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBlocks}</div>
                <p className="text-xs text-muted-foreground">
                  Across all projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => new Date(p.last_modified) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Modified this week
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
            
            {projects.length === 0 ? (
              <div className="text-center p-4 border border-dashed rounded-md">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No projects created yet. Click the button above to create your first project!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Project Name</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{format(new Date(project.created_at), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{format(new Date(project.last_modified), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/projects/${project.id}`)}
                            >
                              Edit
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteProject(project.id)}
                              className="hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
