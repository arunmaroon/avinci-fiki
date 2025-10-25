const axios = require('axios');
const DesignSystemService = require('./designSystemService');

class BuilderService {
  constructor() {
    this.apiKey = process.env.BUILDER_IO_API_KEY || '50b9b8f9e05445158f041651360632d3';
    this.figmaToken = process.env.FIGMA_ACCESS_TOKEN || 'your_figma_token_here';
    this.designSystemId = process.env.FIGMA_DESIGN_SYSTEM_ID || '1224765904007984562';
    this.baseUrl = 'https://cdn.builder.io/api/v3';
    this.figmaUrl = 'https://api.figma.com/v1';
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
    this.figmaHeaders = {
      'X-Figma-Token': this.figmaToken,
      'Content-Type': 'application/json'
    };
    
    // Initialize design system service
    this.designSystemService = new DesignSystemService();
  }

  /**
   * Parse Figma URL to extract file key and node ID
   */
  parseFigmaUrl(url) {
    const patterns = [
      /figma\.com\/file\/([a-zA-Z0-9]+)\/([^?]+)/,
      /figma\.com\/design\/([a-zA-Z0-9]+)\/([^?]+)/,
      /figma\.com\/proto\/([a-zA-Z0-9]+)\/([^?]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          fileKey: match[1],
          fileName: match[2],
          isValid: true
        };
      }
    }

