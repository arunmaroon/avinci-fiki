import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PlayIcon,
    PauseIcon,
    ArrowsPointingOutIcon,
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    DeviceTabletIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon
} from '@heroicons/react/24/outline';

const PrototypeViewer = ({ prototype, onClose }) => {
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
    const [isMuted, setIsMuted] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(3); // seconds per screen

    // Get screens from AST
    const screens = prototype.ast?.reduce((acc, page) => {
        if (page.screens && page.screens.length > 0) {
            acc.push(...page.screens);
        }
        return acc;
    }, []) || [];

    // Auto-play functionality
    useEffect(() => {
        let interval;
        if (isPlaying && screens.length > 1) {
            interval = setInterval(() => {
                setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
            }, playbackSpeed * 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, screens.length, playbackSpeed]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                prevScreen();
            } else if (e.key === 'ArrowRight') {
                nextScreen();
            } else if (e.key === ' ') {
                e.preventDefault();
                togglePlay();
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Fullscreen functionality
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const nextScreen = () => {
        setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
    };

    const prevScreen = () => {
        setCurrentScreenIndex((prev) => (prev === 0 ? screens.length - 1 : prev - 1));
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    };

    const getViewModeStyles = () => {
        switch (viewMode) {
            case 'mobile':
                return {
                    width: '375px',
                    height: '667px',
                    maxWidth: '375px'
                };
            case 'tablet':
                return {
                    width: '768px',
                    height: '1024px',
                    maxWidth: '768px'
                };
            default:
                return {
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%'
                };
        }
    };

    const renderScreen = (screen) => {
        if (!screen) return null;

        return (
            <div
                className="relative bg-white rounded-lg shadow-lg overflow-hidden"
                style={getViewModeStyles()}
            >
                {/* Screen Content */}
                <div
                    className="relative"
                    style={{
                        width: screen.layout.width,
                        height: screen.layout.height,
                        transform: `scale(${Math.min(
                            (getViewModeStyles().width === '100%' ? 1 : parseInt(getViewModeStyles().width)) / screen.layout.width,
                            (getViewModeStyles().height === '100%' ? 1 : parseInt(getViewModeStyles().height)) / screen.layout.height
                        )})`,
                        transformOrigin: 'top left'
                    }}
                >
                    {renderNode(screen)}
                </div>
            </div>
        );
    };

    const renderNode = (node) => {
        if (!node || !node.visible) return null;

        const TagName = getTagName(node.type);
        const styles = getNodeStyles(node);

        return (
            <TagName
                key={node.id}
                className={`absolute ${getNodeClasses(node)}`}
                style={styles}
            >
                {/* Text Content */}
                {node.type === 'TEXT' && node.metadata?.textContent && (
                    <span className="whitespace-pre-wrap">
                        {node.metadata.textContent}
                    </span>
                )}

                {/* Image Content */}
                {node.metadata?.hasImage && (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Image Placeholder</span>
                    </div>
                )}

                {/* Children */}
                {node.children && node.children.map(child => renderNode(child))}
            </TagName>
        );
    };

    const getTagName = (nodeType) => {
        switch (nodeType) {
            case 'TEXT': return 'p';
            case 'RECTANGLE': return 'div';
            case 'ELLIPSE': return 'div';
            case 'FRAME': return 'div';
            case 'COMPONENT': return 'div';
            case 'INSTANCE': return 'div';
            case 'GROUP': return 'div';
            default: return 'div';
        }
    };

    const getNodeClasses = (node) => {
        const classes = [];
        
        if (node.styles?.cornerRadius !== undefined) {
            classes.push('rounded-lg');
        }
        
        return classes.join(' ');
    };

    const getNodeStyles = (node) => {
        const styles = {
            position: 'absolute',
            left: `${node.layout.x}px`,
            top: `${node.layout.y}px`,
            width: `${node.layout.width}px`,
            height: `${node.layout.height}px`
        };

        // Rotation
        if (node.layout.rotation !== 0) {
            styles.transform = `rotate(${node.layout.rotation}deg)`;
        }

        // Opacity
        if (node.layout.opacity !== 1) {
            styles.opacity = node.layout.opacity;
        }

        // Background color
        if (node.styles?.fills?.[0]?.color) {
            const { r, g, b, a } = node.styles.fills[0].color;
            styles.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        }

        // Border
        if (node.styles?.strokes?.[0]?.color) {
            const { r, g, b, a } = node.styles.strokes[0].color;
            const weight = node.styles.strokes[0].weight || 1;
            styles.border = `${weight}px solid rgba(${r}, ${g}, ${b}, ${a})`;
        }

        // Border radius
        if (node.styles?.cornerRadius !== undefined) {
            styles.borderRadius = `${node.styles.cornerRadius}px`;
        }

        // Text styles
        if (node.styles?.textStyle) {
            const textStyle = node.styles.textStyle;
            if (textStyle.fontFamily) styles.fontFamily = textStyle.fontFamily;
            if (textStyle.fontSize) styles.fontSize = `${textStyle.fontSize}px`;
            if (textStyle.fontWeight) styles.fontWeight = textStyle.fontWeight;
            if (textStyle.textAlignHorizontal) {
                styles.textAlign = textStyle.textAlignHorizontal.toLowerCase();
            }
            if (textStyle.letterSpacing) {
                styles.letterSpacing = `${textStyle.letterSpacing}px`;
            }
            if (textStyle.lineHeightPx) {
                styles.lineHeight = `${textStyle.lineHeightPx}px`;
            }
        }

        return styles;
    };

    if (!prototype || screens.length === 0) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Screens Found</h3>
                    <p className="text-gray-500 mb-4">This prototype doesn't contain any screens to view.</p>
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-lg shadow-xl ${isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-full max-h-[90vh]'} flex flex-col`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {prototype.name}
                        </h2>
                        <span className="text-sm text-gray-500">
                            {currentScreenIndex + 1} of {screens.length}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('desktop')}
                                className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                title="Desktop View"
                            >
                                <ComputerDesktopIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('tablet')}
                                className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                title="Tablet View"
                            >
                                <DeviceTabletIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('mobile')}
                                className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                title="Mobile View"
                            >
                                <DevicePhoneMobileIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Playback Speed */}
                        <select
                            value={playbackSpeed}
                            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                            disabled={!isPlaying}
                        >
                            <option value={1}>1s</option>
                            <option value={2}>2s</option>
                            <option value={3}>3s</option>
                            <option value={5}>5s</option>
                            <option value={10}>10s</option>
                        </select>

                        <button
                            onClick={toggleFullscreen}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                            title="Toggle Fullscreen (F)"
                        >
                            <ArrowsPointingOutIcon className="w-4 h-4" />
                        </button>

                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                            title="Close (Esc)"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Screen Display */}
                <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentScreenIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderScreen(screens[currentScreenIndex])}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevScreen}
                            disabled={screens.length <= 1}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                            title="Previous Screen (←)"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>

                        <button
                            onClick={togglePlay}
                            disabled={screens.length <= 1}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                        >
                            {isPlaying ? (
                                <PauseIcon className="w-5 h-5" />
                            ) : (
                                <PlayIcon className="w-5 h-5" />
                            )}
                        </button>

                        <button
                            onClick={nextScreen}
                            disabled={screens.length <= 1}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                            title="Next Screen (→)"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Screen Indicators */}
                    <div className="flex items-center gap-1">
                        {screens.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentScreenIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    index === currentScreenIndex
                                        ? 'bg-blue-600'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                title={`Go to screen ${index + 1}`}
                            />
                        ))}
                    </div>

                    <div className="text-sm text-gray-500">
                        {isPlaying ? 'Auto-playing...' : 'Manual navigation'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrototypeViewer;

