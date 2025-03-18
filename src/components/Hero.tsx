
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-background"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] max-h-[800px] rounded-full blur-3xl bg-accent/10 animate-float"></div>
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-background/50 backdrop-blur-sm">
            <span className="text-xs font-medium text-foreground/80">Precision Engineering Tools</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight">
            <span className="text-gradient">Parametric Manufacturing</span>
            <br /> Drawing Generator
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl">
            Generate precision manufacturing drawings with customizable parameters
            for your tools. Fast, accurate, and production-ready.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link to="/generator">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