    return { isValid: false, error: 'Invalid Figma URL format' };
  }

  /**
   * Get Figma file data
   */
  async getFigmaFile(fileKey, nodeId = null) {
    try {
      const url = nodeId 
        ? `${this.figmaUrl}/files/${fileKey}/nodes?ids=${nodeId}&depth=3`
        : `${this.figmaUrl}/files/${fileKey}?depth=3`;
      
      console.log(`📡 Fetching Figma file: ${fileKey}`);
      const response = await axios.get(url, { headers: this.figmaHeaders });
      
      if (nodeId) {
        return response.data.nodes[nodeId];
      }
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching Figma file:', error.message);
      throw new Error(`Failed to fetch Figma file: ${error.message}`);
    }
  }

  /**
   * Extract components from Figma data
   */
  extractFigmaComponents(figmaData) {
    const components = [];
    
    if (figmaData.document) {
      this.traverseFigmaNodes(figmaData.document, components);
    } else if (figmaData.children) {
      this.traverseFigmaNodes(figmaData, components);
    }

    console.log(`🎨 Extracted ${components.length} components from Figma data`);
    
    // If we got very few components, try aggressive extraction
    if (components.length < 5) {
      console.log('🔍 Attempting aggressive extraction...');
      const aggressiveComponents = this.aggressiveExtraction(figmaData);
      components.push(...aggressiveComponents);
      console.log(`🎨 Aggressive extraction added ${aggressiveComponents.length} more components`);
    }

    return components;
  }

  /**
   * Aggressive extraction for complex Figma files
   */
  aggressiveExtraction(figmaData) {
    const components = [];
    
    const traverse = (node, depth = 0) => {
      if (depth > 6) return; // Prevent infinite recursion
      
      if (node.absoluteBoundingBox && 
          node.absoluteBoundingBox.width > 10 && 
          node.absoluteBoundingBox.height > 10) {
        
        const component = {
          id: node.id,
          name: node.name || `Element_${node.id}`,
          type: node.type,
          x: node.absoluteBoundingBox.x,
          y: node.absoluteBoundingBox.y,
          width: node.absoluteBoundingBox.width,
          height: node.absoluteBoundingBox.height,
          text: this.extractText(node),
          backgroundColor: this.extractBackgroundColor(node),
          color: this.extractTextColor(node),
          fontSize: this.extractFontSize(node),
          fontFamily: this.extractFontFamily(node),
          fontWeight: this.extractFontWeight(node),
          borderRadius: this.extractBorderRadius(node),
          borderColor: this.extractBorderColor(node),
          hasText: !!this.extractText(node),
          hasBackground: !!this.extractBackgroundColor(node),
          hasBorder: !!this.extractBorderColor(node),
          fills: node.fills,
          strokes: node.strokes,
          effects: node.effects,
          opacity: node.opacity,
          blendMode: node.blendMode,
          isMask: node.isMask,
          layoutMode: node.layoutMode,
          itemSpacing: node.itemSpacing,
          paddingLeft: node.paddingLeft,
          paddingRight: node.paddingRight,
          paddingTop: node.paddingTop,
          paddingBottom: node.paddingBottom,
          constraints: node.constraints,
          cornerRadius: node.cornerRadius,
          strokeWeight: node.strokeWeight,
          strokeAlign: node.strokeAlign,
          strokeDashes: node.strokeDashes
        };
        
        components.push(component);
      }
      
      if (node.children) {
        node.children.forEach(child => traverse(child, depth + 1));
      }
    };

    if (figmaData.document) {
      traverse(figmaData.document);
    } else if (figmaData.children) {
      traverse(figmaData);
    }

    // Sort components by position (top to bottom, left to right)
    return components.sort((a, b) => {
      if (Math.abs(a.y - b.y) < 10) {
        return a.x - b.x; // Same row, sort by x
      }
      return a.y - b.y; // Different rows, sort by y
    });
  }

  /**
   * Traverse Figma nodes to extract components
   */
  traverseFigmaNodes(node, components, depth = 0) {
    if (depth > 10) return; // Prevent infinite recursion

    // Extract visual elements
    if (node.absoluteBoundingBox || 
        ['TEXT', 'RECTANGLE', 'ELLIPSE', 'VECTOR', 'FRAME', 'GROUP', 'COMPONENT', 'INSTANCE'].includes(node.type) ||
        node.fills || node.strokes) {
      
      const component = {
        id: node.id,
        name: node.name || `Element_${node.id}`,
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
        borderColor: this.extractBorderColor(node),
        hasText: !!this.extractText(node),
        hasBackground: !!this.extractBackgroundColor(node),
        hasBorder: !!this.extractBorderColor(node)
      };

      // Only add if it has meaningful content or visual properties
      if (component.text || component.backgroundColor || component.borderColor || 
          component.width > 10 || component.height > 10) {
        components.push(component);
      }
    }

    // Traverse children
    if (node.children) {
      node.children.forEach(child => this.traverseFigmaNodes(child, components, depth + 1));
    }
  }

  /**
   * Extract text content from node
   */
  extractText(node) {
    if (node.type === 'TEXT' && node.characters) {
      return node.characters;
    }
    
    if (node.style && node.style.textAlignHorizontal) {
      return node.name || '';
    }
    
    // Check for text in style properties
    if (node.style && typeof node.style === 'object') {
      for (const key in node.style) {
        if (typeof node.style[key] === 'string' && node.style[key].length > 0) {
          return node.style[key];
        }
      }
    }
    
    // Use node name as fallback, but filter out generic names
    const genericNames = ['Frame', 'Group', 'Component', 'Instance', 'Rectangle', 'Ellipse'];
    if (node.name && !genericNames.includes(node.name)) {
      return node.name;
    }
    
    return '';
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
    return 14; // Default
  }

  /**
   * Extract font family
   */
  extractFontFamily(node) {
    if (node.style && node.style.fontFamily) {
      return node.style.fontFamily;
    }
    return 'Inter'; // Default
  }

  /**
   * Extract font weight
   */
  extractFontWeight(node) {
    if (node.style && node.style.fontWeight) {
      return node.style.fontWeight;
    }
    return 400; // Default
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

  /**
   * Map Figma type to Builder.io component type
   */
  mapFigmaTypeToBuilderComponent(figmaType) {
    const typeMap = {
      'TEXT': 'Core:Text',
      'RECTANGLE': 'Core:Box',
      'ELLIPSE': 'Core:Box',
      'VECTOR': 'Core:Image',
      'FRAME': 'Core:Fragment',
      'GROUP': 'Core:Fragment',
      'COMPONENT': 'Core:Fragment',
      'INSTANCE': 'Core:Fragment'
    };
    return typeMap[figmaType] || 'Core:Fragment';
  }

  /**
   * Get design system components
   */
  async getDesignSystemComponents() {
    try {
      const response = await axios.get('http://localhost:3001/api/figma-oauth/design-system');
      return response.data;
    } catch (error) {
      console.log('⚠️ Could not fetch design system, using local components');
      return null;
    }
  }

  /**
   * Convert Figma to Builder.io blocks
   */
  async convertFigmaToBuilder(figmaUrl) {
    try {
      console.log('🚀 Starting Figma to Builder.io conversion...');
      
      // Parse URL
      const urlData = this.parseFigmaUrl(figmaUrl);
      if (!urlData.isValid) {
        throw new Error(urlData.error);
      }

      // Fetch Figma data
      const figmaData = await this.getFigmaFile(urlData.fileKey);
      
      // Extract components
      const components = this.extractFigmaComponents(figmaData);
      if (components.length === 0) {
        throw new Error('No components found in Figma file');
      }

      // Get design system data
      const designSystemData = await this.getDesignSystemComponents();
      
      // Create Builder.io blocks
      const blocks = this.createBuilderBlocksWithLocalDesignSystem(components, designSystemData);
      
      // Generate React code
      const reactCode = this.generateReactCode(blocks);

      return {
        success: true,
        blocks,
        components,
        reactCode,
        designSystemUsed: true,
        componentCount: components.length
      };

    } catch (error) {
      console.error('❌ Conversion failed:', error.message);
      return {
        success: false,
        error: error.message,
        blocks: [],
        components: []
      };
    }
  }

  /**
   * Create Builder.io blocks with local design system
   */
  createBuilderBlocksWithLocalDesignSystem(components, designSystemData) {
    console.log('🎨 Creating Builder.io blocks with MoneyView Design System...');
    
    const blocks = [];
    
    components.forEach((component, index) => {
      // Map to local design system
      const dsMapping = this.mapToLocalDesignSystem(component);
      
      const block = {
        '@type': '@builder.io/sdk:Element',
        '@version': 2,
        id: `mv-ds-${component.id}`,
        component: {
          name: dsMapping.componentType,
          options: {
            ...dsMapping.props,
            designSystemComponent: dsMapping.designSystemComponent,
            importPath: dsMapping.importPath
          }
        },
        responsiveStyles: {
          large: {
            position: 'absolute',
            left: `${component.x}px`,
            top: `${component.y}px`,
            width: `${component.width}px`,
            height: `${component.height}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${component.fontSize}px`,
            fontFamily: component.fontFamily,
            fontWeight: component.fontWeight,
            color: component.color || '#000000',
            backgroundColor: component.backgroundColor || 'transparent',
            borderRadius: `${component.borderRadius}px`
          }
        },
        children: []
      };

      if (component.borderColor) {
        block.responsiveStyles.large.border = `1px solid ${component.borderColor}`;
      }

      blocks.push(block);
    });

    return blocks;
  }

  /**
   * Map Figma component to local design system
   */
  mapToLocalDesignSystem(figmaComponent) {
    const { type, name, width, height, hasText, hasBackground, hasBorder, text } = figmaComponent;
    
    // Button mapping
    if (type === 'RECTANGLE' && hasText && width > 80 && height > 30) {
      return {
        componentType: 'DesignSystem:Button',
        designSystemComponent: 'Button',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/button',
        props: {
          children: text || 'Button',
          variant: 'primary',
          size: height > 50 ? 'large' : 'medium'
        }
      };
    }
    
    // Card mapping
    if (type === 'FRAME' && hasBackground && width > 200) {
      return {
        componentType: 'DesignSystem:Card',
        designSystemComponent: 'Card',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/card',
        props: {
          children: text || 'Card Content',
          variant: 'elevated'
        }
      };
    }
    
    // Typography mapping
    if (type === 'TEXT' || hasText) {
      return {
        componentType: 'DesignSystem:Typography',
        designSystemComponent: 'Typography',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/typography',
        props: {
          children: text || name,
          variant: 'body1'
        }
      };
    }
    
    // TextField mapping
    if (type === 'RECTANGLE' && width > 150 && height < 50 && !hasText) {
      return {
        componentType: 'DesignSystem:TextField',
        designSystemComponent: 'TextField',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/text-field',
        props: {
          placeholder: 'Enter text...',
          variant: 'outlined'
        }
      };
    }
    
    // Icon mapping
    if (type === 'VECTOR' || (width < 50 && height < 50)) {
      return {
        componentType: 'DesignSystem:Icon',
        designSystemComponent: 'Icon',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/icon',
        props: {
          name: 'default-icon'
        }
      };
    }
    
    // Checkbox mapping
    if (type === 'RECTANGLE' && width < 30 && height < 30) {
      return {
        componentType: 'DesignSystem:Checkbox',
        designSystemComponent: 'Checkbox',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/checkbox',
        props: {
          checked: false
        }
      };
    }
    
    // Chip mapping
    if (type === 'RECTANGLE' && hasText && width < 100 && height < 40) {
      return {
        componentType: 'DesignSystem:Chip',
        designSystemComponent: 'Chip',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/chip',
        props: {
          children: text || 'Chip',
          variant: 'filled'
        }
      };
    }
    
    // Dialog mapping
    if (type === 'FRAME' && width > 300 && height > 200) {
      return {
        componentType: 'DesignSystem:Dialog',
        designSystemComponent: 'Dialog',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/dialog',
        props: {
          open: true,
          children: text || 'Dialog Content'
        }
      };
    }
    
    // List mapping
    if (type === 'FRAME' && height > 100) {
      return {
        componentType: 'DesignSystem:List',
        designSystemComponent: 'List',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/list',
        props: {
          children: 'List Item'
        }
      };
    }
    
    // RadioButton mapping
    if (type === 'ELLIPSE' && width < 30 && height < 30) {
      return {
        componentType: 'DesignSystem:RadioButton',
        designSystemComponent: 'RadioButton',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/radio-button',
        props: {
          checked: false
        }
      };
    }
    
    // Slider mapping
    if (type === 'RECTANGLE' && width > 100 && height < 20) {
      return {
        componentType: 'DesignSystem:Slider',
        designSystemComponent: 'Slider',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/slider',
        props: {
          value: 50,
          min: 0,
          max: 100
        }
      };
    }
    
    // Tab mapping
    if (type === 'RECTANGLE' && hasText && width < 150 && height < 50) {
      return {
        componentType: 'DesignSystem:Tab',
        designSystemComponent: 'Tab',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/tab',
        props: {
          children: text || 'Tab',
          active: false
        }
      };
    }
    
    // Toggle mapping
    if (type === 'RECTANGLE' && width < 60 && height < 30) {
      return {
        componentType: 'DesignSystem:Toggle',
        designSystemComponent: 'Toggle',
        importPath: './whizdm-mv-pbds-3b30f5427c36/base-ui/toggle',
        props: {
          checked: false
        }
      };
    }
    
    // Default fallback
    return {
      componentType: 'Core:Fragment',
      designSystemComponent: null,
      importPath: null,
      props: {
        children: text || name || 'Element'
      }
    };
  }

  /**
   * Generate React code from Builder.io blocks
   */
  generateReactCode(blocks) {
    const imports = new Set();
    const components = [];
    
    blocks.forEach(block => {
      if (block.component.options.importPath) {
        const importPath = block.component.options.importPath;
        const componentName = block.component.options.designSystemComponent;
        if (componentName) {
          imports.add(`import { ${componentName} } from '${importPath}';`);
        }
      }
    });
    
    blocks.forEach(block => {
      const componentName = block.component.options.designSystemComponent || 'div';
      const props = block.component.options;
      
      let propsString = '';
      if (props.children) {
        propsString += ` children="${props.children}"`;
      }
      if (props.variant) {
        propsString += ` variant="${props.variant}"`;
      }
      if (props.size) {
        propsString += ` size="${props.size}"`;
      }
      if (props.checked !== undefined) {
        propsString += ` checked={${props.checked}}`;
      }
      if (props.value !== undefined) {
        propsString += ` value={${props.value}}`;
      }
      if (props.min !== undefined) {
        propsString += ` min={${props.min}}`;
      }
      if (props.max !== undefined) {
        propsString += ` max={${props.max}}`;
      }
      if (props.active !== undefined) {
        propsString += ` active={${props.active}}`;
      }
      if (props.open !== undefined) {
        propsString += ` open={${props.open}}`;
      }
      if (props.placeholder) {
        propsString += ` placeholder="${props.placeholder}"`;
      }
      if (props.name) {
        propsString += ` name="${props.name}"`;
      }
      
      components.push(`    <${componentName}${propsString} />`);
    });
    
    return `import React from 'react';
${Array.from(imports).join('\n')}

const GeneratedComponent = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
${components.join('\n')}
    </div>
  );
};

export default GeneratedComponent;`;
  }
}

module.exports = BuilderService;
