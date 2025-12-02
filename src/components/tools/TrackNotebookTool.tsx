import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Save, Trash2, Edit, X, Loader2, Tag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface TrackNote {
  id: string;
  track_name: string;
  date: string;
  title: string;
  content: string;
  weather: string;
  track_surface: string;
  what_worked: string;
  what_didnt_work: string;
  changes_made: string;
  results: string;
  tags: string[];
}

export default function TrackNotebookTool() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<TrackNote[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<TrackNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    track_name: '',
    title: '',
    content: '',
    weather: '',
    track_surface: '',
    what_worked: '',
    what_didnt_work: '',
    changes_made: '',
    results: '',
    tags: ''
  });

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('track_notebooks')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (!error && data) {
      setNotes(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user || !formData.track_name.trim() || !formData.title.trim()) return;

    setLoading(true);
    const noteData = {
      user_id: user.id,
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };

    if (editingNote) {
      const { error } = await supabase
        .from('track_notebooks')
        .update(noteData)
        .eq('id', editingNote.id);

      if (!error) {
        await loadNotes();
        handleClose();
      }
    } else {
      const { error } = await supabase
        .from('track_notebooks')
        .insert(noteData);

      if (!error) {
        await loadNotes();
        handleClose();
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return;

    setLoading(true);
    const { error } = await supabase
      .from('track_notebooks')
      .delete()
      .eq('id', id);

    if (!error) {
      await loadNotes();
    }
    setLoading(false);
  };

  const handleEdit = (note: TrackNote) => {
    setEditingNote(note);
    setFormData({
      track_name: note.track_name,
      title: note.title,
      content: note.content || '',
      weather: note.weather || '',
      track_surface: note.track_surface || '',
      what_worked: note.what_worked || '',
      what_didnt_work: note.what_didnt_work || '',
      changes_made: note.changes_made || '',
      results: note.results || '',
      tags: note.tags.join(', ')
    });
    setShowAddModal(true);
  };

  const handleClose = () => {
    setShowAddModal(false);
    setEditingNote(null);
    setFormData({
      track_name: '',
      title: '',
      content: '',
      weather: '',
      track_surface: '',
      what_worked: '',
      what_didnt_work: '',
      changes_made: '',
      results: '',
      tags: ''
    });
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">Sign in to access track notebook</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Keep detailed notes on track conditions, setups, and race results
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full px-4 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark inline-flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        New Track Note
      </button>

      {loading && (!notes || notes.length === 0) ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
        </div>
      ) : !notes || notes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">
            No track notes yet. Start documenting your racing insights!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{note.title}</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {note.track_name} • {format(new Date(note.date), 'MMM d, yyyy')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {note.content && (
                <p className="text-gray-700 dark:text-gray-300 mb-3">{note.content}</p>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                {note.weather && (
                  <div>
                    <span className="text-gray-500">Weather:</span>{' '}
                    <span className="font-medium">{note.weather}</span>
                  </div>
                )}
                {note.track_surface && (
                  <div>
                    <span className="text-gray-500">Surface:</span>{' '}
                    <span className="font-medium">{note.track_surface}</span>
                  </div>
                )}
                {note.results && (
                  <div>
                    <span className="text-gray-500">Results:</span>{' '}
                    <span className="font-medium">{note.results}</span>
                  </div>
                )}
              </div>

              {note.what_worked && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">What Worked</div>
                  <div className="text-sm">{note.what_worked}</div>
                </div>
              )}

              {note.what_didnt_work && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded">
                  <div className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">What Didn't Work</div>
                  <div className="text-sm">{note.what_didnt_work}</div>
                </div>
              )}

              {note.tags && note.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {note.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{editingNote ? 'Edit' : 'New'} Track Note</h3>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Track Name *</label>
                    <input
                      type="text"
                      value={formData.track_name}
                      onChange={(e) => setFormData({ ...formData, track_name: e.target.value })}
                      className="w-full p-3 rounded-lg"
                      placeholder="e.g., Eldora Speedway"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-3 rounded-lg"
                      placeholder="e.g., Kings Royal Practice"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">General Notes</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-3 rounded-lg"
                    rows={4}
                    placeholder="Overall observations and notes..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Weather</label>
                    <input
                      type="text"
                      value={formData.weather}
                      onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                      className="w-full p-3 rounded-lg"
                      placeholder="e.g., Sunny, 85°F"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Track Surface</label>
                    <input
                      type="text"
                      value={formData.track_surface}
                      onChange={(e) => setFormData({ ...formData, track_surface: e.target.value })}
                      className="w-full p-3 rounded-lg"
                      placeholder="e.g., Heavy, slick, tacky"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-green-600 dark:text-green-400">
                    What Worked
                  </label>
                  <textarea
                    value={formData.what_worked}
                    onChange={(e) => setFormData({ ...formData, what_worked: e.target.value })}
                    className="w-full p-3 rounded-lg"
                    rows={3}
                    placeholder="Setup changes or approaches that were successful..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-red-600 dark:text-red-400">
                    What Didn't Work
                  </label>
                  <textarea
                    value={formData.what_didnt_work}
                    onChange={(e) => setFormData({ ...formData, what_didnt_work: e.target.value })}
                    className="w-full p-3 rounded-lg"
                    rows={3}
                    placeholder="Things to avoid or problems encountered..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Changes Made</label>
                  <textarea
                    value={formData.changes_made}
                    onChange={(e) => setFormData({ ...formData, changes_made: e.target.value })}
                    className="w-full p-3 rounded-lg"
                    rows={2}
                    placeholder="Setup adjustments throughout the event..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Results</label>
                  <input
                    type="text"
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    className="w-full p-3 rounded-lg"
                    placeholder="e.g., Heat: 3rd, Feature: 5th"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full p-3 rounded-lg"
                    placeholder="Separate tags with commas (e.g., slick, hot, heavy)"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading || !formData.track_name.trim() || !formData.title.trim()}
                    className="px-6 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
