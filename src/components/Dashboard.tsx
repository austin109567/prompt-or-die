import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PromptBuilder from "./PromptBuilder";
import TemplateGallery from "./TemplateGallery";
import { PromptBlockProps } from "./PromptBlock";
import { Card } from "./ui/card";
import { PenTool, Eye, ArrowRight, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("builder");
  const [loadedBlocks, setLoadedBlocks] = useState<PromptBlockProps[]>([]);

  const handleLoadTemplate = (blocks: PromptBlockProps[]) => {
    setLoadedBlocks(blocks);
    setActiveTab("builder");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border border-border/40 bg-card/50 backdrop-blur-sm p-6 rounded-xl shadow-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-md">
                {activeTab === "builder" ? (
                  <PenTool className="h-5 w-5 text-primary" />
                ) : (
                  <Eye className="h-5 w-5 text-accent" />
                )}
              </div>
              <h2 className="text-xl font-semibold">
                {activeTab === "builder" ? "Prompt Builder" : "Template Gallery"}
              </h2>
            </div>
            
            {!isAuthenticated && (
              <div className="hidden md:flex">
                <Button 
                  variant="outline" 
                  className="mr-4"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
                <Button 
                  className="group flex items-center gap-2 bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/auth?tab=register")}
                >
                  Join The Order
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50 p-1">
              <TabsTrigger 
                value="builder" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary data-[state=active]:text-primary-foreground rounded-md py-2.5"
              >
                Builder
              </TabsTrigger>
              <TabsTrigger 
                value="templates" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/80 data-[state=active]:to-accent data-[state=active]:text-accent-foreground rounded-md py-2.5"
              >
                Templates
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="builder" className="space-y-6 mt-4">
            <PromptBuilder initialBlocks={loadedBlocks} />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6 mt-4">
            <TemplateGallery onLoadTemplate={handleLoadTemplate} />
          </TabsContent>
        </Tabs>
        
        {!isAuthenticated && (
          <div className="mt-8 pt-6 border-t border-border/30">
            <div className="p-6 bg-primary/10 rounded-lg border border-primary/20 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="p-2 rounded-full bg-primary/20">
                  <Wand2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Unlock Full Potential</h3>
                  <p className="text-sm text-muted-foreground">Create an account to save and share your prompts</p>
                </div>
              </div>
              <Button 
                className="w-full md:w-auto bg-primary hover:bg-primary/90"
                onClick={() => navigate("/auth?tab=register")}
              >
                Create Free Account
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;