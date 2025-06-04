import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Folder, Plus, Share, Star, Trash2 } from "lucide-react";
import DomainSettings from "@/components/DomainSettings";
import { Input } from "@/components/ui/input";

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
  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "",
    initials: "AJ",
    joinDate: "March 2025"
  };
  
  // Mock projects
  const [projects, setProjects] = useState<PromptProject[]>([
    {
      id: "1",
      name: "Content Marketing Suite",
      description: "A collection of prompts for blog posts, social media, and email marketing",
      blocks: 12,
      lastModified: "2 hours ago",
      isStarred: true
    },
    {
      id: "2",
      name: "Developer Assistant",
      description: "Code review, documentation, and debugging prompts",
      blocks: 8,
      lastModified: "Yesterday",
      isStarred: false
    },
    {
      id: "3",
      name: "Creative Writing",
      description: "Story generation and character development prompts",
      blocks: 15,
      lastModified: "3 days ago",
      isStarred: true
    },
    {
      id: "4",
      name: "Data Analysis Helper",
      description: "Prompts for analyzing datasets and creating visualizations",
      blocks: 6,
      lastModified: "1 week ago",
      isStarred: false
    },
  ]);
  
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
  
  // State for active projects and templates
  const [activeProjects, setActiveProjects] = useState<string[]>([]);
  const [activeTemplates, setActiveTemplates] = useState<string[]>([]);
  
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
  const deleteSelectedProjects = () => {
    setProjects(projects.filter(project => !activeProjects.includes(project.id)));
    setActiveProjects([]);
  };
  
  // Delete selected templates
  const deleteSelectedTemplates = () => {
    setTemplates(templates.filter(template => !activeTemplates.includes(template.id)));
    setActiveTemplates([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-lg">{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">Member since {user.joinDate}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
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
                <Button size="sm" className="gap-1 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              </div>
            </div>
            
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
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div>
                        <Badge variant="outline" className="mr-2">
                          {project.blocks} Blocks
                        </Badge>
                      </div>
                      <div>Last modified: {project.lastModified}</div>
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

              <Card className="border-dashed border-2 hover:border-primary/50 cursor-pointer transition-colors flex items-center justify-center h-[200px]">
                <div className="text-center p-6">
                  <Plus className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium">Create New Project</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Start building a new prompt collection
                  </p>
                </div>
              </Card>
            </div>
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
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
            
            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Manage your API keys for integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-md font-mono text-sm">
                  sk_live_promptordie_xxxxxxxxxxxxxxxxxxxxxxxx
                </div>
                <div className="flex gap-4">
                  <Button variant="outline">Regenerate Key</Button>
                  <Button variant="outline">Copy Key</Button>
                </div>
              </CardContent>
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