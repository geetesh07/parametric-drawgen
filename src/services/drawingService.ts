
// Drawing service using SVG and canvas for technical drawings

export interface DrawingTemplate {
  id: string;
  name: string;
  description: string;
  content?: string;
  fileType?: string;
}

export interface ToolParameters {
  toolType: string;
  overallLength: number;
  shankLength: number;
  fluteLength: number;
  shankDiameter: number;
  cuttingDiameter: number;
  pointAngle: number;
  coating: string;
  backTaper: number;
}

/**
 * Generate SVG drawing based on parameters and template
 */
export async function generateDrawing(parameters: ToolParameters, templateId: string): Promise<string | null> {
  try {
    console.log("Generating drawing with parameters:", parameters);
    console.log("Using template:", templateId);
    
    // Generate the drawing content based on parameters and template
    const drawingContent = generateDrawingContent(parameters, templateId);
    
    // Create a data URL from the SVG
    const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(drawingContent)))}`;
    return dataUrl;
  } catch (error) {
    console.error("Error generating drawing:", error);
    return null;
  }
}

/**
 * Generate a parametric drawing based on parameters
 */
function generateDrawingContent(parameters: ToolParameters, templateId: string): string {
  const { toolType, overallLength, cuttingDiameter, shankDiameter, fluteLength, shankLength, pointAngle, coating, backTaper } = parameters;
  
  // Try to find a custom template first
  const customTemplatesString = localStorage.getItem("customTemplates");
  let template: DrawingTemplate | undefined;
  
  if (customTemplatesString) {
    const customTemplates = JSON.parse(customTemplatesString) as DrawingTemplate[];
    template = customTemplates.find(t => t.id === templateId);
  }
  
  // Calculate scale and dimensions for the SVG
  const scale = 2;
  const width = Math.max(overallLength, 200) * scale;
  const height = Math.max(cuttingDiameter * 4, 100) * scale;
  
  const cuttingWidth = cuttingDiameter * scale;
  const shankWidth = shankDiameter * scale;
  const fluteLengthScaled = fluteLength * scale;
  const shankLengthScaled = shankLength * scale;
  const overallLengthScaled = overallLength * scale;
  
  // Generate SVG for the tool based on tool type
  let toolSvg = '';
  
  if (toolType === 'endmill') {
    // Draw end mill shape
    const yCenter = height / 2;
    const startX = (width - overallLengthScaled) / 2;
    
    // Draw the shank
    toolSvg += `<rect x="${startX}" y="${yCenter - shankWidth/2}" width="${shankLengthScaled}" height="${shankWidth}" fill="#CCCCCC" stroke="black" stroke-width="1" />`;
    
    // Draw the fluted part
    toolSvg += `<rect x="${startX + shankLengthScaled}" y="${yCenter - cuttingWidth/2}" width="${fluteLengthScaled}" height="${cuttingWidth}" fill="#999999" stroke="black" stroke-width="1" />`;
    
    // Add some cutting edges
    const edgeSpacing = fluteLengthScaled / 8;
    for (let i = 1; i <= 7; i++) {
      toolSvg += `<line x1="${startX + shankLengthScaled + i * edgeSpacing}" y1="${yCenter - cuttingWidth/2}" x2="${startX + shankLengthScaled + i * edgeSpacing}" y2="${yCenter + cuttingWidth/2}" stroke="black" stroke-width="0.5" />`;
    }
    
    // Add dimensions with precise measurements
    toolSvg += addDimension(startX, yCenter + shankWidth + 20, startX + shankLengthScaled + fluteLengthScaled, yCenter + shankWidth + 20, `${overallLength.toFixed(3)} mm`, '#1e3a8a');
    toolSvg += addDimension(startX, yCenter + shankWidth + 50, startX + shankLengthScaled, yCenter + shankWidth + 50, `${shankLength.toFixed(3)} mm`, '#1e3a8a');
    toolSvg += addDimension(startX + shankLengthScaled, yCenter + shankWidth + 80, startX + shankLengthScaled + fluteLengthScaled, yCenter + shankWidth + 80, `${fluteLength.toFixed(3)} mm`, '#1e3a8a');
    
    // Add diameter dimensions
    toolSvg += addDiameterDimension(startX + shankLengthScaled/2, yCenter, shankWidth/2, `Ø${shankDiameter.toFixed(3)} mm`, '#1e3a8a');
    toolSvg += addDiameterDimension(startX + shankLengthScaled + fluteLengthScaled/2, yCenter, cuttingWidth/2, `Ø${cuttingDiameter.toFixed(3)} mm`, '#1e3a8a');
    
    // Add coating and back taper details
    toolSvg += `<text x="${startX + overallLengthScaled/2}" y="${yCenter - Math.max(shankWidth, cuttingWidth)/2 - 40}" font-family="Arial" font-size="14" text-anchor="middle" fill="#1e3a8a">Coating: ${coating}</text>`;
    
    if (backTaper > 0) {
      toolSvg += `<text x="${startX + shankLengthScaled + fluteLengthScaled/2}" y="${yCenter - Math.max(shankWidth, cuttingWidth)/2 - 60}" font-family="Arial" font-size="14" text-anchor="middle" fill="#1e3a8a">Back Taper: ${backTaper.toFixed(3)} mm</text>`;
    }
  } else if (toolType === 'drill') {
    // Draw drill shape
    const yCenter = height / 2;
    const startX = (width - overallLengthScaled) / 2;
    
    // Draw the shank
    toolSvg += `<rect x="${startX}" y="${yCenter - shankWidth/2}" width="${shankLengthScaled}" height="${shankWidth}" fill="#CCCCCC" stroke="black" stroke-width="1" />`;
    
    // Calculate point length based on point angle and diameter
    const pointLength = (cuttingDiameter * scale) / (2 * Math.tan(pointAngle * Math.PI / 360));
    
    // Draw the fluted part (before the point)
    toolSvg += `<rect x="${startX + shankLengthScaled}" y="${yCenter - cuttingWidth/2}" width="${fluteLengthScaled - pointLength}" height="${cuttingWidth}" fill="#999999" stroke="black" stroke-width="1" />`;
    
    // Draw the point
    toolSvg += `<polygon points="${startX + shankLengthScaled + fluteLengthScaled - pointLength},${yCenter - cuttingWidth/2} ${startX + shankLengthScaled + fluteLengthScaled},${yCenter} ${startX + shankLengthScaled + fluteLengthScaled - pointLength},${yCenter + cuttingWidth/2}" fill="#999999" stroke="black" stroke-width="1" />`;
    
    // Add dimensions with precise measurements
    toolSvg += addDimension(startX, yCenter + shankWidth + 20, startX + shankLengthScaled + fluteLengthScaled, yCenter + shankWidth + 20, `${overallLength.toFixed(3)} mm`, '#1e3a8a');
    toolSvg += addDimension(startX, yCenter + shankWidth + 50, startX + shankLengthScaled, yCenter + shankWidth + 50, `${shankLength.toFixed(3)} mm`, '#1e3a8a');
    toolSvg += addDimension(startX + shankLengthScaled, yCenter + shankWidth + 80, startX + shankLengthScaled + fluteLengthScaled, yCenter + shankWidth + 80, `${fluteLength.toFixed(3)} mm`, '#1e3a8a');
    
    // Add diameter dimensions
    toolSvg += addDiameterDimension(startX + shankLengthScaled/2, yCenter, shankWidth/2, `Ø${shankDiameter.toFixed(3)} mm`, '#1e3a8a');
    toolSvg += addDiameterDimension(startX + shankLengthScaled + fluteLengthScaled/2 - pointLength/2, yCenter, cuttingWidth/2, `Ø${cuttingDiameter.toFixed(3)} mm`, '#1e3a8a');
    
    // Add point angle and coating details
    toolSvg += `<text x="${startX + shankLengthScaled + fluteLengthScaled - pointLength/2}" y="${yCenter - cuttingWidth/2 - 30}" font-family="Arial" font-size="14" text-anchor="middle" fill="#1e3a8a">Point Angle: ${pointAngle}°</text>`;
    toolSvg += `<text x="${startX + overallLengthScaled/2}" y="${yCenter - Math.max(shankWidth, cuttingWidth)/2 - 50}" font-family="Arial" font-size="14" text-anchor="middle" fill="#1e3a8a">Coating: ${coating}</text>`;
  } else {
    // Draw reamer or other tool types
    const yCenter = height / 2;
    const startX = (width - overallLengthScaled) / 2;
    
    // Draw the shank
    toolSvg += `<rect x="${startX}" y="${yCenter - shankWidth/2}" width="${shankLengthScaled}" height="${shankWidth}" fill="#CCCCCC" stroke="black" stroke-width="1" />`;
    
    // Draw the fluted part
    toolSvg += `<rect x="${startX + shankLengthScaled}" y="${yCenter - cuttingWidth/2}" width="${fluteLengthScaled}" height="${cuttingWidth}" fill="#999999" stroke="black" stroke-width="1" />`;
    
    // Add helical flute pattern
    const flutesCount = 6; // Typical for reamers
    const helixAngle = 15;
    
    for (let i = 0; i < flutesCount; i++) {
      const startAngle = (i / flutesCount) * 2 * Math.PI;
      const pathData = generateHelicalPath(
        startX + shankLengthScaled,
        yCenter,
        fluteLengthScaled,
        cuttingWidth/2,
        startAngle,
        helixAngle
      );
      
      toolSvg += `<path d="${pathData}" fill="none" stroke="black" stroke-width="0.5" />`;
    }
    
    // Add dimensions with precise measurements
    toolSvg += addDimension(startX, yCenter + shankWidth + 20, startX + shankLengthScaled + fluteLengthScaled, yCenter + shankWidth + 20, `${overallLength.toFixed(3)} mm`, '#1e3a8a');
    toolSvg += addDimension(startX, yCenter + shankWidth + 50, startX + shankLengthScaled, yCenter + shankWidth + 50, `${shankLength.toFixed(3)} mm`, '#1e3a8a');
    toolSvg += addDimension(startX + shankLengthScaled, yCenter + shankWidth + 80, startX + shankLengthScaled + fluteLengthScaled, yCenter + shankWidth + 80, `${fluteLength.toFixed(3)} mm`, '#1e3a8a');
    
    // Add diameter dimensions
    toolSvg += addDiameterDimension(startX + shankLengthScaled/2, yCenter, shankWidth/2, `Ø${shankDiameter.toFixed(3)} mm`, '#1e3a8a');
    toolSvg += addDiameterDimension(startX + shankLengthScaled + fluteLengthScaled/2, yCenter, cuttingWidth/2, `Ø${cuttingDiameter.toFixed(3)} mm`, '#1e3a8a');
    
    // Add coating details
    toolSvg += `<text x="${startX + overallLengthScaled/2}" y="${yCenter - Math.max(shankWidth, cuttingWidth)/2 - 40}" font-family="Arial" font-size="14" text-anchor="middle" fill="#1e3a8a">Coating: ${coating}</text>`;
  }
  
  // Complete SVG document with proper styling, grid background, and technical drawing look
  const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="0.5"/>
      </pattern>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto" markerUnits="strokeWidth">
        <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
      </marker>
    </defs>
    <rect width="100%" height="100%" fill="white"/>
    <rect width="100%" height="100%" fill="url(#grid)" />
    <text x="10" y="30" font-family="Arial" font-size="20" font-weight="bold" fill="#1e40af">${toolType.toUpperCase()} - Technical Drawing</text>
    <text x="10" y="50" font-family="Arial" font-size="14" fill="#4b5563">Template: ${templateId}</text>
    ${toolSvg}
    <text x="${width - 10}" y="${height - 10}" font-family="Arial" font-size="10" text-anchor="end" fill="#6b7280">Precision Drawing Generator - Scale 2:1</text>
  </svg>`;
  
  return svgContent;
}

