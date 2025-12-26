import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Square, Plus, Trash2, RotateCcw, Save, Loader2, AlertCircle, CheckCircle, Car, Settings, Clock, Wrench, Flag, RefreshCw, CreditCard as Edit, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMaintenanceChecklists } from '../hooks/useMaintenanceChecklists';
import { vehicleCategories } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'post_race' | 'shop' | 'pre_race';
}

interface ChecklistData {
  post_race: ChecklistItem[];
  shop: ChecklistItem[];
  pre_race: ChecklistItem[];
}

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: 'post_race' | 'shop' | 'pre_race', text: string) => void;
  category: 'post_race' | 'shop' | 'pre_race';
}

function AddItemModal({ isOpen, onClose, onAdd, category }: AddItemModalProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(category, text.trim());
      setText('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const categoryNames = {
    post_race: 'Post-Race',
    shop: 'Shop/Garage',
    pre_race: 'Pre-Race'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Add {categoryNames[category]} Item</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="itemText" className="block text-sm font-medium mb-2">
                Checklist Item
              </label>
              <textarea
                id="itemText"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 rounded-lg"
                rows={3}
                placeholder="Enter the maintenance task..."
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function MaintenanceChecklist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    getChecklist,
    saveChecklist,
    deleteChecklist,
    getDefaultChecklist,
    restoreDefaultChecklist,
    loading,
    error
  } = useMaintenanceChecklists();

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistData | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['post_race', 'shop', 'pre_race']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalCategory, setAddModalCategory] = useState<'post_race' | 'shop' | 'pre_race'>('post_race');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get all vehicle types from the categories
  const allVehicleTypes = vehicleCategories.Vehicles.flatMap(category => 
    category.subcategories.map(sub => ({
      name: sub.name,
      path: sub.path.replace('/', ''),
      category: category.name
    }))
  );

  useEffect(() => {
    if (selectedVehicle) {
      loadChecklist();
    }
  }, [selectedVehicle]);

  const loadChecklist = async () => {
    if (!selectedVehicle) return;

    try {
      // Try to load user's custom checklist first
      let checklistData = await getChecklist(selectedVehicle);
      
      // If no custom checklist exists, load the default
      if (!checklistData) {
        checklistData = await getDefaultChecklist(selectedVehicle);
      }
      
      setChecklist(checklistData);
    } catch (err) {
      console.error('Error loading checklist:', err);
    }
  };

  const handleVehicleSelect = (vehicleType: string) => {
    setSelectedVehicle(vehicleType);
    setChecklist(null);
  };

  const toggleItem = (category: 'post_race' | 'shop' | 'pre_race', itemId: string) => {
    if (!checklist) return;

    setChecklist(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        [category]: prev[category].map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
      };
    });
  };

  const addItem = (category: 'post_race' | 'shop' | 'pre_race', text: string) => {
    if (!checklist) return;

    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      category
    };

    setChecklist(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        [category]: [...prev[category], newItem]
      };
    });
  };

  const removeItem = (category: 'post_race' | 'shop' | 'pre_race', itemId: string) => {
    if (!checklist) return;

    setChecklist(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        [category]: prev[category].filter(item => item.id !== itemId)
      };
    });
  };

  const handleSave = async () => {
    if (!selectedVehicle || !checklist) return;

    setSaving(true);
    try {
      const success = await saveChecklist(selectedVehicle, checklist);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving checklist:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedVehicle) return;

    try {
      const defaultChecklist = await restoreDefaultChecklist(selectedVehicle);
      if (defaultChecklist) {
        setChecklist(defaultChecklist);
      }
    } catch (err) {
      console.error('Error restoring checklist:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedVehicle) return;

    try {
      const success = await deleteChecklist(selectedVehicle);
      if (success) {
        // Load default checklist after deletion
        const defaultChecklist = await getDefaultChecklist(selectedVehicle);
        setChecklist(defaultChecklist);
      }
    } catch (err) {
      console.error('Error deleting checklist:', err);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getProgress = (items: ChecklistItem[]) => {
    if (items.length === 0) return 0;
    const completed = items.filter(item => item.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  const categoryInfo = {
    post_race: {
      title: 'Post-Race Tasks',
      description: 'Immediate tasks after coming off the track',
      icon: Flag,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    shop: {
      title: 'Shop/Garage Tasks',
      description: 'Detailed maintenance when back at the shop',
      icon: Wrench,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    pre_race: {
      title: 'Pre-Race Preparation',
      description: 'Everything needed before the next race',
      icon: CheckSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Maintenance Checklists</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive maintenance tracking for every racing vehicle
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Vehicle Selection */}
      {!selectedVehicle ? (
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-2xl font-bold mb-6">Select Your Racing Vehicle</h2>
            
            {vehicleCategories.Vehicles.map((category) => (
              <div key={category.name} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-brand-gold">{category.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.subcategories.map((vehicle) => (
                    <button
                      key={vehicle.path}
                      onClick={() => handleVehicleSelect(vehicle.path.replace('/', ''))}
                      className="glass-panel p-4 text-left hover:bg-brand-gold/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Car className="w-6 h-6 text-brand-gold" />
                        <div>
                          <span className="font-medium">{vehicle.name}</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Maintenance checklist for {vehicle.name.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Checklist View */
        <div className="space-y-6">
          {/* Checklist Header */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {allVehicleTypes.find(v => v.path === selectedVehicle)?.name} Maintenance
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete maintenance checklist for race preparation
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Vehicles
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSave}
                disabled={saving || !checklist}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Progress
                  </>
                )}
              </button>
              
              <button
                onClick={handleRestore}
                className="btn-secondary flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Restore Default
              </button>
              
              <button
                onClick={handleDelete}
                className="btn-danger flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete & Reset
              </button>
            </div>
          </div>

          {/* Checklist Sections */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          ) : checklist ? (
            <div className="space-y-6">
              {Object.entries(categoryInfo).map(([categoryKey, info]) => {
                const category = categoryKey as 'post_race' | 'shop' | 'pre_race';
                const items = checklist[category] || [];
                const progress = getProgress(items);
                const isExpanded = expandedSections.includes(category);
                const IconComponent = info.icon;

                return (
                  <div key={category} className={`glass-panel overflow-hidden ${info.bgColor}`}>
                    <button
                      onClick={() => toggleSection(category)}
                      className="w-full p-6 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <IconComponent className={`w-8 h-8 ${info.color}`} />
                          <div>
                            <h3 className="text-xl font-bold">{info.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{info.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${info.color}`}>
                              {progress}%
                            </div>
                            <div className="text-sm text-gray-500">
                              {items.filter(i => i.completed).length} of {items.length}
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6" />
                          ) : (
                            <ChevronDown className="w-6 h-6" />
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            progress === 100 ? 'bg-green-500' : 
                            progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-semibold">Tasks</h4>
                              <button
                                onClick={() => {
                                  setAddModalCategory(category);
                                  setShowAddModal(true);
                                }}
                                className="btn-secondary flex items-center gap-2 text-sm"
                              >
                                <Plus className="w-4 h-4" />
                                Add Task
                              </button>
                            </div>

                            <div className="space-y-3">
                              {items.map((item) => (
                                <motion.div
                                  key={item.id}
                                  className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors group"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                >
                                  <button
                                    onClick={() => toggleItem(category, item.id)}
                                    className="mt-1 flex-shrink-0"
                                  >
                                    {item.completed ? (
                                      <CheckSquare className="w-5 h-5 text-green-500" />
                                    ) : (
                                      <Square className="w-5 h-5 text-gray-400" />
                                    )}
                                  </button>
                                  
                                  <span 
                                    className={`flex-1 ${
                                      item.completed 
                                        ? 'line-through text-gray-500 dark:text-gray-400' 
                                        : ''
                                    }`}
                                  >
                                    {item.text}
                                  </span>
                                  
                                  <button
                                    onClick={() => removeItem(category, item.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                                    title="Remove item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </motion.div>
                              ))}
                              
                              {items.length === 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                  <p>No tasks in this category yet.</p>
                                  <button
                                    onClick={() => {
                                      setAddModalCategory(category);
                                      setShowAddModal(true);
                                    }}
                                    className="btn-primary mt-4 flex items-center gap-2 mx-auto"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add First Task
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Loading Checklist...</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Setting up your maintenance checklist for {allVehicleTypes.find(v => v.path === selectedVehicle)?.name}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addItem}
        category={addModalCategory}
      />
    </div>
  );
}

export default MaintenanceChecklist;