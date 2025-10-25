/**
 * Figma to JSON Converter
 * Converts Figma design data to various JSON formats
 */

class JsonConverter {
    /**
     * Convert Figma design data to JSON
     * @param {Object} figmaData - Figma design data
     * @param {string} format - Output format (styleDict, custom, tailwind, css)
     * @param {Object} options - Conversion options
     * @returns {Object} Converted JSON
     */
    static convertToJSON(figmaData, format = 'styleDict', options = {}) {
        console.log(`🔄 Converting Figma data to ${format} format`);
        
        const {
            includeComponents = true,
            includePrototypes = true,
            includeStyles = true,
            designSystem = 'custom'
        } = options;

        const baseData = {
            metadata: {
                source: 'figma',
                fileKey: figmaData.fileKey,
                nodeId: figmaData.nodeId,
                name: figmaData.metadata?.name || 'Untitled',
                lastModified: figmaData.metadata?.lastModified,
                version: figmaData.metadata?.version,
                convertedAt: new Date().toISOString(),
                format: format
            }
        };

        switch (format.toLowerCase()) {
            case 'styledict':
                return this.convertToStyleDictionary(figmaData, baseData, options);
            case 'tailwind':
                return this.convertToTailwind(figmaData, baseData, options);
            case 'css':
                return this.convertToCSS(figmaData, baseData, options);
            case 'custom':
                return this.convertToCustom(figmaData, baseData, options);
            case 'designsystem':
                return this.convertToDesignSystem(figmaData, baseData, options);
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    /**
     * Convert to Style Dictionary format
     * @param {Object} figmaData - Figma data
     * @param {Object} baseData - Base data object
     * @param {Object} options - Options
     * @returns {Object} Style Dictionary JSON
     */
    static convertToStyleDictionary(figmaData, baseData, options) {
        const tokens = figmaData.designTokens || {};
        
        return {
            ...baseData,
            tokens: {
                color: this.formatColorTokens(tokens.color || {}),
                spacing: this.formatSpacingTokens(tokens.spacing || {}),
                typography: this.formatTypographyTokens(tokens.typography || {}),
                borderRadius: this.formatBorderRadiusTokens(tokens.borderRadius || {}),
                shadows: this.formatShadowTokens(tokens.shadows || {}),
                effects: this.formatEffectTokens(tokens.effects || {})
            },
            components: options.includeComponents ? this.formatComponents(figmaData.components || []) : undefined,
            prototypes: options.includePrototypes ? this.formatPrototypes(figmaData.prototypes || []) : undefined
        };
    }

    /**
     * Convert to Tailwind CSS format
     * @param {Object} figmaData - Figma data
     * @param {Object} baseData - Base data object
     * @param {Object} options - Options
     * @returns {Object} Tailwind config JSON
     */
    static convertToTailwind(figmaData, baseData, options) {
        const tokens = figmaData.designTokens || {};
        
        return {
            ...baseData,
            theme: {
                extend: {
                    colors: this.convertToTailwindColors(tokens.color || {}),
                    spacing: this.convertToTailwindSpacing(tokens.spacing || {}),
                    fontFamily: this.convertToTailwindFonts(tokens.typography || {}),
                    fontSize: this.convertToTailwindFontSizes(tokens.typography || {}),
                    borderRadius: this.convertToTailwindBorderRadius(tokens.borderRadius || {}),
                    boxShadow: this.convertToTailwindShadows(tokens.shadows || {})
                }
            },
            components: options.includeComponents ? this.formatTailwindComponents(figmaData.components || []) : undefined
        };
    }

    /**
     * Convert to CSS custom properties format
     * @param {Object} figmaData - Figma data
     * @param {Object} baseData - Base data object
     * @param {Object} options - Options
     * @returns {Object} CSS custom properties JSON
     */
    static convertToCSS(figmaData, baseData, options) {
        const tokens = figmaData.designTokens || {};
        
        return {
            ...baseData,
            css: {
                ':root': {
                    ...this.convertToCSSVariables(tokens.color || {}, 'color'),
                    ...this.convertToCSSVariables(tokens.spacing || {}, 'spacing'),
                    ...this.convertToCSSVariables(tokens.typography || {}, 'typography'),
                    ...this.convertToCSSVariables(tokens.borderRadius || {}, 'border-radius'),
                    ...this.convertToCSSVariables(tokens.shadows || {}, 'shadow')
                }
            },
            components: options.includeComponents ? this.formatCSSComponents(figmaData.components || []) : undefined
        };
    }

    /**
     * Convert to custom format
     * @param {Object} figmaData - Figma data
     * @param {Object} baseData - Base data object
     * @param {Object} options - Options
     * @returns {Object} Custom format JSON
     */
    static convertToCustom(figmaData, baseData, options) {
        return {
            ...baseData,
            designSystem: {
                tokens: figmaData.designTokens || {},
                components: options.includeComponents ? figmaData.components || [] : undefined,
                prototypes: options.includePrototypes ? figmaData.prototypes || [] : undefined,
                styles: options.includeStyles ? figmaData.styles || {} : undefined
            }
        };
    }

    /**
     * Convert to design system format
     * @param {Object} figmaData - Figma data
     * @param {Object} baseData - Base data object
     * @param {Object} options - Options
     * @returns {Object} Design system JSON
     */
    static convertToDesignSystem(figmaData, baseData, options) {
        const tokens = figmaData.designTokens || {};
        
        return {
            ...baseData,
            designSystem: {
                name: options.designSystem || 'Custom Design System',
                version: '1.0.0',
                tokens: {
                    semantic: this.createSemanticTokens(tokens),
                    primitive: this.createPrimitiveTokens(tokens)
                },
                components: options.includeComponents ? this.formatDesignSystemComponents(figmaData.components || []) : undefined,
                patterns: this.createDesignPatterns(figmaData.components || []),
                guidelines: this.createDesignGuidelines(tokens)
            }
        };
    }

    // Formatting methods

    /**
     * Format color tokens
     * @param {Object} colors - Color tokens
     * @returns {Object} Formatted color tokens
     */
    static formatColorTokens(colors) {
        const formatted = {};
        Object.entries(colors).forEach(([key, value]) => {
            formatted[key] = {
                value: value.value || value,
                type: 'color',
                description: `Color token: ${key}`
            };
        });
        return formatted;
    }

    /**
     * Format spacing tokens
     * @param {Object} spacing - Spacing tokens
     * @returns {Object} Formatted spacing tokens
     */
    static formatSpacingTokens(spacing) {
        const formatted = {};
        Object.entries(spacing).forEach(([key, value]) => {
            formatted[key] = {
                value: value.value || value,
                type: 'spacing',
                description: `Spacing token: ${key}`
            };
        });
        return formatted;
    }

    /**
     * Format typography tokens
     * @param {Object} typography - Typography tokens
     * @returns {Object} Formatted typography tokens
     */
    static formatTypographyTokens(typography) {
        const formatted = {};
        Object.entries(typography).forEach(([key, value]) => {
            formatted[key] = {
                ...value,
                type: 'typography',
                description: `Typography token: ${key}`
            };
        });
        return formatted;
    }

    /**
     * Format border radius tokens
     * @param {Object} borderRadius - Border radius tokens
     * @returns {Object} Formatted border radius tokens
     */
    static formatBorderRadiusTokens(borderRadius) {
        const formatted = {};
        Object.entries(borderRadius).forEach(([key, value]) => {
            formatted[key] = {
                value: value.value || value,
                type: 'borderRadius',
                description: `Border radius token: ${key}`
            };
        });
        return formatted;
    }

    /**
     * Format shadow tokens
     * @param {Object} shadows - Shadow tokens
     * @returns {Object} Formatted shadow tokens
     */
    static formatShadowTokens(shadows) {
        const formatted = {};
        Object.entries(shadows).forEach(([key, value]) => {
            formatted[key] = {
                value: value.value || value,
                type: 'shadow',
                description: `Shadow token: ${key}`
            };
        });
        return formatted;
    }

    /**
     * Format effect tokens
     * @param {Object} effects - Effect tokens
     * @returns {Object} Formatted effect tokens
     */
    static formatEffectTokens(effects) {
        const formatted = {};
        Object.entries(effects).forEach(([key, value]) => {
            formatted[key] = {
                value: value.value || value,
                type: 'effect',
                description: `Effect token: ${key}`
            };
        });
        return formatted;
    }

    /**
     * Format components
     * @param {Array} components - Components array
     * @returns {Array} Formatted components
     */
    static formatComponents(components) {
        return components.map(component => ({
            id: component.id,
            name: component.name,
            path: component.path,
            type: component.type,
            layout: component.layout,
            styles: component.styles,
            children: component.children,
            properties: component.properties,
            variants: component.variants,
            usage: {
                import: `import { ${component.name} } from './components/${component.name}'`,
                example: `<${component.name} />`
            }
        }));
    }

    /**
     * Format prototypes
     * @param {Array} prototypes - Prototypes array
     * @returns {Array} Formatted prototypes
     */
    static formatPrototypes(prototypes) {
        return prototypes.map(prototype => ({
            id: prototype.id,
            name: prototype.name,
            startNodeId: prototype.startNodeId,
            interactions: prototype.interactions,
            transitions: prototype.transitions,
            usage: {
                description: `Prototype: ${prototype.name}`,
                interactions: prototype.interactions.length
            }
        }));
    }

    // Tailwind conversion methods

    /**
     * Convert to Tailwind colors
     * @param {Object} colors - Color tokens
     * @returns {Object} Tailwind colors
     */
    static convertToTailwindColors(colors) {
        const tailwindColors = {};
        Object.entries(colors).forEach(([key, value]) => {
            const colorValue = value.value || value;
            tailwindColors[key] = colorValue;
        });
        return tailwindColors;
    }

    /**
     * Convert to Tailwind spacing
     * @param {Object} spacing - Spacing tokens
     * @returns {Object} Tailwind spacing
     */
    static convertToTailwindSpacing(spacing) {
        const tailwindSpacing = {};
        Object.entries(spacing).forEach(([key, value]) => {
            const spacingValue = value.value || value;
            // Remove 'px' suffix for Tailwind
            const numericValue = spacingValue.replace('px', '');
            tailwindSpacing[key] = numericValue;
        });
        return tailwindSpacing;
    }

    /**
     * Convert to Tailwind fonts
     * @param {Object} typography - Typography tokens
     * @returns {Object} Tailwind fonts
     */
    static convertToTailwindFonts(typography) {
        const fonts = new Set();
        Object.values(typography).forEach(style => {
            if (style.fontFamily?.value) {
                fonts.add(style.fontFamily.value);
            }
        });
        return Array.from(fonts);
    }

    /**
     * Convert to Tailwind font sizes
     * @param {Object} typography - Typography tokens
     * @returns {Object} Tailwind font sizes
     */
    static convertToTailwindFontSizes(typography) {
        const fontSizes = {};
        Object.entries(typography).forEach(([key, value]) => {
            if (value.fontSize?.value) {
                const size = value.fontSize.value.replace('px', '');
                fontSizes[key] = [size, { lineHeight: value.lineHeight?.value || 'normal' }];
            }
        });
        return fontSizes;
    }

    /**
     * Convert to Tailwind border radius
     * @param {Object} borderRadius - Border radius tokens
     * @returns {Object} Tailwind border radius
     */
    static convertToTailwindBorderRadius(borderRadius) {
        const tailwindBorderRadius = {};
        Object.entries(borderRadius).forEach(([key, value]) => {
            const radiusValue = value.value || value;
            const numericValue = radiusValue.replace('px', '');
            tailwindBorderRadius[key] = numericValue;
        });
        return tailwindBorderRadius;
    }

    /**
     * Convert to Tailwind shadows
     * @param {Object} shadows - Shadow tokens
     * @returns {Object} Tailwind shadows
     */
    static convertToTailwindShadows(shadows) {
        const tailwindShadows = {};
        Object.entries(shadows).forEach(([key, value]) => {
            const shadowValue = value.value || value;
            tailwindShadows[key] = shadowValue;
        });
        return tailwindShadows;
    }

    // CSS conversion methods

    /**
     * Convert to CSS variables
     * @param {Object} tokens - Token object
     * @param {string} prefix - CSS variable prefix
     * @returns {Object} CSS variables
     */
    static convertToCSSVariables(tokens, prefix) {
        const variables = {};
        Object.entries(tokens).forEach(([key, value]) => {
            const cssKey = `--${prefix}-${key}`;
            const cssValue = value.value || value;
            variables[cssKey] = cssValue;
        });
        return variables;
    }

    // Design system methods

    /**
     * Create semantic tokens
     * @param {Object} tokens - All tokens
     * @returns {Object} Semantic tokens
     */
    static createSemanticTokens(tokens) {
        return {
            color: {
                primary: tokens.color?.primary || { value: '#0066FF' },
                secondary: tokens.color?.secondary || { value: '#00CC88' },
                success: tokens.color?.success || { value: '#00CC88' },
                warning: tokens.color?.warning || { value: '#FFB800' },
                error: tokens.color?.error || { value: '#FF4444' },
                neutral: tokens.color?.neutral || { value: '#6B7280' }
            },
            spacing: {
                xs: tokens.spacing?.xs || { value: '4px' },
                sm: tokens.spacing?.sm || { value: '8px' },
                md: tokens.spacing?.md || { value: '16px' },
                lg: tokens.spacing?.lg || { value: '24px' },
                xl: tokens.spacing?.xl || { value: '32px' }
            },
            typography: {
                heading1: tokens.typography?.heading1 || {
                    fontFamily: { value: 'Inter' },
                    fontSize: { value: '32px' },
                    fontWeight: { value: 700 }
                },
                body: tokens.typography?.body || {
                    fontFamily: { value: 'Inter' },
                    fontSize: { value: '16px' },
                    fontWeight: { value: 400 }
                }
            }
        };
    }

    /**
     * Create primitive tokens
     * @param {Object} tokens - All tokens
     * @returns {Object} Primitive tokens
     */
    static createPrimitiveTokens(tokens) {
        return {
            color: tokens.color || {},
            spacing: tokens.spacing || {},
            typography: tokens.typography || {},
            borderRadius: tokens.borderRadius || {},
            shadows: tokens.shadows || {}
        };
    }

    /**
     * Format design system components
     * @param {Array} components - Components array
     * @returns {Array} Design system components
     */
    static formatDesignSystemComponents(components) {
        return components.map(component => ({
            ...component,
            category: this.categorizeComponent(component),
            usage: {
                import: `import { ${component.name} } from '@design-system/${component.name}'`,
                example: this.generateComponentExample(component),
                props: this.generateComponentProps(component)
            }
        }));
    }

    /**
     * Create design patterns
     * @param {Array} components - Components array
     * @returns {Array} Design patterns
     */
    static createDesignPatterns(components) {
        const patterns = [];
        
        // Group components by category
        const categories = {};
        components.forEach(component => {
            const category = this.categorizeComponent(component);
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(component);
        });

        // Create patterns for each category
        Object.entries(categories).forEach(([category, categoryComponents]) => {
            patterns.push({
                name: `${category} Pattern`,
                category: category,
                components: categoryComponents.map(c => c.name),
                description: `Common ${category} components and their usage patterns`
            });
        });

        return patterns;
    }

    /**
     * Create design guidelines
     * @param {Object} tokens - Design tokens
     * @returns {Object} Design guidelines
     */
    static createDesignGuidelines(tokens) {
        return {
            color: {
                primary: 'Use primary colors for main actions and branding',
                secondary: 'Use secondary colors for supporting elements',
                neutral: 'Use neutral colors for text and backgrounds'
            },
            spacing: {
                consistent: 'Use consistent spacing scale throughout the design',
                rhythm: 'Maintain visual rhythm with regular spacing intervals'
            },
            typography: {
                hierarchy: 'Use typography scale to create clear information hierarchy',
                readability: 'Ensure sufficient contrast and line height for readability'
            }
        };
    }

    // Helper methods

    /**
     * Categorize component
     * @param {Object} component - Component object
     * @returns {string} Component category
     */
    static categorizeComponent(component) {
        const name = component.name.toLowerCase();
        
        if (name.includes('button') || name.includes('btn')) return 'Button';
        if (name.includes('input') || name.includes('field')) return 'Form';
        if (name.includes('card') || name.includes('panel')) return 'Layout';
        if (name.includes('modal') || name.includes('dialog')) return 'Overlay';
        if (name.includes('nav') || name.includes('menu')) return 'Navigation';
        if (name.includes('icon')) return 'Icon';
        
        return 'General';
    }

    /**
     * Generate component example
     * @param {Object} component - Component object
     * @returns {string} Component example
     */
    static generateComponentExample(component) {
        return `<${component.name} />`;
    }

    /**
     * Generate component props
     * @param {Object} component - Component object
     * @returns {Object} Component props
     */
    static generateComponentProps(component) {
        if (!component.properties) return {};
        
        const props = {};
        Object.entries(component.properties).forEach(([key, definition]) => {
            props[key] = {
                type: definition.type,
                required: false,
                defaultValue: definition.defaultValue,
                description: `Property: ${key}`
            };
        });
        
        return props;
    }
}

module.exports = JsonConverter;

