import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  CloudArrowUpIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  LinkIcon,
  PuzzlePieceIcon,
  CodeBracketIcon,
  SparklesIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import AdminRoles from './AdminRoles';
import DesignImport from './DesignImport';
import BuilderConverter from './BuilderConverter';
import EnhancedBuilderConverter from './EnhancedBuilderConverter';
import MoneyviewIntegration from '../components/MoneyviewIntegration';
import usePermissions from '../hooks/usePermissions';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { canAccessAdmin } = usePermissions();

  const adminSections = [
    {
      id: 'overview',
      name: 'Overview',
      icon: ChartBarIcon,
      description: 'System overview and analytics'
    },
    {
      id: 'roles',
      name: 'Roles & Users',
      icon: UsersIcon,
      description: 'Manage user roles and permissions'
    },
    {
      id: 'products',
      name: 'Product Management',
      icon: PuzzlePieceIcon,
      description: 'Manage products and prototypes'
    },
    {
      id: 'design',
      name: 'Design Import',
      icon: CloudArrowUpIcon,
      description: 'Import and manage Figma prototypes'
    },
    {
      id: 'builder-converter',
      name: 'Builder.io Converter',
      icon: SparklesIcon,
      description: 'Convert designs to React using Builder.io AI'
    },
    {
      id: 'enhanced-converter',
      name: 'Enhanced Converter',
      icon: PhotoIcon,
      description: 'AI Vision + Builder.io for screenshots and Figma URLs'
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: LinkIcon,
      description: 'Manage external service connections'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: CogIcon,
      description: 'System configuration and preferences'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'roles':
        return <AdminRoles />;
      case 'products':
        return <ProductManagement />;
      case 'design':
        return <DesignImport />;
      case 'builder-converter':
        return <BuilderConverter />;
      case 'enhanced-converter':
        return <EnhancedBuilderConverter />;
      case 'integrations':
        return <AdminIntegrations />;
      case 'overview':
        return <AdminOverview />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">Manage your Avinci workspace</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <ShieldCheckIcon className="w-4 h-4 mr-1" />
                  Admin Access
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-sm min-h-screen">
            <nav className="mt-6">
              {adminSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium">{section.name}</div>
                      <div className="text-xs text-gray-500">{section.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Overview Component
const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalPrototypes: 0,
    recentActivity: []
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">System Overview</h2>
        <p className="text-gray-600">Monitor your Avinci workspace activity and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Roles</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRoles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CloudArrowUpIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prototypes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPrototypes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activity</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.recentActivity.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <PlusIcon className="w-5 h-5 text-gray-400 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Add User</div>
              <div className="text-sm text-gray-500">Create a new user account</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CloudArrowUpIcon className="w-5 h-5 text-gray-400 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Import Design</div>
              <div className="text-sm text-gray-500">Upload Figma prototype</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CogIcon className="w-5 h-5 text-gray-400 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">System Settings</div>
              <div className="text-sm text-gray-500">Configure workspace</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Admin Integrations Component
const AdminIntegrations = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Integrations</h2>
        <p className="text-gray-600">Manage external service connections and OAuth integrations</p>
      </div>

      <div className="space-y-6">
        {/* Moneyview Integration */}
        <MoneyviewIntegration />

        {/* Figma Integration Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CloudArrowUpIcon className="w-6 h-6 text-purple-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Figma Integration</h3>
                <p className="text-sm text-gray-600">Import and manage Figma prototypes</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-1">Status</h5>
              <p className="text-sm text-gray-600">Ready for import</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-1">Features</h5>
              <p className="text-sm text-gray-600">OAuth, AI validation, search</p>
            </div>
          </div>
          
          <div className="mt-4">
            <a
              href="/admin/design-import"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <CloudArrowUpIcon className="w-4 h-4 mr-2" />
              Manage Design Import
            </a>
          </div>
        </div>

        {/* Additional Integrations Placeholder */}
        <div className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-200">
          <div className="text-center py-8">
            <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">More Integrations</h3>
            <p className="text-gray-600 mb-4">
              Additional integrations will be available here as they are added.
            </p>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Request Integration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Settings Component
const AdminSettings = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h2>
        <p className="text-gray-600">Configure your Avinci workspace settings</p>
      </div>

      <div className="space-y-6">
        {/* OAuth Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">OAuth Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneyview OAuth Client ID
              </label>
              <input
                type="text"
                placeholder="Enter Moneyview OAuth Client ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneyview OAuth Client Secret
              </label>
              <input
                type="password"
                placeholder="Enter Moneyview OAuth Client Secret"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect URI
              </label>
              <input
                type="url"
                value="http://localhost:9000/auth/moneyview-callback"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Figma Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Figma Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Figma Client ID
              </label>
              <input
                type="text"
                placeholder="Enter Figma Client ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Figma Client Secret
              </label>
              <input
                type="password"
                placeholder="Enter Figma Client Secret"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Figma Redirect URI
              </label>
              <input
                type="url"
                value="http://localhost:9000/admin/figma-callback"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Enable Design Features</h4>
                <p className="text-sm text-gray-600">Allow Figma prototype imports and AI validation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Enable Moneyview OAuth</h4>
                <p className="text-sm text-gray-600">Allow Moneyview account integration</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Management Component
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Management</h2>
        <p className="text-gray-600">Manage products and their prototype relationships</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <PuzzlePieceIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Prototypes</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <LinkIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Connected Designs</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Products</h3>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <PuzzlePieceIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-gray-600 mb-4">Create your first product to start managing prototypes and designs.</p>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
