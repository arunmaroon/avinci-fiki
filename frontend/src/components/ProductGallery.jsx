import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserGroupIcon,
    DocumentTextIcon,
    EyeIcon,
    ArrowDownTrayIcon,
    TrashIcon,
    CodeBracketIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    Squares2X2Icon,
    ListBulletIcon,
    SparklesIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    TagIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';

const ProductGallery = () => {
    const [products, setProducts] = useState([]);
    const [prototypes, setPrototypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [filterStatus, setFilterStatus] = useState('all');

    // Load data on component mount
    useEffect(() => {
        fetchProducts();
        fetchPrototypes();
    }, []);

    // Fetch products
    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            if (response.data.success) {
                setProducts(response.data.products || []);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    // Fetch prototypes
    const fetchPrototypes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/design/admin/prototypes', {
                headers: { 'x-user-id': 'test-admin-id' }
            });
            
            if (response.data.success) {
                setPrototypes(response.data.prototypes || []);
            }
        } catch (error) {
            console.error('Failed to fetch prototypes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Group prototypes by product
    const getPrototypesByProduct = () => {
        const grouped = {};
        
        // Initialize with all products
        products.forEach(product => {
            grouped[product.id] = {
                product,
                prototypes: []
            };
        });
        
        // Add ungrouped prototypes
        grouped['ungrouped'] = {
            product: { id: 'ungrouped', name: 'Ungrouped', category: 'Other' },
            prototypes: []
        };
        
        // Group prototypes
        prototypes.forEach(prototype => {
            const productId = prototype.productId || 'ungrouped';
            if (grouped[productId]) {
                grouped[productId].prototypes.push(prototype);
            }
        });
        
        return grouped;
    };

    // Filter prototypes
    const getFilteredPrototypes = () => {
        let filtered = prototypes;
        
        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(prototype =>
                prototype.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prototype.fileKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (prototype.productName && prototype.productName.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
        
        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(prototype => {
                if (filterStatus === 'validated') {
                    return prototype.validation && prototype.validation.score >= 0.8;
                } else if (filterStatus === 'needs_attention') {
                    return prototype.validation && prototype.validation.score < 0.8;
                } else if (filterStatus === 'not_validated') {
                    return !prototype.validation;
                }
                return true;
            });
        }
        
        return filtered;
    };

    // Handle export
    const handleExport = async (prototypeId, format) => {
        try {
            const response = await api.post(
                `/design/admin/prototypes/${prototypeId}/export`,
                { format, includeStyles: true, minify: false },
                {
                    responseType: 'blob',
                    headers: { 'x-user-id': 'test-admin-id' }
                }
            );
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `prototype-${format}-${Date.now()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    // Handle delete
    const handleDelete = async (prototypeId) => {
        if (!window.confirm('Are you sure you want to delete this prototype?')) {
            return;
        }
        
        try {
            await api.delete(`/design/admin/prototypes/${prototypeId}`, {
                headers: { 'x-user-id': 'test-admin-id' }
            });
            
            fetchPrototypes();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    // Get validation score color
    const getValidationColor = (validation) => {
        if (!validation) return 'text-gray-500';
        const score = validation.score || 0;
        if (score >= 0.8) return 'text-green-600';
        if (score >= 0.6) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Get validation icon
    const getValidationIcon = (validation) => {
        if (!validation) return <ClockIcon className="w-4 h-4" />;
        const score = validation.score || 0;
        if (score >= 0.8) return <CheckCircleIcon className="w-4 h-4" />;
        if (score >= 0.6) return <ExclamationTriangleIcon className="w-4 h-4" />;
        return <ExclamationTriangleIcon className="w-4 h-4" />;
    };

    const groupedPrototypes = getPrototypesByProduct();
    const filteredPrototypes = getFilteredPrototypes();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Product Gallery</h2>
                    <p className="text-gray-600">Organized view of prototypes by product</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Grid View"
                    >
                        <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        title="List View"
                    >
                        <ListBulletIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search prototypes..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    
                    <div className="w-48">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="validated">Validated (80%+)</option>
                            <option value="needs_attention">Needs Attention</option>
                            <option value="not_validated">Not Validated</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <ClockIcon className="w-8 h-8 mx-auto text-gray-400 animate-spin mb-4" />
                    <p className="text-gray-500">Loading prototypes...</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedPrototypes).map(([productId, { product, prototypes: productPrototypes }]) => {
                        const filteredProductPrototypes = productPrototypes.filter(prototype =>
                            filteredPrototypes.some(p => p.id === prototype.id)
                        );

                        if (filteredProductPrototypes.length === 0) return null;

                        return (
                            <div key={productId} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                {/* Product Header */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <UserGroupIcon className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {product.category} • {filteredProductPrototypes.length} prototype{filteredProductPrototypes.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">
                                                {filteredProductPrototypes.length} items
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Prototypes Grid/List */}
                                <div className="p-6">
                                    {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredProductPrototypes.map((prototype) => (
                                                <motion.div
                                                    key={prototype.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 truncate">
                                                                {prototype.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-500">
                                                                v{prototype.version}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-1">
                                                            {prototype.validation && (
                                                                <span className={`flex items-center gap-1 ${getValidationColor(prototype.validation)}`}>
                                                                    {getValidationIcon(prototype.validation)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 mb-4">
                                                        <div className="text-xs text-gray-500">
                                                            File: {prototype.fileKey}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Created: {new Date(prototype.createdAt).toLocaleDateString()}
                                                        </div>
                                                        {prototype.validation && (
                                                            <div className={`text-xs ${getValidationColor(prototype.validation)}`}>
                                                                Score: {Math.round(prototype.validation.score * 100)}%
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => {
                                                                    // Open prototype viewer
                                                                    console.log('View prototype:', prototype.id);
                                                                }}
                                                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                                title="View Prototype"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    // Open AST viewer
                                                                    console.log('View AST:', prototype.id);
                                                                }}
                                                                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                                                                title="View AST"
                                                            >
                                                                <CodeBracketIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            <div className="relative group">
                                                                <button className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                                                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                                                </button>
                                                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                                    <div className="py-1">
                                                                        {['html', 'react', 'vue', 'moneyview'].map((format) => (
                                                                            <button
                                                                                key={format}
                                                                                onClick={() => handleExport(prototype.id, format)}
                                                                                className="w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 capitalize"
                                                                            >
                                                                                {format}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDelete(prototype.id)}
                                                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                                title="Delete"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {filteredProductPrototypes.map((prototype) => (
                                                <motion.div
                                                    key={prototype.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 bg-white rounded-lg">
                                                            <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                                                        </div>
                                                        
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900">
                                                                {prototype.name}
                                                            </h4>
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                <span>v{prototype.version}</span>
                                                                <span>File: {prototype.fileKey}</span>
                                                                <span>
                                                                    {new Date(prototype.createdAt).toLocaleDateString()}
                                                                </span>
                                                                {prototype.validation && (
                                                                    <span className={`flex items-center gap-1 ${getValidationColor(prototype.validation)}`}>
                                                                        {getValidationIcon(prototype.validation)}
                                                                        {Math.round(prototype.validation.score * 100)}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => console.log('View prototype:', prototype.id)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                            title="View Prototype"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => console.log('View AST:', prototype.id)}
                                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                                            title="View AST"
                                                        >
                                                            <CodeBracketIcon className="w-4 h-4" />
                                                        </button>
                                                        <div className="relative group">
                                                            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                                                                <ArrowDownTrayIcon className="w-4 h-4" />
                                                            </button>
                                                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                                <div className="py-1">
                                                                    {['html', 'react', 'vue', 'moneyview'].map((format) => (
                                                                        <button
                                                                            key={format}
                                                                            onClick={() => handleExport(prototype.id, format)}
                                                                            className="w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 capitalize"
                                                                        >
                                                                            {format}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDelete(prototype.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;

