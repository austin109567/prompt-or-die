
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: number;
  useCase: string;
}

const templates: Template[] = [
  {
    id: 'memebot',
    name: 'MemeBot',
    description: 'Generate absurdist meme captions and viral content',
    category: 'Social',
    blocks: 4,
    useCase: 'Content Creation'
  },
  {
    id: 'solana-trader',
    name: 'Solana Trader',
    description: 'Hype-driven trade recommendations with chaos energy',
    category: 'Crypto',
    blocks: 5,
    useCase: 'Trading Signals'
  },
  {
    id: 'dao-explainer',
    name: 'DAO Explainer',
    description: 'Summarize governance proposals with context memory',
    category: 'Web3',
    blocks: 6,
    useCase: 'Governance'
  },
  {
    id: 'ghostwriter',
    name: 'Brand Ghostwriter',
    description: 'Consistent founder voice for tweets and threads',
    category: 'Marketing',
    blocks: 4,
    useCase: 'Brand Voice'
  },
  {
    id: 'educator',
    name: 'Tutor AI',
    description: 'Explain complex topics like teaching a 5-year-old',
    category: 'Education',
    blocks: 3,
    useCase: 'Learning'
  }
];

const TemplateGallery = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Template Gallery</h2>
        <p className="text-muted-foreground">Start with proven prompt patterns or build from scratch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="p-6 hover:border-primary/50 transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <Badge className="bg-muted text-muted-foreground">
                  {template.category}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {template.blocks} blocks
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {template.useCase}
                </Badge>
                <Button 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Use Template
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;
