import React, { useState, useEffect } from 'react';
import { X, Camera, Upload, Trash2, DollarSign, MapPin, AlertCircle, Loader2, Phone, Mail, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useListings } from '../hooks/useListings';
import { useLocation } from '../hooks/useLocation';
import { supabase } from '../lib/supabase';
import LocationDisplay from './LocationDisplay';
import { vehicleCategories } from '../App';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function CreateListingModal({ isOpen, onClose, onSuccess }: CreateListingModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'email'>('phone');
  const [vehicleType, setVehicleType] = useState('');
  const [includeLocation, setIncludeLocation] = useState(true);
  const [condition, setCondition] = useState<'new' | 'like-new' | 'good' | 'fair' | 'parts'>('good');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { createListing, loading } = useListings();
  const { latitude, longitude, address, city, state: locationState, loading: locationLoading, error: locationError, getLocation } = useLocation({
    enableHighAccuracy: true,
    enableGeocoding: true
  });

  // Load user's contact info
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Get user email from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get phone from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone')
          .eq('id', user.id)
          .single();

        if (profile) {
          setContactPhone(profile.phone || '');
        }
        // Set email from auth user
        setContactEmail(user.email || '');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const categories = [
    'Race Cars',
    'Engines & Parts',
    'Trailers & Transport',
    'Tools & Equipment',
    'Safety Gear',
    'Tires & Wheels',
    'Electronics',
    'Memorabilia',
    'Other'
  ];

  // Create flattened list of vehicle types
  const vehicleTypes = vehicleCategories.Vehicles.flatMap(category => 
    category.subcategories.map(sub => ({
      name: sub.name,
      value: sub.path.replace('/', '')
    }))
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Only allow up to 4 images
    if (images.length + files.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    setUploading(true);
    setError(null);

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result]);
        }
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to upload image');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('');
    setImages([]);
    setError(null);
    setVehicleType('');
    setIncludeLocation(true);
    setCondition('good');
    setIsNegotiable(true);
  };

  const handleLocationToggle = () => {
    if (!includeLocation) {
      getLocation();
    }
    setIncludeLocation(!includeLocation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !price || !category) {
      setError('Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      setError('Please add at least one image');
      return;
    }

    if (!contactPhone && !contactEmail) {
      setError('Please provide at least one contact method');
      return;
    }

    try {
      // Create city/state location string
      let locationDisplay = 'Location not provided';
      if (includeLocation) {
        if (city && locationState) {
          locationDisplay = `${city}, ${locationState}`;
        } else if (city) {
          locationDisplay = city;
        } else if (locationState) {
          locationDisplay = locationState;
        } else {
          locationDisplay = 'Current Location';
        }
      }

      const result = await createListing({
        title,
        description,
        price: parseFloat(price),
        category,
        location: locationDisplay,
        latitude: includeLocation ? (latitude || undefined) : undefined,
        longitude: includeLocation ? (longitude || undefined) : undefined,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        preferred_contact: preferredContact,
        vehicle_type: vehicleType,
        condition: condition,
        is_negotiable: isNegotiable
      }, images);

      if (result) {
        resetForm();
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      setError('Failed to create listing');
      console.error('Error creating listing:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="min-h-screen px-4 text-center">
        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

        <div
          className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle bg-gray-800 rounded-2xl shadow-xl transform transition-all relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-300"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold mb-6 pr-12 text-white">Create New Listing</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1 text-white">
                Photos (max 4) - Click to view full size
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                    >
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 rounded text-xs text-white">
                      {index + 1}/{images.length}
                    </div>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="aspect-square border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-gold transition-colors">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <span className="text-sm text-gray-400">Upload Photo</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      multiple
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1 text-white">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                placeholder="What are you selling?"
                maxLength={100}
                required
              />
            </div>

            {/* Category Select */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1 text-white">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Type Select */}
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium mb-1 text-white">
                Vehicle Type
              </label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
              >
                <option value="">Select vehicle type (optional)</option>
                {vehicleTypes.map(vehicle => (
                  <option key={vehicle.value} value={vehicle.value}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Select */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium mb-1 text-white">
                Condition
              </label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                required
              >
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="parts">For Parts</option>
              </select>
            </div>

            {/* Price Input */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1 text-white">
                Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-10 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1 text-white">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                rows={4}
                placeholder="Describe what you're selling..."
                required
              />
            </div>

            {/* Negotiable Checkbox */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-brand-gold rounded"
                />
                <span className="text-sm font-medium text-white">Price is negotiable</span>
              </label>
              <p className="ml-7 text-xs text-gray-400 mt-1">
                Allow buyers to make offers on your listing
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 p-4 rounded-xl bg-gray-700/50 border border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                <span className="text-xs px-2 py-1 bg-brand-gold/20 text-brand-gold rounded-full font-medium">
                  At least one required
                </span>
              </div>

              {!contactPhone && !contactEmail && (
                <div className="p-3 rounded-lg bg-amber-900/30 border border-amber-600/30 text-amber-300 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Please enter a phone number or email so buyers can contact you
                </div>
              )}

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium mb-1 text-white">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    id="contactPhone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className={`w-full pl-10 p-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 ${
                      contactPhone ? 'border-green-500' : 'border-gray-600'
                    }`}
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium mb-1 text-white">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="contactEmail"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className={`w-full pl-10 p-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 ${
                      contactEmail ? 'border-green-500' : 'border-gray-600'
                    }`}
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={preferredContact === 'phone'}
                      onChange={() => setPreferredContact('phone')}
                      className="mr-2"
                    />
                    Phone
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={preferredContact === 'email'}
                      onChange={() => setPreferredContact('email')}
                      className="mr-2"
                    />
                    Email
                  </label>
                </div>
              </div>
            </div>

            {/* Location Privacy Control */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLocation}
                  onChange={handleLocationToggle}
                  className="form-checkbox h-5 w-5 text-brand-gold rounded"
                />
                <span className="text-sm font-medium text-white">Include my location in this listing</span>
              </label>

              {includeLocation && (
                <div className="ml-7 text-sm text-gray-400">
                  {locationLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Getting location...</span>
                    </div>
                  ) : locationError ? (
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>{locationError}</span>
                    </div>
                  ) : city && locationState ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{city}, {locationState}</span>
                    </div>
                  ) : city ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{city}</span>
                    </div>
                  ) : locationState ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{locationState}</span>
                    </div>
                  ) : (
                    <div className="text-gray-400">Getting city...</div>
                  )}
                </div>
              )}

              <p className="ml-7 text-xs text-gray-400">
                {includeLocation
                  ? 'Buyers will see your city and state only - no street address.'
                  : 'Your location will not be shared with buyers.'}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Post Listing
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div
            className="max-w-4xl max-h-[80vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex]}
              alt={`Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="text-center mt-4 text-white">
              <span className="px-4 py-2 bg-white/10 rounded-full">
                {lightboxIndex + 1} of {images.length}
              </span>
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(idx);
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === lightboxIndex
                      ? 'border-brand-gold scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CreateListingModal;