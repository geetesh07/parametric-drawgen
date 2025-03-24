
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { type ToolParameters } from "./parametric-form/ParametricForm";
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

export interface DrawingPreviewProps {
  parameters: ToolParameters;
}

export function DrawingPreview({ parameters }: DrawingPreviewProps) {
  const frontViewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    renderFrontView();
  }, [parameters]);

  const renderFrontView = () => {
    if (!frontViewCanvasRef.current) return;

    const canvas = frontViewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGridBackground(ctx, canvas.width, canvas.height);

    const margin = 50;
    const maxWidth = canvas.width - margin * 2;
    const scale = maxWidth / parameters.overallLength;
    
    const centerY = canvas.height / 2;
    const startX = (canvas.width - parameters.overallLength * scale) / 2;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#8A898C"; // Standard neutral gray
    ctx.fillStyle = "#F0F0F0"; // Light neutral background for tool
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
    
    ctx.fillStyle = "#333333"; // Darker neutral gray for text
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

  const drawDimensionLine = (
    ctx: CanvasRenderingContext2D, 
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number, 
    text: string
  ) => {
    ctx.strokeStyle = "#6b7280"; // Neutral gray
    ctx.fillStyle = "#444444"; // Darker neutral gray
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
    
    ctx.fillStyle = "#444444"; // Darker neutral gray
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
    ctx.strokeStyle = "#6b7280"; // Neutral gray
    ctx.fillStyle = "#444444"; // Darker neutral gray
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
    
    ctx.fillStyle = "#444444"; // Darker neutral gray
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

  const handleExportPDF = async () => {
    setExportLoading(true);
    
    try {
      const canvas = frontViewCanvasRef.current;
      if (!canvas) {
        throw new Error("Canvas not available");
      }
      
      // Create a simple PDF export using canvas data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create a temporary link to download the PDF (as image for now)
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${parameters.toolType}-drawing.png`;
      link.click();
      
      toast.success("Drawing exported successfully");
    } catch (error) {
      console.error("Error exporting drawing:", error);
      toast.error("Error exporting drawing. Check console for details.");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300">Technical Drawing</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportPDF}
                disabled={exportLoading}
              >
                <FileText className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Export Drawing</span>
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
              <canvas 
                ref={frontViewCanvasRef} 
                width={800} 
                height={400} 
                className="w-full h-[400px] object-contain"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800/30">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">Drawing Details</h4>
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
