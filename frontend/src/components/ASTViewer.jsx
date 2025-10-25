import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XMarkIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    CodeBracketIcon,
    EyeIcon,
    DocumentTextIcon,
    RectangleStackIcon,
    CircleStackIcon,
    CubeIcon,
    Squares2X2Icon,
    PaintBrushIcon,
    CursorArrowRaysIcon
} from '@heroicons/react/24/outline';

const ASTViewer = ({ ast, onClose }) => {
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNode, setSelectedNode] = useState(null);
    const [filterType, setFilterType] = useState('all');

    // Toggle node expansion
    const toggleNode = (nodeId) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    // Get node icon based on type
    const getNodeIcon = (nodeType) => {
        switch (nodeType) {
            case 'PAGE':
                return <DocumentTextIcon className="w-4 h-4" />;
            case 'FRAME':
                return <RectangleStackIcon className="w-4 h-4" />;
            case 'TEXT':
                return <DocumentTextIcon className="w-4 h-4" />;
            case 'RECTANGLE':
                return <RectangleStackIcon className="w-4 h-4" />;
            case 'ELLIPSE':
                return <CircleStackIcon className="w-4 h-4" />;
            case 'COMPONENT':
                return <CubeIcon className="w-4 h-4" />;
            case 'INSTANCE':
                return <Squares2X2Icon className="w-4 h-4" />;
            case 'GROUP':
                return <Squares2X2Icon className="w-4 h-4" />;
            case 'VECTOR':
                return <PaintBrushIcon className="w-4 h-4" />;
            default:
                return <CodeBracketIcon className="w-4 h-4" />;
        }
    };

    // Get node type color
    const getNodeTypeColor = (nodeType) => {
        switch (nodeType) {
            case 'PAGE':
                return 'text-blue-600 bg-blue-100';
            case 'FRAME':
                return 'text-green-600 bg-green-100';
            case 'TEXT':
                return 'text-purple-600 bg-purple-100';
            case 'RECTANGLE':
                return 'text-orange-600 bg-orange-100';
            case 'ELLIPSE':
                return 'text-pink-600 bg-pink-100';
            case 'COMPONENT':
                return 'text-indigo-600 bg-indigo-100';
            case 'INSTANCE':
                return 'text-cyan-600 bg-cyan-100';
            case 'GROUP':
                return 'text-gray-600 bg-gray-100';
            case 'VECTOR':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    // Filter nodes based on search and type
    const filterNodes = (nodes) => {
        return nodes.filter(node => {
            const matchesSearch = !searchQuery || 
                node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                node.type.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesType = filterType === 'all' || node.type === filterType;
            
            return matchesSearch && matchesType;
        });
    };

    // Render node details
    const renderNodeDetails = (node) => {
        if (!node) return null;

        return (
            <div className="space-y-4">
                {/* Basic Info */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Node Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">ID:</span>
                            <span className="ml-2 text-gray-600 font-mono">{node.id}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Type:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${getNodeTypeColor(node.type)}`}>
                                {node.type}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Name:</span>
                            <span className="ml-2 text-gray-600">{node.name}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Visible:</span>
                            <span className={`ml-2 ${node.visible ? 'text-green-600' : 'text-red-600'}`}>
                                {node.visible ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Layout */}
                {node.layout && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-2">Layout</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Position:</span>
                                <span className="ml-2 text-gray-600">
                                    ({node.layout.x}, {node.layout.y})
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Size:</span>
                                <span className="ml-2 text-gray-600">
                                    {node.layout.width} × {node.layout.height}
                                </span>
                            </div>
                            {node.layout.rotation !== 0 && (
                                <div>
                                    <span className="font-medium text-gray-700">Rotation:</span>
                                    <span className="ml-2 text-gray-600">{node.layout.rotation}°</span>
                                </div>
                            )}
                            {node.layout.opacity !== 1 && (
                                <div>
                                    <span className="font-medium text-gray-700">Opacity:</span>
                                    <span className="ml-2 text-gray-600">{node.layout.opacity}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Styles */}
                {node.styles && Object.keys(node.styles).length > 0 && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-2">Styles</h4>
                        <div className="space-y-2 text-sm">
                            {node.styles.fills && node.styles.fills.length > 0 && (
                                <div>
                                    <span className="font-medium text-gray-700">Fills:</span>
                                    <div className="ml-2 space-y-1">
                                        {node.styles.fills.map((fill, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded border"
                                                    style={{
                                                        backgroundColor: fill.color ? 
                                                            `rgba(${fill.color.r}, ${fill.color.g}, ${fill.color.b}, ${fill.color.a})` : 
                                                            'transparent'
                                                    }}
                                                />
                                                <span className="text-gray-600">
                                                    {fill.type} {fill.color ? 
                                                        `rgba(${fill.color.r}, ${fill.color.g}, ${fill.color.b}, ${fill.color.a})` : 
                                                        'none'
                                                    }
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {node.styles.strokes && node.styles.strokes.length > 0 && (
                                <div>
                                    <span className="font-medium text-gray-700">Strokes:</span>
                                    <div className="ml-2 space-y-1">
                                        {node.styles.strokes.map((stroke, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded border"
                                                    style={{
                                                        borderColor: stroke.color ? 
                                                            `rgba(${stroke.color.r}, ${stroke.color.g}, ${stroke.color.b}, ${stroke.color.a})` : 
                                                            'transparent'
                                                    }}
                                                />
                                                <span className="text-gray-600">
                                                    {stroke.type} {stroke.weight}px {stroke.color ? 
                                                        `rgba(${stroke.color.r}, ${stroke.color.g}, ${stroke.color.b}, ${stroke.color.a})` : 
                                                        'none'
                                                    }
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {node.styles.cornerRadius !== undefined && (
                                <div>
                                    <span className="font-medium text-gray-700">Corner Radius:</span>
                                    <span className="ml-2 text-gray-600">{node.styles.cornerRadius}px</span>
                                </div>
                            )}

                            {node.styles.textStyle && (
                                <div>
                                    <span className="font-medium text-gray-700">Text Style:</span>
                                    <div className="ml-2 space-y-1">
                                        {node.styles.textStyle.fontFamily && (
                                            <div>Font: {node.styles.textStyle.fontFamily}</div>
                                        )}
                                        {node.styles.textStyle.fontSize && (
                                            <div>Size: {node.styles.textStyle.fontSize}px</div>
                                        )}
                                        {node.styles.textStyle.fontWeight && (
                                            <div>Weight: {node.styles.textStyle.fontWeight}</div>
                                        )}
                                        {node.styles.textStyle.textAlignHorizontal && (
                                            <div>Align: {node.styles.textStyle.textAlignHorizontal}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Interactions */}
                {node.interactions && node.interactions.length > 0 && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-2">Interactions</h4>
                        <div className="space-y-1 text-sm">
                            {node.interactions.map((interaction, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CursorArrowRaysIcon className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-600">
                                        {interaction.type}: {interaction.startNodeName || 'Unknown'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Metadata */}
                {node.metadata && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-2">Metadata</h4>
                        <div className="space-y-1 text-sm">
                            {node.metadata.textContent && (
                                <div>
                                    <span className="font-medium text-gray-700">Text Content:</span>
                                    <div className="ml-2 p-2 bg-gray-100 rounded text-gray-600">
                                        {node.metadata.textContent}
                                    </div>
                                </div>
                            )}
                            {node.metadata.hasImage && (
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Has Image:</span>
                                    <span className="text-green-600">Yes</span>
                                </div>
                            )}
                            {node.metadata.isComponent && (
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Component:</span>
                                    <span className="text-blue-600">Yes</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Render tree node
    const renderTreeNode = (node, depth = 0) => {
        if (!node) return null;

        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);
        const isSelected = selectedNode?.id === node.id;

        return (
            <div key={node.id} className="select-none">
                <div
                    className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
                        isSelected ? 'bg-blue-100 border border-blue-200' : ''
                    }`}
                    style={{ paddingLeft: `${depth * 20 + 8}px` }}
                    onClick={() => setSelectedNode(node)}
                >
                    {/* Expand/Collapse Button */}
                    {hasChildren ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleNode(node.id);
                            }}
                            className="mr-2 p-1 hover:bg-gray-200 rounded"
                        >
                            {isExpanded ? (
                                <ChevronDownIcon className="w-3 h-3" />
                            ) : (
                                <ChevronRightIcon className="w-3 h-3" />
                            )}
                        </button>
                    ) : (
                        <div className="w-6 mr-2" />
                    )}

                    {/* Node Icon */}
                    <div className={`mr-2 p-1 rounded ${getNodeTypeColor(node.type)}`}>
                        {getNodeIcon(node.type)}
                    </div>

                    {/* Node Name */}
                    <span className="flex-1 text-sm font-medium text-gray-900 truncate">
                        {node.name || 'Unnamed'}
                    </span>

                    {/* Node Type Badge */}
                    <span className={`px-2 py-1 rounded text-xs ${getNodeTypeColor(node.type)}`}>
                        {node.type}
                    </span>
                </div>

                {/* Children */}
                <AnimatePresence>
                    {hasChildren && isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {filterNodes(node.children).map(child => renderTreeNode(child, depth + 1))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    // Get all unique node types
    const getAllNodeTypes = (nodes) => {
        const types = new Set();
        const traverse = (nodeList) => {
            nodeList.forEach(node => {
                types.add(node.type);
                if (node.children) {
                    traverse(node.children);
                }
            });
        };
        traverse(ast);
        return Array.from(types).sort();
    };

    const nodeTypes = getAllNodeTypes(ast);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-full max-h-[90vh] flex">
                {/* Left Panel - Tree View */}
                <div className="w-1/2 border-r border-gray-200 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                AST Tree View
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search nodes..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Types</option>
                            {nodeTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tree */}
                    <div className="flex-1 overflow-auto p-4">
                        {filterNodes(ast).map(node => renderTreeNode(node))}
                    </div>
                </div>

                {/* Right Panel - Node Details */}
                <div className="w-1/2 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Node Details</h3>
                    </div>

                    {/* Details */}
                    <div className="flex-1 overflow-auto p-4">
                        {selectedNode ? (
                            renderNodeDetails(selectedNode)
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <EyeIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>Select a node to view details</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ASTViewer;

