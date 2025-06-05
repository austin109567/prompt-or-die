
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import DashboardStats from '@/components/DashboardStats';
import ProjectsTable from '@/components/ProjectsTable';

const UserDashboard = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { projects, totalBlocks, isLoading, deleteProject } = useProjects();
  
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/auth');
      return;
    }
  }, [isAuthenticated, navigate, authLoading]);

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
          <DashboardStats projects={projects} totalBlocks={totalBlocks} />
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
            <ProjectsTable projects={projects} onDeleteProject={deleteProject} />
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
