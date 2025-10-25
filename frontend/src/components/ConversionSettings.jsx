import React from 'react';
import { CogIcon, CodeBracketIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

const ConversionSettings = ({ settings, onChange, className = '' }) => {
  const frameworks = [
    { value: 'react', label: 'React', description: 'React component with hooks' },
    { value: 'nextjs', label: 'Next.js', description: 'Next.js page component' },
    { value: 'html', label: 'HTML', description: 'Pure HTML with CSS' },
    { value: 'vue', label: 'Vue', description: 'Vue single file component' }
  ];

  const stylingOptions = [
    { value: 'tailwind', label: 'Tailwind CSS', description: 'Utility-first CSS' },
    { value: 'css', label: 'CSS Modules', description: 'Scoped CSS modules' },
    { value: 'styled-components', label: 'Styled Components', description: 'CSS-in-JS' }
  ];

  const componentTypes = [
    { value: 'component', label: 'Component', description: 'Reusable UI component' },
    { value: 'page', label: 'Page', description: 'Full page layout' },
    { value: 'section', label: 'Section', description: 'Page section' }
  ];

  const aiProviders = [
    { value: 'auto', label: 'Auto (Best)', description: 'Automatically choose best AI' },
    { value: 'claude', label: 'Claude 3.5 Sonnet', description: 'Anthropic Claude Vision' },
    { value: 'openai', label: 'GPT-4 Vision', description: 'OpenAI GPT-4 Vision' }
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <CogIcon className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Conversion Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Framework Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <CodeBracketIcon className="w-4 h-4 inline mr-1" />
            Framework
          </label>
          <div className="grid grid-cols-2 gap-3">
            {frameworks.map((framework) => (
              <button
                key={framework.value}
                onClick={() => onChange({ ...settings, framework: framework.value })}
                className={`p-3 text-left border rounded-lg transition-all ${
                  settings.framework === framework.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{framework.label}</div>
                <div className="text-xs text-gray-500 mt-1">{framework.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Styling Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <PaintBrushIcon className="w-4 h-4 inline mr-1" />
            Styling
          </label>
          <div className="grid grid-cols-1 gap-3">
            {stylingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange({ ...settings, styling: option.value })}
                className={`p-3 text-left border rounded-lg transition-all ${
                  settings.styling === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Component Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Component Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {componentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => onChange({ ...settings, componentType: type.value })}
                className={`p-3 text-center border rounded-lg transition-all ${
                  settings.componentType === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-xs text-gray-500 mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            AI Provider
          </label>
          <div className="space-y-2">
            {aiProviders.map((provider) => (
              <button
                key={provider.value}
                onClick={() => onChange({ ...settings, aiProvider: provider.value })}
                className={`w-full p-3 text-left border rounded-lg transition-all ${
                  settings.aiProvider === provider.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{provider.label}</div>
                <div className="text-xs text-gray-500 mt-1">{provider.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Instructions (Optional)
          </label>
          <textarea
            value={settings.customPrompt || ''}
            onChange={(e) => onChange({ ...settings, customPrompt: e.target.value })}
            placeholder="Add specific requirements, design system notes, or special instructions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ConversionSettings;
