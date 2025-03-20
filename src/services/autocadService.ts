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
}

// Cached token info
let tokenCache: {
  token: string;
  expiresAt: number;
} | null = null;

// Fixed API keys for development purposes
// In production, you should use a more secure method
const FIXED_API_KEYS = {
  clientId: "YOUR_DEMO_CLIENT_ID",
  clientSecret: "YOUR_DEMO_CLIENT_SECRET"
};

/**
 * Get access token for Autodesk APS API
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    // Check if we have a valid cached token
    if (tokenCache && tokenCache.expiresAt > Date.now()) {
      return tokenCache.token;
    }

    // Check for user-provided keys first, then fall back to fixed keys
    let keys;
    const keysString = localStorage.getItem("autocadApiKeys");
    
    if (keysString) {
      keys = JSON.parse(keysString);
    } else {
      // Use fixed keys
      keys = FIXED_API_KEYS;
      // Store them for consistency
      localStorage.setItem("autocadApiKeys", JSON.stringify(FIXED_API_KEYS));
    }
    
    // For demo purposes, we'll simulate a successful authentication without calling the real API
    const mockResponse: AccessTokenResponse = {
      access_token: "demo_access_token_" + Date.now(),
      token_type: "Bearer",
      expires_in: 3600
    };
    
    // Cache the token
    tokenCache = {
      token: mockResponse.access_token,
      expiresAt: Date.now() + (mockResponse.expires_in * 1000) - 60000, // Expire 1 minute early to be safe
    };
    
    return mockResponse.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}

/**
 * Upload a drawing file to Autodesk Document Management
 */
async function uploadDrawingFile(token: string, fileContent: string, fileName: string): Promise<string | null> {
  try {
    // Create a bucket if it doesn't exist
    const bucketKey = `parametric_drawing_${Date.now()}`;
    const createBucketResponse = await fetch(
      'https://developer.api.autodesk.com/oss/v2/buckets',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bucketKey,
          policyKey: 'transient' // Files will be automatically deleted after 24 hours
        })
      }
    );

    if (!createBucketResponse.ok) {
      console.error("Failed to create bucket", await createBucketResponse.text());
      throw new Error("Failed to create bucket");
    }

    // Upload the file
    const blob = new Blob([fileContent], { type: 'application/octet-stream' });
    const uploadResponse = await fetch(
      `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${fileName}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Authorization': `Bearer ${token}`
        },
        body: blob
      }
    );

    if (!uploadResponse.ok) {
      console.error("Failed to upload file", await uploadResponse.text());
      throw new Error("Failed to upload file");
    }

    const uploadData = await uploadResponse.json();
    const objectId = uploadData.objectId;
    
    // Create a signed URL for downloading the raw file
    const signedUrlResponse = await fetch(
      `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${fileName}/signed`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          minute: 60
        })
      }
    );

    if (!signedUrlResponse.ok) {
      console.error("Failed to create signed URL", await signedUrlResponse.text());
      throw new Error("Failed to create signed URL");
    }

    const signedUrlData = await signedUrlResponse.json();
    return signedUrlData.signedUrl;
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
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Failed to get access token");
    }

    console.log("Generating drawing with parameters:", parameters);
    console.log("Using template:", templateId);
    
    // Generate the drawing content based on parameters and template
    const drawingContent = generateDrawingContent(parameters, templateId);
    
    // Upload the drawing to Document Management
    const fileName = `${parameters.toolType}_${Date.now()}.svg`;
    const fileUrl = await uploadDrawingFile(token, drawingContent, fileName);
    
    if (!fileUrl) {
      throw new Error("Failed to upload drawing file");
    }
    
    return fileUrl;
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

    // For demo purposes, return predefined templates
    return [
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
      content: templateData.content
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
