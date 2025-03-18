
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DimensionInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
  unit?: string;
  readOnly?: boolean;
  helperText?: string;
}

export function DimensionInput({
  id,
  label,
  value,
  onChange,
  step = "0.001",
  unit = "mm",
  readOnly = false,
  helperText
}: DimensionInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-blue-800 dark:text-blue-400">
        {label} ({unit})
      </Label>
      <Input
        id={id}
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="border-blue-200 dark:border-blue-800/50"
        readOnly={readOnly}
      />
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
}
