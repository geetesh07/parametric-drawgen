
import { CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export function TemplateTab() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("templates");

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    localStorage.setItem("selectedTemplate", templateId);
  };

  return (
    <CardContent className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 w-full mb-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["template-endmill", "template-drill", "template-reamer"].map((templateId) => (
              <div 
                key={templateId}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === templateId 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                    : "border-gray-200 hover:border-blue-300 dark:border-gray-700"
                }`}
                onClick={() => handleTemplateSelect(templateId)}
              >
                <h3 className="text-sm font-medium mb-2">
                  {templateId.replace("template-", "").charAt(0).toUpperCase() + 
                   templateId.replace("template-", "").slice(1)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Standard technical drawing template for {templateId.replace("template-", "")} tools
                </p>
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
