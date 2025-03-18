
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Settings, Zap, Layers, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/40">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground">
                Our parametric drawing generator offers a suite of features designed for precision and efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Settings className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Parametric Input</CardTitle>
                  <CardDescription>
                    Customize every aspect of your tool specifications with precise control.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      <span>Multiple tool type support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      <span>Precise dimensional inputs</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      <span>Material and coating options</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Pencil className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Drawing Generation</CardTitle>
                  <CardDescription>
                    Create production-ready technical drawings based on your specifications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      <span>Accurate dimensional representation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      <span>Industry-standard formatting</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      <span>Easy export options</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Efficiency & Speed</CardTitle>
                  <CardDescription>
                    Save time with our streamlined drawing generation process.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      <span>Instant drawing updates</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      <span>Template reusability</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      <span>Batch processing (coming soon)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tool Types Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Supported Tool Types</h2>
              <p className="text-muted-foreground">
                Generate precise drawings for various cutting tool types with our parametric system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-md text-center">
                <div className="h-40 flex items-center justify-center mb-4">
                  <svg className="h-32 w-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="30" width="60" height="10" fill="currentColor" className="text-primary/20" />
                    <path d="M20 40L20 60L30 70L70 70L80 60L80 40L20 40Z" fill="currentColor" className="text-primary/40" />
                    <path d="M30 70L30 80L70 80L70 70L30 70Z" fill="currentColor" className="text-primary/20" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Endmills</h3>
                <p className="text-muted-foreground">
                  Generate drawings for various endmill types with precise flute and shank specifications.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md text-center">
                <div className="h-40 flex items-center justify-center mb-4">
                  <svg className="h-32 w-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="60" height="10" fill="currentColor" className="text-primary/20" />
                    <path d="M20 30L20 70L40 70L80 50L80 30L20 30Z" fill="currentColor" className="text-primary/40" />
                    <path d="M40 70L80 50" stroke="currentColor" strokeWidth="2" className="text-primary/60" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Drills</h3>
                <p className="text-muted-foreground">
                  Create detailed drill bit drawings with point angle and flute specifications.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md text-center">
                <div className="h-40 flex items-center justify-center mb-4">
                  <svg className="h-32 w-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="30" width="60" height="10" fill="currentColor" className="text-primary/20" />
                    <path d="M20 40L20 60L30 60L70 60L80 60L80 40L20 40Z" fill="currentColor" className="text-primary/40" />
                    <path d="M75 60L85 50L85 40L75 40" stroke="currentColor" strokeWidth="2" className="text-primary/60" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Reamers</h3>
                <p className="text-muted-foreground">
                  Generate precision reamer drawings with accurate cutting edge and taper details.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container">
            <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      Ready to create production-ready drawings?
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Start using our parametric drawing generator today and streamline your manufacturing documentation process.
                    </p>
                    <Button asChild size="lg" className="rounded-full px-6">
                      <Link to="/generator">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="flex-1 max-w-xs">
                    <div className="bg-white p-4 rounded-lg shadow-lg rotate-2">
                      <img 
                        src="/lovable-uploads/6f232b14-6cdb-4247-a856-ab6a9b811fda.png"
                        alt="Tool drawing example" 
                        className="w-full h-auto rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
