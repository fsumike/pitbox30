import React, { useState, useRef } from 'react';
import { Camera, Plus, Search, Edit2, Trash2, X, Image as ImageIcon, Calendar } from 'lucide-react';
import { useShocks, Shock } from '../../hooks/useShocks';
import { Camera as CapacitorCamera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export default function ShockInventoryTool() {
  const { shocks, loading, addShock, updateShock, deleteShock, refreshShocks, getSignedUrlForShock } = useShocks();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedShock, setSelectedShock] = useState<Shock | null>(null);
  const [formData, setFormData] = useState({
    serial_number: '',
    notes: '',
    last_refurbished: '',
  });
  const [dynoPhoto, setDynoPhoto] = useState<File | null>(null);
  const [dynoPhotoPreview, setDynoPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredShocks = shocks.filter((shock) =>
    shock.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTakePhoto = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const photo = await CapacitorCamera.getPhoto({
          quality: 90,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          saveToGallery: false,
          allowEditing: false,
        });

        if (photo.dataUrl) {
          const response = await fetch(photo.dataUrl);
          const blob = await response.blob();
          const file = new File([blob], `dyno-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setDynoPhoto(file);
          setDynoPhotoPreview(photo.dataUrl);
        }
      } else {
        fileInputRef.current?.click();
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Failed to take photo. Please try again.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDynoPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDynoPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = async (shock: Shock, imgElement: HTMLImageElement) => {
    console.log('Image failed to load, attempting to refresh URL for shock:', shock.id);

    // Mark this image as errored to prevent infinite loops
    if (imageErrors.has(shock.id)) {
      console.log('Already attempted to fix this image, showing fallback');
      return;
    }

    setImageErrors(prev => new Set(prev).add(shock.id));

    try {
      // Try to get a fresh signed URL
      const newUrl = await getSignedUrlForShock(shock);
      if (newUrl && newUrl !== shock.dyno_photo_url) {
        console.log('Got new signed URL, updating image source');
        imgElement.src = newUrl;
        // Remove from error set if successful
        setTimeout(() => {
          setImageErrors(prev => {
            const next = new Set(prev);
            next.delete(shock.id);
            return next;
          });
        }, 1000);
      } else {
        console.log('Could not generate new URL');
      }
    } catch (error) {
      console.error('Error refreshing image URL:', error);
    }
  };

  const handleAddShock = async () => {
    if (!formData.serial_number.trim()) {
      setUploadError('Please enter a shock serial number');
      return;
    }

    try {
      setSaving(true);
      setUploadError(null);
      console.log('Adding shock with data:', {
        serial_number: formData.serial_number,
        hasPhoto: !!dynoPhoto,
        photoName: dynoPhoto?.name,
        photoSize: dynoPhoto?.size
      });

      const result = await addShock(
        formData.serial_number,
        dynoPhoto || undefined,
        formData.notes || undefined,
        formData.last_refurbished || undefined
      );

      console.log('Shock added successfully:', result);
      resetForm();
      setShowAddModal(false);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add shock';
      setUploadError(errorMsg);
      console.error('Add shock error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateShock = async () => {
    if (!selectedShock) return;

    try {
      setSaving(true);
      setUploadError(null);
      console.log('Updating shock with data:', {
        id: selectedShock.id,
        serial_number: formData.serial_number,
        hasNewPhoto: !!dynoPhoto,
        photoName: dynoPhoto?.name,
        photoSize: dynoPhoto?.size
      });

      const result = await updateShock(selectedShock.id, {
        serial_number: formData.serial_number,
        notes: formData.notes || undefined,
        last_refurbished: formData.last_refurbished || undefined,
        dyno_photo: dynoPhoto === null ? null : dynoPhoto || undefined,
      });

      console.log('Shock updated successfully:', result);
      resetForm();
      setShowEditModal(false);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update shock';
      setUploadError(errorMsg);
      console.error('Update shock error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteShock = async (shock: Shock) => {
    if (!confirm(`Delete shock ${shock.serial_number}? This cannot be undone.`)) return;

    try {
      await deleteShock(shock.id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete shock');
    }
  };

  const openEditModal = (shock: Shock) => {
    setSelectedShock(shock);
    setFormData({
      serial_number: shock.serial_number,
      notes: shock.notes || '',
      last_refurbished: shock.last_refurbished
        ? new Date(shock.last_refurbished).toISOString().split('T')[0]
        : '',
    });
    setDynoPhoto(null);
    setDynoPhotoPreview(shock.dyno_photo_url);
    setShowEditModal(true);
  };

  const openViewModal = (shock: Shock) => {
    setSelectedShock(shock);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({ serial_number: '', notes: '', last_refurbished: '' });
    setDynoPhoto(null);
    setDynoPhotoPreview(null);
    setSelectedShock(null);
    setUploadError(null);
  };

  const removeDynoPhoto = () => {
    setDynoPhoto(null);
    setDynoPhotoPreview(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Shock Inventory</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Shock
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by serial number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {filteredShocks.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <Camera className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">
            {searchTerm ? 'No shocks found' : 'No shocks in inventory. Add your first shock!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShocks.map((shock) => (
            <div
              key={shock.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-orange-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {shock.serial_number}
                  </h3>
                  {shock.last_refurbished && (
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Refurbished: {new Date(shock.last_refurbished).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(shock)}
                    className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteShock(shock)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {shock.dyno_photo_url ? (
                <div
                  onClick={() => openViewModal(shock)}
                  className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    key={`${shock.id}-${shock.dyno_photo_url}`}
                    src={shock.dyno_photo_url}
                    alt={`Dyno sheet for ${shock.serial_number}`}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    onLoad={() => console.log('Image loaded successfully:', shock.serial_number)}
                    onError={(e) => handleImageError(shock, e.currentTarget)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/50 px-4 py-2 rounded-lg text-white text-sm">
                      View Full Size
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                </div>
              )}

              {shock.notes && (
                <p className="mt-3 text-sm text-gray-400 line-clamp-2">{shock.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Add New Shock</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
                  {uploadError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Serial Number *
                </label>
                <input
                  type="text"
                  value={formData.serial_number}
                  onChange={(e) =>
                    setFormData({ ...formData, serial_number: e.target.value })
                  }
                  placeholder="e.g., 1234, ABCD, 12AB..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dyno Sheet Photo
                </label>
                {dynoPhotoPreview ? (
                  <div className="relative">
                    <img
                      src={dynoPhotoPreview}
                      alt="Dyno sheet preview"
                      className="w-full rounded-lg"
                    />
                    <button
                      onClick={removeDynoPhoto}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleTakePhoto}
                    className="w-full py-8 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-orange-500 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-400">Take/Upload Photo</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Refurbished
                </label>
                <input
                  type="date"
                  value={formData.last_refurbished}
                  onChange={(e) =>
                    setFormData({ ...formData, last_refurbished: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes about this shock..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddShock}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Shock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedShock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Edit Shock</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
                  {uploadError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Serial Number *
                </label>
                <input
                  type="text"
                  value={formData.serial_number}
                  onChange={(e) =>
                    setFormData({ ...formData, serial_number: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dyno Sheet Photo
                </label>
                {dynoPhotoPreview ? (
                  <div className="relative">
                    <img
                      src={dynoPhotoPreview}
                      alt="Dyno sheet preview"
                      className="w-full rounded-lg"
                    />
                    <button
                      onClick={() => {
                        removeDynoPhoto();
                        if (!dynoPhoto) {
                          setDynoPhoto(null);
                        }
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleTakePhoto}
                    className="w-full py-8 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-orange-500 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-400">Take/Upload New Photo</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Refurbished
                </label>
                <input
                  type="date"
                  value={formData.last_refurbished}
                  onChange={(e) =>
                    setFormData({ ...formData, last_refurbished: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateShock}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedShock && selectedShock.dyno_photo_url && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowViewModal(false)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-orange-500 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedShock.dyno_photo_url}
              alt={`Dyno sheet for ${selectedShock.serial_number}`}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Shock: {selectedShock.serial_number}</h3>
              {selectedShock.last_refurbished && (
                <p className="text-gray-700 dark:text-gray-400 mt-1">
                  Last Refurbished:{' '}
                  {new Date(selectedShock.last_refurbished).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
