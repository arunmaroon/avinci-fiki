const axios = require('axios');

class FigmaParser {
  constructor() {
    this.accessToken = process.env.FIGMA_ACCESS_TOKEN || '50b9b8f9e05445158f041651360632d3';
    this.baseUrl = 'https://api.figma.com/v1';
  }

  /**
   * Parse Figma URL to extract file key and node ID
   */
  parseFigmaUrl(url) {
    // Handle /file/, /design/, and /proto/ URLs
    const fileKeyMatch = url.match(/\/(?:file|design|proto)\/([a-zA-Z0-9]+)/);
    const nodeIdMatch = url.match(/node-id=([^&]+)/);

    if (!fileKeyMatch) {
      throw new Error('Invalid Figma URL: Could not extract file key. Supported formats: /file/, /design/, or /proto/');
    }

    return {
      fileKey: fileKeyMatch[1],
      nodeId: nodeIdMatch ? decodeURIComponent(nodeIdMatch[1]) : null
    };
  }

  /**
   * Fetch Figma file data
   */
  async getFigmaFile(fileKey, nodeId = null) {
    if (!this.accessToken) {
      throw new Error('Figma access token is not configured');
    }

    let url = `${this.baseUrl}/files/${fileKey}`;
    if (nodeId) {
      url += `?ids=${nodeId}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'X-Figma-Token': this.accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching Figma file:', error.message);
      if (error.response) {
        console.error('Figma API response error:', error.response.status, error.response.data);
      }
      throw new Error(`Failed to fetch Figma file: ${error.message}`);
    }
  }

  /**
   * Extract UI components from Figma file
   */
  extractUIComponents(figmaData) {
    const components = [];
    const frames = [];

    // Extract frames (screens/pages)
    const extractFrames = (node, parentFrame = null) => {
      if (node.type === 'FRAME' || node.type === 'COMPONENT') {
        const frame = {
        id: node.id,
          name: node.name,
        type: node.type,
          x: node.absoluteBoundingBox?.x || 0,
          y: node.absoluteBoundingBox?.y || 0,
          width: node.absoluteBoundingBox?.width || 0,
          height: node.absoluteBoundingBox?.height || 0,
          backgroundColor: this.extractBackgroundColor(node),
          children: []
        };

        if (parentFrame) {
          parentFrame.children.push(frame);
        } else {
          frames.push(frame);
        }

    // Process children
        if (node.children) {
          node.children.forEach(child => {
            extractFrames(child, frame);
            this.extractComponent(child, components, frame);
          });
        }
      } else if (node.children) {
        node.children.forEach(child => {
          extractFrames(child, parentFrame);
          this.extractComponent(child, components, parentFrame);
        });
      }
    };

    // Start extraction from document
    if (figmaData.document) {
      extractFrames(figmaData.document);
    }

    return { components, frames };
  }

  /**
   * Extract individual components
   */
  extractComponent(node, components, parentFrame) {
    if (node.type === 'TEXT') {
      components.push({
        id: node.id,
        name: node.name,
        type: 'TEXT',
        text: node.characters || '',
        x: node.absoluteBoundingBox?.x || 0,
        y: node.absoluteBoundingBox?.y || 0,
        width: node.absoluteBoundingBox?.width || 0,
        height: node.absoluteBoundingBox?.height || 0,
        fontSize: node.style?.fontSize || 14,
        fontFamily: node.style?.fontFamily || 'Inter',
        fontWeight: node.style?.fontWeight || 400,
        color: this.extractTextColor(node),
        parentFrame: parentFrame?.id
      });
    } else if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE') {
      components.push({
        id: node.id,
        name: node.name,
        type: 'SHAPE',
        x: node.absoluteBoundingBox?.x || 0,
        y: node.absoluteBoundingBox?.y || 0,
        width: node.absoluteBoundingBox?.width || 0,
        height: node.absoluteBoundingBox?.height || 0,
        backgroundColor: this.extractBackgroundColor(node),
        borderRadius: this.extractBorderRadius(node),
        borderColor: this.extractBorderColor(node),
        borderWidth: this.extractBorderWidth(node),
        parentFrame: parentFrame?.id
      });
    } else if (node.type === 'VECTOR' || node.type === 'BOOLEAN_OPERATION') {
      components.push({
        id: node.id,
        name: node.name,
        type: 'ICON',
        x: node.absoluteBoundingBox?.x || 0,
        y: node.absoluteBoundingBox?.y || 0,
        width: node.absoluteBoundingBox?.width || 0,
        height: node.absoluteBoundingBox?.height || 0,
        color: this.extractFillColor(node),
        parentFrame: parentFrame?.id
      });
    }
  }

  /**
   * Extract background color from node
   */
  extractBackgroundColor(node) {
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID' && fill.color) {
        const { r, g, b, a = 1 } = fill.color;
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
      }
    }
    return 'transparent';
  }

  /**
   * Extract text color from node
   */
  extractTextColor(node) {
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID' && fill.color) {
        const { r, g, b, a = 1 } = fill.color;
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
      }
    }
    return '#000000';
  }

  /**
   * Extract fill color from node
   */
  extractFillColor(node) {
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID' && fill.color) {
        const { r, g, b, a = 1 } = fill.color;
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
      }
    }
    return '#000000';
  }

  /**
   * Extract border radius from node
   */
  extractBorderRadius(node) {
    if (node.cornerRadius) {
      return node.cornerRadius;
    }
    return 0;
  }

  /**
   * Extract border color from node
   */
  extractBorderColor(node) {
    if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0];
      if (stroke.type === 'SOLID' && stroke.color) {
        const { r, g, b, a = 1 } = stroke.color;
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
      }
    }
    return 'transparent';
  }

  /**
   * Extract border width from node
   */
  extractBorderWidth(node) {
    return node.strokeWeight || 0;
  }

  /**
   * Generate HTML from extracted components
   */
  generateHTML(components, frames) {
    const mobileFrame = frames.find(frame => 
      frame.width > 300 && frame.width < 500 && frame.height > 500
    ) || frames[0];

    if (!mobileFrame) {
      return this.generateBasicHTML(components);
    }

    return this.generateMobileHTML(mobileFrame, components);
  }

  /**
   * Generate mobile app HTML
   */
  generateMobileHTML(frame, components) {
    const frameComponents = components.filter(comp => comp.parentFrame === frame.id);
    
    const componentHTML = frameComponents.map(comp => {
      const styles = {
        position: 'absolute',
        left: `${comp.x - frame.x}px`,
        top: `${comp.y - frame.y}px`,
        width: `${comp.width}px`,
        height: `${comp.height}px`,
        fontSize: comp.fontSize ? `${comp.fontSize}px` : '14px',
        fontFamily: comp.fontFamily || 'Inter, sans-serif',
        fontWeight: comp.fontWeight || '400',
        color: comp.color || '#000000',
        backgroundColor: comp.backgroundColor || 'transparent',
        borderRadius: comp.borderRadius ? `${comp.borderRadius}px` : '0px',
        border: comp.borderColor && comp.borderWidth ? 
          `${comp.borderWidth}px solid ${comp.borderColor}` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      };

      const styleString = Object.entries(styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');

      if (comp.type === 'TEXT') {
        return `<div style="${styleString}">${comp.text}</div>`;
      } else if (comp.type === 'SHAPE') {
        return `<div style="${styleString}"></div>`;
      } else if (comp.type === 'ICON') {
        return `<div style="${styleString}">●</div>`;
      }
      return '';
    }).join('\n');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Figma UI Preview</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
          }
          .mobile-container {
            position: relative;
            width: ${frame.width}px;
            height: ${frame.height}px;
            background: ${frame.backgroundColor};
            border-radius: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            overflow: hidden;
            margin: 0 auto;
          }
          .ui-content {
            position: relative;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div class="mobile-container">
          <div class="ui-content">
            ${componentHTML}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate basic HTML for non-mobile layouts
   */
  generateBasicHTML(components) {
    const componentHTML = components.map(comp => {
      const styles = {
        position: 'absolute',
        left: `${comp.x}px`,
        top: `${comp.y}px`,
        width: `${comp.width}px`,
        height: `${comp.height}px`,
        fontSize: comp.fontSize ? `${comp.fontSize}px` : '14px',
        fontFamily: comp.fontFamily || 'Inter, sans-serif',
        fontWeight: comp.fontWeight || '400',
        color: comp.color || '#000000',
        backgroundColor: comp.backgroundColor || 'transparent',
        borderRadius: comp.borderRadius ? `${comp.borderRadius}px` : '0px',
        border: comp.borderColor && comp.borderWidth ? 
          `${comp.borderWidth}px solid ${comp.borderColor}` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      };

      const styleString = Object.entries(styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');

      if (comp.type === 'TEXT') {
        return `<div style="${styleString}">${comp.text}</div>`;
      } else if (comp.type === 'SHAPE') {
        return `<div style="${styleString}"></div>`;
      } else if (comp.type === 'ICON') {
        return `<div style="${styleString}">●</div>`;
      }
      return '';
    }).join('\n');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Figma UI Preview</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', sans-serif;
            background: #f5f5f5;
            padding: 20px;
          }
          .ui-container {
            position: relative;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
            margin: 0 auto;
            max-width: 800px;
            min-height: 400px;
          }
        </style>
      </head>
      <body>
        <div class="ui-container">
          ${componentHTML}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Parse Figma URL and generate working UI
   */
  async parseFigmaToUI(figmaUrl) {
    try {
      console.log('🎨 Parsing Figma URL:', figmaUrl);
      
      const { fileKey, nodeId } = this.parseFigmaUrl(figmaUrl);
      console.log('📁 File Key:', fileKey, 'Node ID:', nodeId);
      
      const figmaData = await this.getFigmaFile(fileKey, nodeId);
      console.log('✅ Figma file fetched successfully');
      
      const { components, frames } = this.extractUIComponents(figmaData);
      console.log(`🎯 Extracted ${components.length} components and ${frames.length} frames`);
      
      const html = this.generateHTML(components, frames);
      console.log('✅ HTML generated successfully');
      
      return {
        success: true,
        fileKey,
        nodeId,
        components,
        frames,
        html,
        metadata: {
          totalComponents: components.length,
          totalFrames: frames.length,
          hasText: components.some(c => c.type === 'TEXT'),
          hasShapes: components.some(c => c.type === 'SHAPE'),
          hasIcons: components.some(c => c.type === 'ICON')
        }
      };
      
    } catch (error) {
      console.error('❌ Figma parsing failed:', error.message);
      throw error;
    }
  }
}

module.exports = FigmaParser;