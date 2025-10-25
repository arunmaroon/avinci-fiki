import React, { useState, useEffect } from 'react';
import {
  EyeIcon, CodeBracketIcon, PlayIcon, ArrowPathIcon, 
  ExclamationTriangleIcon, DocumentTextIcon, SparklesIcon, 
  CheckCircleIcon, CloudArrowUpIcon, PhotoIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';
import ConversionSettings from '../components/ConversionSettings';
import CodePreview from '../components/CodePreview';
import FigmaOAuth from '../components/FigmaOAuth';

const EnhancedBuilderConverter = () => {
  const [activeMode, setActiveMode] = useState('figma-url');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('preview');
  const [showFigmaOAuth, setShowFigmaOAuth] = useState(false);
  const [figmaAuthenticated, setFigmaAuthenticated] = useState(false);
  const [moneyViewAuthenticated, setMoneyViewAuthenticated] = useState(false);
  const [builderStatus, setBuilderStatus] = useState(null);
  const [visionStatus, setVisionStatus] = useState(null);

  // Conversion settings
  const [settings, setSettings] = useState({
    framework: 'react',
    styling: 'tailwind',
    componentType: 'component',
    aiProvider: 'auto',
    customPrompt: ''
  });

  // Load data on mount
  useEffect(() => {
    loadConversionHistory();
    testBuilderConnection();
    testVisionConnection();
  }, []);

  const loadConversionHistory = async () => {
    try {
      const [builderResponse, visionResponse] = await Promise.all([
        fetch('/api/builder/conversions'),
        fetch('/api/vision/conversions')
      ]);
      
      const builderData = await builderResponse.json();
      const visionData = await visionResponse.json();
      
      const allConversions = [
        ...(builderData.conversions || []).map(conv => ({ ...conv, type: 'builder' })),
        ...(visionData.conversions || []).map(conv => ({ ...conv, type: 'vision' }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setConversionHistory(allConversions);
    } catch (error) {
      console.error('Failed to load conversion history:', error);
    }
  };

  const testBuilderConnection = async () => {
    try {
      const response = await fetch('/api/builder/test');
      const data = await response.json();
      setBuilderStatus(data);
    } catch (error) {
      console.error('Builder.io test failed:', error);
    }
  };

  const testVisionConnection = async () => {
    try {
      const response = await fetch('/api/vision/test?provider=openai');
      const data = await response.json();
      setVisionStatus(data);
    } catch (error) {
      console.error('Vision test failed:', error);
    }
  };

  const handleFigmaAuthSuccess = (authData) => {
    setFigmaAuthenticated(true);
    setShowFigmaOAuth(false);
    toast.success('Successfully connected to Figma!');
  };

  const handleFigmaFileSelect = (figmaUrl) => {
    setFigmaUrl(figmaUrl);
    setShowFigmaOAuth(false);
  };

  const handleMoneyViewAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/figma-oauth/login');
      const data = await response.json();
      
      if (data.success && data.authUrl) {
        // Open MoneyView Figma authentication in new window
        const authWindow = window.open(data.authUrl, 'figma-auth', 'width=600,height=700');
        
        // Listen for authentication completion
        const checkAuth = setInterval(async () => {
          try {
            const statusResponse = await fetch('/api/figma-oauth/design-system');
            const statusData = await statusResponse.json();
            
            if (statusData.success) {
              clearInterval(checkAuth);
              authWindow.close();
              setMoneyViewAuthenticated(true);
              toast.success('MoneyView Figma authentication successful!');
            }
          } catch (error) {
            // Continue checking
          }
        }, 2000);
        
        // Stop checking after 5 minutes
        setTimeout(() => {
          clearInterval(checkAuth);
          if (authWindow && !authWindow.closed) {
            authWindow.close();
          }
        }, 300000);
      } else {
        throw new Error(data.message || 'Failed to initiate MoneyView authentication');
      }
    } catch (error) {
      console.error('MoneyView authentication failed:', error);
      toast.error(`MoneyView authentication failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if (activeMode === 'figma-url') {
      if (!figmaUrl.trim()) {
        toast.error('Please enter a Figma URL');
        return;
      }
      await handleFigmaConvert();
    } else {
      if (!imageFile) {
        toast.error('Please upload an image');
        return;
      }
      await handleImageConvert();
    }
  };

  const handleFigmaConvert = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/builder/convert-figma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figmaUrl: figmaUrl.trim() }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        toast.success('Figma file converted successfully!');
        loadConversionHistory();
      } else {
        throw new Error(data.error || 'Figma conversion failed');
      }
    } catch (error) {
      console.error('Figma conversion failed:', error);
      toast.error(`Figma conversion failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageConvert = async () => {
    console.log('🎨 Converting image:', imageFile?.name, imageFile?.size, imageFile?.type);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('framework', settings.framework);
      formData.append('styling', settings.styling);
      formData.append('componentType', settings.componentType);
      formData.append('aiProvider', settings.aiProvider);
      // Add specific prompt for form analysis
      const formAnalysisPrompt = settings.customPrompt || 
        `Analyze this mobile app screenshot carefully. This appears to be a PAN card details form. 

Look for and identify:
- PAN card number input field
- Date of birth input field  
- PIN input field
- Password input field
- Confirm password input field
- "Get offer" button
- "Remember me" checkbox
- All labels and text content

Create a complete React form component using MoneyView Design System components that exactly matches this design.`;
      
      formData.append('customPrompt', formAnalysisPrompt);

      console.log('📤 Sending FormData with image file');
      const response = await fetch('/api/vision/convert-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', response.status, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText.substring(0, 200));
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('❌ Response text:', responseText);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }
      
      if (data.success) {
        setResult({
          success: true,
          code: data.result.code,
          tokensUsed: data.result.tokensUsed,
          model: data.result.model,
          provider: data.result.provider,
          type: 'vision'
        });
        toast.success('Image converted to code successfully!');
        loadConversionHistory();
      } else {
        throw new Error(data.error || 'Image conversion failed');
      }
    } catch (error) {
      console.error('Image conversion failed:', error);
      toast.error(`Image conversion failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (file, preview) => {
    console.log('📁 Image selected:', file?.name, file?.size, file?.type);
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const generatePreviewHTML = (result) => {
    if (!result || (!result.code && !result.blocks)) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Code Preview</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: #f5f5f5;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .no-preview {
              text-align: center;
              color: #666;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="no-preview">No preview available</div>
        </body>
        </html>
      `;
    }

    // Show generated React code for AI Vision conversions
    if (result.type === 'vision' && result.code) {
      console.log('🎨 Rendering AI Vision generated code:', result.code);
      
      // Extract the main component from the generated code
      const codeLines = result.code.split('\n');
      const componentStart = codeLines.findIndex(line => line.includes('const GeneratedComponent') || line.includes('export const'));
      const componentEnd = codeLines.findIndex((line, index) => index > componentStart && line.includes('};'));
      
      if (componentStart !== -1 && componentEnd !== -1) {
        const componentCode = codeLines.slice(componentStart, componentEnd + 1).join('\n');
        
        return `
          <!DOCTYPE html>
          <html>
          <head>
            <title>AI Vision Generated Component</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                background: #f8f9fa;
              }
              .code-preview {
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 20px;
              }
              .code-header {
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
              }
              .ai-badge {
                background: #e3f2fd;
                color: #1976d2;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                margin-left: 10px;
              }
              pre {
                background: #f5f5f5;
                padding: 16px;
                border-radius: 4px;
                overflow-x: auto;
                font-size: 14px;
                line-height: 1.5;
                border: 1px solid #e0e0e0;
              }
              .note {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 12px;
                border-radius: 4px;
                margin-top: 16px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="code-preview">
              <div class="code-header">
                🤖 AI Generated Component
                <span class="ai-badge">${result.provider || 'OpenAI'}</span>
              </div>
              <pre><code>${componentCode}</code></pre>
              <div class="note">
                <strong>Note:</strong> This is the React component code generated by AI Vision analysis. 
                The component uses MoneyView Design System components and should be copied to your project.
              </div>
            </div>
          </body>
          </html>
        `;
      }
    }

    // Simple, reliable preview for Builder.io blocks
    if (result.blocks && result.blocks.length > 0) {
      console.log('🎨 Rendering Builder.io blocks:', result.blocks);
      
      const blocksHTML = result.blocks.map((block, index) => {
        const componentName = block.component?.name || 'Unknown';
        const textContent = block.component?.options?.children || 
                          block.component?.options?.text || 
                          block.text || 
                          block.component?.options?.title ||
                          `Element ${index + 1}`;
        
        const isDesignSystem = componentName.startsWith('DesignSystem:');
        const displayName = isDesignSystem ? 
          componentName.replace('DesignSystem:', '') : 
          componentName.replace('Core:', '');
        
        // Get component dimensions from responsive styles
        const styles = block.responsiveStyles?.large || {};
        const width = styles.width || '200px';
        const height = styles.height || '60px';
        const backgroundColor = styles.backgroundColor || (isDesignSystem ? '#e3f2fd' : '#f5f5f5');
        const color = styles.color || '#333';
        const fontSize = styles.fontSize || '14px';
        const fontFamily = styles.fontFamily || 'Inter, sans-serif';
        
        return `
          <div style="
            background: ${backgroundColor};
            border: 2px solid ${isDesignSystem ? '#2196f3' : '#ddd'};
            border-radius: 8px;
            padding: 16px;
            margin: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-width: ${width};
            min-height: ${height};
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            transition: all 0.2s ease;
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
            <div style="font-size: ${fontSize}; font-weight: 500; color: ${color}; margin-bottom: 4px; font-family: ${fontFamily};">
              ${textContent}
            </div>
            <div style="font-size: 10px; color: #666; opacity: 0.8;">
              ${isDesignSystem ? '🎨 ' : '📦 '}${displayName}
            </div>
            <div style="position: absolute; top: 4px; right: 4px; font-size: 8px; color: #999; background: rgba(255,255,255,0.8); padding: 2px 4px; border-radius: 3px;">
              ${width} × ${height}
            </div>
          </div>
        `;
      }).join('');
      
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Figma Design Preview</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .preview-container {
              background: white;
              border-radius: 12px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
              padding: 20px;
            }
            .preview-header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #f0f0f0;
            }
            .preview-title {
              font-size: 18px;
              font-weight: 600;
              color: #333;
              margin: 0 0 5px 0;
            }
            .preview-subtitle {
              font-size: 12px;
              color: #666;
              margin: 0;
            }
            .components-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 16px;
            }
          </style>
        </head>
        <body>
          <div class="preview-container">
            <div class="preview-header">
              <h2 class="preview-title">Figma Design Preview</h2>
              <p class="preview-subtitle">${result.blocks.length} components converted</p>
            </div>
            <div class="components-grid">
              ${blocksHTML}
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Fallback for other conversion types
    if (result.code) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Code Preview</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: #f5f5f5;
            }
            .code-preview {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="code-preview">
            <h3>Generated Code</h3>
            <pre style="background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto;">${result.code}</pre>
          </div>
        </body>
        </html>
      `;
    }

    // Generate preview based on conversion type
    if (result.blocks && result.blocks.length > 0) {
      console.log('🎨 Rendering Builder.io blocks:', result.blocks);
      // Render Builder.io blocks as HTML
      const renderBlock = (block) => {
        const styles = block.responsiveStyles?.large || {};
        const componentName = block.component?.name || 'Unknown';
        
        // Handle different component types
        if (componentName === 'Core:Fragment' || componentName === 'Core:Text' || componentName === 'Core:Box' || componentName === 'Core:Image' || componentName.startsWith('DesignSystem:')) {
          // Get text content from various possible sources
          const textContent = block.component?.options?.children || 
                            block.component?.options?.text || 
                            block.text || 
                            block.content || 
                            (componentName === 'Core:Text' ? 'Text Content' : 
                             componentName === 'Core:Box' ? 'Box' :
                             componentName === 'Core:Image' ? 'Image' :
                             componentName.startsWith('DesignSystem:') ? 
                               (block.component?.options?.children || block.component?.options?.title || 'Design System Component') :
                             componentName === 'Core:Fragment' ? 'Component' : 'Element');
          
          return `
            <div style="
              position: ${styles.position || 'relative'};
              left: ${styles.left || '0px'};
              top: ${styles.top || '0px'};
              width: ${styles.width || 'auto'};
              height: ${styles.height || 'auto'};
              display: ${styles.display || 'block'};
              align-items: ${styles.alignItems || 'stretch'};
              justify-content: ${styles.justifyContent || 'flex-start'};
              font-size: ${styles.fontSize || '14px'};
              font-family: ${styles.fontFamily || 'inherit'};
              font-weight: ${styles.fontWeight || 'normal'};
              color: ${styles.color || '#000'};
              background-color: ${styles.backgroundColor || 'transparent'};
              border-radius: ${styles.borderRadius || '0px'};
              border: ${styles.borderColor ? `1px solid ${styles.borderColor}` : 'none'};
              padding: 8px;
              margin: 4px;
              min-height: ${styles.height ? 'auto' : '40px'};
            ">
              ${block.children ? block.children.map(renderBlock).join('') : `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 8px;">
                  ${textContent ? `<div style="font-size: 14px; font-weight: 500; color: #333; margin-bottom: 4px;">${textContent}</div>` : ''}
                  <div style="font-size: 10px; color: #666; opacity: 0.7;">
                    ${componentName.startsWith('DesignSystem:') ? 
                      `🎨 ${componentName.replace('DesignSystem:', '')}` : 
                      componentName}
                  </div>
                  ${componentName.startsWith('DesignSystem:') && block.component?.options?.designSystemComponent ? 
                    `<div style="font-size: 8px; color: #999; margin-top: 2px;">${block.component.options.designSystemComponent}</div>` : ''}
                </div>
              `}
            </div>
          `;
        }
        
        // Handle other component types
        return `
          <div style="
            position: ${styles.position || 'relative'};
            left: ${styles.left || '0px'};
            top: ${styles.top || '0px'};
            width: ${styles.width || 'auto'};
            height: ${styles.height || 'auto'};
            display: ${styles.display || 'block'};
            align-items: ${styles.alignItems || 'stretch'};
            justify-content: ${styles.justifyContent || 'flex-start'};
            font-size: ${styles.fontSize || '14px'};
            font-family: ${styles.fontFamily || 'inherit'};
            font-weight: ${styles.fontWeight || 'normal'};
            color: ${styles.color || '#000'};
            background-color: ${styles.backgroundColor || 'transparent'};
            border-radius: ${styles.borderRadius || '0px'};
            border: ${styles.borderColor ? `1px solid ${styles.borderColor}` : '1px solid #e5e7eb'};
            padding: 8px;
            margin: 4px;
            min-height: 40px;
          ">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 8px;">
              <div style="font-size: 14px; font-weight: 500; color: #333; margin-bottom: 4px;">${block.name || componentName}</div>
              <div style="font-size: 10px; color: #666; opacity: 0.7;">${componentName}</div>
            </div>
            ${block.children ? block.children.map(renderBlock).join('') : ''}
          </div>
        `;
      };

      const renderedBlocks = result.blocks.map(renderBlock).join('');
      console.log('🎨 Rendered blocks HTML length:', renderedBlocks.length);
      
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Figma Design Preview</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: #f5f5f5;
              min-height: 100vh;
            }
            .preview-container {
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              padding: 20px;
              max-width: 400px;
              margin: 0 auto;
              position: relative;
              min-height: 600px;
            }
            .preview-title {
              font-size: 18px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 16px;
              text-align: center;
            }
            .design-preview {
              border: 1px solid #e5e7eb;
              border-radius: 4px;
              background: white;
              position: relative;
              min-height: 500px;
            }
          </style>
        </head>
        <body>
          <div class="preview-container">
            <div class="preview-title">Figma Design Preview</div>
            <div class="design-preview">
              ${renderedBlocks}
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Default success message for other conversion types
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Generated Code Preview</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .preview-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 40px;
            max-width: 600px;
            text-align: center;
          }
          .success-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          .success-title {
            font-size: 24px;
            font-weight: 600;
            color: #059669;
            margin-bottom: 12px;
          }
          .success-message {
            color: #6b7280;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="success-icon">✅</div>
          <div class="success-title">Conversion Successful!</div>
          <div class="success-message">Your design has been converted to code successfully.</div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced Design Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Convert Figma designs or screenshots to production-ready code using AI Vision and Builder.io
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
            <SparklesIcon className="w-4 h-4 mr-2" />
            Powered by AI Vision & Builder.io
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {builderStatus && (
            <div className={`p-4 rounded-lg ${
              builderStatus.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {builderStatus.success ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                )}
                <span className={`font-medium ${
                  builderStatus.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  Builder.io: {builderStatus.message}
                </span>
              </div>
            </div>
          )}

          {visionStatus && (
            <div className={`p-4 rounded-lg ${
              visionStatus.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {visionStatus.success ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                )}
                <span className={`font-medium ${
                  visionStatus.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  AI Vision: {visionStatus.message}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input & Settings */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Input Method</h2>
              
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                <button
                  onClick={() => setActiveMode('figma-url')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeMode === 'figma-url'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CloudArrowUpIcon className="w-4 h-4 inline mr-2" />
                  Figma URL
                </button>
                <button
                  onClick={() => setActiveMode('image-upload')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeMode === 'image-upload'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <PhotoIcon className="w-4 h-4 inline mr-2" />
                  Screenshot
                </button>
              </div>

              {activeMode === 'figma-url' ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Figma URL
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowFigmaOAuth(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {figmaAuthenticated ? 'Browse Files' : 'Connect with Figma'}
                      </button>
                      <button
                        onClick={handleMoneyViewAuth}
                        disabled={loading}
                        className="text-sm text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                      >
                        {moneyViewAuthenticated ? '✅ MoneyView Connected' : '🔐 Connect MoneyView'}
                      </button>
                    </div>
                  </div>
                  <input
                    type="url"
                    value={figmaUrl}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                    placeholder="https://www.figma.com/file/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Paste your Figma file URL to convert it to Builder.io blocks
                  </p>
                </div>
              ) : (
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  onImageRemove={handleImageRemove}
                  selectedImage={imagePreview}
                />
              )}
            </div>

            {/* Settings Panel */}
            {activeMode === 'image-upload' && (
              <ConversionSettings
                settings={settings}
                onChange={setSettings}
              />
            )}

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={loading || (activeMode === 'figma-url' ? !figmaUrl.trim() : !imageFile)}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <PlayIcon className="w-5 h-5" />
              )}
              <span>
                {loading 
                  ? 'Converting...' 
                  : activeMode === 'figma-url' 
                    ? 'Convert Figma to Builder.io' 
                    : 'Convert Image to Code'
                }
              </span>
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {result && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'preview'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <EyeIcon className="w-5 h-5 inline mr-2" />
                      Preview
                    </button>
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'code'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <CodeBracketIcon className="w-5 h-5 inline mr-2" />
                      Code
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'preview' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">
                            Generated with {result.provider || 'AI'} - {result.model || 'Unknown Model'}
                          </span>
                        </div>
                        <div className="p-4 bg-white">
                          <iframe
                            srcDoc={generatePreviewHTML(result)}
                            className="w-full h-96 border-0"
                            title="Code Preview"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'code' && (
                    <CodePreview
                      code={result.code}
                      language={settings.framework === 'html' ? 'html' : 'tsx'}
                      fileName={activeMode === 'figma-url' ? 'figma-component' : 'generated-component'}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Conversion History */}
            {conversionHistory.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversions</h3>
                <div className="space-y-2">
                  {conversionHistory.slice(0, 5).map((conversion) => (
                    <div key={conversion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {conversion.type === 'builder' ? 'Builder.io Conversion' : 'AI Vision Conversion'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {conversion.framework || 'Unknown'} • {conversion.ai_provider || 'Builder.io'}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(conversion.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Figma OAuth Modal */}
      {showFigmaOAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Figma Integration</h3>
                <button
                  onClick={() => setShowFigmaOAuth(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <FigmaOAuth
                onAuthSuccess={handleFigmaAuthSuccess}
                onFileSelect={handleFigmaFileSelect}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedBuilderConverter;
