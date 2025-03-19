
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key, Save, Lock } from "lucide-react";
import { toast } from "sonner";

interface AutocadApiKeys {
  clientId: string;
  clientSecret: string;
}

export function ApiKeyForm() {
  // Load keys from localStorage if they exist
  const [keys, setKeys] = useState<AutocadApiKeys>(() => {
    const savedKeys = localStorage.getItem("autocadApiKeys");
    return savedKeys ? JSON.parse(savedKeys) : {
      clientId: "",
      clientSecret: ""
    };
  });
  
  const [isStored, setIsStored] = useState<boolean>(
    !!localStorage.getItem("autocadApiKeys")
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeys((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveApiKeys = () => {
    // Validate that both fields are filled
    if (!keys.clientId || !keys.clientSecret) {
      toast.error("Please provide both Client ID and Client Secret");
      return;
    }

    // Save to localStorage
    localStorage.setItem("autocadApiKeys", JSON.stringify(keys));
    setIsStored(true);
    toast.success("API keys saved successfully");
  };

  const clearApiKeys = () => {
    localStorage.removeItem("autocadApiKeys");
    setKeys({ clientId: "", clientSecret: "" });
    setIsStored(false);
    toast.info("API keys cleared");
  };

  return (
    <Card className="w-full shadow-lg border-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-600" />
          AutoCAD API Configuration
        </CardTitle>
        <CardDescription>
          Enter your Autodesk APS (formerly Forge) API credentials for drawing generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientId" className="text-blue-800 dark:text-blue-400">
            Client ID
          </Label>
          <Input
            id="clientId"
            name="clientId"
            value={keys.clientId}
            onChange={handleInputChange}
            className="border-blue-200 dark:border-blue-800/50"
            placeholder="Enter your APS Client ID"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientSecret" className="text-blue-800 dark:text-blue-400">
            Client Secret
          </Label>
          <Input
            id="clientSecret"
            name="clientSecret"
            type="password"
            value={keys.clientSecret}
            onChange={handleInputChange}
            className="border-blue-200 dark:border-blue-800/50"
            placeholder="Enter your APS Client Secret"
          />
          <p className="text-xs text-muted-foreground">
            Your credentials are stored locally in your browser and never transmitted to our servers.
          </p>
        </div>

        {isStored && (
          <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-md border border-green-200 dark:border-green-800/30 flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400">
              API keys are stored in your browser
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={clearApiKeys} disabled={!isStored}>
          Clear Keys
        </Button>
        <Button onClick={saveApiKeys} className="gap-1">
          <Save className="h-4 w-4" />
          Save Keys
        </Button>
      </CardFooter>
    </Card>
  );
}
