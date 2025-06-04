import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Folder, Plus, Share, Star, Trash2, BarChart2, PenTool, Zap, Book, Terminal } from "lucide-react";
import DomainSettings from "@/components/DomainSettings";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts";

interface PromptProject {
  id: string;
  name: string;
  description: string;
  blocks: number;
  lastModified: string;
  isStarred: boolean;
}

interface SavedTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  usageCount: number;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [projects, setProjects] = useState<PromptProject[]>([]);
  const [completionRate, setCompletionRate] = useState(78);
  const [activeProjects, setActiveProjects] = useState<string[]>([]);
  const [activeTemplates, setActiveTemplates] = useState<string[]>([]);
  
  // Analytics data
  const activityData = [
    { date: "Mon", prompts: 5, responses: 3, tokens: 1200 },
    { date: "Tue", prompts: 8, responses: 7, tokens: 3100 },
    { date: "Wed", prompts: 12, responses: 10, tokens: 4500 },
    { date: "Thu", prompts: 7, responses: 6, tokens: 2800 },
    { date: "Fri", prompts: 9, responses: 8, tokens: 3300 },
    { date: "Sat", prompts: 4, responses: 3, tokens: 1600 },
    { date: "Sun", prompts: 6, responses: 5, tokens: 2100 }
  ];
  
  const modelUsageData = [
    { name: "GPT-4", value: 65, color: "#10B981" },
    { name: "Claude", value: 25, color: "#3B82F6" },
    { name: "Llama", value: 10, color: "#8B5CF6" }
  ];
  
  const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"];
  
  const blockTypeData = [
    { name: "Intent", value: 42, color: "#10B981" },
    { name: "Tone", value: 28, color: "#06B6D4" },
    { name: "Format", value: 18, color: "#F59E0B" },
    { name: "Context", value: 8, color: "#8B5CF6" },
    { name: "Persona", value: 4, color: "#EC4899" }
  ];
  
  // Mock saved templates
  const [templates, setTemplates] = useState<SavedTemplate[]>([
    {
      id: "1",
      name: "SEO Blog Post",
      category: "Marketing",
      description: "Template for creating SEO-optimized blog content",
      usageCount: 23
    },
    {
      id: "2",
      name: "Bug Report Analysis",
      category: "Development",
      description: "Analyze software bugs and suggest fixes",
      usageCount: 17
    },
    {
      id: "3",
      name: "Product Description",
      category: "E-commerce",
      description: "Generate compelling product descriptions",
      usageCount: 31
    },
  ]);

  useEffect(() => {
    // Fetch user profile and projects
    const fetchUserData = async () => {
      if (user) {
        try {
          // Get user profile - using maybeSingle() instead of single()
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (profileError) throw profileError;
          
          // If no user profile exists, create one
          if (!profileData) {
            const username = user.email ? user.email.split('@')[0] : `user_${Math.random().toString(36).substring(2, 8)}`;
            
            const { data: newUserData, error: createError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email,
                handle: username
              })
              .select()
              .single();
              
            if (createError) throw createError;
            
            setUserProfile(newUserData);
          } else {
            setUserProfile(profileData);
          }
          
          // Get user projects
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('*, prompt_blocks(count)')
            .eq('user_id', user.id);
            
          if (projectsError) throw projectsError;
          
          if (projectsData) {
            const formattedProjects = projectsData.map((project) => ({
              id: project.id,
              name: project.name,
              description: "A collection of prompt blocks",
              blocks: project.prompt_blocks?.count || 0,
              lastModified: new Date(project.last_modified).toLocaleDateString(),
              isStarred: false
            }));
            
            setProjects(formattedProjects);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    fetchUserData();
  }, [user]);
  
  // Toggle project starred status
  const toggleStarred = (id: string) => {
    setProjects(projects.map(project => 
      project.id === id 
        ? { ...project, isStarred: !project.isStarred } 
        : project
    ));
  };
  
  // Toggle project selection
  const toggleProjectSelection = (id: string) => {
    setActiveProjects(prev => 
      prev.includes(id) 
        ? prev.filter(projectId => projectId !== id) 
        : [...prev, id]
    );
  };
  
  // Toggle template selection
  const toggleTemplateSelection = (id: string) => {
    setActiveTemplates(prev => 
      prev.includes(id) 
        ? prev.filter(templateId => templateId !== id) 
        : [...prev, id]
    );
  };
  
  // Delete selected projects
  const deleteSelectedProjects = async () => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('projects')
        .delete()
        .in('id', activeProjects);
        
      if (error) throw error;
      
      // Update local state
      setProjects(projects.filter(project => !activeProjects.includes(project.id)));
      setActiveProjects([]);
    } catch (error) {
      console.error('Error deleting projects:', error);
    }
  };
  
  // Delete selected templates
  const deleteSelectedTemplates = () => {
    setTemplates(templates.filter(template => !activeTemplates.includes(template.id)));
    setActiveTemplates([]);
  };
  
  // Create new project
  const createNewProject = async () => {
    if (!user) return;
    
    try {
      const newProjectId = Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          id: newProjectId,
          name: "New Project",
          user_id: user.id,
          last_modified: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
      
      if (data) {
        setProjects([
          ...projects,
          {
            id: newProjectId,
            name: "New Project",
            description: "A collection of prompt blocks",
            blocks: 0,
            lastModified: new Date().toLocaleDateString(),
            isStarred: false
          }
        ]);
      }
    } catch (error) {
      console.error('Error creating new project:', error);
    }
  };
  
  // Helper function to format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg bg-primary/20">
                {userProfile?.handle?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{userProfile?.handle || user?.email?.split('@')[0]}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={createNewProject}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
        
        {/* Dashboard overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card primary">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-md">
                <PenTool className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Total Projects</h3>
            </div>
            <p className="text-3xl font-bold">{projects.length}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">Last 30 days</p>
              <Badge variant="outline" className="bg-primary/10 text-primary text-xs">+{Math.floor(projects.length * 0.2)}</Badge>
            </div>
          </div>
          
          <div className="stat-card accent">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent/20 rounded-md">
                <Terminal className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-medium">Total Prompts</h3>
            </div>
            <p className="text-3xl font-bold">{formatNumber(78)}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">Last 30 days</p>
              <Badge variant="outline" className="bg-accent/10 text-accent text-xs">+15</Badge>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/20 rounded-md">
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <h3 className="font-medium">AI Responses</h3>
            </div>
            <p className="text-3xl font-bold">{formatNumber(156)}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">Last 30 days</p>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 text-xs">+42</Badge>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-md">
                <BarChart2 className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-medium">Tokens Used</h3>
            </div>
            <p className="text-3xl font-bold">{formatNumber(185000)}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">Total usage</p>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 text-xs">Tier 1</Badge>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Saved Templates</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Your Prompt Projects</h2>
              <div className="flex items-center gap-2">
                {activeProjects.length > 0 && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={deleteSelectedProjects}
                    className="gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete ({activeProjects.length})
                  </Button>
                )}
                <Button variant="outline" size="sm" className="gap-1">
                  <Folder className="h-4 w-4" />
                  New Folder
                </Button>
                <Button 
                  size="sm" 
                  className="gap-1 bg-primary hover:bg-primary/90"
                  onClick={createNewProject}
                >
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              </div>
            </div>
            
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-lg">
                <Book className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4 max-w-md text-center">
                  Create your first project to start building AI prompts
                </p>
                <Button onClick={createNewProject} className="gap-2 bg-primary">
                  <Plus className="h-4 w-4" />
                  Create First Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <Card 
                    key={project.id} 
                    className={`group cursor-pointer transition-all duration-200 ${
                      activeProjects.includes(project.id) ? 'ring-2 ring-primary/70 shadow-lg' : ''
                    }`}
                    onClick={() => toggleProjectSelection(project.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle>{project.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStarred(project.id);
                          }}
                        >
                          <Star className={`h-4 w-4 ${project.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <div>
                          <Badge variant="outline" className="mr-2">
                            {project.blocks} Blocks
                          </Badge>
                        </div>
                        <div>Last modified: {project.lastModified}</div>
                      </div>
                      
                      {/* Project completion progress */}
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">Completion</span>
                          <span className="text-xs font-medium">{completionRate}%</span>
                        </div>
                        <Progress value={completionRate} className="h-1.5" />
                      </div>
                    </CardContent>
                    <CardFooter className="opacity-0 group-hover:opacity-100 transition-opacity pt-0">
                      <div className="w-full flex justify-between">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjects(projects.filter(p => p.id !== project.id));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}

                <Card 
                  className="border-dashed border-2 hover:border-primary/50 cursor-pointer transition-colors flex items-center justify-center h-[200px]"
                  onClick={createNewProject}
                >
                  <div className="text-center p-6">
                    <Plus className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium">Create New Project</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Start building a new prompt collection
                    </p>
                  </div>
                </Card>
              </div>
            )}
            
            {projects.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <Card>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {projects.slice(0, 5).map((project, index) => (
                        <li key={`activity-${index}`} className="flex items-start gap-3 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                          <div className="p-2 bg-primary/10 rounded-md">
                            {index % 3 === 0 ? (
                              <Edit className="h-4 w-4 text-primary" />
                            ) : index % 3 === 1 ? (
                              <Terminal className="h-4 w-4 text-accent" />
                            ) : (
                              <Zap className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {index % 3 === 0 ? 
                                `Updated project "${project.name}"` : 
                                index % 3 === 1 ? 
                                  `Generated a new prompt in "${project.name}"` : 
                                  `Exported prompt from "${project.name}"`
                              }
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {index === 0 ? "Just now" : 
                               index === 1 ? "2 hours ago" : 
                               index === 2 ? "Yesterday" : 
                               index === 3 ? "3 days ago" : "Last week"}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          {/* New Analytics tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Usage Analytics</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Last 7 Days</Button>
                <Button variant="outline" size="sm">Last 30 Days</Button>
                <Button variant="outline" size="sm">All Time</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prompt Activity</CardTitle>
                  <CardDescription>Prompt generation and responses over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2E39" />
                        <XAxis dataKey="date" stroke="#525969" />
                        <YAxis stroke="#525969" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1D1E2B', border: '1px solid #2A2E39' }}
                          itemStyle={{ color: '#E2E8F0' }}
                        />
                        <Line type="monotone" dataKey="prompts" stroke="#10B981" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="responses" stroke="#3B82F6" />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Token Usage</CardTitle>
                  <CardDescription>Daily token consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2E39" />
                        <XAxis dataKey="date" stroke="#525969" />
                        <YAxis stroke="#525969" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1D1E2B', border: '1px solid #2A2E39' }}
                          itemStyle={{ color: '#E2E8F0' }}
                        />
                        <Bar dataKey="tokens" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Model Usage</CardTitle>
                  <CardDescription>Distribution across different models</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={modelUsageData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {modelUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1D1E2B', border: '1px solid #2A2E39' }}
                          itemStyle={{ color: '#E2E8F0' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Block Types</CardTitle>
                  <CardDescription>Distribution of prompt block types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={blockTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {blockTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1D1E2B', border: '1px solid #2A2E39' }}
                          itemStyle={{ color: '#E2E8F0' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
                <CardDescription>Key insights about your prompt performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium">Response Quality</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Relevance</span>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Coherence</span>
                          <span className="text-sm font-medium">87%</span>
                        </div>
                        <Progress value={87} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Creativity</span>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                        <Progress value={75} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-accent/10 rounded-md">
                        <Terminal className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-medium">Prompt Effectiveness</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Clarity</span>
                          <span className="text-sm font-medium">94%</span>
                        </div>
                        <Progress value={94} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Specificity</span>
                          <span className="text-sm font-medium">82%</span>
                        </div>
                        <Progress value={82} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Context Quality</span>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-yellow-500/10 rounded-md">
                        <BarChart2 className="h-5 w-5 text-yellow-500" />
                      </div>
                      <h3 className="font-medium">Efficiency Metrics</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs mb-1">Avg. Tokens</p>
                          <p className="text-2xl font-bold">256</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs mb-1">Cost/Response</p>
                          <p className="text-2xl font-bold">$0.05</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs mb-1">Avg. Latency</p>
                          <p className="text-2xl font-bold">1.2s</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs mb-1">Success Rate</p>
                          <p className="text-2xl font-bold">98%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Saved Templates</h2>
              <div className="flex items-center gap-2">
                {activeTemplates.length > 0 && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={deleteSelectedTemplates}
                    className="gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete ({activeTemplates.length})
                  </Button>
                )}
                <Button size="sm" className="gap-1 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Create Template
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <Card 
                  key={template.id} 
                  className={`group cursor-pointer transition-all duration-200 ${
                    activeTemplates.includes(template.id) ? 'ring-2 ring-primary/70 shadow-lg' : ''
                  }`}
                  onClick={() => toggleTemplateSelection(template.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      Used {template.usageCount} times
                    </div>
                  </CardContent>
                  <CardFooter className="opacity-0 group-hover:opacity-100 transition-opacity pt-0">
                    <div className="w-full flex justify-between">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTemplates(templates.filter(t => t.id !== template.id));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}

              <Card className="border-dashed border-2 hover:border-primary/50 cursor-pointer transition-colors flex items-center justify-center h-[200px]">
                <div className="text-center p-6">
                  <Plus className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium">Create New Template</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Design a reusable prompt template
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-8">
            <h2 className="text-xl font-bold">Account Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="handle">Username</Label>
                  <Input id="handle" defaultValue={userProfile?.handle} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} disabled />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              </CardFooter>
            </Card>
            
            <DomainSettings />
            
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-primary hover:bg-primary/90">Update Password</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-destructive/20 rounded-md">
                  <h4 className="font-medium mb-2">Delete Account</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive">Delete My Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Label component for the settings page
const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium">
      {children}
    </label>
  );
};

export default UserDashboard;