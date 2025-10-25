import React, { useState, useEffect } from 'react';
import { 
  CloudIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  FolderIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const FigmaOAuth = ({ onAuthSuccess, onFileSelect }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [files, setFiles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/figma-oauth/files');
      if (response.ok) {
        setIsAuthenticated(true);
        const data = await response.json();
        setFiles(data.files || []);
      } else if (response.status === 401) {
        // User not authenticated - this is normal
        setIsAuthenticated(false);
      } else {
        // Other error
        console.warn('Error checking Figma authentication:', response.status);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Network error or other issue - user not authenticated
      console.log('Not authenticated with Figma');
      setIsAuthenticated(false);
    }
  };

  const handleFigmaLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/figma-oauth/login');
      const data = await response.json();
      
      if (data.success) {
        // Open Figma OAuth in new window
        const authWindow = window.open(
          data.authUrl,
          'figma-oauth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Listen for the window to close or receive message
        const checkClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkClosed);
            setIsLoading(false);
            // Check if authentication was successful
            checkAuthStatus();
          }
        }, 1000);

        // Listen for postMessage from the popup
        const handleMessage = (event) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'FIGMA_AUTH_SUCCESS') {
            clearInterval(checkClosed);
            authWindow.close();
            setIsLoading(false);
            setIsAuthenticated(true);
            setUserInfo(event.data.userInfo);
            toast.success('Successfully connected to Figma!');
            onAuthSuccess && onAuthSuccess(event.data);
          }
        };

        window.addEventListener('message', handleMessage);
        
        // Clean up listener after 5 minutes
        setTimeout(() => {
          window.removeEventListener('message', handleMessage);
        }, 300000);

      } else {
        throw new Error(data.error || 'Failed to initiate Figma login');
      }
    } catch (error) {
      console.error('Figma login error:', error);
      toast.error('Failed to connect to Figma');
      setIsLoading(false);
    }
  };

  const loadUserFiles = async () => {
    try {
      const response = await fetch('/api/figma-oauth/files');
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.files || []);
        setShowFiles(true);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load Figma files');
    }
  };

  const loadTeamFiles = async () => {
    try {
      const response = await fetch('/api/figma-oauth/team-files');
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.files || []);
        setTeams(data.teams || []);
        setShowFiles(true);
      }
    } catch (error) {
      console.error('Error loading team files:', error);
      toast.error('Failed to load team files');
    }
  };

  const handleFileSelect = (file) => {
    const figmaUrl = `https://www.figma.com/design/${file.key}/${file.name}`;
    onFileSelect && onFileSelect(figmaUrl);
    toast.success(`Selected: ${file.name}`);
  };

  if (isAuthenticated && showFiles) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Connected to Figma</h3>
          </div>
          <button
            onClick={() => setShowFiles(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={loadUserFiles}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
            >
              <FolderIcon className="h-4 w-4" />
              <span>My Files</span>
            </button>
            <button
              onClick={loadTeamFiles}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100"
            >
              <UserGroupIcon className="h-4 w-4" />
              <span>Team Files</span>
            </button>
          </div>

          {files.length > 0 && (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {files.map((file, index) => (
                <div
                  key={file.key || index}
                  onClick={() => handleFileSelect(file)}
                  className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{file.name}</h4>
                      <p className="text-sm text-gray-500">
                        {file.description || 'No description'}
                      </p>
                    </div>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {teams.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Teams:</h4>
              <div className="flex flex-wrap gap-2">
                {teams.map((team, index) => (
                  <span
                    key={team.id || index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {team.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center">
        <CloudIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connect to Figma
        </h3>
        <p className="text-gray-600 mb-6">
          Authenticate with your Figma account to access your designs and convert them to code.
        </p>
        
        <button
          onClick={handleFigmaLogin}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <CloudIcon className="h-4 w-4" />
              <span>Connect with Figma</span>
            </>
          )}
        </button>

        <div className="mt-4 text-xs text-gray-500">
          <p>• Access your private Figma files</p>
          <p>• Convert designs to React components</p>
          <p>• Secure OAuth authentication</p>
        </div>
      </div>
    </div>
  );
};

export default FigmaOAuth;
