const axios = require('axios');

class FigmaExtractor {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://api.figma.com/v1';
  }

  /**
   * Extract components from Figma file
   */
  async extractComponents(fileKey, nodeId = null) {
    try {
      console.log(`🔍 Extracting components from Figma file: ${fileKey}`);
      console.log(`🔍 Access token: ${this.accessToken.substring(0, 10)}...`);
      
      // Removed demo mode logic - always fetch real Figma data
      
      // Use the provided Figma token directly
      if (this.accessToken === process.env.FIGMA_PERSONAL_ACCESS_TOKEN) {
        console.log(`🎨 Using production Figma token for real data extraction`);
      }
      
      // Fetch file data
      console.log(`📡 Making Figma API call for file: ${fileKey}`);
      const fileData = await this.getFile(fileKey, nodeId);
      
      // Extract components
      const components = this.parseComponents(fileData);
      console.log(`✅ Extracted ${components.length} components`);
      
      return {
        success: true,
        components,
        fileData
      };
      
    } catch (error) {
      console.error('❌ Component extraction failed:', error.message);
      return {
        success: false,
        error: error.message,
        components: []
      };
    }
  }

  /**
   * Get Figma file data
   */
  async getFile(fileKey, nodeId = null) {
    const url = nodeId 
      ? `${this.baseUrl}/files/${fileKey}/nodes?ids=${nodeId}`
      : `${this.baseUrl}/files/${fileKey}`;
    
    const response = await axios.get(url, {
      headers: {
        'X-Figma-Token': this.accessToken
      }
    });
    
    return nodeId ? response.data.nodes[nodeId] : response.data;
  }

  /**
   * Parse components from Figma data
   */
  parseComponents(data) {
    const components = [];
    
    if (data.document) {
      this.traverseNodes(data.document, components);
    } else if (data.children) {
      this.traverseNodes(data, components);
    }
    
    return components;
  }

  /**
   * Traverse Figma nodes to find components
   */
  traverseNodes(node, components, depth = 0) {
    if (depth > 10) return; // Prevent infinite recursion
    
    // Check if this is a component or instance
    if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
      const component = {
        id: node.id,
        name: node.name,
        type: node.type,
        x: node.absoluteBoundingBox?.x || 0,
        y: node.absoluteBoundingBox?.y || 0,
        width: node.absoluteBoundingBox?.width || 0,
        height: node.absoluteBoundingBox?.height || 0,
        text: this.extractText(node),
        backgroundColor: this.extractBackgroundColor(node),
        color: this.extractTextColor(node),
        fontSize: this.extractFontSize(node),
        fontFamily: this.extractFontFamily(node),
        fontWeight: this.extractFontWeight(node),
        borderRadius: this.extractBorderRadius(node),
        borderColor: this.extractBorderColor(node)
      };
      
      components.push(component);
    }
    
    // Traverse children
    if (node.children) {
      node.children.forEach(child => this.traverseNodes(child, components, depth + 1));
    }
  }

  /**
   * Extract text content from node
   */
  extractText(node) {
    if (node.type === 'TEXT' && node.characters) {
      return node.characters;
    }
    return node.name || '';
  }

  /**
   * Extract background color
   */
  extractBackgroundColor(node) {
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID' && fill.color) {
        const { r, g, b } = fill.color;
        const alpha = fill.opacity || 1;
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
      }
    }
    return null;
  }

  /**
   * Extract text color
   */
  extractTextColor(node) {
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID' && fill.color) {
        const { r, g, b } = fill.color;
        const alpha = fill.opacity || 1;
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
      }
    }
    return null;
  }

  /**
   * Extract font size
   */
  extractFontSize(node) {
    if (node.style && node.style.fontSize) {
      return node.style.fontSize;
    }
    return 14;
  }

  /**
   * Extract font family
   */
  extractFontFamily(node) {
    if (node.style && node.style.fontFamily) {
      return node.style.fontFamily;
    }
    return 'Inter';
  }

  /**
   * Extract font weight
   */
  extractFontWeight(node) {
    if (node.style && node.style.fontWeight) {
      return node.style.fontWeight;
    }
    return 400;
  }

  /**
   * Extract border radius
   */
  extractBorderRadius(node) {
    if (node.cornerRadius) {
      return node.cornerRadius;
    }
    return 0;
  }

  /**
   * Extract border color
   */
  extractBorderColor(node) {
    if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0];
      if (stroke.type === 'SOLID' && stroke.color) {
        const { r, g, b } = stroke.color;
        const alpha = stroke.opacity || 1;
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
      }
    }
    return null;
  }
}

module.exports = FigmaExtractor;
