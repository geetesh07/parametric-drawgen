
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { type ToolParameters } from "./ParametricForm";
import { useRef, useEffect } from "react";

interface DrawingPreviewProps {
  parameters: ToolParameters | null;
}

export function DrawingPreview({ parameters }: DrawingPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!parameters || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scale to fit drawing in canvas
    const margin = 50;
    const maxWidth = canvas.width - margin * 2;
    const scale = maxWidth / parameters.overallLength;
    
    // Center the drawing
    const centerY = canvas.height / 2;
    const startX = margin;

    // Drawing settings
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    
    // Draw the tool outline
    ctx.beginPath();
    
    // Shank
    const shankStartX = startX;
    const shankEndX = startX + parameters.shankLength * scale;
    const shankRadius = parameters.shankDiameter * scale / 2;
    
    // Flute
    const fluteEndX = shankEndX + parameters.fluteLength * scale;
    const fluteRadius = parameters.cuttingDiameter * scale / 2;
    
    // Draw shank
    ctx.moveTo(shankStartX, centerY - shankRadius);
    ctx.lineTo(shankEndX, centerY - shankRadius);
    
    // Draw flute with point
    if (parameters.toolType === "drill" || parameters.toolType === "endmill") {
      // Draw flute top
      ctx.lineTo(fluteEndX - fluteRadius, centerY - fluteRadius);
      
      // Draw point
      ctx.lineTo(fluteEndX, centerY);
      ctx.lineTo(fluteEndX - fluteRadius, centerY + fluteRadius);
    } else {
      // Reamer has a straighter profile
      ctx.lineTo(fluteEndX, centerY - fluteRadius);
      ctx.lineTo(fluteEndX, centerY + fluteRadius);
    }
    
    // Draw bottom of tool
    ctx.lineTo(shankEndX, centerY + shankRadius);
    ctx.lineTo(shankStartX, centerY + shankRadius);
    ctx.closePath();
    ctx.stroke();
    
    // Add dimensions
    ctx.fillStyle = "#000000";
    
    // Overall length
    ctx.beginPath();
    ctx.moveTo(startX, centerY + 40);
    ctx.lineTo(fluteEndX, centerY + 40);
    ctx.stroke();
    
    // Dimension arrows
    drawArrow(ctx, startX, centerY + 40, startX + 10, centerY + 40);
    drawArrow(ctx, fluteEndX, centerY + 40, fluteEndX - 10, centerY + 40);
    
    // Dimension text
    ctx.fillText(`${parameters.overallLength.toFixed(1)} mm`, (startX + fluteEndX) / 2, centerY + 55);
    
    // Draw diameter indicators
    ctx.fillText(`Ø${parameters.shankDiameter.toFixed(3)}`, startX + 30, centerY - shankRadius - 10);
    ctx.fillText(`Ø${parameters.cuttingDiameter.toFixed(3)}`, fluteEndX - 30, centerY - fluteRadius - 10);
    
    // Draw back taper label
    ctx.fillText(`BACK TAPER ${parameters.backTaper.toFixed(3)}`, fluteEndX - 50, centerY - 40);
    
    // Draw coating label
    ctx.fillText(`${parameters.coating}`, startX + 50, centerY + 10);
    
  }, [parameters]);

  // Helper function for drawing arrows
  function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
    const headLength = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'tool-drawing.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Drawing Preview</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <ZoomIn className="h-4 w-4 mr-1" />
                <span>Zoom</span>
              </Button>
              <Button variant="outline" size="sm" disabled>
                <RotateCw className="h-4 w-4 mr-1" />
                <span>Reset</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={!parameters}>
                <Download className="h-4 w-4 mr-1" />
                <span>Download</span>
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-white">
            {parameters ? (
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={400} 
                className="w-full h-[400px] object-contain"
              />
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Enter parameters and generate a drawing to see preview</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
