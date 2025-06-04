import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Download, Heart, Search, Share2, Star } from "lucide-react";

interface PromptCard {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  likes: number;
  downloads: number;
  preview: string;
  isLiked: boolean;
}

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    "All", "Creative Writing", "Business", "Technical", "Academic", 
    "Marketing", "Data Analysis", "Design", "Chatbot"
  ];
  
  const promptCards: PromptCard[] = [
    {
      id: "1",
      title: "Expert Code Reviewer",
      description: "A comprehensive prompt for detailed code reviews with best practices and optimization suggestions.",
      author: "DevMaster",
      category: "Technical",
      tags: ["coding", "review", "development"],
      likes: 325,
      downloads: 742,
      preview: "Act as a senior software developer with expertise in multiple programming languages...",
      isLiked: false
    },
    {
      id: "2",
      title: "Marketing Copy Generator",
      description: "Create compelling marketing copy for products with persuasive language and calls to action.",
      author: "CopyPro",
      category: "Marketing",
      tags: ["copywriting", "advertising", "sales"],
      likes: 487,
      downloads: 1253,
      preview: "Write persuasive marketing copy that highlights the benefits and features...",
      isLiked: true
    },
    {
      id: "3",
      title: "Creative Story Writer",
      description: "Generate engaging short stories with rich characters and compelling narratives.",
      author: "StoryWeaver",
      category: "Creative Writing",
      tags: ["fiction", "storytelling", "narrative"],
      likes: 512,
      downloads: 934,
      preview: "Create a short story with vivid descriptions and memorable characters...",
      isLiked: false
    },
    {
      id: "4",
      title: "Data Insights Analyst",
      description: "Extract meaningful insights from data sets with statistical analysis and visualization suggestions.",
      author: "DataSage",
      category: "Data Analysis",
      tags: ["data", "analytics", "visualization"],
      likes: 298,
      downloads: 671,
      preview: "Analyze the provided data to identify key patterns, trends, and actionable insights...",
      isLiked: false
    },
    {
      id: "5",
      title: "Academic Research Assistant",
      description: "Structure and formulate academic research questions with proper methodology guidelines.",
      author: "ScholarAI",
      category: "Academic",
      tags: ["research", "education", "academic"],
      likes: 216,
      downloads: 583,
      preview: "Help structure an academic research paper following standard methodological approaches...",
      isLiked: true
    },
    {
      id: "6",
      title: "UX Design Critic",
      description: "Evaluate user interfaces and suggest improvements based on UX principles and heuristics.",
      author: "DesignMind",
      category: "Design",
      tags: ["ux", "design", "interfaces"],
      likes: 342,
      downloads: 687,
      preview: "Analyze this user interface design and provide constructive feedback based on...",
      isLiked: false
    }
  ];
  
  const [cards, setCards] = useState<PromptCard[]>(promptCards);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === "All" ? null : category);
  };
  
  const handleLike = (id: string) => {
    setCards(cards.map(card => 
      card.id === id 
        ? { ...card, isLiked: !card.isLiked, likes: card.isLiked ? card.likes - 1 : card.likes + 1 } 
        : card
    ));
  };
  
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || card.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold">Prompt Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover and use community-created prompt templates. Find inspiration or share your own creations with others.
          </p>
          
          <div className="flex items-center max-w-md mx-auto mt-8 relative">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search prompts..." 
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant={selectedCategory === category || (category === "All" && selectedCategory === null) ? "default" : "outline"}
              className="px-4 py-2 cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map(card => (
            <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border/50 hover:border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="bg-muted text-muted-foreground mb-2">
                    {card.category}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleLike(card.id)}
                  >
                    <Heart className={`h-4 w-4 ${card.isLiked ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded-md text-xs font-mono h-24 overflow-y-auto">
                  <pre>{card.preview}</pre>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {card.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-2 pb-4">
                <div className="text-xs text-muted-foreground">
                  By <span className="font-medium">{card.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Heart className="h-3 w-3 mr-1" />
                    {card.likes}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Download className="h-3 w-3 mr-1" />
                    {card.downloads}
                  </div>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredCards.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No prompts found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;