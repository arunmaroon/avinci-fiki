const path = require('path');
const fs = require('fs');

class DesignSystemService {
  constructor() {
    this.designSystemPath = path.join(__dirname, '../../whizdm-mv-pbds-3b30f5427c36/base-ui');
    this.components = this.loadDesignSystemComponents();
  }

  /**
   * Load available design system components
   */
  loadDesignSystemComponents() {
    const components = {};
    
    try {
      const componentDirs = fs.readdirSync(this.designSystemPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      componentDirs.forEach(componentName => {
        const componentPath = path.join(this.designSystemPath, componentName);
        const indexPath = path.join(componentPath, 'index.ts');
        
        if (fs.existsSync(indexPath)) {
          components[componentName] = {
            name: componentName,
            path: componentPath,
            available: true
          };
        }
      });

      console.log(`🎨 Loaded ${Object.keys(components).length} design system components:`, Object.keys(components));
      return components;
    } catch (error) {
      console.error('❌ Failed to load design system components:', error.message);
      return {};
    }
  }

  /**
   * Map Figma element to design system component
   */
  mapFigmaToDesignSystem(figmaElement) {
    const { type, name, text } = figmaElement;
    
    // Map based on element type and name patterns
    if (type === 'TEXT') {
      if (name.toLowerCase().includes('button') || text?.toLowerCase().includes('button')) {
        return this.createDesignSystemComponent('button', figmaElement);
      }
      if (name.toLowerCase().includes('title') || name.toLowerCase().includes('heading')) {
        return this.createDesignSystemComponent('title', figmaElement);
      }
      if (name.toLowerCase().includes('card')) {
        return this.createDesignSystemComponent('card', figmaElement);
      }
      return this.createDesignSystemComponent('typography', figmaElement);
    }
    
    if (type === 'FRAME' || type === 'GROUP') {
      if (name.toLowerCase().includes('card')) {
        return this.createDesignSystemComponent('card', figmaElement);
      }
      if (name.toLowerCase().includes('button')) {
        return this.createDesignSystemComponent('button', figmaElement);
      }
      if (name.toLowerCase().includes('input') || name.toLowerCase().includes('field')) {
        return this.createDesignSystemComponent('text-field', figmaElement);
      }
      return this.createDesignSystemComponent('card', figmaElement);
    }
    
    if (type === 'RECTANGLE') {
      if (name.toLowerCase().includes('button')) {
        return this.createDesignSystemComponent('button', figmaElement);
      }
      return this.createDesignSystemComponent('card', figmaElement);
    }
    
    // Default fallback
    return this.createDesignSystemComponent('card', figmaElement);
  }

  /**
   * Create a design system component configuration
   */
  createDesignSystemComponent(componentType, figmaElement) {
    const component = this.components[componentType];
    
    if (!component) {
      console.log(`⚠️ Design system component '${componentType}' not found, using fallback`);
      return this.createFallbackComponent(figmaElement);
    }

    const baseConfig = {
      type: 'design-system',
      componentType: componentType,
      figmaElement: figmaElement,
      available: true
    };

    // Add component-specific configurations
    switch (componentType) {
      case 'button':
        return {
          ...baseConfig,
          props: {
            children: figmaElement.text || figmaElement.name || 'Button',
            variant: 'primary',
            size: 'buttonDefault',
            disabled: false
          }
        };
      
      case 'card':
        return {
          ...baseConfig,
          props: {
            id: figmaElement.id,
            title: figmaElement.text || figmaElement.name || 'Card Title',
            variant: 'cardVariant1',
            children: figmaElement.text || ''
          }
        };
      
      case 'title':
        return {
          ...baseConfig,
          props: {
            children: figmaElement.text || figmaElement.name || 'Title',
            variant: 'h1'
          }
        };
      
      case 'typography':
        return {
          ...baseConfig,
          props: {
            children: figmaElement.text || figmaElement.name || 'Text',
            variant: 'body1'
          }
        };
      
      case 'text-field':
        return {
          ...baseConfig,
          props: {
            label: figmaElement.name || 'Input',
            placeholder: figmaElement.text || '',
            variant: 'outlined'
          }
        };
      
      default:
        return this.createFallbackComponent(figmaElement);
    }
  }

  /**
   * Create fallback component when design system component is not available
   */
  createFallbackComponent(figmaElement) {
    return {
      type: 'fallback',
      componentType: 'div',
      figmaElement: figmaElement,
      available: false,
      props: {
        children: figmaElement.text || figmaElement.name || 'Element'
      }
    };
  }

  /**
   * Generate Builder.io block from design system component
   */
  generateBuilderBlock(designSystemComponent) {
    const { componentType, props, figmaElement } = designSystemComponent;
    
    // Create a custom Builder.io component that references the design system
    return {
      '@type': '@builder.io/sdk:Element',
      '@version': 2,
      id: `ds-${figmaElement.id}`,
      component: {
        name: `DesignSystem:${componentType}`,
        options: {
          ...props,
          designSystemComponent: componentType,
          figmaData: figmaElement
        }
      },
      responsiveStyles: {
        large: {
          position: 'relative',
          left: `${figmaElement.x}px`,
          top: `${figmaElement.y}px`,
          width: `${figmaElement.width}px`,
          height: `${figmaElement.height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }
    };
  }

  /**
   * Get available design system components
   */
  getAvailableComponents() {
    return Object.keys(this.components);
  }

  /**
   * Check if a component is available in the design system
   */
  isComponentAvailable(componentType) {
    return this.components[componentType]?.available || false;
  }
}

module.exports = DesignSystemService;
