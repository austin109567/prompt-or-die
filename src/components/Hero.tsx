
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDown, Play } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.1),transparent_50%)]" />
      
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Design prompts like
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              design systems
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Build modular AI prompts with drag-and-drop blocks. Preview in real-time. Export to any agent framework.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
            <Play className="h-5 w-5 mr-2" />
            Start Building
          </Button>
          <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 px-8 py-3">
            View Templates
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card className="p-6 bg-card/50 backdrop-blur border-primary/20">
            <div className="space-y-2">
              <h3 className="font-bold text-primary">Modular Blocks</h3>
              <p className="text-sm text-muted-foreground">
                Compose prompts from Intent, Tone, Format, and Context atoms
              </p>
            </div>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur border-accent/20">
            <div className="space-y-2">
              <h3 className="font-bold text-accent">Live Preview</h3>
              <p className="text-sm text-muted-foreground">
                See AI responses in real-time via Bolt SDK integration
              </p>
            </div>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur border-yellow-500/20">
            <div className="space-y-2">
              <h3 className="font-bold text-yellow-500">Export Anywhere</h3>
              <p className="text-sm text-muted-foreground">
                Output to ElizaOS, JSON configs, or raw prompts
              </p>
            </div>
          </Card>
        </div>

        <div className="flex justify-center mt-12">
          <ArrowDown className="h-6 w-6 text-muted-foreground animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
