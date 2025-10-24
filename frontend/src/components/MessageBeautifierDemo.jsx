import React from 'react';
import MessageBeautifier from './MessageBeautifier';

const MessageBeautifierDemo = () => {
  const demoMessages = [
    {
      content: "Hello! How are you today? 😊",
      agentName: "AI Assistant",
      timestamp: new Date().toISOString(),
      type: "agent"
    },
    {
      content: "I'm doing great! Thanks for asking. Here's some **code** I've been working on:\n\n```javascript\nconst greeting = 'Hello World';\nconsole.log(greeting);\n```",
      agentName: "You",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: "user"
    },
    {
      content: "That's awesome! I can see you're working with JavaScript. Here are some **best practices**:\n\n1. Use `const` for values that won't change\n2. Use `let` for values that will change\n3. Avoid `var` in modern JavaScript\n\nCheck out this [MDN documentation](https://developer.mozilla.org) for more info!",
      agentName: "AI Assistant",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      type: "agent"
    },
    {
      content: "System is updating... Please wait.",
      agentName: "System",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      type: "system"
    },
    {
      content: "Error: Failed to connect to server. Please try again.",
      agentName: "Error",
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      type: "error"
    },
    {
      content: "🎤 **Audio Call Message**\n\nThis is how messages look during audio calls with **markdown support** and beautiful formatting!",
      agentName: "Elena Rodriguez",
      timestamp: new Date(Date.now() - 1500000).toISOString(),
      type: "call"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Message Beautifier Demo</h1>
        <p className="text-gray-600 mb-8">Showcasing beautiful message formatting with markdown support, code highlighting, and responsive design.</p>
        
        <div className="space-y-4">
          {demoMessages.map((message, index) => (
            <MessageBeautifier
              key={index}
              message={message}
              type={message.type}
              showAvatar={message.type !== 'user'}
              showTimestamp={true}
            />
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">✨ Features Demonstrated</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>Markdown Support:</strong> Bold, italic, headers, lists, links</li>
            <li>• <strong>Code Highlighting:</strong> Syntax highlighting for code blocks</li>
            <li>• <strong>Emoji Support:</strong> Native emoji rendering</li>
            <li>• <strong>Message Types:</strong> User, agent, system, error, and call messages</li>
            <li>• <strong>Responsive Design:</strong> Mobile-friendly layout</li>
            <li>• <strong>Timestamps:</strong> Smart relative time formatting</li>
            <li>• <strong>Avatars:</strong> Context-aware icons and styling</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MessageBeautifierDemo;
