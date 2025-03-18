
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CoatingSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CoatingSelect({ value, onChange }: CoatingSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="coating" className="text-blue-800 dark:text-blue-400">Coating</Label>
      <Select
        value={value}
        onValueChange={onChange}
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
  );
}
