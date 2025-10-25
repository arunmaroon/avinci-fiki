const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Code Generation Service
 * Generates code in multiple formats from Figma AST
 */

/**
 * Main function to generate code export
 * @param {Array} ast - Figma AST
 * @param {string} format - Export format (html, react, vue, moneyview)
 * @param {Object} options - Export options
 * @returns {Promise<Buffer>} ZIP file buffer
 */
const generateCodeExport = async (ast, format, options = {}) => {
    console.log(`🔧 Generating ${format.toUpperCase()} code export`);
    
    const {
        includeStyles = true,
        minify = false,
        includeImages = true,
        componentName = 'FigmaPrototype'
    } = options;

    let generatedCode;
    
    switch (format.toLowerCase()) {
        case 'html':
            generatedCode = await generateHtmlExport(ast, { includeStyles, minify, includeImages });
            break;
        case 'react':
            generatedCode = await generateReactExport(ast, { includeStyles, minify, includeImages, componentName });
            break;
        case 'vue':
            generatedCode = await generateVueExport(ast, { includeStyles, minify, includeImages, componentName });
            break;
        case 'moneyview':
            generatedCode = await generateMoneyviewExport(ast, { includeStyles, minify, includeImages, componentName });
            break;
        default:
            throw new Error(`Unsupported format: ${format}`);
    }

    return generatedCode;
};

/**
 * Generate HTML export
 * @param {Array} ast - Figma AST
 * @param {Object} options - Export options
 * @returns {Promise<Buffer>} ZIP file buffer
 */
const generateHtmlExport = async (ast, options) => {
    const { includeStyles, minify, includeImages } = options;
    
    const screens = findScreens(ast);
    const htmlContent = generateHtmlContent(screens, { includeStyles, minify });
    const cssContent = includeStyles ? generateCssContent(screens, { minify }) : '';
    
    return createZipFile({
        'index.html': htmlContent,
        'styles.css': cssContent,
        'package.json': generatePackageJson('html'),
        'README.md': generateReadme('HTML')
    });
};

/**
 * Generate React export
 * @param {Array} ast - Figma AST
 * @param {Object} options - Export options
 * @returns {Promise<Buffer>} ZIP file buffer
 */
const generateReactExport = async (ast, options) => {
    const { includeStyles, minify, includeImages, componentName } = options;
    
    const screens = findScreens(ast);
    const reactComponent = generateReactComponent(screens, { includeStyles, minify, componentName });
    const cssContent = includeStyles ? generateCssContent(screens, { minify }) : '';
    
    return createZipFile({
        'src/App.jsx': generateReactApp(),
        [`src/components/${componentName}.jsx`]: reactComponent,
        'src/index.css': cssContent,
        'package.json': generatePackageJson('react'),
        'vite.config.js': generateViteConfig(),
        'index.html': generateReactIndexHtml(),
        'README.md': generateReadme('React')
    });
};

/**
 * Generate Vue export
 * @param {Array} ast - Figma AST
 * @param {Object} options - Export options
 * @returns {Promise<Buffer>} ZIP file buffer
 */
const generateVueExport = async (ast, options) => {
    const { includeStyles, minify, includeImages, componentName } = options;
    
    const screens = findScreens(ast);
    const vueComponent = generateVueComponent(screens, { includeStyles, minify, componentName });
    
    return createZipFile({
        'src/App.vue': generateVueApp(),
        [`src/components/${componentName}.vue`]: vueComponent,
        'package.json': generatePackageJson('vue'),
        'vite.config.js': generateViteConfig(),
        'index.html': generateVueIndexHtml(),
        'README.md': generateReadme('Vue')
    });
};

/**
 * Generate Moneyview Design System export
 * @param {Array} ast - Figma AST
 * @param {Object} options - Export options
 * @returns {Promise<Buffer>} ZIP file buffer
 */
const generateMoneyviewExport = async (ast, options) => {
    const { includeStyles, minify, includeImages, componentName } = options;
    
    const screens = findScreens(ast);
    const moneyviewComponent = generateMoneyviewComponent(screens, { includeStyles, minify, componentName });
    const tailwindConfig = generateTailwindConfig();
    
    return createZipFile({
        'src/App.jsx': generateMoneyviewApp(componentName),
        [`src/components/${componentName}.jsx`]: moneyviewComponent,
        'src/index.css': generateTailwindCss(),
        'tailwind.config.js': tailwindConfig,
        'package.json': generatePackageJson('moneyview'),
        'vite.config.js': generateViteConfig(),
        'index.html': generateMoneyviewIndexHtml(),
        'README.md': generateReadme('Moneyview Design System')
    });
};

