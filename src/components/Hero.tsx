import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,128,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 -left-60 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 -right-60 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-pulse" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="space-y-6 text-center max-w-4xl">
          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/60 border border-primary/30 backdrop-blur-sm mb-4">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">Visual AI Prompt Builder</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter">
            Design prompts like
            <div className="relative inline-block mt-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-shift">
                design systems
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl opacity-50 bg-[length:200%_auto] animate-gradient-shift"></span>
            </div>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Build modular AI prompts with drag-and-drop blocks. Preview in real-time. Export to any agent framework.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="group bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 text-lg h-auto glow-effect"
              asChild
            >
              <Link to="/auth?tab=register">
                Start Building
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              asChild
              className="border-primary/30 text-primary hover:bg-primary/10 px-6 py-6 text-lg h-auto group"
            >
              <Link to="/gallery">
                <Code className="h-5 w-5 mr-2 group-hover:rotate-3 transition-transform" />
                Explore Templates
              </Link>
            </Button>
          </div>
          
          {/* Features preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="feature-card group cursor-pointer">
              <div className="rounded-xl border border-primary/20 bg-secondary/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/50 hover:bg-secondary/60 hover:shadow-[0_0_20px_rgba(0,255,128,0.2)]">
                <div className="flex flex-col items-start">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">Modular Blocks</h3>
                  <p className="text-sm text-muted-foreground">
                    Compose prompts from Intent, Tone, Format, Context, and Persona atoms for maximum reusability.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="feature-card group cursor-pointer">
              <div className="rounded-xl border border-accent/20 bg-secondary/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-accent/50 hover:bg-secondary/60 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                <div className="flex flex-col items-start">
                  <div className="h-10 w-10 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-accent transition-colors">Live Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    See AI responses in real-time with our embedded AI preview tool and OpenAI integration.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="feature-card group cursor-pointer">
              <div className="rounded-xl border border-yellow-500/20 bg-secondary/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-yellow-500/50 hover:bg-secondary/60 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <div className="flex flex-col items-start">
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Code className="h-5 w-5 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-yellow-500 transition-colors">Export Anywhere</h3>
                  <p className="text-sm text-muted-foreground">
                    Output to any format: OpenAI API, raw text, JSON, or as a sharable link.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;