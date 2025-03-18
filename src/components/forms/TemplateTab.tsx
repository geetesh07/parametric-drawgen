
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export function TemplateTab() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <CardContent className="p-6">
      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="template" className="block text-blue-800 dark:text-blue-400">
              Template
            </Label>
            <Popover open={showInfo} onOpenChange={setShowInfo}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                  <Info className="h-4 w-4 text-blue-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Custom Templates</h4>
                  <p className="text-sm text-muted-foreground">
                    In a future update, you'll be able to upload your own custom drawing templates
                    and save tool configurations for quick reuse.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="border-2 border-dashed border-blue-200 dark:border-blue-800/30 rounded-lg p-8 text-center bg-blue-50/50 dark:bg-blue-900/10">
            <p className="text-muted-foreground">Custom template uploads will be available in a future update.</p>
          </div>
        </div>
      </div>
    </CardContent>
  );
}
