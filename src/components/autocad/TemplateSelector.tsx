
import { useState, useEffect } from "react";
import { getTemplates } from "@/services/autocadService";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Info, Plus, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateUploader } from "./TemplateUploader";

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void;
  selectedTemplate: string | null;
}

export function TemplateSelector({ onTemplateSelect, selectedTemplate }: TemplateSelectorProps) {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<{id: string; name: string; description: string}[]>([]);
  const [customTemplates, setCustomTemplates] = useState<{id: string; name: string; description: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("builtin");

  const loadCustomTemplates = () => {
    const templatesString = localStorage.getItem("customTemplates");
    if (templatesString) {
      try {
        const parsedTemplates = JSON.parse(templatesString);
        setCustomTemplates(parsedTemplates);
      } catch (e) {
        console.error("Error parsing custom templates:", e);
        setCustomTemplates([]);
      }
    }
  };

  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoading(true);
        const templatesData = await getTemplates();
        setTemplates(templatesData);
        
        // Load custom templates
        loadCustomTemplates();
        
        // Select the first template by default if none is selected
        if (!selectedTemplate && templatesData.length > 0) {
          onTemplateSelect(templatesData[0].id);
        }
      } catch (err) {
        setError("Failed to load templates. Please check your API keys.");
      } finally {
        setLoading(false);
      }
    }

    loadTemplates();
  }, [onTemplateSelect, selectedTemplate]);

  useEffect(() => {
    if (selectedTemplate) {
      localStorage.setItem("selectedTemplate", selectedTemplate);
    }
  }, [selectedTemplate]);

  const handleTemplateUploadComplete = () => {
    loadCustomTemplates();
    setActiveTab("custom");
  };

  if (loading) {
    return (
      <Card className="w-full shadow-lg border-gradient">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-64" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !localStorage.getItem("autocadApiKeys")) {
    return (
      <Card className="w-full shadow-lg border-gradient">
        <CardContent className="p-6">
          <div className="text-center py-4 text-amber-600">
            <p>Using demo API keys. For real AutoCAD integration, configure your API keys.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-gradient">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="builtin">Built-in</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="builtin" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-blue-800 dark:text-blue-400 text-lg">
                Built-in Templates
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <Info className="h-4 w-4 text-blue-600" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Built-in Templates</h4>
                    <p className="text-sm text-muted-foreground">
                      These are pre-defined templates that come with the application.
                      Select one of these for standard tool types.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <ScrollArea className="h-64 rounded-md border p-4">
              <RadioGroup
                value={selectedTemplate || ""}
                onValueChange={onTemplateSelect}
                className="space-y-4"
              >
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-slate-50 dark:hover:bg-slate-900/20"
                  >
                    <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor={template.id} className="text-base font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        {template.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-blue-800 dark:text-blue-400 text-lg">
                Custom Templates
              </Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab("upload")}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>

            {customTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border rounded-md p-4 bg-slate-50 dark:bg-slate-900/20">
                <Upload className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-center text-muted-foreground">No custom templates yet</p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("upload")} 
                  className="mt-4 gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Create Template
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-64 rounded-md border p-4">
                <RadioGroup
                  value={selectedTemplate || ""}
                  onValueChange={onTemplateSelect}
                  className="space-y-4"
                >
                  {customTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-slate-50 dark:hover:bg-slate-900/20"
                    >
                      <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                      <div className="space-y-1">
                        <Label htmlFor={template.id} className="text-base font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          {template.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <TemplateUploader onUploadComplete={handleTemplateUploadComplete} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
