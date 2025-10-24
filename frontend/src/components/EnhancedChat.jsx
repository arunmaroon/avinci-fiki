import React, { useState, useRef, useEffect } from 'react';
import { Button, Card } from '../design-system';
import useChatStore from '../stores/chatStore';
import { toast } from 'react-hot-toast';
import MessageBeautifier from './MessageBeautifier';
import { 
    PaperAirplaneIcon, 
    PhotoIcon, 
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const EnhancedChat = ({ agentId, agentName }) => {
    const {
        chatHistory,
        isLoading,
        error,
        uiContext,
        setCurrentAgent,
        sendMessage,
        uploadUI,
        clearHistory,
        clearError
    } = useChatStore();

    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (agentId) {
            setCurrentAgent(agentId);
        }
    }, [agentId, setCurrentAgent]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                style: {
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '9999px',
                    padding: '12px 16px'
                }
            });
            clearError();
        }
    }, [error, clearError]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const messageText = message.trim();
        setMessage('');
        
        await sendMessage(messageText, uiContext);
        
        toast.success('Message sent!', {
            style: {
                background: '#10b981',
                color: 'white',
                borderRadius: '9999px',
                padding: '12px 16px'
            }
        });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Please use PNG, JPG, or PDF.', {
                style: {
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '9999px',
                    padding: '12px 16px'
                }
            });
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large. Maximum size is 5MB.', {
                style: {
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '9999px',
                    padding: '12px 16px'
                }
            });
            return;
        }

        await uploadUI(file);
        
        toast.success('UI uploaded successfully!', {
            style: {
                background: '#10b981',
                color: 'white',
                borderRadius: '9999px',
                padding: '12px 16px'
            }
        });
    };


    const formatMessage = (msg) => {
        return (
            <MessageBeautifier 
                message={msg}
                type={msg.role}
                showAvatar={msg.role !== 'user'}
                showTimestamp={true}
            />
        );
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Chat with {agentName}
                        </h2>
                        {uiContext && (
                            <p className="text-sm text-blue-600 flex items-center">
                                <PhotoIcon className="h-4 w-4 mr-1" />
                                UI context loaded
                            </p>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <PhotoIcon className="h-4 w-4 mr-1" />
                            Upload UI
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearHistory}
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            </div>


            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <p>Start a conversation with {agentName}</p>
                        <p className="text-sm mt-2">Upload a UI image to get detailed feedback</p>
                    </div>
                ) : (
                    chatHistory.map((msg) => (
                        <div key={msg.id}>
                            {formatMessage(msg)}
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 text-gray-900 rounded-lg px-6 py-3">
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                <p className="text-sm">Thinking...</p>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4 rounded-b-xl">
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Ask ${agentName} anything...`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <Button
                        type="submit"
                        disabled={!message.trim() || isLoading}
                        loading={isLoading}
                    >
                        <PaperAirplaneIcon className="h-4 w-4" />
                    </Button>
                </form>
                
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default EnhancedChat;
