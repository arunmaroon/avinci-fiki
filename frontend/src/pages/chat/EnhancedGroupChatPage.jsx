/**
 * Enhanced Group Chat Page with Video Calling and Chat Summary
 * Modern messenger interface with video calling and conversation saving
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import MessageBeautifier from '../../components/MessageBeautifier';
import { 
    MagnifyingGlassIcon,
    PlusIcon,
    EllipsisVerticalIcon,
    PaperAirplaneIcon,
    PhotoIcon,
    FaceSmileIcon,
    PaperClipIcon,
    CheckIcon,
    InboxIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    ArchiveBoxIcon,
    TrashIcon,
    XMarkIcon,
    UserGroupIcon,
    PhoneIcon,
    VideoCameraIcon,
    StopIcon,
    DocumentTextIcon,
    BookmarkIcon,
    ShareIcon,
    MicrophoneIcon,
    SpeakerXMarkIcon,
    CameraIcon,
    VideoCameraSlashIcon,
    TruckIcon,
    CpuChipIcon,
    AcademicCapIcon,
    ScissorsIcon,
    HomeModernIcon,
    ShoppingBagIcon,
    WrenchScrewdriverIcon,
    BuildingOfficeIcon,
    BriefcaseIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import { PhoneIcon as PhoneSolid, VideoCameraIcon as VideoSolid } from '@heroicons/react/24/solid';
import { AirbnbButton, AirbnbCard, AirbnbInput, AirbnbBadge, AirbnbSpinner } from '../../design-system/airbnb-components';
import { colors } from '../../design-system/colors';
import api from '../../utils/api';
import EnhancedNewChatModal from '../../components/EnhancedNewChatModal';

// Get profession-specific icon
const getProfessionIcon = (occupation) => {
  const occupationLower = (occupation || '').toLowerCase();
  
  if (occupationLower.includes('driver') || occupationLower.includes('delivery')) {
    return TruckIcon;
  }
  if (occupationLower.includes('manager') || occupationLower.includes('hr')) {
    return UserGroupIcon;
  }
  if (occupationLower.includes('analyst') || occupationLower.includes('consultant')) {
    return CpuChipIcon;
  }
  if (occupationLower.includes('designer') || occupationLower.includes('design')) {
    return AcademicCapIcon;
  }
  if (occupationLower.includes('tailor') || occupationLower.includes('craft')) {
    return ScissorsIcon;
  }
  if (occupationLower.includes('housekeeping') || occupationLower.includes('staff')) {
    return HomeModernIcon;
  }
  if (occupationLower.includes('restaurant') || occupationLower.includes('hotel')) {
    return ShoppingBagIcon;
  }
  if (occupationLower.includes('engineer') || occupationLower.includes('developer')) {
    return WrenchScrewdriverIcon;
  }
  if (occupationLower.includes('business') || occupationLower.includes('office')) {
    return BuildingOfficeIcon;
  }
  
  return BriefcaseIcon; // Default
};

const EnhancedGroupChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewChat, setShowNewChat] = useState(false);
    const [allAgents, setAllAgents] = useState([]);
    const [selectedAgents, setSelectedAgents] = useState([]);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [agentsLoading, setAgentsLoading] = useState(true);
    const [attachments, setAttachments] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    
    // Call state
    const [isInCall, setIsInCall] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [callType, setCallType] = useState(null); // 'audio' or 'video'
    const [callStartTime, setCallStartTime] = useState(null);
    
    // Chat summary state
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [chatSummary, setChatSummary] = useState(null);
    const [savedConversations, setSavedConversations] = useState([]);
    
    // Refs
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const callIntervalRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        loadConversations();
        loadAgents();
        loadSavedConversations();
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const loadConversations = async () => {
        try {
            const response = await api.get('/chat/conversations');
            setConversations(response.data || []);
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    };

    const loadAgents = async () => {
        try {
            setAgentsLoading(true);
            console.log('Loading agents from /agents/v5?view=short...');
            const response = await api.get('/agents/v5', { params: { view: 'short', _t: Date.now() } });
            console.log('Agents API response:', response.data);
            // Ensure array
            const rows = Array.isArray(response.data) ? response.data : (response.data?.agents || []);
            console.log('Processed agents count:', rows.length);
            setAllAgents(rows);
            
            // Force re-render of the modal if it's open
            if (showNewChat) {
                setShowNewChat(false);
                setTimeout(() => setShowNewChat(true), 100);
            }
        } catch (error) {
            console.error('Error loading agents:', error);
        } finally {
            setAgentsLoading(false);
        }
    };

    const loadSavedConversations = async () => {
        try {
            const response = await api.get('/chat/saved-conversations');
            setSavedConversations(response.data || []);
        } catch (error) {
            console.error('Error loading saved conversations:', error);
        }
    };

    const startCall = (type) => {
        if (!selectedConversation) {
            toast.error('Please select a conversation first');
            return;
        }

        setIsInCall(true);
        setCallType(type);
        setCallDuration(0);
        setCallStartTime(new Date());
        setIsVideoEnabled(type === 'video');
        
        // Start call timer
        callIntervalRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);

        // Add system message
        const systemMessage = {
            id: Date.now(),
            text: `${type === 'audio' ? '📞' : '📹'} ${type === 'audio' ? 'Audio' : 'Video'} call started with ${selectedConversation.name}`,
            sender: 'System',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isSystem: true
        };
        setMessages(prev => [...prev, systemMessage]);

        toast.success(`${type === 'audio' ? 'Audio' : 'Video'} call started`);

        // Initialize call API
        initializeCall(selectedConversation.id, type);
    };

    const endCall = async (saveConversation = false) => {
        if (callIntervalRef.current) {
            clearInterval(callIntervalRef.current);
        }

        const duration = formatCallDuration(callDuration);
        
        // Add system message
        const systemMessage = {
            id: Date.now(),
            text: `${callType === 'audio' ? '📞' : '📹'} Call ended. Duration: ${duration}${saveConversation ? ' • Conversation saved' : ''}`,
            sender: 'System',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isSystem: true
        };
        setMessages(prev => [...prev, systemMessage]);

        // Save conversation if requested
        if (saveConversation) {
            await saveConversationToHistory();
        }

        setIsInCall(false);
        setCallDuration(0);
        setCallType(null);
        setIsMuted(false);
        setIsVideoEnabled(true);
        setCallStartTime(null);

        toast.success(saveConversation ? 'Call ended and conversation saved' : 'Call ended');
    };

    const saveConversationToHistory = async () => {
        try {
            const conversationData = {
                conversationId: selectedConversation.id,
                messages: messages,
                callDuration: callDuration,
                callType: callType,
                startTime: callStartTime,
                endTime: new Date(),
                participants: selectedConversation.members || [selectedConversation]
            };

            await api.post('/chat/save-conversation', conversationData);
            await loadSavedConversations();
        } catch (error) {
            console.error('Error saving conversation:', error);
            toast.error('Failed to save conversation');
        }
    };

    const generateChatSummary = async () => {
        if (!selectedConversation || messages.length === 0) {
            toast.error('No conversation to summarize');
            return;
        }

        setIsGeneratingSummary(true);
        try {
            const response = await api.post('/ai/generate-summary', {
                conversationId: selectedConversation.id,
                messages: messages,
                callDuration: callDuration,
                callType: callType
            });

            setChatSummary(response.data.summary);
            setShowSummaryModal(true);
        } catch (error) {
            console.error('Error generating summary:', error);
            toast.error('Failed to generate summary');
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
        toast.success(isMuted ? 'Unmuted' : 'Muted');
    };

    const toggleVideo = () => {
        if (callType === 'video') {
            setIsVideoEnabled(prev => !prev);
            toast.success(isVideoEnabled ? 'Video disabled' : 'Video enabled');
        }
    };

    const formatCallDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const initializeCall = async (conversationId, type) => {
        try {
            const response = await api.post('/voice/start-call', {
                conversationId: conversationId,
                callType: type,
                agentIds: selectedConversation.members?.map(m => m.id) || [conversationId]
            });

            console.log('Call initialized:', response.data);
        } catch (error) {
            console.error('Failed to initialize call:', error);
            // Don't show error to user as we have fallback
        }
    };

    const sendMessage = async () => {
        if ((!message.trim() && attachments.length === 0) || !selectedConversation) return;

        const userMessage = {
            id: Date.now(),
            text: message,
            sender: 'You',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isUser: true,
            attachments: [...attachments]
        };

        setMessages(prev => [...prev, userMessage]);
        const outgoingText = message; // preserve before clearing state
        setMessage('');
        setAttachments([]);
        setLoading(true);

        try {
            // Prefer parallel endpoint when multiple agents are selected
            if (selectedConversation.agentIds && selectedConversation.agentIds.length > 1) {
                const resp = await api.post('/ai/parallel/parallel-chat', {
                    agentIds: selectedConversation.agentIds,
                    message: outgoingText,
                    chatHistory: messages
                });

                const responses = resp.data?.responses || [];
                const aiMessages = responses.map(r => ({
                    id: Date.now() + Math.random(),
                    text: r.response,
                    sender: r.agentName || 'Agent',
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    isUser: false,
                    avatar: selectedConversation.members?.find(m => m.id === r.agentId)?.avatar_url || selectedConversation.avatar
                }));
                setMessages(prev => [...prev, ...aiMessages]);
            } else {
                // Single agent - use enhanced generate endpoint
                const agentId = (selectedConversation.agentIds && selectedConversation.agentIds[0])
                    || selectedConversation.members?.[0]?.id
                    || selectedConversation.id; // fallback

                const response = await api.post('/ai/generate', {
                    agentId,
                    query: outgoingText,
                    attachments: attachments,
                    chat_history: messages
                });

                const aiResponse = {
                    id: Date.now() + 1,
                    text: response.data.response || "I've analyzed your message. Here's my response.",
                    sender: selectedConversation.name,
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    isUser: false,
                    avatar: selectedConversation.avatar
                };
                setMessages(prev => [...prev, aiResponse]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Send error:', error);
            toast.error('Failed to send message');
            setLoading(false);
        }
    };

    const createNewChat = (topic = '') => {
        if (selectedAgents.length === 0) return;

        const newConversation = {
            id: Date.now(),
            name: selectedAgents.length === 1 ? selectedAgents[0].name : `${selectedAgents[0].name} + ${selectedAgents.length - 1} more`,
            lastMessage: topic ? `Topic: ${topic}` : 'Start a conversation',
            timestamp: 'Just now',
            unread: 0,
            avatar: selectedAgents[0].avatar_url,
            members: selectedAgents,
            isGroup: selectedAgents.length > 1,
            // Store the actual agent IDs for API calls
            agentIds: selectedAgents.map(agent => agent.id),
            topic: topic // Store the topic
        };

        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
        setMessages([]);
        setShowNewChat(false);
        setSelectedAgents([]);
    };

    const handleAgentToggle = (agent) => {
        setSelectedAgents(prev => {
            const exists = prev.find(a => a.id === agent.id);
            if (exists) {
                return prev.filter(a => a.id !== agent.id);
            } else {
                return [...prev, agent];
            }
        });
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-gray-900">Conversations</h1>
                        <AirbnbButton
                            size="sm"
                            onClick={() => setShowNewChat(true)}
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            New Chat
                        </AirbnbButton>
                    </div>
                    
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <AirbnbInput
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            onClick={() => setSelectedConversation(conversation)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedConversation?.id === conversation.id ? 'bg-primary-50 border-primary-200' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        src={conversation.avatar}
                                        alt={conversation.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    {conversation.isGroup && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                                            <UserGroupIcon className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">
                                        {conversation.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">
                                        {conversation.lastMessage}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-400">
                                            {conversation.timestamp}
                                        </span>
                                        {conversation.unread > 0 && (
                                            <AirbnbBadge size="sm" variant="primary">
                                                {conversation.unread}
                                            </AirbnbBadge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Saved Conversations */}
                {savedConversations.length > 0 && (
                    <div className="border-t border-gray-200 p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Conversations</h3>
                        <div className="space-y-2">
                            {savedConversations.slice(0, 3).map((saved) => (
                                <div
                                    key={saved.id}
                                    className="p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                        setSelectedConversation(saved.conversation);
                                        setMessages(saved.messages || []);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <BookmarkIcon className="w-4 h-4 text-primary-500" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {saved.conversation?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {saved.callType} • {formatCallDuration(saved.callDuration || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src={selectedConversation.avatar}
                                            alt={selectedConversation.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        {selectedConversation.isGroup && (
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                                                <UserGroupIcon className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-gray-900">
                                            {selectedConversation.name}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {isInCall ? (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                    {callType === 'audio' ? 'Audio call' : 'Video call'} - {formatCallDuration(callDuration)}
                                                </span>
                                            ) : (
                                                <span>{selectedConversation.isGroup ? `${selectedConversation.members?.length || 0} members` : 'Online'}</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Call Buttons */}
                                    {!isInCall ? (
                                        <>
                                            <AirbnbButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => startCall('audio')}
                                            >
                                                <PhoneIcon className="w-4 h-4 mr-2" />
                                                Audio
                                            </AirbnbButton>
                                            <AirbnbButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => startCall('video')}
                                            >
                                                <VideoCameraIcon className="w-4 h-4 mr-2" />
                                                Video
                                            </AirbnbButton>
                                        </>
                                    ) : (
                                        <>
                                            <AirbnbButton
                                                variant="outline"
                                                size="sm"
                                                onClick={toggleMute}
                                                className={isMuted ? 'bg-red-50 text-red-600' : ''}
                                            >
                                                {isMuted ? (
                                                    <SpeakerXMarkIcon className="w-4 h-4 mr-2" />
                                                ) : (
                                                    <MicrophoneIcon className="w-4 h-4 mr-2" />
                                                )}
                                                {isMuted ? 'Unmute' : 'Mute'}
                                            </AirbnbButton>
                                            
                                            {callType === 'video' && (
                                                <AirbnbButton
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={toggleVideo}
                                                    className={!isVideoEnabled ? 'bg-red-50 text-red-600' : ''}
                                                >
                                                    {isVideoEnabled ? (
                                                        <CameraIcon className="w-4 h-4 mr-2" />
                                                    ) : (
                                                        <VideoCameraSlashIcon className="w-4 h-4 mr-2" />
                                                    )}
                                                    {isVideoEnabled ? 'Video On' : 'Video Off'}
                                                </AirbnbButton>
                                            )}

                                            <AirbnbButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => endCall(false)}
                                                className="bg-red-50 text-red-600 hover:bg-red-100"
                                            >
                                                <StopIcon className="w-4 h-4 mr-2" />
                                                End Call
                                            </AirbnbButton>
                                        </>
                                    )}

                                    {/* Summary Button */}
                                    <AirbnbButton
                                        variant="outline"
                                        size="sm"
                                        onClick={generateChatSummary}
                                        disabled={isGeneratingSummary || messages.length === 0}
                                    >
                                        {isGeneratingSummary ? (
                                            <AirbnbSpinner size="sm" className="mr-2" />
                                        ) : (
                                            <DocumentTextIcon className="w-4 h-4 mr-2" />
                                        )}
                                        Summary
                                    </AirbnbButton>

                                    <button className="p-2 rounded-lg hover:bg-gray-100">
                                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Call Banner */}
                        {isInCall && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-white"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                                            {callType === 'audio' ? (
                                                <PhoneSolid className="w-5 h-5" />
                                            ) : (
                                                <VideoSolid className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold">
                                                {callType === 'audio' ? 'Audio Call' : 'Video Call'} in Progress
                                            </p>
                                            <p className="text-sm opacity-90">
                                                {formatCallDuration(callDuration)} • {selectedConversation.isGroup ? `${selectedConversation.members?.length || 0} participants` : '1 participant'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <AirbnbButton
                                            variant="outline"
                                            size="sm"
                                            onClick={() => endCall(true)}
                                            className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 border-white"
                                        >
                                            <BookmarkIcon className="w-4 h-4 mr-2" />
                                            Save & End
                                        </AirbnbButton>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <MessageBeautifier
                                    key={msg.id}
                                    message={{
                                        content: msg.text,
                                        agentName: msg.isUser ? 'You' : msg.sender,
                                        timestamp: msg.timestamp,
                                        avatar: msg.avatar || selectedConversation.avatar
                                    }}
                                    type={msg.isSystem ? 'system' : msg.isUser ? 'user' : 'agent'}
                                    showAvatar={!msg.isUser && !msg.isSystem}
                                    showTimestamp={true}
                                />
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-3">
                                        <img
                                            src={selectedConversation.avatar}
                                            alt={selectedConversation.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                                            <AirbnbSpinner size="sm" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <PaperClipIcon className="w-5 h-5 text-gray-600" />
                                </button>
                                
                                <div className="flex-1 relative">
                                    <AirbnbInput
                                        placeholder="Type a message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        className="pr-12"
                                    />
                                    <button
                                        onClick={() => setMessage(message + '😊')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        <FaceSmileIcon className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                                
                                <AirbnbButton
                                    onClick={sendMessage}
                                    disabled={!message.trim() && attachments.length === 0}
                                >
                                    <PaperAirplaneIcon className="w-4 h-4" />
                                </AirbnbButton>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                            <p className="text-gray-500">Choose a conversation from the sidebar to start chatting</p>
                        </div>
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            {showNewChat && (
                <EnhancedNewChatModal
                    agents={allAgents}
                    selectedAgents={selectedAgents}
                    onSelect={setSelectedAgents}
                    onClose={() => setShowNewChat(false)}
                    onCreate={createNewChat}
                    loading={agentsLoading}
                />
            )}

            {/* Chat Summary Modal */}
            <AnimatePresence>
                {showSummaryModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">Chat Summary</h3>
                                    <button
                                        onClick={() => setShowSummaryModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 max-h-96 overflow-y-auto">
                                {chatSummary ? (
                                    <div className="prose max-w-none">
                                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Conversation Overview</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Duration:</span>
                                                    <span className="ml-2 font-medium">{formatCallDuration(callDuration)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Type:</span>
                                                    <span className="ml-2 font-medium">{callType || 'Text chat'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Messages:</span>
                                                    <span className="ml-2 font-medium">{messages.length}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Participants:</span>
                                                    <span className="ml-2 font-medium">{selectedConversation?.members?.length || 1}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="whitespace-pre-wrap">{chatSummary}</div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <AirbnbSpinner size="lg" />
                                        <p className="mt-4 text-gray-500">Generating summary...</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                                <AirbnbButton
                                    variant="outline"
                                    onClick={() => setShowSummaryModal(false)}
                                >
                                    Close
                                </AirbnbButton>
                                <div className="flex items-center gap-3">
                                    <AirbnbButton
                                        variant="outline"
                                        onClick={() => {
                                            // Copy to clipboard
                                            navigator.clipboard.writeText(chatSummary);
                                            toast.success('Summary copied to clipboard');
                                        }}
                                    >
                                        <ShareIcon className="w-4 h-4 mr-2" />
                                        Copy
                                    </AirbnbButton>
                                    <AirbnbButton
                                        onClick={() => {
                                            saveConversationToHistory();
                                            setShowSummaryModal(false);
                                            toast.success('Conversation saved');
                                        }}
                                    >
                                        <BookmarkIcon className="w-4 h-4 mr-2" />
                                        Save
                                    </AirbnbButton>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EnhancedGroupChatPage;
