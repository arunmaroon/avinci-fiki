import React, { useState, useEffect } from 'react';
import {
  EyeIcon, CodeBracketIcon, PlayIcon, ArrowPathIcon, ExclamationTriangleIcon, 
  DocumentTextIcon, SparklesIcon, CheckCircleIcon, CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const BuilderConverter = () => {
  const [activeMode, setActiveMode] = useState('figma-url');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [designData, setDesignData] = useState('');
  const [componentName, setComponentName] = useState('BuilderComponent');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('preview');
  const [builderStatus, setBuilderStatus] = useState(null);

  // Load conversion history on mount
  useEffect(() => {
    loadConversionHistory();
    testBuilderConnection();
  }, []);

  const loadConversionHistory = async () => {
    try {
      const response = await fetch('/api/builder/conversions');
      const data = await response.json();
      if (data.success) {
        setConversionHistory(data.conversions);
      }
    } catch (error) {
      console.error('Failed to load conversion history:', error);
    }
  };

  const testBuilderConnection = async () => {
    try {
      const response = await fetch('/api/builder/test');
      const data = await response.json();
      setBuilderStatus(data);
      if (data.success) {
        toast.success('Builder.io connection successful!');
      } else {
        toast.error(`Builder.io connection failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Builder.io test failed:', error);
      toast.error(`Builder.io test failed: ${error.message}`);
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
      if (!designData.trim()) {
        toast.error('Please enter design data or upload a file');
        return;
      }
      await handleDesignConvert();
    }
  };

  const handleFigmaConvert = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/builder/convert-figma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          figmaUrl: figmaUrl.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        
        // Check if there are any components to display
        const hasComponents = data.components && data.components.length > 0;
        const hasBlocks = data.blocks && data.blocks.some(block => block.children && block.children.length > 0);
        
        if (hasComponents || hasBlocks) {
          toast.success('Figma file converted to Builder.io blocks successfully!');
        } else {
          toast.success('Figma file processed successfully, but no components found to convert.');
        }
        
        loadConversionHistory(); // Refresh history
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

  const handleDesignConvert = async () => {
    setLoading(true);
    try {
      let parsedDesignData;
      
      // Try to parse as JSON first
      try {
        parsedDesignData = JSON.parse(designData);
      } catch (parseError) {
        // If not JSON, create a simple design object
        parsedDesignData = {
          type: 'design',
          name: componentName,
          components: [
            {
              id: 'text-1',
              type: 'TEXT',
              name: 'Sample Text',
              text: designData,
              x: 20,
              y: 20,
              width: 200,
              height: 40,
              fontSize: 16,
              fontFamily: 'Inter, sans-serif',
              color: '#000000'
            }
          ]
        };
      }

      const response = await fetch('/api/builder/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          designData: parsedDesignData,
          componentName: componentName.trim() || 'BuilderComponent'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result);
        toast.success('Design converted to Builder.io blocks successfully!');
        loadConversionHistory(); // Refresh history
      } else {
        throw new Error(data.error || 'Conversion failed');
      }
    } catch (error) {
      console.error('Conversion failed:', error);
      toast.error(`Conversion failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDesignData(e.target.result);
        toast.success('File uploaded successfully!');
      };
      reader.readAsText(file);
    }
  };

  const generatePreviewHTML = (result) => {
    console.log('🔍 Generating preview for result:', result);
    console.log('🔍 Components:', result.components);
    console.log('🔍 Blocks:', result.blocks);
    
    if (!result || !result.blocks) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Builder.io Preview</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: #f5f5f5;
            }
            .preview-container {
              position: relative;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
              margin: 0 auto;
              max-width: 800px;
              height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .no-preview {
              text-align: center;
              color: #666;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="preview-container">
            <div class="no-preview">No preview available</div>
          </div>
        </body>
        </html>
      `;
    }

    // Check if there are any components to display
    const hasComponents = result.components && result.components.length > 0;
    const hasBlocks = result.blocks && result.blocks.some(block => block.children && block.children.length > 0);
    
    console.log('🔍 hasComponents:', hasComponents, 'hasBlocks:', hasBlocks);
    
    if (!hasComponents && !hasBlocks) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Builder.io Preview</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: #f5f5f5;
            }
            .preview-container {
              position: relative;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
              margin: 0 auto;
              max-width: 800px;
              height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .empty-figma {
              text-align: center;
              color: #666;
              font-size: 16px;
            }
            .empty-figma h3 {
              color: #333;
              margin-bottom: 10px;
            }
            .empty-figma p {
              margin: 5px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="preview-container">
            <div class="empty-figma">
              <h3>Figma File Processed Successfully</h3>
              <p>The Figma file was loaded but contains no components to convert.</p>
              <p>Try using a Figma file with actual design elements.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Handle Figma conversion result - try components first, then blocks
    let componentsToRender = [];
    
    if (result.components && result.components.length > 0) {
      componentsToRender = result.components;
    } else if (result.blocks && result.blocks.length > 0) {
      // Extract components from blocks
      result.blocks.forEach(block => {
        if (block.children && block.children.length > 0) {
          block.children.forEach(child => {
            if (child.responsiveStyles && child.responsiveStyles.large) {
              const styles = child.responsiveStyles.large;
              componentsToRender.push({
                id: child.id || 'block-' + Math.random(),
                name: child.component?.name || 'Block Component',
                type: 'BLOCK',
                x: parseInt(styles.left) || 0,
                y: parseInt(styles.top) || 0,
                width: parseInt(styles.width) || 100,
                height: parseInt(styles.height) || 30,
                backgroundColor: styles.backgroundColor || 'transparent',
                text: child.component?.options?.text || child.component?.name || 'Block',
                fontSize: parseInt(styles.fontSize) || 14,
                fontFamily: styles.fontFamily || 'Inter, sans-serif',
                fontWeight: styles.fontWeight || 400,
                color: styles.color || '#000000',
                borderRadius: parseInt(styles.borderRadius) || 0,
                borderColor: styles.border ? styles.border.split(' ')[2] : null
              });
            }
          });
        }
      });
    }
    
    if (componentsToRender.length > 0) {
      const componentHTML = componentsToRender.map((component, index) => {
        return `
          <div style="
            position: absolute;
            left: ${component.x}px;
            top: ${component.y}px;
            width: ${component.width}px;
            height: ${component.height}px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${component.fontSize}px;
            font-family: ${component.fontFamily};
            font-weight: ${component.fontWeight};
            color: ${component.color};
            background-color: ${component.backgroundColor};
            border-radius: ${component.borderRadius}px;
            ${component.borderColor ? `border: 1px solid ${component.borderColor};` : ''}
            padding: 10px;
            margin: 5px;
            box-sizing: border-box;
            border: 1px solid #e0e0e0;
          ">
            ${component.text || component.name || `Component ${index + 1}`}
          </div>
        `;
      }).join('');

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Figma to Builder.io Preview</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 20px;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .preview-container {
              position: relative;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: visible;
              margin: 0 auto;
              max-width: 800px;
              min-height: 400px;
              padding: 20px;
            }
            .figma-preview {
              position: relative;
              width: 100%;
              height: 600px;
              background: #f8f9fa;
              border: 2px dashed #dee2e6;
              border-radius: 8px;
              overflow: auto;
            }
            .figma-info {
              position: absolute;
              top: -30px;
              left: 0;
              font-size: 12px;
              color: #666;
              background: rgba(255,255,255,0.9);
              padding: 4px 8px;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="preview-container">
            <div class="figma-info">Figma to Builder.io Preview - ${componentsToRender.length} components</div>
            <div class="figma-preview">
              ${componentHTML || '<div style="text-align: center; color: #666; padding: 50px;">No components to display</div>'}
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Generate HTML from Builder.io blocks
    const blocks = result.blocks || [];
    const componentHTML = blocks.map((block, index) => {
      if (block.children && block.children.length > 0) {
        return block.children.map((child, childIndex) => {
          const styles = child.responsiveStyles?.large || {};
          return `
            <div style="
              position: ${styles.position || 'relative'};
              left: ${styles.left || '0'};
              top: ${styles.top || '0'};
              width: ${styles.width || '100px'};
              height: ${styles.height || '30px'};
              display: ${styles.display || 'flex'};
              align-items: ${styles.alignItems || 'center'};
              justify-content: ${styles.justifyContent || 'center'};
              font-size: ${styles.fontSize || '14px'};
              font-family: ${styles.fontFamily || 'Inter, sans-serif'};
              font-weight: ${styles.fontWeight || '400'};
              color: ${styles.color || '#000000'};
              background-color: ${styles.backgroundColor || 'transparent'};
              border: ${styles.border || 'none'};
              border-radius: ${styles.borderRadius || '0px'};
              padding: 10px;
              margin: 5px;
            ">
              ${child.component?.options?.text || `Component ${index}-${childIndex}`}
            </div>
          `;
        }).join('');
      }
      return '';
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Builder.io Preview</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 20px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .preview-container {
            position: relative;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
            margin: 0 auto;
            max-width: 800px;
            min-height: 400px;
            padding: 20px;
          }
          .builder-info {
            position: absolute;
            top: -30px;
            left: 0;
            font-size: 12px;
            color: #666;
            background: rgba(255,255,255,0.9);
            padding: 4px 8px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="builder-info">Builder.io Preview - ${blocks.length} blocks</div>
          ${componentHTML || '<div style="text-align: center; color: #666; padding: 50px;">No components to display</div>'}
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
            Builder.io Design Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Convert your designs to React components using Builder.io's powerful AI
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
            <SparklesIcon className="w-4 h-4 mr-2" />
            Powered by Builder.io AI
          </div>
        </div>

        {/* Builder.io Status */}
        {builderStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
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
                Builder.io Status: {builderStatus.message}
              </span>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Convert Design to Builder.io</h2>
          
          {/* Mode Selection */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
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
                onClick={() => setActiveMode('design-data')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeMode === 'design-data'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                Design Data
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {activeMode === 'figma-url' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Figma URL
                </label>
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
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Design Data (JSON or Text)
                  </label>
                  <textarea
                    value={designData}
                    onChange={(e) => setDesignData(e.target.value)}
                    placeholder='Enter design data as JSON or plain text...'
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Component Name
                    </label>
                    <input
                      type="text"
                      value={componentName}
                      onChange={(e) => setComponentName(e.target.value)}
                      placeholder="BuilderComponent"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload File
                    </label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".json,.txt"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={handleConvert}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <PlayIcon className="w-5 h-5" />
              )}
              <span>{loading ? 'Converting...' : (activeMode === 'figma-url' ? 'Convert Figma to Builder.io' : 'Convert to Builder.io')}</span>
            </button>

            <button
              onClick={testBuilderConnection}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ExclamationTriangleIcon className="w-5 h-5" />
              <span>Test Connection</span>
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                  React Code
                </button>
                <button
                  onClick={() => setActiveTab('blocks')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'blocks'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                  Builder Blocks
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'preview' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Builder.io Preview</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">
                        Live Preview - Generated with Builder.io
                      </span>
                    </div>
                    <div className="p-4 bg-white">
                      <iframe
                        srcDoc={generatePreviewHTML(result)}
                        className="w-full h-96 border-0"
                        title="Builder.io Preview"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'code' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Generated React Code</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{result.reactCode}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'blocks' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Builder.io Blocks (JSON)</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{JSON.stringify(result.blocks, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conversion History */}
        {conversionHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversions</h3>
            <div className="space-y-2">
              {conversionHistory.slice(0, 5).map((conversion) => (
                <div key={conversion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Builder.io Conversion</p>
                    <p className="text-sm text-gray-600">
                      {conversion.design_data ? 'Design data provided' : 'No design data'}
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
  );
};

export default BuilderConverter;
