
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PromptBuilder from "./PromptBuilder";
import TemplateGallery from "./TemplateGallery";
import { PromptBlockProps } from "./PromptBlock";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("builder");
  const [loadedBlocks, setLoadedBlocks] = useState<PromptBlockProps[]>([]);

  const handleLoadTemplate = (blocks: PromptBlockProps[]) => {
    setLoadedBlocks(blocks);
    setActiveTab("builder");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="flex items-center justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted">
            <TabsTrigger value="builder" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Builder
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Templates
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="builder" className="space-y-6">
          <PromptBuilder initialBlocks={loadedBlocks} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <TemplateGallery onLoadTemplate={handleLoadTemplate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
