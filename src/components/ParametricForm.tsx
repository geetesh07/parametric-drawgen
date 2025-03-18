
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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
  onGenerate: (params: ToolParameters) => void;
}

export function ParametricForm({ onGenerate }: ParametricFormProps) {
  const [parameters, setParameters] = useState<ToolParameters>({
    toolType: "endmill",
    overallLength: 109.10,
    shankLength: 56.10,
    fluteLength: 53,
    shankDiameter: 10.503,
    cuttingDiameter: 10.519,
    pointAngle: 140,
    coating: "TiAlN",
    backTaper: 0.063,
  });

  const handleChange = (name: keyof ToolParameters, value: string | number) => {
    setParameters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(parameters);
    toast.success("Drawing generated successfully");
  };

  return (
    <Card className="w-full shadow-lg border border-border/60">
      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parameters" className="space-y-4">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="toolType">Tool Type</Label>
                    <Select
                      value={parameters.toolType}
                      onValueChange={(value) => handleChange("toolType", value)}
                    >
                      <SelectTrigger id="toolType">
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
                    <Label htmlFor="coating">Coating</Label>
                    <Select
                      value={parameters.coating}
                      onValueChange={(value) => handleChange("coating", value)}
                    >
                      <SelectTrigger id="coating">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="overallLength">Overall Length (mm)</Label>
                    <Input
                      id="overallLength"
                      type="number"
                      step="0.001"
                      value={parameters.overallLength}
                      onChange={(e) => handleChange("overallLength", parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shankLength">Shank Length (mm)</Label>
                    <Input
                      id="shankLength"
                      type="number"
                      step="0.001"
                      value={parameters.shankLength}
                      onChange={(e) => handleChange("shankLength", parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fluteLength">Flute Length (mm)</Label>
                    <Input
                      id="fluteLength"
                      type="number"
                      step="0.001"
                      value={parameters.fluteLength}
                      onChange={(e) => handleChange("fluteLength", parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shankDiameter">Shank Diameter (mm)</Label>
                    <Input
                      id="shankDiameter"
                      type="number"
                      step="0.001"
                      value={parameters.shankDiameter}
                      onChange={(e) => handleChange("shankDiameter", parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cuttingDiameter">Cutting Diameter (mm)</Label>
                    <Input
                      id="cuttingDiameter"
                      type="number"
                      step="0.001"
                      value={parameters.cuttingDiameter}
                      onChange={(e) => handleChange("cuttingDiameter", parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pointAngle">Point Angle (degrees)</Label>
                    <Input
                      id="pointAngle"
                      type="number"
                      step="0.1"
                      value={parameters.pointAngle}
                      onChange={(e) => handleChange("pointAngle", parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backTaper">Back Taper (mm)</Label>
                    <Input
                      id="backTaper"
                      type="number"
                      step="0.001"
                      value={parameters.backTaper}
                      onChange={(e) => handleChange("backTaper", parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">Generate Drawing</Button>
            </form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="template" className="space-y-4">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="template" className="block mb-2">Template (Coming Soon)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
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