// Helper function to add a dimension line with measurements
function addDimension(
  fromX: number, 
  fromY: number, 
  toX: number, 
  toY: number, 
  text: string,
  color: string
): string {
  const arrowSize = 10;
  let dimensionSvg = '';
  
  // Main dimension line
  dimensionSvg += `<line x1="${fromX}" y1="${fromY}" x2="${toX}" y2="${toY}" stroke="${color}" stroke-width="0.75" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)" />`;
  
  // Extension lines
  dimensionSvg += `<line x1="${fromX}" y1="${fromY - 15}" x2="${fromX}" y2="${fromY + 5}" stroke="${color}" stroke-width="0.5" />`;
  dimensionSvg += `<line x1="${toX}" y1="${toY - 15}" x2="${toX}" y2="${toY + 5}" stroke="${color}" stroke-width="0.5" />`;
  
  // Dimension text with background
  const textX = (fromX + toX) / 2;
  const textY = fromY - 5;
  
  dimensionSvg += `
    <rect x="${textX - 40}" y="${textY - 15}" width="80" height="20" fill="white" fill-opacity="0.8" />
    <text x="${textX}" y="${textY}" font-family="Arial" font-size="12" text-anchor="middle" fill="${color}">${text}</text>
  `;
  
  return dimensionSvg;
}

