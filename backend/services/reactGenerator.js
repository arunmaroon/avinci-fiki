/**
 * React Component Generator
 * Generates React components from Figma design data using AI
 */

const { OpenAI } = require('openai');

class ReactGenerator {
    constructor(apiKey) {
        this.openai = new OpenAI({ apiKey });
    }

    /**
     * Generate React component from Figma data
     * @param {Object} figmaData - Figma design data
     * @param {Object} designSystem - Design system configuration
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generated React component
     */
    async generateReactComponent(figmaData, designSystem = {}, options = {}) {
        try {
            console.log(`🤖 Generating React component from Figma data`);
            
            // Check if this is demo mode
            console.log('🔍 Checking demo mode:', {
                hasApiKey: !!this.openai.apiKey,
                apiKey: this.openai.apiKey,
                fileKey: figmaData.fileKey
            });
            
            // Removed demo mode logic - always generate real components
            
            const {
                componentName = 'FigmaComponent',
                framework = 'react',
                styling = 'tailwind',
                typescript = true,
                accessibility = true,
                responsive = true
            } = options;

            // Extract component data
            const componentData = this.extractComponentData(figmaData);
            
            // Generate component code
            const componentCode = await this.generateComponentCode(
                componentData,
                designSystem,
                {
                    componentName,
                    framework,
                    styling,
                    typescript,
                    accessibility,
                    responsive
                }
            );

            // Generate storybook story
            const storyCode = await this.generateStorybookStory(
                componentData,
                componentName,
                options
            );

            // Generate tests
            const testCode = await this.generateTests(
                componentData,
                componentName,
                options
            );

            return {
                component: {
                    name: componentName,
                    code: componentCode,
                    story: storyCode,
                    tests: testCode,
                    metadata: {
                        generatedAt: new Date().toISOString(),
                        framework,
                        styling,
                        typescript,
                        accessibility,
                        responsive
                    }
                },
                designSystem: this.generateDesignSystemConfig(designSystem, styling),
                packageJson: this.generatePackageJson(framework, styling, typescript)
            };
        } catch (error) {
            console.error('❌ React component generation failed:', error);
            throw new Error(`Failed to generate React component: ${error.message}`);
        }
    }

    /**
     * Extract component data from Figma data
     * @param {Object} figmaData - Figma design data
     * @returns {Object} Component data
     */
    extractComponentData(figmaData) {
        console.log('🔍 Figma data structure:', JSON.stringify(figmaData, null, 2));
        
        // Handle both array and object formats for components
        let components = figmaData.components || [];
        if (typeof components === 'object' && !Array.isArray(components)) {
            components = Object.values(components);
        }
        
        console.log('🔍 Components after conversion:', components);
        
        const designTokens = figmaData.designTokens || {};
        
        // Find the main component (usually the first one or largest)
        const mainComponent = components.length > 0 ? components[0] : null;
        
        if (!mainComponent) {
            throw new Error('No components found in Figma data');
        }

        return {
            id: mainComponent.id,
            name: mainComponent.name,
            type: mainComponent.type,
            layout: mainComponent.layout,
            styles: mainComponent.styles,
            children: mainComponent.children || [],
            properties: mainComponent.properties || {},
            variants: mainComponent.variants || [],
            designTokens: designTokens
        };
    }

