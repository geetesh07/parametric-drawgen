
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadTemplate } from "@/services/autocadService";
import { toast } from "sonner";
import { UploadCloud, FileUp } from "lucide-react";

export function TemplateUploader({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Auto-fill name from filename if empty
      if (!templateName) {
        setTemplateName(file.name.split('.')[0]);
      }
      
      // For DWG/DWT files, we'll store a reference to the file
      // and handle the content differently
      if (file.name.endsWith('.dwg') || file.name.endsWith('.dwt')) {
        // We'll read the file as binary data for DWG/DWT files
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            // Store a base64 representation of the binary data
            const base64Content = btoa(
              new Uint8Array(event.target.result as ArrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            setTemplateContent(`data:application/octet-stream;base64,${base64Content}`);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // For SVG or XML, read as text
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            setTemplateContent(event.target.result as string);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!templateName.trim()) {
      toast.error("Please provide a template name");
      return;
    }

    if (!selectedFile && !templateContent.trim()) {
      toast.error("Please select a template file or provide template content");
      return;
    }

    try {
      setIsUploading(true);
      const templateId = await uploadTemplate({
        name: templateName,
        description: templateDescription,
        content: templateContent,
        fileType: selectedFile ? selectedFile.name.split('.').pop()?.toLowerCase() || 'svg' : 'svg'
      });

      if (templateId) {
        toast.success("Template uploaded successfully");
        setTemplateName("");
        setTemplateDescription("");
        setTemplateContent("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
        <Label>Template File (DWG, DWT, SVG, or XML)</Label>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" onClick={triggerFileInput}>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".dwg,.dwt,.svg,.xml" 
            onChange={handleFileChange}
          />
          <FileUp className="h-10 w-10 text-gray-400 mb-2" />
          {selectedFile ? (
            <div className="text-center">
              <p className="font-medium text-sm">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="font-medium text-sm">Click to select or drop a file</p>
              <p className="text-xs text-muted-foreground">
                Supports DWG, DWT, SVG, or XML files
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="templateContent">Or Paste Content Directly</Label>
        <Textarea
          id="templateContent"
          value={templateContent}
          onChange={(e) => setTemplateContent(e.target.value)}
          placeholder="Paste your template content here"
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