// Helper function to add a diameter dimension
function addDiameterDimension(
  x: number, 
  y: number, 
  radius: number, 
  text: string, 
  color: string
): string {
  let dimensionSvg = '';
  
  // Extension line
  dimensionSvg += `<line x1="${x}" y1="${y - radius}" x2="${x}" y2="${y - radius - 20}" stroke="${color}" stroke-width="0.5" />`;
  
  // Dimension text with background
  dimensionSvg += `
    <rect x="${x - 40}" y="${y - radius - 35}" width="80" height="20" fill="white" fill-opacity="0.8" />
    <text x="${x}" y="${y - radius - 20}" font-family="Arial" font-size="12" text-anchor="middle" fill="${color}">${text}</text>
  `;
  
  return dimensionSvg;
}

// Generate helical path for flutes
function generateHelicalPath(
  startX: number, 
  centerY: number, 
  length: number, 
  radius: number, 
  startAngle: number, 
  helixAngle: number
): string {
  const points = [];
  const steps = 20;
  const angleIncrement = helixAngle * (Math.PI / 180);
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = startX + t * length;
    const angle = startAngle + t * angleIncrement * 5;
    const y = centerY + Math.sin(angle) * radius;
    points.push(`${x},${y}`);
  }
  
  return 'M ' + points.join(' L ');
}

