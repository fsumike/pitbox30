import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Advertisement } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminAdvertisements() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [formData, setFormData] = useState({
    business_name: '',
    contact_email: '',
    contact_phone: '',
    ad_content: '',
    image_url: '',
    target_radius_miles: 50,
    start_date: '',
    end_date: '',
    is_active: true,
  });

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdvertisements(data || []);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAd) {
        const { error } = await supabase
          .from('advertisements')
          .update(formData)
          .eq('id', editingAd.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('advertisements')
          .insert([formData]);

        if (error) throw error;
      }

      await fetchAdvertisements();
      resetForm();
    } catch (error) {
      console.error('Error saving advertisement:', error);
      alert('Failed to save advertisement. Please try again.');
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      business_name: ad.business_name,
      contact_email: ad.contact_email,
      contact_phone: ad.contact_phone || '',
      ad_content: ad.ad_content,
      image_url: ad.image_url || '',
      target_radius_miles: ad.target_radius_miles || 50,
      start_date: ad.start_date.split('T')[0],
      end_date: ad.end_date.split('T')[0],
      is_active: ad.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAdvertisements();
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      alert('Failed to delete advertisement. Please try again.');
    }
  };

  const toggleActive = async (ad: Advertisement) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ is_active: !ad.is_active })
        .eq('id', ad.id);

      if (error) throw error;
      await fetchAdvertisements();
    } catch (error) {
      console.error('Error toggling advertisement:', error);
      alert('Failed to update advertisement. Please try again.');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingAd(null);
    setFormData({
      business_name: '',
      contact_email: '',
      contact_phone: '',
      ad_content: '',
      image_url: '',
      target_radius_miles: 50,
      start_date: '',
      end_date: '',
      is_active: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Advertisement Management</h1>
            <p className="text-gray-400 mt-2">Manage location-based advertisements</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'New Advertisement'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Business Name</label>
                  <input
                    type="text"
                    required
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Phone (Optional)</label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Radius (miles)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.target_radius_miles}
                    onChange={(e) => setFormData({ ...formData, target_radius_miles: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ad Content</label>
                <textarea
                  required
                  rows={4}
                  value={formData.ad_content}
                  onChange={(e) => setFormData({ ...formData, ad_content: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium">Active</label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  {editingAd ? 'Update' : 'Create'} Advertisement
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {advertisements.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <p className="text-gray-400">No advertisements yet. Create your first one above.</p>
            </div>
          ) : (
            advertisements.map((ad) => (
              <div
                key={ad.id}
                className={`bg-gray-800 rounded-lg p-6 ${!ad.is_active ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{ad.business_name}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          ad.is_active ? 'bg-green-600' : 'bg-gray-600'
                        }`}
                      >
                        {ad.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{ad.ad_content}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                      <div>
                        <p><strong>Contact:</strong> {ad.contact_email}</p>
                        {ad.contact_phone && <p><strong>Phone:</strong> {ad.contact_phone}</p>}
                      </div>
                      <div>
                        <p><strong>Start:</strong> {new Date(ad.start_date).toLocaleDateString()}</p>
                        <p><strong>End:</strong> {new Date(ad.end_date).toLocaleDateString()}</p>
                        <p><strong>Radius:</strong> {ad.target_radius_miles} miles</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span>{ad.impressions} impressions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-green-400" />
                        <span>{ad.clicks} clicks</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleActive(ad)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                      title={ad.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {ad.is_active ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(ad)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