    /**
     * Generate component code using AI
     * @param {Object} componentData - Component data
     * @param {Object} designSystem - Design system
     * @param {Object} options - Generation options
     * @returns {Promise<string>} Generated component code
     */
    async generateComponentCode(componentData, designSystem, options) {
        const prompt = this.buildComponentPrompt(componentData, designSystem, options);
        
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert React developer who creates pixel-perfect components from Figma designs. Generate clean, accessible, and responsive React components."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 4000,
                temperature: 0.3
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error);
            // Fallback to template-based generation
            return this.generateTemplateComponent(componentData, designSystem, options);
        }
    }

    /**
     * Build component generation prompt
     * @param {Object} componentData - Component data
     * @param {Object} designSystem - Design system
     * @param {Object} options - Generation options
     * @returns {string} Prompt string
     */
    buildComponentPrompt(componentData, designSystem, options) {
        const {
            componentName,
            framework,
            styling,
            typescript,
            accessibility,
            responsive
        } = options;

        return `
Generate a ${framework} component from this Figma design data:

COMPONENT DATA:
${JSON.stringify(componentData, null, 2)}

DESIGN SYSTEM:
${JSON.stringify(designSystem, null, 2)}

REQUIREMENTS:
- Component Name: ${componentName}
- Framework: ${framework}
- Styling: ${styling}
- TypeScript: ${typescript}
- Accessibility: ${accessibility}
- Responsive: ${responsive}

GENERATE:
1. Complete ${framework} component code
2. Use ${styling} for styling
3. Include proper TypeScript types if enabled
4. Add ARIA labels and accessibility features if enabled
5. Make it responsive if enabled
6. Use design tokens from the design system
7. Include proper prop types and default values
8. Add JSDoc comments for documentation

The component should be production-ready and follow React best practices.
        `.trim();
    }

    /**
     * Generate template-based component (fallback)
     * @param {Object} componentData - Component data
     * @param {Object} designSystem - Design system
     * @param {Object} options - Generation options
     * @returns {string} Generated component code
     */
    generateTemplateComponent(componentData, designSystem, options) {
        const {
            componentName,
            framework,
            styling,
            typescript,
            accessibility,
            responsive
        } = options;

        const tsInterface = typescript ? `
interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
  ${this.generatePropsFromVariants(componentData.variants)}
}
` : '';

        const componentCode = `
import React from 'react';
${styling === 'styled-components' ? "import styled from 'styled-components';" : ''}
${typescript ? tsInterface : ''}

const ${componentName}${typescript ? `: React.FC<${componentName}Props>` : ''} = ({
  className = '',
  children,
  ${this.generateDefaultProps(componentData.variants)}
  ...props
}) => {
  return (
    <div 
      className={\`${this.generateClassName(componentData, styling)} \${className}\`}
      ${accessibility ? 'role="button" tabIndex={0}' : ''}
      {...props}
    >
      {children || this.renderContent()}
    </div>
  );
};

${this.generateHelperMethods(componentData)}

export default ${componentName};
        `.trim();

        return componentCode;
    }

    /**
     * Generate Storybook story
     * @param {Object} componentData - Component data
     * @param {string} componentName - Component name
     * @param {Object} options - Generation options
     * @returns {Promise<string>} Generated story code
     */
    async generateStorybookStory(componentData, componentName, options) {
        const storyCode = `
import type { Meta, StoryObj } from '@storybook/react';
import ${componentName} from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ${this.generateStorybookArgTypes(componentData.variants)}
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ${this.generateDefaultStoryArgs(componentData.variants)}
  },
};

${this.generateVariantStories(componentData.variants, componentName)}
        `.trim();

        return storyCode;
    }

    /**
     * Generate component tests
     * @param {Object} componentData - Component data
     * @param {string} componentName - Component name
     * @param {Object} options - Generation options
     * @returns {Promise<string>} Generated test code
     */
    async generateTests(componentData, componentName, options) {
        const testCode = `
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<${componentName} className={customClass} />);
    expect(screen.getByRole('button')).toHaveClass(customClass);
  });

  ${this.generateVariantTests(componentData.variants, componentName)}
});
        `.trim();

        return testCode;
    }

    /**
     * Generate design system configuration
     * @param {Object} designSystem - Design system
     * @param {string} styling - Styling framework
     * @returns {Object} Design system config
     */
    generateDesignSystemConfig(designSystem, styling) {
        if (styling === 'tailwind') {
            return {
                tailwind: {
                    content: ['./src/**/*.{js,ts,jsx,tsx}'],
                    theme: {
                        extend: {
                            colors: this.convertToTailwindColors(designSystem.tokens?.color || {}),
                            spacing: this.convertToTailwindSpacing(designSystem.tokens?.spacing || {}),
                            fontFamily: this.convertToTailwindFonts(designSystem.tokens?.typography || {}),
                        }
                    }
                }
            };
        }

        if (styling === 'styled-components') {
            return {
                theme: {
                    colors: designSystem.tokens?.color || {},
                    spacing: designSystem.tokens?.spacing || {},
                    typography: designSystem.tokens?.typography || {}
                }
            };
        }

        return designSystem;
    }

    /**
     * Generate package.json
     * @param {string} framework - Framework type
     * @param {string} styling - Styling framework
     * @param {boolean} typescript - TypeScript support
     * @returns {Object} Package.json object
     */
    generatePackageJson(framework, styling, typescript) {
        const dependencies = {
            'react': '^18.2.0',
            'react-dom': '^18.2.0'
        };

        const devDependencies = {
            '@vitejs/plugin-react': '^4.0.0',
            'vite': '^4.4.0'
        };

        if (styling === 'tailwind') {
            dependencies['tailwindcss'] = '^3.3.0';
            devDependencies['autoprefixer'] = '^10.4.0';
            devDependencies['postcss'] = '^8.4.0';
        }

        if (styling === 'styled-components') {
            dependencies['styled-components'] = '^6.0.0';
        }

        if (typescript) {
            devDependencies['typescript'] = '^5.0.0';
            devDependencies['@types/react'] = '^18.2.0';
            devDependencies['@types/react-dom'] = '^18.2.0';
        }

        return {
            name: `figma-${framework}-component`,
            version: '1.0.0',
            type: 'module',
            scripts: {
                dev: 'vite',
                build: 'vite build',
                preview: 'vite preview'
            },
            dependencies,
            devDependencies
        };
    }

    // Helper methods

    /**
     * Generate props from variants
     * @param {Array} variants - Component variants
     * @returns {string} Props string
     */
    generatePropsFromVariants(variants) {
        if (!variants || variants.length === 0) return '';
        
        return variants.map(variant => 
            `${variant.property}?: ${this.getTypeFromValue(variant.value)};`
        ).join('\n  ');
    }

    /**
     * Generate default props
     * @param {Array} variants - Component variants
     * @returns {string} Default props string
     */
    generateDefaultProps(variants) {
        if (!variants || variants.length === 0) return '';
        
        return variants.map(variant => 
            `${variant.property} = '${variant.value}'`
        ).join(',\n  ');
    }

    /**
     * Generate className
     * @param {Object} componentData - Component data
     * @param {string} styling - Styling framework
     * @returns {string} ClassName string
     */
    generateClassName(componentData, styling) {
        if (styling === 'tailwind') {
            return this.generateTailwindClasses(componentData);
        }
        
        return 'figma-component';
    }

    /**
     * Generate Tailwind classes
     * @param {Object} componentData - Component data
     * @returns {string} Tailwind classes
     */
    generateTailwindClasses(componentData) {
        const classes = [];
        
        // Layout classes
        if (componentData.layout) {
            classes.push('relative');
            if (componentData.layout.width) {
                classes.push(`w-${Math.round(componentData.layout.width)}`);
            }
            if (componentData.layout.height) {
                classes.push(`h-${Math.round(componentData.layout.height)}`);
            }
        }
        
        // Style classes
        if (componentData.styles) {
            if (componentData.styles.cornerRadius) {
                classes.push('rounded-lg');
            }
        }
        
        return classes.join(' ');
    }

    /**
     * Generate helper methods
     * @param {Object} componentData - Component data
     * @returns {string} Helper methods
     */
    generateHelperMethods(componentData) {
        return `
  renderContent() {
    return (
      <div className="content">
        {/* Add your content here */}
      </div>
    );
  }
        `.trim();
    }

    /**
     * Generate Storybook arg types
     * @param {Array} variants - Component variants
     * @returns {string} Arg types string
     */
    generateStorybookArgTypes(variants) {
        if (!variants || variants.length === 0) return '';
        
        return variants.map(variant => 
            `${variant.property}: {
    control: 'select',
    options: ['${variant.value}'],
    description: '${variant.property} variant'
  }`
        ).join(',\n    ');
    }

    /**
     * Generate default story args
     * @param {Array} variants - Component variants
     * @returns {string} Default args string
     */
    generateDefaultStoryArgs(variants) {
        if (!variants || variants.length === 0) return '';
        
        return variants.map(variant => 
            `${variant.property}: '${variant.value}'`
        ).join(',\n    ');
    }

    /**
     * Generate variant stories
     * @param {Array} variants - Component variants
     * @param {string} componentName - Component name
     * @returns {string} Variant stories
     */
    generateVariantStories(variants, componentName) {
        if (!variants || variants.length === 0) return '';
        
        return variants.map(variant => `
export const ${variant.property}: Story = {
  args: {
    ${variant.property}: '${variant.value}'
  },
};
        `).join('\n');
    }

    /**
     * Generate variant tests
     * @param {Array} variants - Component variants
     * @param {string} componentName - Component name
     * @returns {string} Variant tests
     */
    generateVariantTests(variants, componentName) {
        if (!variants || variants.length === 0) return '';
        
        return variants.map(variant => `
  it('renders with ${variant.property} variant', () => {
    render(<${componentName} ${variant.property}="${variant.value}" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
        `).join('\n');
    }

    /**
     * Get type from value
     * @param {*} value - Value
     * @returns {string} Type string
     */
    getTypeFromValue(value) {
        if (typeof value === 'string') return 'string';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'boolean';
        return 'string';
    }

    /**
     * Convert to Tailwind colors
     * @param {Object} colors - Color tokens
     * @returns {Object} Tailwind colors
     */
    convertToTailwindColors(colors) {
        const tailwindColors = {};
        Object.entries(colors).forEach(([key, value]) => {
            tailwindColors[key] = value.value || value;
        });
        return tailwindColors;
    }

    /**
     * Convert to Tailwind spacing
     * @param {Object} spacing - Spacing tokens
     * @returns {Object} Tailwind spacing
     */
    convertToTailwindSpacing(spacing) {
        const tailwindSpacing = {};
        Object.entries(spacing).forEach(([key, value]) => {
            const spacingValue = value.value || value;
            const numericValue = spacingValue.replace('px', '');
            tailwindSpacing[key] = numericValue;
        });
        return tailwindSpacing;
    }

    /**
     * Convert to Tailwind fonts
     * @param {Object} typography - Typography tokens
     * @returns {Array} Tailwind fonts
     */
    convertToTailwindFonts(typography) {
        const fonts = new Set();
        Object.values(typography).forEach(style => {
            if (style.fontFamily?.value) {
                fonts.add(style.fontFamily.value);
            }
        });
        return Array.from(fonts);
    }

    /**
     * Get demo React component for testing purposes
     * @param {Object} figmaData - Figma design data
     * @param {Object} designSystem - Design system configuration
     * @param {Object} options - Generation options
     * @returns {Object} Demo React component
     */
    getDemoReactComponent(figmaData, designSystem = {}, options = {}) {
        const {
            componentName = 'DemoComponent',
            framework = 'react',
            styling = 'tailwind',
            typescript = true,
            accessibility = true,
            responsive = true
        } = options;

        const componentCode = `import React from 'react';
${typescript ? `interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}` : ''}

const ${componentName}${typescript ? `: React.FC<${componentName}Props>` : ''} = ({
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    accent: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${disabledClasses} \${className}\`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children || 'Demo Button'}
    </button>
  );
};

export default ${componentName};`;

        const storyCode = `import type { Meta, StoryObj } from '@storybook/react';
import ${componentName} from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'accent'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Demo Button',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};`;

        const testCode = `import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('renders with default props', () => {
    render(<${componentName}>Test Button</${componentName}>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<${componentName} className={customClass}>Test</${componentName}>);
    expect(screen.getByRole('button')).toHaveClass(customClass);
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<${componentName} onClick={handleClick}>Test</${componentName}>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<${componentName} disabled>Test</${componentName}>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});`;

        return {
            component: {
                code: componentCode,
                language: 'typescript',
                filename: `${componentName}.tsx`
            },
            story: {
                code: storyCode,
                language: 'typescript',
                filename: `${componentName}.stories.tsx`
            },
            test: {
                code: testCode,
                language: 'typescript',
                filename: `${componentName}.test.tsx`
            },
            metadata: {
                componentName,
                framework,
                styling,
                typescript,
                accessibility,
                responsive,
                generatedAt: new Date().toISOString(),
                demoMode: true
            }
        };
    }
}

module.exports = ReactGenerator;
