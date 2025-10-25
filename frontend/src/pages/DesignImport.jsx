import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    CloudArrowUpIcon,
    EyeIcon,
    CodeBracketIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    PlayIcon,
    DocumentTextIcon,
    SparklesIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    UserGroupIcon,
    TagIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import PrototypeViewer from '../components/PrototypeViewer';
import ASTViewer from '../components/ASTViewer';
import ProductGallery from '../components/ProductGallery';

const DesignImport = () => {
    // State management
    const [activeTab, setActiveTab] = useState('import');
    const [prototypes, setPrototypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPrototype, setSelectedPrototype] = useState(null);
    const [showViewer, setShowViewer] = useState(false);
    const [showAST, setShowAST] = useState(false);
    const [filterProduct, setFilterProduct] = useState('');
    const [products, setProducts] = useState([]);
    
    // Import form state
    const [importForm, setImportForm] = useState({
        fileKey: '',
        accessToken: '',
        productId: '',
        useOAuth: false
    });
    
    // Pagination
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });

    // Load prototypes on component mount
    useEffect(() => {
        fetchPrototypes();
        fetchProducts();
    }, []);

    // Fetch prototypes from API
    const fetchPrototypes = async (page = 1, search = '', productId = '') => {
        try {
            setLoading(true);
            const response = await api.get('/design/admin/prototypes', {
                params: { page, limit: 20, search, productId },
                headers: { 'x-user-id': 'test-admin-id' }
            });
            
            if (response.data.success) {
                setPrototypes(response.data.prototypes);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch prototypes:', error);
            toast.error('Failed to load prototypes');
        } finally {
            setLoading(false);
        }
    };

    // Fetch products for filter
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

    // Handle Figma import
    const handleFigmaImport = async (e) => {
        e.preventDefault();
        
        if (!importForm.fileKey.trim()) {
            toast.error('Please enter a Figma file key or URL');
            return;
        }
        
        try {
            setLoading(true);
            toast.loading('Importing Figma file...', { id: 'import' });
            
            // Extract file key from URL if needed
            let fileKey = importForm.fileKey;
            if (fileKey.includes('figma.com')) {
                const match = fileKey.match(/\/(?:file|design)\/([a-zA-Z0-9]{22})/);
                if (match) {
                    fileKey = match[1];
                } else {
                    throw new Error('Invalid Figma URL format');
                }
            }
            
            const requestData = {
                fileKey,
                productId: importForm.productId || null
            };
            
            if (importForm.useOAuth) {
                // Use OAuth flow
                const oauthResponse = await api.get('/design/admin/oauth', {
                    headers: { 'x-user-id': 'test-admin-id' }
                });
                
                if (oauthResponse.data.success) {
                    // Open OAuth popup
                    const popup = window.open(
                        oauthResponse.data.authUrl,
                        'figma-oauth',
                        'width=600,height=700,scrollbars=yes,resizable=yes'
                    );
                    
                    // Monitor popup completion
                    const checkClosed = setInterval(() => {
                        if (popup.closed) {
                            clearInterval(checkClosed);
                            fetchPrototypes();
                            toast.success('OAuth completed! You can now import files.', { id: 'import' });
                        }
                    }, 1000);
                    
                    return;
                }
            } else {
                // Direct import with access token
                if (!importForm.accessToken.trim()) {
                    toast.error('Please enter your Figma access token');
                    return;
                }
                requestData.accessToken = importForm.accessToken;
            }
            
            const response = await api.post('/design/admin/import-direct', requestData, {
                headers: { 'x-user-id': 'test-admin-id' }
            });
            
            if (response.data.success) {
                toast.success('Figma file imported successfully!', { id: 'import' });
                setImportForm({ fileKey: '', accessToken: '', productId: '', useOAuth: false });
                fetchPrototypes();
            }
        } catch (error) {
            console.error('Import failed:', error);
            toast.error(error.response?.data?.details || 'Import failed', { id: 'import' });
        } finally {
            setLoading(false);
        }
    };

    // Handle export
    const handleExport = async (prototypeId, format) => {
        try {
            toast.loading(`Exporting as ${format.toUpperCase()}...`, { id: 'export' });
            
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
            
            toast.success(`Exported as ${format.toUpperCase()}!`, { id: 'export' });
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Export failed', { id: 'export' });
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
            
            toast.success('Prototype deleted successfully');
            fetchPrototypes();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Delete failed');
        }
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchPrototypes(1, searchQuery, filterProduct);
    };

    // Handle filter change
    const handleFilterChange = (productId) => {
        setFilterProduct(productId);
        fetchPrototypes(1, searchQuery, productId);
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🎨 Figma Import System
                    </h1>
                    <p className="text-gray-600">
                        Import, parse, and export Figma prototypes with AI validation
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'import', name: 'Import', icon: CloudArrowUpIcon },
                            { id: 'prototypes', name: 'Prototypes', icon: DocumentTextIcon },
                            { id: 'gallery', name: 'Gallery', icon: UserGroupIcon }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <tab.icon className="w-4 h-4 mr-2" />
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'import' && (
                        <motion.div
                            key="import"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Import Figma File
                            </h2>
                            
                            <form onSubmit={handleFigmaImport} className="space-y-6">
                                {/* File Key Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Figma File Key or URL
                                    </label>
                                    <input
                                        type="text"
                                        value={importForm.fileKey}
                                        onChange={(e) => setImportForm({ ...importForm, fileKey: e.target.value })}
                                        placeholder="Enter Figma file key or URL (e.g., FPqV8e9Y7DbQfyoABniMp1)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        You can use either the file key or the full Figma URL
                                    </p>
                                </div>

                                {/* OAuth Toggle */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="useOAuth"
                                        checked={importForm.useOAuth}
                                        onChange={(e) => setImportForm({ ...importForm, useOAuth: e.target.checked })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="useOAuth" className="ml-2 text-sm text-gray-700">
                                        Use OAuth (recommended)
                                    </label>
                                </div>

                                {/* Access Token Input (only if not using OAuth) */}
                                {!importForm.useOAuth && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Figma Access Token
                                        </label>
                                        <input
                                            type="password"
                                            value={importForm.accessToken}
                                            onChange={(e) => setImportForm({ ...importForm, accessToken: e.target.value })}
                                            placeholder="Enter your Figma personal access token"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Get your token from Figma → Settings → Account → Personal Access Tokens
                                        </p>
                                    </div>
                                )}

                                {/* Product Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product (Optional)
                                    </label>
                                    <select
                                        value={importForm.productId}
                                        onChange={(e) => setImportForm({ ...importForm, productId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select a product</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                                            Importing...
                                        </>
                                    ) : (
                                        <>
                                            <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                                            Import Figma File
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === 'prototypes' && (
                        <motion.div
                            key="prototypes"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Search and Filter */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <form onSubmit={handleSearch} className="flex gap-4">
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
                                            value={filterProduct}
                                            onChange={(e) => handleFilterChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">All Products</option>
                                            {products.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Search
                                    </button>
                                </form>
                            </div>

                            {/* Prototypes List */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                {loading ? (
                                    <div className="p-8 text-center">
                                        <ClockIcon className="w-8 h-8 mx-auto text-gray-400 animate-spin mb-4" />
                                        <p className="text-gray-500">Loading prototypes...</p>
                                    </div>
                                ) : prototypes.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No prototypes found</h3>
                                        <p className="text-gray-500">Import your first Figma file to get started</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200">
                                        {prototypes.map((prototype) => (
                                            <div key={prototype.id} className="p-6 hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-medium text-gray-900">
                                                                {prototype.name}
                                                            </h3>
                                                            <span className="text-sm text-gray-500">
                                                                v{prototype.version}
                                                            </span>
                                                            {prototype.productName && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    <TagIcon className="w-3 h-3 mr-1" />
                                                                    {prototype.productName}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 mb-2">
                                                            File Key: {prototype.fileKey}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span>
                                                                Created: {new Date(prototype.createdAt).toLocaleDateString()}
                                                            </span>
                                                            {prototype.validation && (
                                                                <span className={`flex items-center gap-1 ${getValidationColor(prototype.validation)}`}>
                                                                    {getValidationIcon(prototype.validation)}
                                                                    Score: {Math.round(prototype.validation.score * 100)}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPrototype(prototype);
                                                                setShowViewer(true);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                            title="View Prototype"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPrototype(prototype);
                                                                setShowAST(true);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                                            title="View AST"
                                                        >
                                                            <CodeBracketIcon className="w-4 h-4" />
                                                        </button>
                                                        <div className="relative group">
                                                            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                                                                <ArrowDownTrayIcon className="w-4 h-4" />
                                                            </button>
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                                <div className="py-1">
                                                                    {['html', 'react', 'vue', 'moneyview'].map((format) => (
                                                                        <button
                                                                            key={format}
                                                                            onClick={() => handleExport(prototype.id, format)}
                                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                                                                        >
                                                                            Export as {format}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDelete(prototype.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                            title="Delete Prototype"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'gallery' && (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <ProductGallery />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modals */}
                {showViewer && selectedPrototype && (
                    <PrototypeViewer
                        prototype={selectedPrototype}
                        onClose={() => {
                            setShowViewer(false);
                            setSelectedPrototype(null);
                        }}
                    />
                )}

                {showAST && selectedPrototype && (
                    <ASTViewer
                        ast={selectedPrototype.ast}
                        onClose={() => {
                            setShowAST(false);
                            setSelectedPrototype(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default DesignImport;