/**
 * Generate HTML content
 * @param {Array} screens - Screens array
 * @param {Object} options - Options
 * @returns {string} HTML content
 */
const generateHtmlContent = (screens, options) => {
    const { includeStyles } = options;
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Figma Prototype</title>
    ${includeStyles ? '<link rel="stylesheet" href="styles.css">' : ''}
</head>
<body>
    <div class="prototype-container">
`;

    screens.forEach((screen, index) => {
        html += generateHtmlScreen(screen, index);
    });

    html += `
    </div>
    <script>
        // Simple navigation between screens
        let currentScreen = 0;
        const screens = document.querySelectorAll('.screen');
        
        function showScreen(index) {
            screens.forEach((screen, i) => {
                screen.style.display = i === index ? 'block' : 'none';
            });
        }
        
        function nextScreen() {
            currentScreen = (currentScreen + 1) % screens.length;
            showScreen(currentScreen);
        }
        
        function prevScreen() {
            currentScreen = currentScreen === 0 ? screens.length - 1 : currentScreen - 1;
            showScreen(currentScreen);
        }
        
        // Initialize
        showScreen(0);
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextScreen();
            if (e.key === 'ArrowLeft') prevScreen();
        });
    </script>
</body>
</html>`;

    return html;
};

/**
 * Generate HTML for a single screen
 * @param {Object} screen - Screen object
 * @param {number} index - Screen index
 * @returns {string} HTML content
 */
const generateHtmlScreen = (screen, index) => {
    let html = `        <div class="screen" id="screen-${index}" style="display: ${index === 0 ? 'block' : 'none'};">
            <div class="screen-content" style="width: ${screen.layout.width}px; height: ${screen.layout.height}px; position: relative;">
`;

    // Generate HTML for children
    if (screen.children) {
        screen.children.forEach(child => {
            html += generateHtmlNode(child, 1);
        });
    }

    html += `            </div>
        </div>
`;

    return html;
};

/**
 * Generate HTML for a node
 * @param {Object} node - Node object
 * @param {number} depth - Current depth
 * @returns {string} HTML content
 */
const generateHtmlNode = (node, depth) => {
    const indent = '                '.repeat(depth);
    const tagName = getHtmlTagName(node.type);
    
    let html = `${indent}<${tagName} class="node-${node.id}" style="${generateInlineStyles(node)}">`;

    // Add text content for text nodes
    if (node.type === 'TEXT' && node.metadata && node.metadata.textContent) {
        html += node.metadata.textContent;
    }

    // Generate children
    if (node.children && node.children.length > 0) {
        html += '\n';
        node.children.forEach(child => {
            html += generateHtmlNode(child, depth + 1);
        });
        html += `${indent}`;
    }

    html += `</${tagName}>\n`;
    return html;
};

/**
 * Get HTML tag name for node type
 * @param {string} nodeType - Node type
 * @returns {string} HTML tag name
 */
const getHtmlTagName = (nodeType) => {
    switch (nodeType) {
        case 'TEXT': return 'p';
        case 'RECTANGLE': return 'div';
        case 'ELLIPSE': return 'div';
        case 'FRAME': return 'div';
        case 'COMPONENT': return 'div';
        case 'INSTANCE': return 'div';
        case 'GROUP': return 'div';
        default: return 'div';
    }
};

/**
 * Generate inline styles for node
 * @param {Object} node - Node object
 * @returns {string} Inline styles
 */
const generateInlineStyles = (node) => {
    const styles = [];
    
    // Position and size
    if (node.layout) {
        styles.push(`position: absolute`);
        styles.push(`left: ${node.layout.x}px`);
        styles.push(`top: ${node.layout.y}px`);
        styles.push(`width: ${node.layout.width}px`);
        styles.push(`height: ${node.layout.height}px`);
        
        if (node.layout.rotation !== 0) {
            styles.push(`transform: rotate(${node.layout.rotation}deg)`);
        }
        
        if (node.layout.opacity !== 1) {
            styles.push(`opacity: ${node.layout.opacity}`);
        }
    }
    
    // Background color
    if (node.styles && node.styles.fills && node.styles.fills.length > 0) {
        const fill = node.styles.fills[0];
        if (fill.color) {
            const { r, g, b, a } = fill.color;
            styles.push(`background-color: rgba(${r}, ${g}, ${b}, ${a})`);
        }
    }
    
    // Border
    if (node.styles && node.styles.strokes && node.styles.strokes.length > 0) {
        const stroke = node.styles.strokes[0];
        if (stroke.color) {
            const { r, g, b, a } = stroke.color;
            styles.push(`border: ${stroke.weight}px solid rgba(${r}, ${g}, ${b}, ${a})`);
        }
    }
    
    // Border radius
    if (node.styles && node.styles.cornerRadius !== undefined) {
        styles.push(`border-radius: ${node.styles.cornerRadius}px`);
    }
    
    // Text styles
    if (node.styles && node.styles.textStyle) {
        const textStyle = node.styles.textStyle;
        if (textStyle.fontFamily) styles.push(`font-family: ${textStyle.fontFamily}`);
        if (textStyle.fontSize) styles.push(`font-size: ${textStyle.fontSize}px`);
        if (textStyle.fontWeight) styles.push(`font-weight: ${textStyle.fontWeight}`);
        if (textStyle.textAlignHorizontal) {
            styles.push(`text-align: ${textStyle.textAlignHorizontal.toLowerCase()}`);
        }
        if (textStyle.letterSpacing) styles.push(`letter-spacing: ${textStyle.letterSpacing}px`);
    }
    
    return styles.join('; ');
};

/**
 * Generate CSS content
 * @param {Array} screens - Screens array
 * @param {Object} options - Options
 * @returns {string} CSS content
 */
const generateCssContent = (screens, options) => {
    const { minify } = options;
    
    let css = `/* Figma Prototype Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f5f5f5;
    overflow: hidden;
}

.prototype-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.screen {
    display: none;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.screen-content {
    background-color: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin: 20px;
}

/* Navigation controls */
.nav-controls {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 1000;
}

