import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, MousePointerClick, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useUserAdvertisements, Advertisement } from '../hooks/useAdvertisements';
import { useAuth } from '../contexts/AuthContext';

export default function MyAdvertisements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { advertisements, loading, deleteAdvertisement } = useUserAdvertisements();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Please sign in to manage advertisements</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Sign In
        </button>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;

    try {
      await deleteAdvertisement(id);
    } catch (err) {
      alert('Failed to delete advertisement');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-gold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Advertisement
        </button>
      </div>

      <div className="glass-panel p-6">
        <h1 className="text-2xl font-bold mb-6">My Advertisements</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
          </div>
        ) : advertisements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No advertisements yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Ad
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {advertisements.map((ad) => (
              <div key={ad.id} className="glass-panel p-4 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  {ad.image_url && (
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{ad.business_name}</h3>
                        <p className="text-brand-gold font-medium">{ad.title}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            ad.is_active
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {ad.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {ad.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {ad.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{ad.impressions} views</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MousePointerClick className="w-4 h-4 text-gray-400" />
                        <span>{ad.clicks} clicks</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="capitalize">{ad.reach_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>{ad.radius_miles} mi radius</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(ad.start_date).toLocaleDateString()} -{' '}
                        {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : 'Ongoing'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingAd(ad)}
                        className="px-3 py-1.5 rounded-lg bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 transition-colors flex items-center gap-1 text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(showCreateModal || editingAd) && (
        <AdFormModal
          ad={editingAd}
          onClose={() => {
            setShowCreateModal(false);
            setEditingAd(null);
          }}
        />
      )}
    </div>
  );
}

interface AdFormModalProps {
  ad: Advertisement | null;
  onClose: () => void;
}

function AdFormModal({ ad, onClose }: AdFormModalProps) {
  const { createAdvertisement, updateAdvertisement } = useUserAdvertisements();
  const [formData, setFormData] = useState({
    business_name: ad?.business_name || '',
    title: ad?.title || '',
    description: ad?.description || '',
    image_url: ad?.image_url || '',
    website_url: ad?.website_url || '',
    phone: ad?.phone || '',
    latitude: ad?.latitude || 0,
    longitude: ad?.longitude || 0,
    reach_type: ad?.reach_type || 'local',
    radius_miles: ad?.radius_miles || 50,
    category: ad?.category || 'other',
    is_active: ad?.is_active ?? true,
    end_date: ad?.end_date || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (ad) {
        await updateAdvertisement(ad.id, formData);
      } else {
        await createAdvertisement(formData);
      }
      onClose();
    } catch (err) {
      alert('Failed to save advertisement');
    } finally {
      setLoading(false);
    }
  };

  const reachOptions = [
    { value: 'local', label: 'Local', radius: 50, description: 'Within 50 miles' },
    { value: 'regional', label: 'Regional', radius: 200, description: 'Within 200 miles' },
    { value: 'national', label: 'National', radius: 99999, description: 'Nationwide' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="glass-panel p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {ad ? 'Edit Advertisement' : 'Create Advertisement'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Business Name *</label>
            <input
              type="text"
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ad Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="input-field"
              >
                <option value="parts">Parts</option>
                <option value="services">Services</option>
                <option value="tracks">Tracks</option>
                <option value="equipment">Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Website URL</label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Latitude *</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Longitude *</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reach Type *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reachOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      reach_type: option.value as any,
                      radius_miles: option.radius
                    })
                  }
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.reach_type === option.value
                      ? 'border-brand-gold bg-brand-gold/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-brand-gold/50'
                  }`}
                >
                  <div className="font-bold mb-1">{option.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {formData.reach_type !== 'national' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Custom Radius (miles): {formData.radius_miles}
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={formData.radius_miles}
                onChange={(e) => setFormData({ ...formData, radius_miles: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Active (show this ad)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Saving...' : ad ? 'Update Advertisement' : 'Create Advertisement'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-brand-gold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
