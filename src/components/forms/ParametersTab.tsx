
import { CardContent } from "@/components/ui/card";
import { ToolTypeSelect } from "./ToolTypeSelect";
import { CoatingSelect } from "./CoatingSelect";
import { DimensionInput } from "./DimensionInput";
import { type ToolParameters } from "../parametric-form/ParametricForm";

interface ParametersTabProps {
  parameters: ToolParameters;
  onParameterChange: (name: keyof ToolParameters, value: string | number) => void;
}

export function ParametersTab({ parameters, onParameterChange }: ParametersTabProps) {
  return (
    <CardContent className="p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToolTypeSelect 
            value={parameters.toolType} 
            onChange={(value) => onParameterChange("toolType", value)} 
          />
          
          <CoatingSelect 
            value={parameters.coating} 
            onChange={(value) => onParameterChange("coating", value)} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DimensionInput
            id="overallLength"
            label="Overall Length"
            value={parameters.overallLength}
            onChange={(value) => onParameterChange("overallLength", value)}
            readOnly
            helperText="Calculated from shank + flute"
          />
          
          <DimensionInput
            id="shankLength"
            label="Shank Length"
            value={parameters.shankLength}
            onChange={(value) => onParameterChange("shankLength", value)}
          />
          
          <DimensionInput
            id="fluteLength"
            label="Flute Length"
            value={parameters.fluteLength}
            onChange={(value) => onParameterChange("fluteLength", value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DimensionInput
            id="shankDiameter"
            label="Shank Diameter"
            value={parameters.shankDiameter}
            onChange={(value) => onParameterChange("shankDiameter", value)}
          />
          
          <DimensionInput
            id="cuttingDiameter"
            label="Cutting Diameter"
            value={parameters.cuttingDiameter}
            onChange={(value) => onParameterChange("cuttingDiameter", value)}
          />
          
          <DimensionInput
            id="pointAngle"
            label="Point Angle"
            value={parameters.pointAngle}
            onChange={(value) => onParameterChange("pointAngle", value)}
            unit="degrees"
            step="0.1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DimensionInput
            id="backTaper"
            label="Back Taper"
            value={parameters.backTaper}
            onChange={(value) => onParameterChange("backTaper", value)}
          />
        </div>
      </div>
    </CardContent>
  );
}
