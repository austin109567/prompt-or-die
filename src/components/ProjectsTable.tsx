
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Project {
  id: string;
  name: string;
  created_at: string;
  last_modified: string;
  user_id: string;
}

interface ProjectsTableProps {
  projects: Project[];
  onDeleteProject: (projectId: string) => void;
}

const ProjectsTable = ({ projects, onDeleteProject }: ProjectsTableProps) => {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="text-center p-4 border border-dashed rounded-md">
        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground">
          No projects created yet. Click the button above to create your first project!
        </p>
      </div>
    );
  }

  return (
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
                    onClick={() => onDeleteProject(project.id)}
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
  );
};

export default ProjectsTable;
