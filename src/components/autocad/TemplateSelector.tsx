import { useState, useEffect } from "react";
import { getTemplates } from "@/services/autocadService";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void;
  selectedTemplate: string | null;
}

export function TemplateSelector({ onTemplateSelect, selectedTemplate }: TemplateSelectorProps) {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<{id: string; name: string; description: string}[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoading(true);
        const templatesData = await getTemplates();
        setTemplates(templatesData);
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

    const apiKeysExist = localStorage.getItem("autocadApiKeys");
    if (apiKeysExist) {
      loadTemplates();
    } else {
      setLoading(false);
      setError("Please configure your AutoCAD API keys first");
    }
  }, [onTemplateSelect, selectedTemplate]);

  useEffect(() => {
    if (selectedTemplate) {
      localStorage.setItem("selectedTemplate", selectedTemplate);
    }
  }, [selectedTemplate]);

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

  if (error) {
    return (
      <Card className="w-full shadow-lg border-gradient">
        <CardContent className="p-6">
          <div className="text-center py-4 text-red-600">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-gradient">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-blue-800 dark:text-blue-400 text-lg">
              Drawing Templates
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                  <Info className="h-4 w-4 text-blue-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">AutoCAD Templates</h4>
                  <p className="text-sm text-muted-foreground">
                    These templates will be used with the AutoCAD API to generate technical drawings
                    based on your input parameters. Each template is configured for a specific type of tool.
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
        </div>
      </CardContent>
    </Card>
  );
}
