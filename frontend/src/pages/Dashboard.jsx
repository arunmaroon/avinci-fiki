import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    ChartBarIcon, 
    ChatBubbleLeftRightIcon, 
    UserGroupIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        fetchAgents();
        fetchAnalytics();
    }, [selectedAgent]);

    const fetchAgents = async () => {
        try {
            const response = await api.get('/agent/generate');
            setAgents(response.data.agents);
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const params = selectedAgent ? { agentId: selectedAgent } : {};
            const response = await api.get('/analytics/insights', { params });
            setAnalytics(response.data.insights);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className={`flex items-center mt-1 text-sm ${
                            trend > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                            {trend > 0 ? '+' : ''}{trend}%
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-full bg-${color}-100`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </motion.div>
    );

    const ThemeCard = ({ theme, percentage, count }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{theme}</h3>
                <span className="text-sm text-gray-500">{count} mentions</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">{percentage}% of conversations</p>
        </motion.div>
    );

    const SentimentCard = ({ sentiment }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
            <div className="space-y-4">
                {Object.entries(sentiment.distribution).map(([type, percentage]) => (
                    <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${
                                type === 'positive' ? 'bg-green-500' :
                                type === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                            }`} />
                            <span className="capitalize text-gray-700">{type}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{percentage}%</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    Average Score: <span className="font-semibold">{sentiment.averageScore}</span>
                </p>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Analytics</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchAnalytics}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="text-gray-600 mt-2">Insights from your AI agent conversations</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedAgent}
                                onChange={(e) => setSelectedAgent(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Agents</option>
                                {agents.map(agent => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={fetchAnalytics}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {analytics ? (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Total Messages"
                                value={analytics.engagement?.totalMessages || 0}
                                icon={ChatBubbleLeftRightIcon}
                                color="blue"
                            />
                            <StatCard
                                title="Active Days"
                                value={analytics.engagement?.activeDays || 0}
                                icon={ClockIcon}
                                color="green"
                            />
                            <StatCard
                                title="Avg Message Length"
                                value={`${analytics.engagement?.averageMessageLength || 0} chars`}
                                icon={ChartBarIcon}
                                color="purple"
                            />
                            <StatCard
                title="Peak Hour"
                value={analytics.engagement?.peakHour || 'N/A'}
                icon={ArrowTrendingUpIcon}
                color="orange"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Themes Analysis */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Conversation Themes</h2>
                                <div className="space-y-4">
                                    {analytics.themes?.themes?.map((theme, index) => (
                                        <ThemeCard
                                            key={index}
                                            theme={theme.name}
                                            percentage={theme.percentage}
                                            count={theme.count}
                                        />
                                    )) || (
                                        <div className="text-center py-8 text-gray-500">
                                            No theme data available
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sentiment Analysis */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Sentiment Analysis</h2>
                                {analytics.sentiment ? (
                                    <SentimentCard sentiment={analytics.sentiment} />
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No sentiment data available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Common Phrases */}
                        {analytics.themes?.commonPhrases && analytics.themes.commonPhrases.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Common Phrases</h2>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {analytics.themes.commonPhrases.slice(0, 10).map((phrase, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-700 truncate">{phrase.phrase}</span>
                                                <span className="text-sm text-gray-500 ml-2">{phrase.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📊</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h2>
                        <p className="text-gray-600">Start chatting with agents to see analytics here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;