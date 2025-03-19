
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParametricForm, type ToolParameters } from "@/components/parametric-form/ParametricForm";
import { DrawingPreview } from "@/components/DrawingPreview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InfoIcon } from "lucide-react";
import { Toaster } from "sonner";

const Generator = () => {
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
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiKeysConfigured, setApiKeysConfigured] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Check if API keys and template are configured
  useEffect(() => {
    const keys = localStorage.getItem("autocadApiKeys");
    setApiKeysConfigured(!!keys);
    
    const template = localStorage.getItem("selectedTemplate");
    setSelectedTemplate(template);
  }, []);
  
  // Validate dimensions whenever parameters change
  useEffect(() => {
    // Diameter too large relative to length check
    const diameterLengthRatio = parameters.cuttingDiameter / parameters.overallLength;
    if (diameterLengthRatio > 0.3) {
      setValidationError("Warning: Cutting diameter is too large relative to overall length. This may be impractical.");
    } else {
      setValidationError(null);
    }
  }, [parameters]);

  const handleParameterChange = (updatedParams: ToolParameters) => {
    setParameters(updatedParams);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gradient">Parametric Drawing Generator</h1>
            <p className="text-muted-foreground">
              Enter tool specifications to generate a precision manufacturing drawing.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* API Status Alert */}
            {!apiKeysConfigured && (
              <Alert className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30">
                <InfoIcon className="h-5 w-5 text-blue-600" />
                <AlertTitle>AutoCAD API Keys Required</AlertTitle>
                <AlertDescription>
                  To generate professional drawings using the AutoCAD API, please configure your API keys in the Template tab.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Template Status Alert */}
            {(apiKeysConfigured && !selectedTemplate) && (
              <Alert className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30">
                <InfoIcon className="h-5 w-5 text-yellow-600" />
                <AlertTitle>Drawing Template Required</AlertTitle>
                <AlertDescription>
                  Please select a drawing template in the Template tab to generate drawings.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Parameters Form */}
            <div className="grid grid-cols-1 gap-6">
              <ParametricForm parameters={parameters} onParametersChange={handleParameterChange} />
            </div>
            
            {/* Validation Warning */}
            {validationError && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            
            {/* Multi-view Drawing Preview */}
            <div className="grid grid-cols-1 gap-6">
              <DrawingPreview 
                parameters={parameters} 
                templateId={selectedTemplate || "template-endmill"} 
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Generator;
