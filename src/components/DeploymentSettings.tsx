import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CloudCog as CloudCheck, Loader2, RefreshCw, Share2 } from "lucide-react";

const DeploymentSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [deployStatus, setDeployStatus] = useState<{
    status: "pending" | "deployed" | "error";
    url: string;
    lastDeployed: string;
  }>({
    status: "deployed",
    url: "https://promptordie-demo.netlify.app",
    lastDeployed: "2025-03-15T12:00:00Z"
  });
  
  const handleDeploy = () => {
    setIsLoading(true);
    
    // Simulate deployment process
    setTimeout(() => {
      setDeployStatus({
        status: "deployed",
        url: "https://promptordie-demo.netlify.app",
        lastDeployed: new Date().toISOString()
      });
      
      setIsLoading(false);
      toast({
        title: "Deployment successful!",
        description: "Your site is now live at the specified URL."
      });
    }, 3000);
  };
  
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment</CardTitle>
        <CardDescription>
          Deploy your prompt builder to the web
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="netlify">
          <TabsList>
            <TabsTrigger value="netlify">Netlify</TabsTrigger>
            <TabsTrigger value="vercel" disabled>Vercel (Coming Soon)</TabsTrigger>
            <TabsTrigger value="custom" disabled>Custom (Coming Soon)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="netlify" className="space-y-4 mt-4">
            <div className="p-4 bg-muted/50 rounded-md border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge 
                  className={
                    deployStatus.status === "deployed" ? "bg-green-500/20 text-green-500" :
                    deployStatus.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                    "bg-red-500/20 text-red-500"
                  }
                >
                  {deployStatus.status === "deployed" ? "Live" :
                   deployStatus.status === "pending" ? "Deploying" : "Failed"}
                </Badge>
                <div>
                  {deployStatus.status === "deployed" && (
                    <a 
                      href={deployStatus.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                    >
                      {deployStatus.url}
                    </a>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Last deployed: {formatDate(deployStatus.lastDeployed)}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  disabled={isLoading}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </Button>
                <Button 
                  size="sm" 
                  className="gap-1 bg-primary hover:bg-primary/90"
                  onClick={handleDeploy}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" />
                      Redeploy
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Deployment Settings</h3>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="p-3 border rounded-md">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Build Command</h4>
                  <code className="text-xs bg-muted p-1 rounded">npm run build</code>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Publish Directory</h4>
                  <code className="text-xs bg-muted p-1 rounded">dist</code>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Branch</h4>
                  <code className="text-xs bg-muted p-1 rounded">main</code>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Node Version</h4>
                  <code className="text-xs bg-muted p-1 rounded">18.x</code>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="gap-1">
          <CloudCheck className="h-4 w-4" />
          View Deployment Logs
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeploymentSettings;