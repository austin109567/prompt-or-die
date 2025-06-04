import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { templates } from "./TemplateLoader";
import { Input } from "./ui/input";
import { useState } from "react";

interface TemplateGalleryProps {
  onLoadTemplate?: (templateBlocks: any[]) => void;
}

const TemplateGallery = ({ onLoadTemplate }: TemplateGalleryProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [...new Set(templates.map(t => t.category))];
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !activeCategory || template.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: any) => {
    if (onLoadTemplate) {
      onLoadTemplate(template.blocks);
      toast({
        title: "Template loaded!",
        description: `${template.name} template has been loaded into your builder.`
      });
    } else {
      toast({
        title: "Template ready",
        description: `${template.name} template selected. Switch to Builder tab to see it.`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold">Template Gallery</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Start with proven prompt patterns or build from scratch
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <Badge 
          variant={activeCategory === null ? "default" : "outline"}
          className="px-3 py-1 cursor-pointer"
          onClick={() => setActiveCategory(null)}
        >
          All
        </Badge>
        {categories.map(category => (
          <Badge
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className="px-3 py-1 cursor-pointer"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="group overflow-hidden border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,128,0.1)]"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-shift" />
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <Badge className="bg-muted/70 text-muted-foreground border border-border/50 hover:bg-muted">
                  {template.category}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {template.blocks.length} blocks
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{template.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
              </div>
              
              <div className="pt-2">
                <Badge variant="outline" className="text-xs border-border/50">
                  {template.useCase}
                </Badge>
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-opacity"
                  onClick={() => handleUseTemplate(template)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredTemplates.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search query or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;