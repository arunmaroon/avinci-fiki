import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

const MessageBeautifier = ({ 
  message, 
  type = 'agent', 
  showAvatar = true, 
  showTimestamp = true,
  compact = false 
}) => {
  const formatMessage = (content) => {
    if (!content) return '';
    
    // Auto-detect and format URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const formattedContent = content.replace(urlRegex, (url) => {
      return `[${url}](${url})`;
    });
    
    return formattedContent;
  };

  const getMessageStyles = () => {
    const baseStyles = "rounded-lg px-4 py-3 max-w-xs lg:max-w-md transition-all duration-200 hover:shadow-md";
    
    switch (type) {
      case 'user':
        return `${baseStyles} bg-blue-500 text-white ml-auto`;
      case 'agent':
        return `${baseStyles} bg-white border border-gray-200 text-gray-900 shadow-sm`;
      case 'system':
        return `${baseStyles} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case 'error':
        return `${baseStyles} bg-red-100 text-red-800 border border-red-200`;
      case 'call':
        return `${baseStyles} bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-gray-900 shadow-sm`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-900`;
    }
  };

  const getAvatarStyles = () => {
    switch (type) {
      case 'user':
        return 'bg-blue-500 text-white';
      case 'agent':
        return 'bg-purple-500 text-white';
      case 'system':
        return 'bg-yellow-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'call':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAvatarIcon = () => {
    switch (type) {
      case 'user':
        return '👤';
      case 'agent':
        return '🤖';
      case 'system':
        return '⚙️';
      case 'error':
        return '❌';
      case 'call':
        return '🎤';
      default:
        return '💬';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4 ${compact ? 'mb-2' : ''}`}>
      <div className="flex items-start space-x-3 max-w-4xl">
        {showAvatar && type !== 'user' && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${getAvatarStyles()} shadow-sm`}>
            {getAvatarIcon()}
          </div>
        )}
        
        <div className={getMessageStyles()}>
          {message.agentName && type === 'agent' && (
            <div className="text-xs font-semibold text-gray-600 mb-1 flex items-center">
              <span className="mr-1">🤖</span>
              {message.agentName}
            </div>
          )}
          
          {message.agentName && type === 'call' && (
            <div className="text-xs font-semibold text-purple-600 mb-1 flex items-center">
              <span className="mr-1">🎤</span>
              {message.agentName}
            </div>
          )}
          
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <pre className="bg-gray-100 rounded p-3 overflow-x-auto text-sm border">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2"
                  >
                    {children}
                  </a>
                ),
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 bg-gray-50 py-2 rounded-r">
                    {children}
                  </blockquote>
                ),
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-700">{children}</em>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-left font-semibold text-gray-900">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2 border-b border-gray-200 text-gray-700">
                    {children}
                  </td>
                ),
              }}
            >
              {formatMessage(message.content || message.responseText || message.text || '')}
            </ReactMarkdown>
          </div>
          
          {message.ui_path && (
            <div className="text-xs text-gray-500 mt-2 flex items-center bg-gray-50 px-2 py-1 rounded">
              <span className="mr-1">📎</span>
              UI attached
            </div>
          )}
          
          {message.image && (
            <div className="mt-2">
              <img 
                src={message.image} 
                alt="Attachment" 
                className="max-w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          )}
          
          {message.audioUrl && (
            <div className="mt-2">
              <audio 
                controls 
                className="w-full h-8 rounded"
                preload="none"
              >
                <source src={message.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          
          {showTimestamp && (message.timestamp || message.created_at) && (
            <div className="text-xs opacity-70 mt-2 text-gray-500">
              {formatTimestamp(message.timestamp || message.created_at)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBeautifier;
