
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
}

export function ParametricForm({ parameters, onParametersChange }: ParametricFormProps) {
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
  }, [parameters.shankLength, parameters.fluteLength]);

  return (
    <Card className="w-full shadow-lg border-gradient">
      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parameters" className="space-y-4">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="toolType" className="text-blue-800 dark:text-blue-400">Tool Type</Label>
                  <Select
                    value={parameters.toolType}
                    onValueChange={(value) => handleChange("toolType", value)}
                  >
                    <SelectTrigger id="toolType" className="border-blue-200 dark:border-blue-800/50">
                      <SelectValue placeholder="Select tool type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="endmill">Endmill</SelectItem>
                      <SelectItem value="drill">Drill</SelectItem>
                      <SelectItem value="reamer">Reamer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coating" className="text-blue-800 dark:text-blue-400">Coating</Label>
                  <Select
                    value={parameters.coating}
                    onValueChange={(value) => handleChange("coating", value)}
                  >
                    <SelectTrigger id="coating" className="border-blue-200 dark:border-blue-800/50">
                      <SelectValue placeholder="Select coating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TiAlN">TiAlN</SelectItem>
                      <SelectItem value="TiN">TiN</SelectItem>
                      <SelectItem value="AlTiN">AlTiN</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="overallLength" className="text-blue-800 dark:text-blue-400">
                    Overall Length (mm)
                  </Label>
                  <Input
                    id="overallLength"
                    type="number"
                    step="0.001"
                    value={parameters.overallLength}
                    onChange={(e) => handleChange("overallLength", parseFloat(e.target.value))}
                    className="border-blue-200 dark:border-blue-800/50"
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground">Calculated from shank + flute</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shankLength" className="text-blue-800 dark:text-blue-400">
                    Shank Length (mm)
                  </Label>
                  <Input
                    id="shankLength"
                    type="number"
                    step="0.001"
                    value={parameters.shankLength}
                    onChange={(e) => handleChange("shankLength", parseFloat(e.target.value))}
                    className="border-blue-200 dark:border-blue-800/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fluteLength" className="text-blue-800 dark:text-blue-400">
                    Flute Length (mm)
                  </Label>
                  <Input
                    id="fluteLength"
                    type="number"
                    step="0.001"
                    value={parameters.fluteLength}
                    onChange={(e) => handleChange("fluteLength", parseFloat(e.target.value))}
                    className="border-blue-200 dark:border-blue-800/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shankDiameter" className="text-blue-800 dark:text-blue-400">
                    Shank Diameter (mm)
                  </Label>
                  <Input
                    id="shankDiameter"
                    type="number"
                    step="0.001"
                    value={parameters.shankDiameter}
                    onChange={(e) => handleChange("shankDiameter", parseFloat(e.target.value))}
                    className="border-blue-200 dark:border-blue-800/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cuttingDiameter" className="text-blue-800 dark:text-blue-400">
                    Cutting Diameter (mm)
                  </Label>
                  <Input
                    id="cuttingDiameter"
                    type="number"
                    step="0.001"
                    value={parameters.cuttingDiameter}
                    onChange={(e) => handleChange("cuttingDiameter", parseFloat(e.target.value))}
                    className="border-blue-200 dark:border-blue-800/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pointAngle" className="text-blue-800 dark:text-blue-400">
                    Point Angle (degrees)
                  </Label>
                  <Input
                    id="pointAngle"
                    type="number"
                    step="0.1"
                    value={parameters.pointAngle}
                    onChange={(e) => handleChange("pointAngle", parseFloat(e.target.value))}
                    className="border-blue-200 dark:border-blue-800/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backTaper" className="text-blue-800 dark:text-blue-400">
                    Back Taper (mm)
                  </Label>
                  <Input
                    id="backTaper"
                    type="number"
                    step="0.001"
                    value={parameters.backTaper}
                    onChange={(e) => handleChange("backTaper", parseFloat(e.target.value))}
                    className="border-blue-200 dark:border-blue-800/50"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="template" className="space-y-4">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="template" className="block mb-2 text-blue-800 dark:text-blue-400">Template (Coming Soon)</Label>
                <div className="border-2 border-dashed border-blue-200 dark:border-blue-800/30 rounded-lg p-8 text-center bg-blue-50/50 dark:bg-blue-900/10">
                  <p className="text-muted-foreground">Custom template uploads will be available in a future update.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
