// Types for AutoCAD API responses
interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface DrawingTemplate {
  id: string;
  name: string;
  description: string;
  content?: string;
  fileType?: string;
}

// Cached token info
let tokenCache: {
  token: string;
  expiresAt: number;
} | null = null;

// Fixed API keys for development purposes
// In production, you should use a more secure method
const FIXED_API_KEYS = {
  clientId: "YourFixedClientId",
  clientSecret: "YourFixedClientSecret"
};

/**
 * Get access token for Autodesk APS API
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    // For demo purposes, we're using a mock token that will NOT actually call the API
    // but will still allow the application flow to continue
    
    // Simulate a successful authentication without calling the real API
    const mockResponse: AccessTokenResponse = {
      access_token: "mock_token_" + Date.now(),
      token_type: "Bearer",
      expires_in: 3600
    };
    
    // Cache the token
    tokenCache = {
      token: mockResponse.access_token,
      expiresAt: Date.now() + (mockResponse.expires_in * 1000) - 60000, // Expire 1 minute early to be safe
    };
    
    console.log("Using mock token for demo purposes:", mockResponse.access_token);
    return mockResponse.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}

/**
 * Upload a drawing file to Autodesk Document Management
 * Note: In our demo version, we don't actually upload to Autodesk
 */
async function uploadDrawingFile(token: string, fileContent: string, fileName: string): Promise<string | null> {
  try {
    console.log("Mock uploading drawing file:", fileName);
    
    // For demo purposes, create a data URL that can be displayed
    // This allows us to show the drawing without actually calling the Autodesk API
    
    if (fileName.endsWith('.svg')) {
      // If it's already SVG content, we can create a direct data URL
      return `data:image/svg+xml;base64,${btoa(fileContent)}`;
    } else {
      // For DWG/DWT files, we would normally convert them to a viewable format
      // Since we can't actually do that in the browser, we'll generate a demo SVG
      
      // Extract any template ID information that might be in the filename
      const templateIdMatch = fileName.match(/template-([a-z0-9-]+)/);
      const templateId = templateIdMatch ? templateIdMatch[1] : 'generic';
      
      // Generate a simple SVG representation
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
          <rect width="100%" height="100%" fill="white"/>
          <text x="50%" y="50" font-family="Arial" font-size="24" text-anchor="middle" font-weight="bold">DWG File Simulation</text>
          <text x="50%" y="80" font-family="Arial" font-size="16" text-anchor="middle">Template: ${templateId}</text>
          <text x="50%" y="120" font-family="Arial" font-size="16" text-anchor="middle">Filename: ${fileName}</text>
          <rect x="100" y="150" width="600" height="400" fill="none" stroke="#333" stroke-width="2"/>
          <text x="400" y="350" font-family="Arial" font-size="20" text-anchor="middle">Drawing would be displayed here</text>
          <text x="400" y="380" font-family="Arial" font-size="16" text-anchor="middle">(Using actual AutoCAD API would render this)</text>
        </svg>
      `;
      
      return `data:image/svg+xml;base64,${btoa(svgContent)}`;
    }
  } catch (error) {
    console.error("Error uploading drawing file:", error);
    return null;
  }
}

/**
 * Generate a parametric drawing based on parameters
 */
function generateDrawingContent(parameters: any, templateId: string): string {
  // For demo purposes, we'll generate a simple SVG as our drawing content
  // In a real implementation, you would generate a proper DWG file using AutoCAD APIs
  
  const { toolType, overallLength, cuttingDiameter, shankDiameter, fluteLength, shankLength } = parameters;
  
  // Try to find a custom template first
  const customTemplatesString = localStorage.getItem("customTemplates");
  let template: DrawingTemplate | undefined;
  
  if (customTemplatesString) {
    const customTemplates = JSON.parse(customTemplatesString) as DrawingTemplate[];
    template = customTemplates.find(t => t.id === templateId);
  }
  
  // If a custom template is found and it's a DWG/DWT file, we would use that as the base
  // Since we can't actually modify DWG files in the browser, we'll just simulate it
  if (template && template.fileType && ['dwg', 'dwt'].includes(template.fileType)) {
    // In a real implementation, you would send the template and parameters to a server
    // that would modify the DWG file with the new parameters
    // For now, we'll just generate a SVG that mentions we'd use the template
    
    // Calculate scale and dimensions
    const scale = 2;
    const width = Math.max(overallLength, 200) * scale;
    const height = Math.max(cuttingDiameter * 4, 100) * scale;
    
    // Complete SVG document
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="white"/>
      <text x="10" y="30" font-family="Arial" font-size="20" font-weight="bold">${toolType.toUpperCase()} - Technical Drawing (Using Custom DWG/DWT)</text>
      <text x="10" y="50" font-family="Arial" font-size="14">Template: ${template.name}</text>
      <text x="10" y="70" font-family="Arial" font-size="14">This drawing would use the uploaded DWG/DWT template with these parameters:</text>
      <text x="30" y="100" font-family="Arial" font-size="12">Overall Length: ${overallLength.toFixed(3)} mm</text>
      <text x="30" y="120" font-family="Arial" font-size="12">Cutting Diameter: ${cuttingDiameter.toFixed(3)} mm</text>
      <text x="30" y="140" font-family="Arial" font-size="12">Shank Diameter: ${shankDiameter.toFixed(3)} mm</text>
      <text x="30" y="160" font-family="Arial" font-size="12">Flute Length: ${fluteLength.toFixed(3)} mm</text>
      <text x="30" y="180" font-family="Arial" font-size="12">Shank Length: ${shankLength.toFixed(3)} mm</text>
    </svg>`;
  }
  
  // If no custom template or it's not a DWG/DWT, use the standard SVG generation
  // Calculate scale and dimensions
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
    
    // Add dimensions
    toolSvg += `<text x="${startX}" y="${yCenter + shankWidth + 20}" font-family="Arial" font-size="12">Shank: Ø${shankDiameter.toFixed(3)}</text>`;
    toolSvg += `<text x="${startX + shankLengthScaled}" y="${yCenter + cuttingWidth + 20}" font-family="Arial" font-size="12">Cutting: Ø${cuttingDiameter.toFixed(3)}</text>`;
    toolSvg += `<text x="${startX}" y="${yCenter - shankWidth - 10}" font-family="Arial" font-size="12">Overall Length: ${overallLength.toFixed(2)}</text>`;
  } else if (toolType === 'drill') {
    // Draw drill shape
    const yCenter = height / 2;
    const startX = (width - overallLengthScaled) / 2;
    
    // Draw the shank
    toolSvg += `<rect x="${startX}" y="${yCenter - shankWidth/2}" width="${shankLengthScaled}" height="${shankWidth}" fill="#CCCCCC" stroke="black" stroke-width="1" />`;
    
    // Draw the fluted part
    toolSvg += `<rect x="${startX + shankLengthScaled}" y="${yCenter - cuttingWidth/2}" width="${fluteLengthScaled - 20 * scale}" height="${cuttingWidth}" fill="#999999" stroke="black" stroke-width="1" />`;
    
    // Draw the point
    toolSvg += `<polygon points="${startX + overallLengthScaled - 20 * scale},${yCenter - cuttingWidth/2} ${startX + overallLengthScaled},${yCenter} ${startX + overallLengthScaled - 20 * scale},${yCenter + cuttingWidth/2}" fill="#999999" stroke="black" stroke-width="1" />`;
    
    // Add dimensions
    toolSvg += `<text x="${startX}" y="${yCenter + shankWidth + 20}" font-family="Arial" font-size="12">Shank: Ø${shankDiameter.toFixed(3)}</text>`;
    toolSvg += `<text x="${startX + shankLengthScaled}" y="${yCenter + cuttingWidth + 20}" font-family="Arial" font-size="12">Cutting: Ø${cuttingDiameter.toFixed(3)}</text>`;
    toolSvg += `<text x="${startX}" y="${yCenter - shankWidth - 10}" font-family="Arial" font-size="12">Overall Length: ${overallLength.toFixed(2)}</text>`;
  } else {
    // Default generic tool shape
    const yCenter = height / 2;
    const startX = (width - overallLengthScaled) / 2;
    
    toolSvg += `<rect x="${startX}" y="${yCenter - shankWidth/2}" width="${overallLengthScaled}" height="${shankWidth}" fill="#AAAAAA" stroke="black" stroke-width="1" />`;
    toolSvg += `<text x="${startX}" y="${yCenter + shankWidth + 20}" font-family="Arial" font-size="12">Tool Length: ${overallLength.toFixed(2)}</text>`;
  }
  
  // Complete SVG document
  const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="white"/>
    <text x="10" y="30" font-family="Arial" font-size="20" font-weight="bold">${toolType.toUpperCase()} - Technical Drawing</text>
    <text x="10" y="50" font-family="Arial" font-size="14">Template: ${templateId}</text>
    ${toolSvg}
  </svg>`;
  
  return svgContent;
}

/**
 * Generate drawing based on parameters and template
 */
export async function generateDrawing(parameters: any, templateId: string): Promise<string | null> {
  try {
    // For demo purposes, we don't actually need a real token
    // but we'll call getAccessToken to maintain the workflow
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Failed to get access token");
    }

    console.log("Generating drawing with parameters:", parameters);
    console.log("Using template:", templateId);
    
    // Generate the drawing content based on parameters and template
    const drawingContent = generateDrawingContent(parameters, templateId);
    
    // Create a data URL that can be used directly instead of uploading to Autodesk
    // This bypasses the API calls that were failing
    const dataUrl = `data:image/svg+xml;base64,${btoa(drawingContent)}`;
    return dataUrl;
  } catch (error) {
    console.error("Error generating drawing:", error);
    return null;
  }
}

/**
 * Get available drawing templates
 */
export async function getTemplates(): Promise<DrawingTemplate[]> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Failed to get access token");
    }

    // Get custom templates from localStorage
    const customTemplatesString = localStorage.getItem("customTemplates");
    const customTemplates = customTemplatesString ? 
      JSON.parse(customTemplatesString) as DrawingTemplate[] : [];

    // For demo purposes, return predefined templates along with any custom templates
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
 * @param templateData The template content and metadata
 * @returns The new template ID if successful
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
    
    // In a real implementation, you would upload this to a server
    // For now, we'll store it in localStorage
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
 * Generate PDF from drawing
 */
export async function generatePDF(drawingUrl: string): Promise<string | null> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Failed to get access token");
    }

    console.log("Converting drawing to PDF:", drawingUrl);
    
    // In a real implementation, you would use Autodesk Model Derivative API
    // to convert the DWG to PDF. For this demo, we'll just return the SVG URL.
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
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Failed to get access token");
    }

    console.log("Exporting drawing as PNG:", drawingUrl);
    
    // In a real implementation, you would use Autodesk Model Derivative API
    // to convert the DWG to PNG. For this demo, we'll just return the SVG URL.
    return drawingUrl;
  } catch (error) {
    console.error("Error exporting as PNG:", error);
    return null;
  }
}
