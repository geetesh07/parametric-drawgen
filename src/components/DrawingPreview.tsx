
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ZoomIn, ZoomOut, RotateCw, Square, Maximize2, Ruler, Scan, FileText } from "lucide-react";
import { type ToolParameters } from "./parametric-form/ParametricForm";
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import { generateDrawing, generatePDF, exportAsPNG } from "@/services/autocadService";

export interface DrawingPreviewProps {
  parameters: ToolParameters;
  templateId: string;
}

export function DrawingPreview({ parameters, templateId }: DrawingPreviewProps) {
  const frontViewCanvasRef = useRef<HTMLCanvasElement>(null);
  const sideViewCanvasRef = useRef<HTMLCanvasElement>(null);
  const topViewCanvasRef = useRef<HTMLCanvasElement>(null);
  const isometricViewCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [activeTab, setActiveTab] = useState("front-view");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [exportLoading, setExportLoading] = useState(false);
  const [autocadDrawingUrl, setAutocadDrawingUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    renderFrontView();
    renderSideView();
    renderTopView();
    renderIsometricView();
  }, [parameters, zoomLevel]);

  const renderFrontView = () => {
    if (!frontViewCanvasRef.current) return;

    const canvas = frontViewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGridBackground(ctx, canvas.width, canvas.height);

    const margin = 50;
    const maxWidth = canvas.width - margin * 2;
    const scale = (maxWidth / parameters.overallLength) * zoomLevel;
    
    const centerY = canvas.height / 2;
    const startX = (canvas.width - parameters.overallLength * scale) / 2;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#3b82f6";
    ctx.fillStyle = "#dbeafe";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.textAlign = "center";
    
    ctx.beginPath();
    
    const shankStartX = startX;
    const shankEndX = startX + parameters.shankLength * scale;
    const shankRadius = parameters.shankDiameter * scale / 2;
    
    const fluteEndX = shankEndX + parameters.fluteLength * scale;
    const fluteRadius = parameters.cuttingDiameter * scale / 2;
    
    ctx.moveTo(shankStartX, centerY - shankRadius);
    ctx.lineTo(shankEndX, centerY - shankRadius);
    
    if (parameters.toolType === "drill" || parameters.toolType === "endmill") {
      ctx.lineTo(fluteEndX - fluteRadius, centerY - fluteRadius);
      ctx.lineTo(fluteEndX, centerY);
      ctx.lineTo(fluteEndX - fluteRadius, centerY + fluteRadius);
    } else {
      ctx.lineTo(fluteEndX, centerY - fluteRadius);
      ctx.lineTo(fluteEndX, centerY + fluteRadius);
    }
    
    ctx.lineTo(shankEndX, centerY + shankRadius);
    ctx.lineTo(shankStartX, centerY + shankRadius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    drawDimensionLine(ctx, shankStartX, centerY + 40, fluteEndX, centerY + 40, `${parameters.overallLength.toFixed(2)} mm`);
    drawDimensionLine(ctx, shankStartX, centerY + 70, shankEndX, centerY + 70, `${parameters.shankLength.toFixed(2)} mm`);
    drawDimensionLine(ctx, shankEndX, centerY + 100, fluteEndX, centerY + 100, `${parameters.fluteLength.toFixed(2)} mm`);
    
    drawDiameterDimension(ctx, shankStartX + parameters.shankLength * scale * 0.2, centerY, shankRadius, `Ø${parameters.shankDiameter.toFixed(3)}`);
    drawDiameterDimension(ctx, fluteEndX - parameters.fluteLength * scale * 0.3, centerY, fluteRadius, `Ø${parameters.cuttingDiameter.toFixed(3)}`);
    
    ctx.fillStyle = "#1e40af";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText(`${parameters.toolType.toUpperCase()} - ${parameters.coating}`, canvas.width / 2, 30);
    
    if (parameters.backTaper > 0) {
      ctx.fillStyle = "#6b7280";
      ctx.font = "12px 'Inter', sans-serif";
      
      const taperLabelX = shankEndX + parameters.fluteLength * scale * 0.5;
      const taperLabelY = centerY - Math.max(fluteRadius, shankRadius) * 3;
      
      ctx.beginPath();
      ctx.moveTo(taperLabelX, taperLabelY);
      ctx.lineTo(taperLabelX, centerY - fluteRadius);
      ctx.stroke();
      
      ctx.fillText(`BACK TAPER: ${parameters.backTaper.toFixed(3)} mm`, taperLabelX, taperLabelY - 10);
    }
  };

  const renderSideView = () => {
    if (!sideViewCanvasRef.current) return;
    
    const canvas = sideViewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGridBackground(ctx, canvas.width, canvas.height);
    
    const margin = 50;
    const maxWidth = canvas.width - margin * 2;
    const scale = (maxWidth / parameters.overallLength) * zoomLevel;
    
    const centerY = canvas.height / 2;
    const centerX = canvas.width / 2;
    
    ctx.strokeStyle = "#3b82f6";
    ctx.fillStyle = "#dbeafe";
    
    ctx.beginPath();
    ctx.arc(centerX - 100, centerY, parameters.shankDiameter * scale / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX + 100, centerY, parameters.cuttingDiameter * scale / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = "#1e40af";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText("Shank Cross-Section", centerX - 100, centerY - parameters.shankDiameter * scale - 10);
    ctx.fillText("Flute Cross-Section", centerX + 100, centerY - parameters.cuttingDiameter * scale - 10);
    
    ctx.fillStyle = "#000000";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText(`Ø${parameters.shankDiameter.toFixed(3)} mm`, centerX - 100, centerY + parameters.shankDiameter * scale + 30);
    ctx.fillText(`Ø${parameters.cuttingDiameter.toFixed(3)} mm`, centerX + 100, centerY + parameters.cuttingDiameter * scale + 30);
  };

  const renderTopView = () => {
    if (!topViewCanvasRef.current) return;
    
    const canvas = topViewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGridBackground(ctx, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const toolRadius = Math.max(parameters.shankDiameter, parameters.cuttingDiameter) * 5;
    
    ctx.fillStyle = "#dbeafe";
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, toolRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.strokeStyle = "#1e40af";
    
    if (parameters.toolType === "endmill") {
      const numTeeth = 4;
      for (let i = 0; i < numTeeth; i++) {
        const angle = (i / numTeeth) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * toolRadius,
          centerY + Math.sin(angle) * toolRadius
        );
        ctx.stroke();
      }
    } else if (parameters.toolType === "drill") {
      ctx.beginPath();
      ctx.moveTo(centerX - toolRadius/2, centerY);
      ctx.lineTo(centerX + toolRadius/2, centerY);
      ctx.stroke();
    } else if (parameters.toolType === "reamer") {
      const numFlutes = 6;
      for (let i = 0; i < numFlutes; i++) {
        const angle = (i / numFlutes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * toolRadius * 0.7,
          centerY + Math.sin(angle) * toolRadius * 0.7
        );
        ctx.stroke();
      }
    }
    
    ctx.fillStyle = "#1e40af";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText(`${parameters.toolType} - Top View`, centerX, 30);
  };

  const renderIsometricView = () => {
    if (!isometricViewCanvasRef.current) return;
    
    const canvas = isometricViewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGridBackground(ctx, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const margin = 100;
    const maxDim = Math.max(parameters.overallLength, parameters.cuttingDiameter * 2);
    const scale = (Math.min(canvas.width, canvas.height) - margin) / maxDim * zoomLevel * 0.5;
    
    const cosa = Math.cos(Math.PI/6);
    const sina = Math.sin(Math.PI/6);
    
    const shankLength = parameters.shankLength * scale;
    const fluteLength = parameters.fluteLength * scale;
    const shankRadius = parameters.shankDiameter * scale / 2;
    const fluteRadius = parameters.cuttingDiameter * scale / 2;
    
    ctx.strokeStyle = "#3b82f6";
    ctx.fillStyle = "#dbeafe";
    ctx.lineWidth = 2;
    
    const iso = (x: number, y: number, z: number) => {
      return {
        x: centerX + (x - z) * cosa,
        y: centerY + (x + z) * sina - y
      };
    };
    
    const shankStart = iso(0, 0, 0);
    const shankEnd = iso(shankLength, 0, 0);
    
    ctx.beginPath();
    ctx.moveTo(shankStart.x, shankStart.y - shankRadius);
    ctx.lineTo(shankEnd.x, shankEnd.y - shankRadius);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(shankStart.x, shankStart.y + shankRadius);
    ctx.lineTo(shankEnd.x, shankEnd.y + shankRadius);
    ctx.stroke();
    
    const fluteEnd = iso(shankLength + fluteLength, 0, 0);
    
    ctx.beginPath();
    ctx.moveTo(shankEnd.x, shankEnd.y - shankRadius);
    
    if (parameters.toolType === "drill") {
      ctx.lineTo(fluteEnd.x, fluteEnd.y);
    } else {
      ctx.lineTo(fluteEnd.x, fluteEnd.y - fluteRadius);
    }
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(shankEnd.x, shankEnd.y + shankRadius);
    
    if (parameters.toolType === "drill") {
      ctx.lineTo(fluteEnd.x, fluteEnd.y);
    } else {
      ctx.lineTo(fluteEnd.x, fluteEnd.y + fluteRadius);
    }
    ctx.stroke();
    
    drawIsometricCircle(ctx, shankStart.x, shankStart.y, shankRadius);
    
    if (parameters.toolType !== "drill") {
      drawIsometricCircle(ctx, fluteEnd.x, fluteEnd.y, fluteRadius);
    }
    
    ctx.fillStyle = "#1e40af";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText(`${parameters.toolType} - Isometric View`, centerX, 30);
  };

  const drawIsometricCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawDimensionLine = (
    ctx: CanvasRenderingContext2D, 
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number, 
    text: string
  ) => {
    ctx.strokeStyle = "#6b7280";
    ctx.fillStyle = "#1e3a8a";
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, fromY);
    ctx.stroke();
    
    drawArrow(ctx, fromX, fromY, fromX + 10, fromY);
    drawArrow(ctx, toX, fromY, toX - 10, fromY);
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY - 5);
    ctx.lineTo(fromX, fromY + 5);
    ctx.moveTo(toX, fromY - 5);
    ctx.lineTo(toX, fromY + 5);
    ctx.stroke();
    
    const textWidth = ctx.measureText(text).width;
    const padding = 4;
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(
      (fromX + toX) / 2 - textWidth / 2 - padding, 
      fromY + 5, 
      textWidth + padding * 2, 
      20
    );
    
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText(text, (fromX + toX) / 2, fromY + 18);
  };

  const drawDiameterDimension = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    text: string
  ) => {
    ctx.strokeStyle = "#6b7280";
    ctx.fillStyle = "#1e3a8a";
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(x, y - radius - 10);
    ctx.lineTo(x, y + radius + 10);
    ctx.stroke();
    
    drawArrow(ctx, x, y - radius, x, y - radius + 10);
    drawArrow(ctx, x, y + radius, x, y + radius - 10);
    
    const textWidth = ctx.measureText(text).width;
    const padding = 4;
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(
      x - textWidth / 2 - padding, 
      y - radius - 25, 
      textWidth + padding * 2, 
      20
    );
    
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText(text, x, y - radius - 15);
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headLength = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(fromX - headLength * Math.cos(angle - Math.PI / 6), fromY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(fromX - headLength * Math.cos(angle + Math.PI / 6), fromY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  const drawGridBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    
    const gridSize = 20;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const handleDownload = () => {
    let canvasToDownload;
    
    switch (activeTab) {
      case 'front-view':
        canvasToDownload = frontViewCanvasRef.current;
        break;
      case 'side-view':
        canvasToDownload = sideViewCanvasRef.current;
        break;
      case 'top-view':
        canvasToDownload = topViewCanvasRef.current;
        break;
      case 'isometric-view':
        canvasToDownload = isometricViewCanvasRef.current;
        break;
      default:
        canvasToDownload = frontViewCanvasRef.current;
    }
    
    if (!canvasToDownload) return;
    
    const link = document.createElement('a');
    link.download = `${parameters.toolType}-${activeTab}.png`;
    link.href = canvasToDownload.toDataURL('image/png');
    link.click();
  };

  const handleExportWithAutocad = async () => {
    const apiKeysExist = localStorage.getItem("autocadApiKeys");
    if (!apiKeysExist) {
      toast.error("Please configure your AutoCAD API keys first");
      return;
    }
    
    setIsGenerating(true);
    setExportLoading(true);
    
    try {
      const drawingUrl = await generateDrawing(parameters, templateId);
      
      if (drawingUrl) {
        setAutocadDrawingUrl(drawingUrl);
        toast.success("Drawing generated successfully with AutoCAD API");
      } else {
        toast.error("Failed to generate drawing");
      }
    } catch (error) {
      console.error("Error generating drawing:", error);
      toast.error("Error generating drawing. Check console for details.");
    } finally {
      setIsGenerating(false);
      setExportLoading(false);
    }
  };

  const handleExportPDFWithAutocad = async () => {
    if (!autocadDrawingUrl) {
      toast.error("Please generate a drawing first");
      return;
    }
    
    setExportLoading(true);
    
    try {
      const pdfUrl = await generatePDF(autocadDrawingUrl);
      
      if (pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${parameters.toolType}-autocad.pdf`;
        link.click();
        
        toast.success("PDF generated and downloaded successfully");
      } else {
        toast.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF. Check console for details.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportPNGWithAutocad = async () => {
    if (!autocadDrawingUrl) {
      toast.error("Please generate a drawing first");
      return;
    }
    
    setExportLoading(true);
    
    try {
      const pngUrl = await exportAsPNG(autocadDrawingUrl);
      
      if (pngUrl) {
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${parameters.toolType}-autocad.png`;
        link.click();
        
        toast.success("PNG generated and downloaded successfully");
      } else {
        toast.error("Failed to generate PNG");
      }
    } catch (error) {
      console.error("Error generating PNG:", error);
      toast.error("Error generating PNG. Check console for details.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  };

  const handleReset = () => {
    setZoomLevel(1);
  };

  return (
    <Card className="w-full shadow-lg border-2 border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-400">Technical Drawing</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Zoom In</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Zoom Out</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCw className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">PNG</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportWithAutocad}
                disabled={isGenerating || exportLoading}
              >
                <FileText className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Generate with AutoCAD</span>
              </Button>
              
              {autocadDrawingUrl && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportPDFWithAutocad}
                    disabled={exportLoading}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">AutoCAD PDF</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportPNGWithAutocad}
                    disabled={exportLoading}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">AutoCAD PNG</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          <Tabs defaultValue="front-view" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="front-view" className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                <span>Front View</span>
              </TabsTrigger>
              <TabsTrigger value="side-view" className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                <span>Side View</span>
              </TabsTrigger>
              <TabsTrigger value="top-view" className="flex items-center gap-2">
                <Maximize2 className="h-4 w-4" />
                <span>Top View</span>
              </TabsTrigger>
              <TabsTrigger value="isometric-view" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                <span>3D View</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="front-view" className="pt-4">
              <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                <canvas 
                  ref={frontViewCanvasRef} 
                  width={800} 
                  height={400} 
                  className="w-full h-[400px] object-contain"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="side-view" className="pt-4">
              <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                <canvas 
                  ref={sideViewCanvasRef} 
                  width={800} 
                  height={400} 
                  className="w-full h-[400px] object-contain"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="top-view" className="pt-4">
              <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                <canvas 
                  ref={topViewCanvasRef} 
                  width={800} 
                  height={400} 
                  className="w-full h-[400px] object-contain"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="isometric-view" className="pt-4">
              <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                <canvas 
                  ref={isometricViewCanvasRef} 
                  width={800} 
                  height={400} 
                  className="w-full h-[400px] object-contain"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          {isGenerating && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-blue-800 dark:text-blue-400">Generating drawing with AutoCAD API...</p>
              </div>
            </div>
          )}
          
          {autocadDrawingUrl && !isGenerating && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
              <p className="text-sm text-green-800 dark:text-green-400">
                AutoCAD drawing generated successfully. You can now export to PDF or PNG.
              </p>
            </div>
          )}
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">Drawing Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Tool Type</p>
                <p className="font-medium">{parameters.toolType}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Overall Length</p>
                <p className="font-medium">{parameters.overallLength.toFixed(3)} mm</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Cutting Diameter</p>
                <p className="font-medium">{parameters.cuttingDiameter.toFixed(3)} mm</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Coating</p>
                <p className="font-medium">{parameters.coating}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
