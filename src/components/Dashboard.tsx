import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PromptBuilder from "./PromptBuilder";
import TemplateGallery from "./TemplateGallery";
import { PromptBlockProps } from "./PromptBlock";
import { Card } from "./ui/card";

const Dashboard = () => {
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
      </Card>
    </div>
  );
};

export default Dashboard;