import React, { useState, useRef, useEffect } from 'react';
import { Upload, ZoomIn, ZoomOut, Trash2, X, Camera, Save, Database, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useDynoImages } from '../hooks/useDynoImages';
import { useAuth } from '../contexts/AuthContext';
import { DynoImage as DynoImageType } from '../lib/supabase';
import { takePicture, selectPicture, isNative } from '../utils/capacitor';

interface LocalDynoImage {
  type: 'motor' | 'shock';
  url: string;
  timestamp: string;
  id?: string; // Optional ID for saved images
}

interface DynoImageCaptureProps {
  title: string;
  type: 'motor' | 'shock';
}

function DynoImageCapture({ title, type }: DynoImageCaptureProps) {
  const [images, setImages] = useState<LocalDynoImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<LocalDynoImage | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveDynoImage, loadDynoImages, deleteDynoImage, loading, error } = useDynoImages();
  const { user } = useAuth();

  // Load saved images when component mounts
  useEffect(() => {
    if (user) {
      handleLoadImages();
    }
  }, [user]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          addImage(e.target.result as string);
          setExpanded(true); // Auto-expand when adding a new image
        }
      };
      reader.readAsDataURL(file);
      // Reset the input value so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  const handleCapturePicture = async () => {
    if (isNative) {
      const imageUrl = await takePicture();
      if (imageUrl) {
        addImage(imageUrl);
        setExpanded(true);
      }
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSelectPicture = async () => {
    if (isNative) {
      const imageUrl = await selectPicture();
      if (imageUrl) {
        addImage(imageUrl);
        setExpanded(true);
      }
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addImage = (url: string) => {
    setImages(prev => [...prev, {
      type,
      url,
      timestamp: new Date().toLocaleString()
    }]);
  };

  const removeImage = (index: number) => {
    const image = images[index];
    
    // If the image has an ID, it's saved in the database and needs to be deleted
    if (image.id) {
      deleteDynoImage(image.id).then(success => {
        if (success) {
          setImages(prev => prev.filter((_, i) => i !== index));
        }
      });
    } else {
      // Local image only, just remove from state
      setImages(prev => prev.filter((_, i) => i !== index));
    }
    
    setShowDeleteConfirm(null);
  };

  const handleSaveImage = async (imageUrl: string, index: number) => {
    if (!user) return;
    
    const result = await saveDynoImage(type, imageUrl);
    if (result) {
      // Update the local image with the saved ID
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, id: result.id } : img
      ));
    }
  };

  const handleLoadImages = async () => {
    if (!user) return;
    
    const savedImages = await loadDynoImages(type);
    if (savedImages.length > 0) {
      // Convert to local format and add to state
      const localImages: LocalDynoImage[] = savedImages.map(img => ({
        id: img.id,
        type: img.type,
        url: img.url,
        timestamp: new Date(img.created_at).toLocaleString()
      }));
      
      setImages(prev => {
        // Merge with existing images, avoiding duplicates by ID
        const existingIds = new Set(prev.filter(img => img.id).map(img => img.id));
        const newImages = localImages.filter(img => !existingIds.has(img.id));
        return [...prev, ...newImages];
      });
    }
  };

  const openImageViewer = (image: LocalDynoImage) => {
    setSelectedImage(image);
    setZoom(1);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
    setZoom(1);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev + 0.25 : prev - 0.25;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  // Handle escape key to close viewer
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        closeImageViewer();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">{title} Dyno</h3>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse section" : "Expand section"}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-5 h-5" />
              <span className="text-sm font-medium">Hide Images</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5" />
              <span className="text-sm font-medium">
                {images.length > 0 ? `Show Images (${images.length})` : "Show Upload Options"}
              </span>
            </>
          )}
        </button>
      </div>
      
      {expanded && (
        <>
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Desktop upload button */}
            <button
              onClick={handleSelectPicture}
              className="btn-accent flex items-center gap-2 px-4 py-2"
              aria-label="Upload image"
            >
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Upload Image</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {/* Camera button */}
            <button
              onClick={handleCapturePicture}
              className="btn-primary flex items-center gap-2 px-4 py-2"
              aria-label="Take photo"
            >
              <Camera className="w-5 h-5" />
              <span>Take Photo</span>
            </button>

            {/* Load saved images button */}
            <button
              onClick={handleLoadImages}
              className="btn-primary flex items-center gap-2 px-4 py-2"
              disabled={loading || !user}
            >
              <Database className="w-5 h-5" />
              <span className="hidden sm:inline">Load Saved Images</span>
              <span className="sm:hidden">Load Saved</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading...</span>
            </div>
          )}

          {images.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              No {title.toLowerCase()} dyno images yet. Upload or take a photo to add one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <div className="group">
                    <img
                      src={image.url}
                      alt={`${type} dyno ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                      onClick={() => openImageViewer(image)}
                    />
                    
                    {/* Save indicator */}
                    {image.id ? (
                      <div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
                        Saved
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSaveImage(image.url, index)}
                        className="absolute top-2 right-2 bg-blue-500/80 hover:bg-blue-600/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Save to cloud"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {image.timestamp}
                    </p>
                    
                    {/* Delete button with confirmation */}
                    {showDeleteConfirm !== `${index}` ? (
                      <button
                        onClick={() => setShowDeleteConfirm(`${index}`)}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 p-1 rounded">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <button
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium px-1"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="text-gray-500 hover:text-gray-700 text-sm font-medium px-1"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
          onClick={closeImageViewer}
        >
          {/* Close button at the top */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-black/50">
            <button
              onClick={closeImageViewer}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors flex items-center gap-2"
              title="Close viewer (Esc)"
            >
              <X className="w-6 h-6" />
              <span className="text-sm font-medium">Close</span>
            </button>

            {/* Zoom controls */}
            <div className="flex items-center gap-2 bg-white/10 rounded-full p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoom('out');
                }}
                className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoom('in');
                }}
                className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[90vw] max-h-[80vh] overflow-auto mt-16"
          >
            <img
              src={selectedImage.url}
              alt="Enlarged view"
              className="rounded-lg transition-transform duration-200"
              style={{ 
                transform: `scale(${zoom})`,
                cursor: 'grab'
              }}
            />
          </div>

          {/* Instructions overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            Tap anywhere to close
          </div>
        </div>
      )}
    </div>
  );
}

export default DynoImageCapture;