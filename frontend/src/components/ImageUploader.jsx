import React, { useCallback, useState } from 'react';
import { CloudArrowUpIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ImageUploader = ({ onImageSelect, onImageRemove, selectedImage, className = '' }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = useCallback((file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      onImageSelect(file, result);
      toast.success('Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleRemove = useCallback(() => {
    onImageRemove();
    toast.success('Image removed');
  }, [onImageRemove]);

  return (
    <div className={`w-full ${className}`}>
      {selectedImage ? (
        <div className="relative">
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <img
              src={selectedImage}
              alt="Upload preview"
              className="w-full h-64 object-contain rounded-lg border"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Click or drag a new image to replace
          </p>
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('image-upload').click()}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              {isDragActive ? (
                <CloudArrowUpIcon className="w-8 h-8 text-blue-500" />
              ) : (
                <PhotoIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragActive ? 'Drop your image here' : 'Upload Design Screenshot'}
              </h3>
              <p className="text-sm text-gray-600">
                Drag and drop an image, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
