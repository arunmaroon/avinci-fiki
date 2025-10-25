import React, { useState } from 'react';
import { 
  CodeBracketIcon, 
  ClipboardDocumentIcon, 
  ArrowDownTrayIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CodePreview = ({ 
  code, 
  language = 'tsx', 
  isLoading = false, 
  fileName = 'component',
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  const getFileExtension = (lang) => {
    const extensions = {
      'tsx': 'tsx',
      'jsx': 'jsx',
      'html': 'html',
      'vue': 'vue',
      'css': 'css'
    };
    return extensions[lang] || 'txt';
  };

  const formatCode = (code) => {
    if (!code) return '';
    
    // Basic formatting for better readability
    const lines = code.split('\n');
    const formattedLines = lines.map((line, index) => {
      const lineNumber = showLineNumbers ? (index + 1).toString().padStart(3, ' ') : '';
      return showLineNumbers ? `${lineNumber} | ${line}` : line;
    });
    
    return formattedLines.join('\n');
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Generated Code</h3>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Generating...</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Generated Code</h3>
        </div>
        <div className="p-6 text-center">
          <CodeBracketIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No code generated yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Upload an image and convert to see the generated code here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CodeBracketIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Generated Code</h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {getFileExtension(language).toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title={showLineNumbers ? 'Hide line numbers' : 'Show line numbers'}
            >
              {showLineNumbers ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {copied ? (
                <CheckIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ClipboardDocumentIcon className="w-4 h-4" />
              )}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <pre className="p-6 overflow-x-auto bg-gray-900 text-gray-100 text-sm leading-relaxed">
          <code className="font-mono">
            {formatCode(code)}
          </code>
        </pre>
        
        {/* Copy overlay for mobile */}
        <div className="absolute top-2 right-2 md:hidden">
          <button
            onClick={handleCopy}
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <ClipboardDocumentIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{code.split('\n').length} lines</span>
          <span>{code.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default CodePreview;