/**
 * Get available drawing templates
 */
export async function getTemplates(): Promise<DrawingTemplate[]> {
  try {
    // Get custom templates from localStorage
    const customTemplatesString = localStorage.getItem("customTemplates");
    const customTemplates = customTemplatesString ? 
      JSON.parse(customTemplatesString) as DrawingTemplate[] : [];

    // Return predefined templates along with any custom templates
    const builtInTemplates = [
      {
        id: "template-endmill",
        name: "Standard End Mill",
        description: "Template for standard end mill tools"
      },
      {
        id: "template-drill",
        name: "Standard Drill",
        description: "Template for standard drill tools"
      },
      {
        id: "template-reamer",
        name: "Standard Reamer",
        description: "Template for standard reamer tools"
      }
    ];
    
    return [...builtInTemplates, ...customTemplates];
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
}

/**
 * Upload a custom template
 */
export async function uploadTemplate(templateData: {
  name: string;
  description: string;
  content: string;
  fileType?: string;
}): Promise<string | null> {
  try {
    // Generate a unique ID for the template
    const templateId = `custom-${Date.now()}`;
    
    // Store in localStorage
    const existingTemplatesString = localStorage.getItem("customTemplates");
    const existingTemplates = existingTemplatesString ? 
      JSON.parse(existingTemplatesString) as DrawingTemplate[] : [];
    
    const newTemplate: DrawingTemplate = {
      id: templateId,
      name: templateData.name,
      description: templateData.description,
      content: templateData.content,
      fileType: templateData.fileType
    };
    
    existingTemplates.push(newTemplate);
    localStorage.setItem("customTemplates", JSON.stringify(existingTemplates));
    
    return templateId;
  } catch (error) {
    console.error("Error uploading template:", error);
    return null;
  }
}

/**
 * Export drawing as PDF
 */
export async function generatePDF(drawingUrl: string): Promise<string | null> {
  try {
    console.log("Converting drawing to PDF:", drawingUrl);
    
    // For now, we'll return the SVG URL - in a real implementation,
    // you would use a library like jsPDF to convert the SVG to PDF
    return drawingUrl;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
}

/**
 * Export drawing as PNG
 */
export async function exportAsPNG(drawingUrl: string): Promise<string | null> {
  try {
    console.log("Exporting drawing as PNG:", drawingUrl);
    
    // Create a temporary image element to convert SVG to PNG
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject("Failed to get canvas context");
            return;
          }
          
          // Draw white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the image
          ctx.drawImage(img, 0, 0);
          
          // Convert to PNG data URL
          const pngUrl = canvas.toDataURL('image/png');
          resolve(pngUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject("Failed to load SVG");
      };
      
      img.src = drawingUrl;
    });
  } catch (error) {
    console.error("Error exporting as PNG:", error);
    return null;
  }
}
