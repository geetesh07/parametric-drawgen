
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { type ToolParameters } from "./parametric-form/ParametricForm";
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const margin = 50;
    const maxWidth = canvas.width - margin * 2;
    const scale = maxWidth / parameters.overallLength;
    
    const centerY = canvas.height / 2;
    const startX = (canvas.width - parameters.overallLength * scale) / 2;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#333333"; // Dark gray for tool outline
    ctx.fillStyle = "#EEEEEE"; // Light gray for tool body
    ctx.font = "12px 'Inter', sans-serif";
    ctx.textAlign = "center";
    
    ctx.beginPath();
    
    const shankStartX = startX;
    const shankEndX = startX + parameters.shankLength * scale;
    const shankRadius = parameters.shankDiameter * scale / 2;
    
    const fluteEndX = shankEndX + parameters.fluteLength * scale;
    const fluteRadius = parameters.cuttingDiameter * scale / 2;
    
    // Draw tool shape based on tool type
    ctx.moveTo(shankStartX, centerY - shankRadius);
    ctx.lineTo(shankEndX, centerY - shankRadius);
    
    if (parameters.toolType === "drill") {
      // Calculate point length based on point angle
      const pointAngle = parameters.pointAngle;
      const pointLength = (parameters.cuttingDiameter / 2) / Math.tan((pointAngle / 2) * (Math.PI / 180)) * scale;
      
      // Draw drill with point
      ctx.lineTo(fluteEndX - pointLength, centerY - fluteRadius);
      ctx.lineTo(fluteEndX, centerY);
      ctx.lineTo(fluteEndX - pointLength, centerY + fluteRadius);
      
      // Add point angle dimensioning
      drawPointAngle(ctx, fluteEndX, centerY, fluteRadius, pointLength, pointAngle);
    } else if (parameters.toolType === "endmill") {
      // Draw end mill with flat end
      ctx.lineTo(fluteEndX - fluteRadius, centerY - fluteRadius);
      ctx.lineTo(fluteEndX, centerY - fluteRadius);
      ctx.lineTo(fluteEndX, centerY + fluteRadius);
      ctx.lineTo(fluteEndX - fluteRadius, centerY + fluteRadius);
    } else {
      // Default for reamer and other tools
      ctx.lineTo(fluteEndX, centerY - fluteRadius);
      ctx.lineTo(fluteEndX, centerY + fluteRadius);
    }
    
    // Complete the tool shape
    ctx.lineTo(shankEndX, centerY + shankRadius);
    ctx.lineTo(shankStartX, centerY + shankRadius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw dimension lines
    drawDimensionLine(ctx, shankStartX, centerY + 40, fluteEndX, centerY + 40, `${parameters.overallLength.toFixed(3)} mm`);
    drawDimensionLine(ctx, shankStartX, centerY + 70, shankEndX, centerY + 70, `${parameters.shankLength.toFixed(3)} mm`);
    drawDimensionLine(ctx, shankEndX, centerY + 100, fluteEndX, centerY + 100, `${parameters.fluteLength.toFixed(3)} mm`);
    
    // Draw diameter dimensions with tolerances
    // Shank diameter with tolerance
    let shankTolerance = "±0.005";
    let cuttingTolerance = "±0.010";
    
    if (parameters.toolType === "drill" || parameters.toolType === "endmill") {
      cuttingTolerance = "+0.000/-0.003";
    }
    
    drawDiameterDimension(
      ctx, 
      shankStartX + parameters.shankLength * scale * 0.2, 
      centerY, 
      shankRadius, 
      `Ø${parameters.shankDiameter.toFixed(3)} ${shankTolerance}`
    );
    
    drawDiameterDimension(
      ctx, 
      fluteEndX - parameters.fluteLength * scale * 0.3, 
      centerY, 
      fluteRadius, 
      `Ø${parameters.cuttingDiameter.toFixed(3)} ${cuttingTolerance}`
    );
    
    // Draw title and info
    ctx.fillStyle = "#333333";
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillText(`${parameters.toolType.toUpperCase()} - ${parameters.coating}`, canvas.width / 2, 30);
    
    // Add back taper info if present
    if (parameters.backTaper > 0) {
      ctx.fillStyle = "#333333";
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

  const drawPointAngle = (
    ctx: CanvasRenderingContext2D,
    tipX: number,
    centerY: number,
    radius: number,
    pointLength: number,
    pointAngle: number
  ) => {
    ctx.strokeStyle = "#555555";
    ctx.fillStyle = "#333333";
    ctx.lineWidth = 0.5;
    
    // Draw angle arcs
    ctx.beginPath();
    ctx.arc(tipX, centerY, 30, Math.PI * 1.5, Math.PI * 0.5, false);
    ctx.stroke();
    
    // Draw point angle text
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText(`${pointAngle}°`, tipX - 40, centerY);
  };

  const drawDimensionLine = (
    ctx: CanvasRenderingContext2D, 
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number, 
    text: string
  ) => {
    ctx.strokeStyle = "#555555";
    ctx.fillStyle = "#333333";
    ctx.lineWidth = 1;
    
    // Draw main dimension line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, fromY);
    ctx.stroke();
    
    // Draw arrows
    drawArrow(ctx, fromX, fromY, fromX + 10, fromY);
    drawArrow(ctx, toX, fromY, toX - 10, fromY);
    
    // Draw extension lines
    ctx.beginPath();
    ctx.moveTo(fromX, fromY - 5);
    ctx.lineTo(fromX, fromY + 5);
    ctx.moveTo(toX, fromY - 5);
    ctx.lineTo(toX, fromY + 5);
    ctx.stroke();
    
    // Draw dimension text
    const textWidth = ctx.measureText(text).width;
    const padding = 4;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(
      (fromX + toX) / 2 - textWidth / 2 - padding, 
      fromY - 8, 
      textWidth + padding * 2, 
      16
    );
    
    ctx.fillStyle = "#333333";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText(text, (fromX + toX) / 2, fromY + 4);
  };

  const drawDiameterDimension = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    text: string
  ) => {
    ctx.strokeStyle = "#555555";
    ctx.fillStyle = "#333333";
    ctx.lineWidth = 1;
    
    // Draw dimension line
    ctx.beginPath();
    ctx.moveTo(x, y - radius - 10);
    ctx.lineTo(x, y + radius + 10);
    ctx.stroke();
    
    // Draw arrows
    drawArrow(ctx, x, y - radius, x, y - radius + 10);
    drawArrow(ctx, x, y + radius, x, y + radius - 10);
    
    // Draw dimension text
    const textWidth = ctx.measureText(text).width;
    const padding = 4;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(
      x - textWidth / 2 - padding, 
      y - radius - 25, 
      textWidth + padding * 2, 
      16
    );
    
    ctx.fillStyle = "#333333";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText(text, x, y - radius - 15);
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D, 
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number
  ) => {
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

  const handleExportPDF = async () => {
    setExportLoading(true);
    
    try {
      const canvas = frontViewCanvasRef.current;
      if (!canvas) {
        throw new Error("Canvas not available");
      }
      
      // Create a high-quality PDF with jsPDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Create new PDF document
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate the scaling for high quality
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      const scaledWidth = canvas.width * ratio * 0.9; // 90% of available space
      const scaledHeight = canvas.height * ratio * 0.9;
      const xOffset = (pdfWidth - scaledWidth) / 2;
      const yOffset = (pdfHeight - scaledHeight) / 2;
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);
      
      // Add title and metadata
      pdf.setFontSize(10);
      pdf.text(`${parameters.toolType.toUpperCase()} - Technical Drawing`, pdfWidth / 2, 10, { align: 'center' });
      pdf.text(`Created on ${new Date().toLocaleDateString()}`, pdfWidth / 2, pdfHeight - 5, { align: 'center' });
      
      // Download the PDF
      pdf.save(`${parameters.toolType}-technical-drawing.pdf`);
      
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Error exporting PDF. Check console for details.");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
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
                <span className="hidden sm:inline">Export as PDF</span>
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <div className="overflow-hidden bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
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
