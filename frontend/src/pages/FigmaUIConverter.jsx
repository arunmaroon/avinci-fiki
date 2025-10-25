import React, { useState, useEffect } from 'react';
import {
  EyeIcon, CodeBracketIcon, PlayIcon, ArrowPathIcon, ExclamationTriangleIcon, 
  DocumentTextIcon, SparklesIcon, CheckCircleIcon, CloudArrowUpIcon, LinkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const FigmaUIConverter = () => {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [componentName, setComponentName] = useState('FigmaUI');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('preview');
  const [figmaStatus, setFigmaStatus] = useState(null);

  // Load conversion history on mount
  useEffect(() => {
    loadConversionHistory();
    testFigmaConnection();
  }, []);

  const loadConversionHistory = async () => {
    try {
      const response = await fetch('/api/figma-ui/conversions');
      const data = await response.json();
      if (data.success) {
        setConversionHistory(data.conversions);
      }
    } catch (error) {
      console.error('Failed to load conversion history:', error);
    }
  };

  const testFigmaConnection = async () => {
    try {
      const response = await fetch('/api/figma-ui/test');
      const data = await response.json();
      setFigmaStatus(data);
      if (data.success) {
        toast.success(`Figma connection successful! Found ${data.testResult.componentsCount} components`);
      } else {
        toast.error(`Figma connection failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Figma test failed:', error);
      toast.error(`Figma test failed: ${error.message}`);
    }
  };

  const handleConvert = async () => {
    if (!figmaUrl.trim()) {
      toast.error('Please enter a Figma URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/figma-ui/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          figmaUrl: figmaUrl.trim(),
          componentName: componentName.trim() || 'FigmaUI'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result);
        toast.success('Figma prototype converted to working UI successfully!');
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

  const handlePasteFigmaUrl = () => {
    navigator.clipboard.readText().then(text => {
      if (text.includes('figma.com')) {
        setFigmaUrl(text);
        toast.success('Figma URL pasted from clipboard!');
      } else {
        toast.error('Clipboard does not contain a Figma URL');
      }
    }).catch(() => {
      toast.error('Could not access clipboard');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Figma Prototype to UI Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Upload your Figma prototype and get the actual working UI with real components, styling, and layout
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
            <SparklesIcon className="w-4 h-4 mr-2" />
            Powered by Figma API
          </div>
        </div>

        {/* Figma Status */}
        {figmaStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            figmaStatus.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {figmaStatus.success ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className={`font-medium ${
                figmaStatus.success ? 'text-green-800' : 'text-red-800'
              }`}>
                Figma Status: {figmaStatus.message}
                {figmaStatus.testResult && (
                  <span className="ml-2 text-sm">
                    ({figmaStatus.testResult.componentsCount} components, {figmaStatus.testResult.framesCount} frames)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Convert Figma Prototype to UI</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Figma Prototype URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  placeholder="https://www.figma.com/file/... or https://www.figma.com/design/..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handlePasteFigmaUrl}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Paste</span>
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Paste your Figma prototype URL here. Supports both /file/ and /design/ URLs.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Component Name
              </label>
              <input
                type="text"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                placeholder="FigmaUI"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={handleConvert}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <PlayIcon className="w-5 h-5" />
              )}
              <span>{loading ? 'Converting...' : 'Convert to Working UI'}</span>
            </button>

            <button
              onClick={testFigmaConnection}
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
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <EyeIcon className="w-5 h-5 inline mr-2" />
                  Live Preview
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'code'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <CodeBracketIcon className="w-5 h-5 inline mr-2" />
                  HTML Code
                </button>
                <button
                  onClick={() => setActiveTab('components')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'components'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                  Components
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'preview' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Working UI Preview</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">
                        Live Preview - {result.components.length} components from Figma
                      </span>
                    </div>
                    <div className="p-4 bg-white">
                      <iframe
                        srcDoc={result.html}
                        className="w-full h-96 border-0"
                        title="Figma UI Preview"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'code' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Generated HTML Code</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{result.html}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'components' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Extracted Components</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.components.map((component, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{component.name}</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Type:</strong> {component.type}</p>
                          <p><strong>Size:</strong> {component.width} × {component.height}px</p>
                          <p><strong>Position:</strong> ({component.x}, {component.y})</p>
                          {component.text && <p><strong>Text:</strong> {component.text}</p>}
                          {component.color && <p><strong>Color:</strong> {component.color}</p>}
                          {component.backgroundColor && <p><strong>Background:</strong> {component.backgroundColor}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
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
                    <p className="font-medium text-gray-900">{conversion.component_name}</p>
                    <p className="text-sm text-gray-600">{conversion.figma_url}</p>
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

export default FigmaUIConverter;