.nav-btn {
    padding: 10px 20px;
    background-color: #007AFF;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.nav-btn:hover {
    background-color: #0056CC;
}

/* Responsive design */
@media (max-width: 768px) {
    .screen-content {
        margin: 10px;
        border-radius: 4px;
    }
}
`;

    return minify ? css.replace(/\s+/g, ' ').trim() : css;
};

/**
 * Generate React component
 * @param {Array} screens - Screens array
 * @param {Object} options - Options
 * @returns {string} React component
 */
const generateReactComponent = (screens, options) => {
    const { componentName } = options;
    
    return `import React, { useState } from 'react';
import './styles.css';

const ${componentName} = () => {
    const [currentScreen, setCurrentScreen] = useState(0);
    
    const nextScreen = () => {
        setCurrentScreen((prev) => (prev + 1) % screens.length);
    };
    
    const prevScreen = () => {
        setCurrentScreen((prev) => prev === 0 ? screens.length - 1 : prev - 1);
    };
    
    const screens = [
${screens.map((screen, index) => `        {
            id: '${screen.id}',
            name: '${screen.name}',
            width: ${screen.layout.width},
            height: ${screen.layout.height},
            children: ${JSON.stringify(screen.children, null, 12)}
        }`).join(',\n')}
    ];
    
    return (
        <div className="prototype-container">
            {screens.map((screen, index) => (
                <div
                    key={screen.id}
                    className="screen"
                    style={{ display: index === currentScreen ? 'block' : 'none' }}
                >
                    <div 
                        className="screen-content"
                        style={{
                            width: screen.width,
                            height: screen.height
                        }}
                    >
                        {renderScreen(screen)}
                    </div>
                </div>
            ))}
            
            <div className="nav-controls">
                <button className="nav-btn" onClick={prevScreen}>
                    Previous
                </button>
                <span className="nav-info">
                    {currentScreen + 1} of {screens.length}
                </span>
                <button className="nav-btn" onClick={nextScreen}>
                    Next
                </button>
            </div>
        </div>
    );
};

const renderScreen = (screen) => {
    return screen.children.map(child => renderNode(child));
};

