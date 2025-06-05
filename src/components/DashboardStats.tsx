
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Zap, TrendingUp } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  created_at: string;
  last_modified: string;
  user_id: string;
}

interface DashboardStatsProps {
  projects: Project[];
  totalBlocks: number;
}

const DashboardStats = ({ projects, totalBlocks }: DashboardStatsProps) => {
  const projectsThisWeek = projects.filter(
    p => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const activeProjects = projects.filter(
    p => new Date(p.last_modified) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.length}</div>
          <p className="text-xs text-muted-foreground">
            +{projectsThisWeek} this week
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
          <div className="text-2xl font-bold">{activeProjects}</div>
          <p className="text-xs text-muted-foreground">
            Modified this week
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
