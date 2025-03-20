
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadTemplate } from "@/services/autocadService";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

export function TemplateUploader({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!templateName.trim()) {
      toast.error("Please provide a template name");
      return;
    }

    if (!templateContent.trim()) {
      toast.error("Template content cannot be empty");
      return;
    }

    try {
      setIsUploading(true);
      const templateId = await uploadTemplate({
        name: templateName,
        description: templateDescription,
        content: templateContent
      });

      if (templateId) {
        toast.success("Template uploaded successfully");
        setTemplateName("");
        setTemplateDescription("");
        setTemplateContent("");
        onUploadComplete();
      } else {
        toast.error("Failed to upload template");
      }
    } catch (error) {
      console.error("Error uploading template:", error);
      toast.error("An error occurred while uploading the template");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="templateName">Template Name</Label>
        <Input
          id="templateName"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="e.g., Custom End Mill"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="templateDescription">Description</Label>
        <Input
          id="templateDescription"
          value={templateDescription}
          onChange={(e) => setTemplateDescription(e.target.value)}
          placeholder="e.g., Template for custom end mill tools"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="templateContent">Template Content (SVG or AutoCAD XML)</Label>
        <Textarea
          id="templateContent"
          value={templateContent}
          onChange={(e) => setTemplateContent(e.target.value)}
          placeholder="Paste your SVG or AutoCAD XML content here"
          className="min-h-32 font-mono text-sm"
        />
      </div>

      <Button 
        onClick={handleUpload} 
        className="w-full" 
        disabled={isUploading}
      >
        <UploadCloud className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload Template"}
      </Button>
    </div>
  );
}