const renderNode = (node) => {
    const TagName = getTagName(node.type);
    
    return (
        <TagName
            key={node.id}
            className={\`node-\${node.id}\`}
            style={getNodeStyles(node)}
        >
            {node.type === 'TEXT' && node.metadata?.textContent}
            {node.children && node.children.map(child => renderNode(child))}
        </TagName>
    );
};

const getTagName = (nodeType) => {
    switch (nodeType) {
        case 'TEXT': return 'p';
        case 'RECTANGLE': return 'div';
        case 'ELLIPSE': return 'div';
        case 'FRAME': return 'div';
        case 'COMPONENT': return 'div';
        case 'INSTANCE': return 'div';
        case 'GROUP': return 'div';
        default: return 'div';
    }
};

const getNodeStyles = (node) => {
    const styles = {};
    
    if (node.layout) {
        styles.position = 'absolute';
        styles.left = \`\${node.layout.x}px\`;
        styles.top = \`\${node.layout.y}px\`;
        styles.width = \`\${node.layout.width}px\`;
        styles.height = \`\${node.layout.height}px\`;
        
        if (node.layout.rotation !== 0) {
            styles.transform = \`rotate(\${node.layout.rotation}deg)\`;
        }
        
        if (node.layout.opacity !== 1) {
            styles.opacity = node.layout.opacity;
        }
    }
    
    if (node.styles?.fills?.[0]?.color) {
        const { r, g, b, a } = node.styles.fills[0].color;
        styles.backgroundColor = \`rgba(\${r}, \${g}, \${b}, \${a})\`;
    }
    
    if (node.styles?.cornerRadius !== undefined) {
        styles.borderRadius = \`\${node.styles.cornerRadius}px\`;
    }
    
    return styles;
};

export default ${componentName};`;
};

/**
 * Generate Vue component
 * @param {Array} screens - Screens array
 * @param {Object} options - Options
 * @returns {string} Vue component
 */
const generateVueComponent = (screens, options) => {
    const { componentName } = options;
    
    return `<template>
    <div class="prototype-container">
        <div
            v-for="(screen, index) in screens"
            :key="screen.id"
            class="screen"
            :style="{ display: index === currentScreen ? 'block' : 'none' }"
        >
            <div 
                class="screen-content"
                :style="{
                    width: screen.width + 'px',
                    height: screen.height + 'px'
                }"
            >
                <component
                    v-for="child in screen.children"
                    :key="child.id"
                    :is="getTagName(child.type)"
                    :class="\`node-\${child.id}\`"
                    :style="getNodeStyles(child)"
                >
                    {{ child.type === 'TEXT' ? child.metadata?.textContent : '' }}
                </component>
            </div>
        </div>
        
        <div class="nav-controls">
            <button class="nav-btn" @click="prevScreen">Previous</button>
            <span class="nav-info">{{ currentScreen + 1 }} of {{ screens.length }}</span>
            <button class="nav-btn" @click="nextScreen">Next</button>
        </div>
    </div>
</template>

<script>
export default {
    name: '${componentName}',
    data() {
        return {
            currentScreen: 0,
            screens: ${JSON.stringify(screens, null, 8)}
        };
    },
    methods: {
        nextScreen() {
            this.currentScreen = (this.currentScreen + 1) % this.screens.length;
        },
        prevScreen() {
            this.currentScreen = this.currentScreen === 0 ? this.screens.length - 1 : this.currentScreen - 1;
        },
        getTagName(nodeType) {
            switch (nodeType) {
                case 'TEXT': return 'p';
                case 'RECTANGLE': return 'div';
                case 'ELLIPSE': return 'div';
                case 'FRAME': return 'div';
                case 'COMPONENT': return 'div';
                case 'INSTANCE': return 'div';
                case 'GROUP': return 'div';
                default: return 'div';
            }
        },
        getNodeStyles(node) {
            const styles = {};
            
            if (node.layout) {
                styles.position = 'absolute';
                styles.left = \`\${node.layout.x}px\`;
                styles.top = \`\${node.layout.y}px\`;
                styles.width = \`\${node.layout.width}px\`;
                styles.height = \`\${node.layout.height}px\`;
                
                if (node.layout.rotation !== 0) {
                    styles.transform = \`rotate(\${node.layout.rotation}deg)\`;
                }
                
                if (node.layout.opacity !== 1) {
                    styles.opacity = node.layout.opacity;
                }
            }
            
            if (node.styles?.fills?.[0]?.color) {
                const { r, g, b, a } = node.styles.fills[0].color;
                styles.backgroundColor = \`rgba(\${r}, \${g}, \${b}, \${a})\`;
            }
            
            if (node.styles?.cornerRadius !== undefined) {
                styles.borderRadius = \`\${node.styles.cornerRadius}px\`;
            }
            
            return styles;
        }
    }
};
</script>

<style scoped>
/* Styles are imported from external CSS file */
</style>`;
};

/**
 * Generate Moneyview Design System component
 * @param {Array} screens - Screens array
 * @param {Object} options - Options
 * @returns {string} Moneyview component
 */
const generateMoneyviewComponent = (screens, options) => {
    const { componentName } = options;
    
    return `import React, { useState } from 'react';
import { Button, Card, Text, Box } from '@moneyview/design-system';

const ${componentName} = () => {
    const [currentScreen, setCurrentScreen] = useState(0);
    
    const nextScreen = () => {
        setCurrentScreen((prev) => (prev + 1) % screens.length);
    };
    
    const prevScreen = () => {
        setCurrentScreen((prev) => prev === 0 ? screens.length - 1 : prev - 1);
    };
    
    const screens = [
${screens.map((screen, index) => `        {
            id: '${screen.id}',
            name: '${screen.name}',
            width: ${screen.layout.width},
            height: ${screen.layout.height},
            children: ${JSON.stringify(screen.children, null, 12)}
        }`).join(',\n')}
    ];
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card className="w-full max-w-6xl mx-4">
                {screens.map((screen, index) => (
                    <div
                        key={screen.id}
                        className={\`\${index === currentScreen ? 'block' : 'hidden'}\`}
                    >
                        <div 
                            className="relative bg-white rounded-lg shadow-lg overflow-hidden"
                            style={{
                                width: screen.width,
                                height: screen.height
                            }}
                        >
                            {renderScreen(screen)}
                        </div>
                    </div>
                ))}
                
                <div className="flex justify-center items-center gap-4 mt-6">
                    <Button variant="outline" onClick={prevScreen}>
                        Previous
                    </Button>
                    <Text className="text-sm text-gray-600">
                        {currentScreen + 1} of {screens.length}
                    </Text>
                    <Button onClick={nextScreen}>
                        Next
                    </Button>
                </div>
            </Card>
        </div>
    );
};

const renderScreen = (screen) => {
    return screen.children.map(child => renderNode(child));
};

const renderNode = (node) => {
    const TagName = getTagName(node.type);
    
    return (
        <TagName
            key={node.id}
            className={\`absolute \${getNodeClasses(node)}\`}
            style={getNodeStyles(node)}
        >
            {node.type === 'TEXT' && (
                <Text className={getTextClasses(node)}>
                    {node.metadata?.textContent}
                </Text>
            )}
            {node.children && node.children.map(child => renderNode(child))}
        </TagName>
    );
};

const getTagName = (nodeType) => {
    switch (nodeType) {
        case 'TEXT': return 'p';
        case 'RECTANGLE': return 'div';
        case 'ELLIPSE': return 'div';
        case 'FRAME': return 'div';
        case 'COMPONENT': return 'div';
        case 'INSTANCE': return 'div';
        case 'GROUP': return 'div';
        default: return 'div';
    }
};

const getNodeClasses = (node) => {
    const classes = [];
    
    if (node.styles?.cornerRadius !== undefined) {
        classes.push('rounded-lg');
    }
    
    return classes.join(' ');
};

const getTextClasses = (node) => {
    const classes = [];
    
    if (node.styles?.textStyle) {
        const textStyle = node.styles.textStyle;
        if (textStyle.fontWeight >= 600) classes.push('font-semibold');
        if (textStyle.fontSize >= 24) classes.push('text-2xl');
        else if (textStyle.fontSize >= 18) classes.push('text-lg');
        else if (textStyle.fontSize >= 16) classes.push('text-base');
        else classes.push('text-sm');
    }
    
    return classes.join(' ');
};

const getNodeStyles = (node) => {
    const styles = {};
    
    if (node.layout) {
        styles.left = \`\${node.layout.x}px\`;
        styles.top = \`\${node.layout.y}px\`;
        styles.width = \`\${node.layout.width}px\`;
        styles.height = \`\${node.layout.height}px\`;
        
        if (node.layout.rotation !== 0) {
            styles.transform = \`rotate(\${node.layout.rotation}deg)\`;
        }
        
        if (node.layout.opacity !== 1) {
            styles.opacity = node.layout.opacity;
        }
    }
    
    if (node.styles?.fills?.[0]?.color) {
        const { r, g, b, a } = node.styles.fills[0].color;
        styles.backgroundColor = \`rgba(\${r}, \${g}, \${b}, \${a})\`;
    }
    
    return styles;
};

export default ${componentName};`;
};

/**
 * Helper functions
 */
const findScreens = (ast) => {
    const screens = [];
    ast.forEach(page => {
        if (page.screens && page.screens.length > 0) {
            screens.push(...page.screens);
        }
    });
    return screens;
};

const createZipFile = async (files) => {
    return new Promise((resolve, reject) => {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const chunks = [];
        
        archive.on('data', (chunk) => chunks.push(chunk));
        archive.on('end', () => resolve(Buffer.concat(chunks)));
        archive.on('error', reject);
        
        Object.entries(files).forEach(([filename, content]) => {
            archive.append(content, { name: filename });
        });
        
        archive.finalize();
    });
};

const generatePackageJson = (format) => {
    const basePackage = {
        name: `figma-prototype-${format}`,
        version: '1.0.0',
        description: `Figma prototype exported as ${format}`,
        main: 'index.js',
        scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview'
        }
    };

    switch (format) {
        case 'react':
            return JSON.stringify({
                ...basePackage,
                dependencies: {
                    'react': '^18.2.0',
                    'react-dom': '^18.2.0'
                },
                devDependencies: {
                    '@vitejs/plugin-react': '^4.0.0',
                    'vite': '^4.4.0'
                }
            }, null, 2);
        case 'vue':
            return JSON.stringify({
                ...basePackage,
                dependencies: {
                    'vue': '^3.3.0'
                },
                devDependencies: {
                    '@vitejs/plugin-vue': '^4.0.0',
                    'vite': '^4.4.0'
                }
            }, null, 2);
        case 'moneyview':
            return JSON.stringify({
                ...basePackage,
                dependencies: {
                    'react': '^18.2.0',
                    'react-dom': '^18.2.0',
                    '@moneyview/design-system': '^1.0.0',
                    'tailwindcss': '^3.3.0'
                },
                devDependencies: {
                    '@vitejs/plugin-react': '^4.0.0',
                    'vite': '^4.4.0',
                    'autoprefixer': '^10.4.0',
                    'postcss': '^8.4.0'
                }
            }, null, 2);
        default:
            return JSON.stringify(basePackage, null, 2);
    }
};

const generateViteConfig = () => {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})`;
};

const generateTailwindConfig = () => {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
};

const generateTailwindCss = () => {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles for Figma prototype */
.prototype-container {
  @apply min-h-screen bg-gray-50 flex items-center justify-center;
}

.screen {
  @apply hidden;
}

.screen.active {
  @apply block;
}

.nav-controls {
  @apply fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-50;
}

.nav-btn {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}

.nav-info {
  @apply px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm;
}`;
};

