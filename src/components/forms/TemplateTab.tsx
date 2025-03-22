
import { CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export function TemplateTab() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("templates");

  // Load saved template from localStorage on initial render
  useEffect(() => {
    const savedTemplate = localStorage.getItem("selectedTemplate");
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    localStorage.setItem("selectedTemplate", templateId);
  };

  // Template data with visual information
  const templates = [
    {
      id: "template-endmill",
      name: "Endmill",
      description: "High-performance solid carbide endmill",
      features: ["4-flute design", "Square end", "Standard helix"],
      imagePath: "/placeholder.svg"
    },
    {
      id: "template-drill",
      name: "Drill",
      description: "Precision solid carbide drill bit",
      features: ["135° point angle", "2-flute design", "Straight shank"],
      imagePath: "/placeholder.svg"
    },
    {
      id: "template-reamer",
      name: "Reamer",
      description: "Finishing reamer for precision holes",
      features: ["Multi-flute design", "Straight flutes", "Chamfered entry"],
      imagePath: "/placeholder.svg"
    }
  ];

  return (
    <CardContent className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 w-full mb-4">
          <TabsTrigger value="templates">Tool Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div 
                key={template.id}
                className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${
                  selectedTemplate === template.id 
                    ? "border-blue-500 ring-2 ring-blue-500/30" 
                    : "border-gray-200 hover:border-blue-300 dark:border-gray-700"
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                {/* Image Section */}
                <div className="aspect-[4/3] relative bg-muted/30 flex items-center justify-center">
                  <img 
                    src={template.imagePath} 
                    alt={template.name} 
                    className="h-full w-full object-contain p-2"
                  />
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="primary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Selected
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="p-4">
                  <h3 className="text-base font-semibold mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  
                  <div className="space-y-1">
                    {template.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">How Templates Work</h3>
            <p className="text-sm text-muted-foreground">
              Templates define the basic layout and appearance of your technical drawings.
              Select a template that matches your tool type for best results.
              The parameters you specify will be applied to the template to generate your drawing.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>
  );
}
