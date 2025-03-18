
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function TemplateTab() {
  return (
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
  );
}