const generateReadme = (format) => {
    return `# Figma Prototype - ${format}

This is a Figma prototype exported as ${format} code.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open your browser and navigate to the URL shown in the terminal.

## Features

- Interactive prototype viewing
- Keyboard navigation (Arrow keys)
- Responsive design
- Clean, semantic code

## Customization

You can modify the components and styles to match your design system requirements.

## Export Information

- Generated on: ${new Date().toISOString()}
- Format: ${format}
- Screens: Multiple interactive screens
- Framework: ${format === 'html' ? 'Vanilla HTML/CSS/JS' : format === 'react' ? 'React' : format === 'vue' ? 'Vue.js' : 'Moneyview Design System'}
`;
};

// Additional helper functions for different formats
const generateReactApp = () => {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import FigmaPrototype from './components/FigmaPrototype';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FigmaPrototype />
  </React.StrictMode>
);`;
};

const generateVueApp = () => {
    return `<template>
  <div id="app">
    <FigmaPrototype />
  </div>
</template>

<script>
import FigmaPrototype from './components/FigmaPrototype.vue';

export default {
  name: 'App',
  components: {
    FigmaPrototype
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>`;
};

const generateMoneyviewApp = (componentName) => {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import ${componentName} from './components/${componentName}';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <${componentName} />
  </React.StrictMode>
);`;
};

const generateReactIndexHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Figma Prototype - React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
};

const generateVueIndexHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Figma Prototype - Vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`;
};

const generateMoneyviewIndexHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Figma Prototype - Moneyview</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
};

module.exports = {
    generateCodeExport,
    generateHtmlExport,
    generateReactExport,
    generateVueExport,
    generateMoneyviewExport
};

