
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type ToolParameters } from "../parametric-form/ParametricForm";

interface ToolTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ToolTypeSelect({ value, onChange }: ToolTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="toolType" className="text-blue-800 dark:text-blue-400">Tool Type</Label>
      <Select
        value={value}
        onValueChange={onChange}
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
  );
}
