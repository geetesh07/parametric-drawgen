
import { CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ApiKeyForm } from "@/components/autocad/ApiKeyForm";
import { TemplateSelector } from "@/components/autocad/TemplateSelector";

export function TemplateTab() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("settings");

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  return (
    <CardContent className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="settings">API Settings</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4">
          <ApiKeyForm />
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">About AutoCAD Integration</h3>
            <p className="text-sm text-muted-foreground">
              The Autodesk APS (formerly Forge) integration allows you to generate professional-grade 
              CAD drawings based on your tool parameters. Enter your API credentials to get started.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <TemplateSelector 
            onTemplateSelect={handleTemplateSelect}
            selectedTemplate={selectedTemplate}
          />
          
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
