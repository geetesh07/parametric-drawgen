
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParametersTab } from "../forms/ParametersTab";
import { TemplateSelector } from "../autocad/TemplateSelector";

export type ToolParameters = {
  toolType: string;
  overallLength: number;
  shankLength: number;
  fluteLength: number;
  shankDiameter: number;
  cuttingDiameter: number;
  pointAngle: number;
  coating: string;
  backTaper: number;
};

interface ParametricFormProps {
  parameters: ToolParameters;
  onParametersChange: (params: ToolParameters) => void;
  selectedTemplate: string | null;
  onTemplateSelect: (templateId: string) => void;
}

export function ParametricForm({ 
  parameters, 
  onParametersChange, 
  selectedTemplate,
  onTemplateSelect 
}: ParametricFormProps) {
  const handleChange = (name: keyof ToolParameters, value: string | number) => {
    onParametersChange({
      ...parameters,
      [name]: value,
    });
  };

  // Ensure flute + shank length = overall length
  useEffect(() => {
    const calculatedOverallLength = parameters.shankLength + parameters.fluteLength;
    if (Math.abs(calculatedOverallLength - parameters.overallLength) > 0.01) {
      onParametersChange({
        ...parameters,
        overallLength: calculatedOverallLength,
      });
    }
  }, [parameters.shankLength, parameters.fluteLength, parameters.overallLength, onParametersChange]);

  return (
    <Card className="w-full shadow-lg border-gradient">
      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="template">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parameters" className="space-y-4">
          <ParametersTab 
            parameters={parameters}
            onParameterChange={handleChange}
          />
        </TabsContent>
        
        <TabsContent value="template" className="space-y-4">
          <TemplateSelector 
            onTemplateSelect={onTemplateSelect}
            selectedTemplate={selectedTemplate}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
