import React, { useState, useEffect } from 'react';
import { X, Camera, Upload, Trash2, DollarSign, MapPin, AlertCircle, Loader2, Phone, Mail, CheckCircle, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { useListings } from '../hooks/useListings';
import { useLocation } from '../hooks/useLocation';
import { supabase } from '../lib/supabase';
import { vehicleCategories } from '../App';
import { compressImage } from '../utils/imageCompression';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'email'>('phone');
  const [vehicleType, setVehicleType] = useState('');
  const [includeLocation, setIncludeLocation] = useState(true);
  const [condition, setCondition] = useState<'new' | 'like-new' | 'good' | 'fair' | 'parts'>('good');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [submitStep, setSubmitStep] = useState<'idle' | 'creating' | 'uploading' | 'done'>('idle');

  const { createListing, error, setError } = useListings();
  const isSubmitting = submitStep !== 'idle';
  const location = useLocation({
    enableHighAccuracy: true,
    enableGeocoding: true,
    autoFetch: true
  });

  useEffect(() => {
    if (isOpen) {
      loadUserProfile();
    }
  }, [isOpen]);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setContactPhone(profile.phone || '');
        }
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

  const vehicleTypes = vehicleCategories.Vehicles.flatMap(category =>
    category.subcategories.map(sub => ({
      name: sub.name,
      value: sub.path.replace('/', '')
    }))
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - images.length;
    if (remainingSlots <= 0) {
      setError('Maximum 4 images allowed');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    setUploading(true);
    setError(null);

    try {
      const compressedImages = await Promise.all(
        filesToProcess.map(file =>
          compressImage(file, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.8
          })
        )
      );
      setImages(prev => [...prev, ...compressedImages]);
    } catch (err) {
      console.error('Image compression error:', err);
      setError('Failed to process images');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
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
    setSubmitStep('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title?.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!description?.trim()) {
      setError('Please enter a description');
      return;
    }

    if (!price || parseFloat(price) < 0) {
      setError('Please enter a valid price');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    if (images.length === 0) {
      setError('Please add at least one image');
      return;
    }

    if (!contactPhone?.trim() && !contactEmail?.trim()) {
      setError('Please provide at least one contact method');
      return;
    }

    setSubmitStep('creating');

    try {
      let locationDisplay = 'Location not provided';
      if (includeLocation && location.latitude && location.longitude) {
        if (location.city && location.state) {
          locationDisplay = `${location.city}, ${location.state}`;
        } else if (location.city) {
          locationDisplay = location.city;
        } else if (location.state) {
          locationDisplay = location.state;
        } else {
          locationDisplay = 'Current Location';
        }
      }

      setSubmitStep('uploading');

      const result = await createListing({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category,
        location: locationDisplay,
        latitude: includeLocation && location.latitude ? location.latitude : undefined,
        longitude: includeLocation && location.longitude ? location.longitude : undefined,
        contact_phone: contactPhone.trim() || undefined,
        contact_email: contactEmail.trim() || undefined,
        preferred_contact: preferredContact,
        vehicle_type: vehicleType || undefined,
        condition,
        is_negotiable: isNegotiable
      }, images);

      if (result) {
        setSubmitStep('done');
        setTimeout(() => {
          resetForm();
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setSubmitStep('idle');
      }
    } catch (err) {
      console.error('Error creating listing:', err);
      setSubmitStep('idle');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && onClose()} />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block w-full max-w-2xl text-left align-middle bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl shadow-brand-gold/20 transform transition-all relative border-2 border-brand-gold/30"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => !isSubmitting && onClose()}
            disabled={isSubmitting}
            className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-300 hover:text-white disabled:opacity-50 z-10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold mb-6 pr-12 bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold bg-clip-text text-transparent">
              Create New Listing
            </h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-brand-gold" />
                    Photos ({images.length}/4)
                  </label>
                  <span className="text-xs text-gray-400">Auto-compressed</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <AnimatePresence>
                    {images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square group rounded-xl overflow-hidden border-2 border-gray-700 hover:border-brand-gold transition-all"
                      >
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-110"
                          onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                          }}
                        />
                        <div
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                          }}
                        >
                          <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-xs text-white font-medium">
                          {index + 1}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {images.length < 4 && (
                    <label className="aspect-square border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-gold hover:bg-brand-gold/5 transition-all group">
                      {uploading ? (
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-brand-gold mx-auto mb-2" />
                          <span className="text-xs text-brand-gold font-medium">Processing...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2 text-gray-400 group-hover:text-brand-gold transition-colors" />
                          <span className="text-sm text-gray-400 group-hover:text-brand-gold font-medium transition-colors">Add Photo</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        multiple
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-semibold mb-2 text-white">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800/50 border-2 border-gray-700 text-white placeholder-gray-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 transition-all"
                  placeholder="What are you selling?"
                  maxLength={100}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold mb-2 text-white">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-800/50 border-2 border-gray-700 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 transition-all"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-semibold mb-2 text-white">
                    Vehicle Type
                  </label>
                  <select
                    id="vehicleType"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-800/50 border-2 border-gray-700 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 transition-all"
                  >
                    <option value="">Select type (optional)</option>
                    {vehicleTypes.map(vehicle => (
                      <option key={vehicle.value} value={vehicle.value}>{vehicle.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="condition" className="block text-sm font-semibold mb-2 text-white">
                    Condition <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as 'new' | 'like-new' | 'good' | 'fair' | 'parts')}
                    className="w-full p-3 rounded-xl bg-gray-800/50 border-2 border-gray-700 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 transition-all"
                    required
                  >
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="parts">For Parts</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-semibold mb-2 text-white">
                    Price <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold w-5 h-5" />
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-10 pr-4 p-3 rounded-xl bg-gray-800/50 border-2 border-gray-700 text-white placeholder-gray-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 transition-all"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold mb-2 text-white">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800/50 border-2 border-gray-700 text-white placeholder-gray-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 transition-all resize-none"
                  rows={4}
                  placeholder="Describe your item in detail..."
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-gray-700 bg-gray-800/50 text-brand-gold focus:ring-2 focus:ring-brand-gold/50"
                />
                <label htmlFor="negotiable" className="text-sm font-medium text-white cursor-pointer">
                  Price is negotiable
                </label>
              </div>

              <div className="p-4 rounded-xl bg-gray-800/30 border-2 border-gray-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Contact Information</h3>
                  <span className="text-xs px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full font-semibold">
                    Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-semibold mb-2 text-white">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        id="contactPhone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className={`w-full pl-10 pr-4 p-3 rounded-xl bg-gray-800/50 border-2 text-white placeholder-gray-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 transition-all ${
                          contactPhone ? 'border-green-500' : 'border-gray-700'
                        }`}
                        placeholder="Your phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-semibold mb-2 text-white">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        id="contactEmail"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 p-3 rounded-xl bg-gray-800/50 border-2 text-white placeholder-gray-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 transition-all ${
                          contactEmail ? 'border-green-500' : 'border-gray-700'
                        }`}
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={preferredContact === 'phone'}
                      onChange={() => setPreferredContact('phone')}
                      className="w-4 h-4 text-brand-gold focus:ring-brand-gold"
                    />
                    <span className="text-sm">Prefer Phone</span>
                  </label>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={preferredContact === 'email'}
                      onChange={() => setPreferredContact('email')}
                      className="w-4 h-4 text-brand-gold focus:ring-brand-gold"
                    />
                    <span className="text-sm">Prefer Email</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-gray-800/30 border-2 border-gray-700">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLocation}
                    onChange={(e) => setIncludeLocation(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-2 border-gray-700 bg-gray-800/50 text-brand-gold focus:ring-2 focus:ring-brand-gold/50"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-white block mb-1">Include my location</span>
                    {includeLocation && location.latitude && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-brand-gold" />
                        <span>
                          {location.city && location.state
                            ? `${location.city}, ${location.state}`
                            : location.city || location.state || 'Location detected'}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {includeLocation
                        ? 'Buyers will see your city/state only'
                        : 'Your location will not be shared'}
                    </p>
                  </div>
                </label>
              </div>

              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-brand-gold/10 to-amber-600/10 border-2 border-brand-gold/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {submitStep === 'done' ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : (
                      <Loader2 className="w-6 h-6 animate-spin text-brand-gold flex-shrink-0" />
                    )}
                    <p className="font-semibold text-white">
                      {submitStep === 'creating' && 'Creating your listing...'}
                      {submitStep === 'uploading' && 'Uploading images...'}
                      {submitStep === 'done' && 'Listing posted successfully!'}
                    </p>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${submitStep === 'done' ? 'bg-green-500' : 'bg-gradient-to-r from-brand-gold to-amber-600'}`}
                      initial={{ width: '0%' }}
                      animate={{
                        width: submitStep === 'creating' ? '33%' : submitStep === 'uploading' ? '66%' : '100%'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-white font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-amber-600 hover:from-amber-600 hover:to-brand-gold text-black font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-brand-gold/30"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {submitStep === 'creating' && 'Creating...'}
                      {submitStep === 'uploading' && 'Uploading...'}
                      {submitStep === 'done' && 'Done!'}
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
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl max-h-[80vh] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightboxIndex]}
                alt={`Image ${lightboxIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />
              <div className="text-center mt-4 text-white">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full font-semibold">
                  {lightboxIndex + 1} of {images.length}
                </span>
              </div>
            </motion.div>

            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(idx);
                    }}
                    className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === lightboxIndex
                        ? 'border-brand-gold scale-110 shadow-lg shadow-brand-gold/50'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreateListingModal;
