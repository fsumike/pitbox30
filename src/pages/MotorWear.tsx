import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Battery, Gauge, Thermometer, Zap, Save, Trash2, RefreshCw, CheckCircle, Loader2, AlertCircle, Calendar, Database, Plus, CreditCard as Edit, X, Clock, MapPin, Settings, TrendingUp, BarChart3, Info } from 'lucide-react';
import { useMotorHealth, Motor, MotorEvent } from '../hooks/useMotorHealth';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Motor type information with expected life and refresh thresholds
const MOTOR_TYPE_INFO = {
  '410_sprint': {
    name: '410 Sprint Car',
    expectedLife: 750,
    refreshThreshold: 80,
    description: 'High-performance 410 cubic inch sprint car engines typically last 750-1000 laps between major rebuilds. These powerful engines operate at extreme RPMs and require careful monitoring.',
    tips: [
      'Monitor oil pressure closely during races',
      'Check compression every 100 laps',
      'Refresh at 80% of expected life for optimal performance',
      'Track RPM patterns to identify potential issues early'
    ]
  },
  '360_sprint': {
    name: '360 Sprint Car',
    expectedLife: 900,
    refreshThreshold: 80,
    description: '360 cubic inch sprint car engines offer excellent durability while maintaining competitive power. Expected life is 900-1200 laps with proper maintenance.',
    tips: [
      'Less stress than 410s allows for longer intervals',
      'Still monitor oil consumption carefully',
      'Valve adjustments every 200 laps recommended',
      'Consider refresh at 720 laps for peak performance'
    ]
  },
  'crate_sprint': {
    name: 'Crate Sprint',
    expectedLife: 1200,
    refreshThreshold: 85,
    description: 'Sealed crate engines are designed for longevity and cost control. These engines typically last 1200-1500 laps with minimal maintenance.',
    tips: [
      'Follow manufacturer maintenance schedule strictly',
      'Oil changes every 3-4 races',
      'Sealed nature means fewer adjustments needed',
      'Focus on external components and cooling system'
    ]
  },
  'late_model': {
    name: 'Late Model',
    expectedLife: 800,
    refreshThreshold: 75,
    description: 'Late model engines balance power and durability for longer races. Expected life is 800-1000 laps depending on track conditions.',
    tips: [
      'Longer races mean more heat cycles',
      'Monitor water temperature closely',
      'Check valve springs every 150 laps',
      'Consider refresh earlier for championship events'
    ]
  },
  'crate_late_model': {
    name: 'Crate Late Model',
    expectedLife: 1000,
    refreshThreshold: 80,
    description: 'Crate late model engines provide excellent reliability for cost-conscious teams. Expected life is 1000-1300 laps.',
    tips: [
      'More durable than open engines',
      'Follow crate engine maintenance guidelines',
      'Oil analysis recommended every 200 laps',
      'Cooling system maintenance is critical'
    ]
  },
  'modified': {
    name: 'Modified',
    expectedLife: 850,
    refreshThreshold: 80,
    description: 'Modified engines see varied conditions and power levels. Expected life ranges from 850-1100 laps based on setup.',
    tips: [
      'Power levels vary significantly by class',
      'Track conditions greatly affect engine life',
      'Monitor for dirt ingestion on dusty tracks',
      'Carburetor tuning affects engine longevity'
    ]
  },
  'micro_600': {
    name: '600 Micro',
    expectedLife: 600,
    refreshThreshold: 75,
    description: 'High-revving 600cc motorcycle engines require frequent attention. Expected life is 600-800 laps due to extreme RPM operation.',
    tips: [
      'Highest RPM operation of all classes',
      'Check valve clearances every 100 laps',
      'Oil changes every 2-3 races mandatory',
      'Monitor for overheating during long races'
    ]
  }
};

interface AddMotorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (motorData: Partial<Motor>) => void;
  loading: boolean;
}

function AddMotorModal({ isOpen, onClose, onSave, loading }: AddMotorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    motor_type: '',
    engine_class: '',
    expected_life_laps: 750,
    refresh_threshold: 80,
    notes: ''
  });

  const handleMotorTypeChange = (motorType: string) => {
    const typeInfo = MOTOR_TYPE_INFO[motorType as keyof typeof MOTOR_TYPE_INFO];
    setFormData(prev => ({
      ...prev,
      motor_type: motorType,
      expected_life_laps: typeInfo?.expectedLife || 750,
      refresh_threshold: typeInfo?.refreshThreshold || 80
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      name: '',
      motor_type: '',
      engine_class: '',
      expected_life_laps: 750,
      refresh_threshold: 80,
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Add New Motor</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Motor Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 rounded-lg"
                placeholder="e.g., Primary 410, Backup 360, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Motor Type *</label>
              <select
                value={formData.motor_type}
                onChange={(e) => handleMotorTypeChange(e.target.value)}
                className="w-full p-3 rounded-lg"
                required
              >
                <option value="">Select Motor Type</option>
                {Object.entries(MOTOR_TYPE_INFO).map(([key, info]) => (
                  <option key={key} value={key}>{info.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Engine Class</label>
              <input
                type="text"
                value={formData.engine_class}
                onChange={(e) => setFormData(prev => ({ ...prev, engine_class: e.target.value }))}
                className="w-full p-3 rounded-lg"
                placeholder="e.g., Open, Crate, Restricted, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Expected Life (Laps)</label>
                <input
                  type="number"
                  value={formData.expected_life_laps}
                  onChange={(e) => setFormData(prev => ({ ...prev, expected_life_laps: parseInt(e.target.value) }))}
                  className="w-full p-3 rounded-lg"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Refresh Threshold (%)</label>
                <input
                  type="number"
                  value={formData.refresh_threshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, refresh_threshold: parseInt(e.target.value) }))}
                  className="w-full p-3 rounded-lg"
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-3 rounded-lg"
                rows={3}
                placeholder="Additional notes about this motor..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Motor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<MotorEvent, 'id' | 'created_at'>) => void;
  motorId: string;
  loading: boolean;
}

function AddEventModal({ isOpen, onClose, onSave, motorId, loading }: AddEventModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    event_type: 'race' as 'race' | 'practice' | 'maintenance',
    laps: 0,
    average_rpm: 0,
    max_rpm: 0,
    track_name: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      motor_id: motorId,
      ...formData
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      event_type: 'race',
      laps: 0,
      average_rpm: 0,
      max_rpm: 0,
      track_name: '',
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Add Motor Event</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-3 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Event Type *</label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value as 'race' | 'practice' | 'maintenance' }))}
                  className="w-full p-3 rounded-lg"
                  required
                >
                  <option value="race">Race</option>
                  <option value="practice">Practice</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Track Name</label>
              <input
                type="text"
                value={formData.track_name}
                onChange={(e) => setFormData(prev => ({ ...prev, track_name: e.target.value }))}
                className="w-full p-3 rounded-lg"
                placeholder="e.g., Knoxville Raceway, Eldora Speedway"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Laps *</label>
                <input
                  type="number"
                  value={formData.laps}
                  onChange={(e) => setFormData(prev => ({ ...prev, laps: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 rounded-lg"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Average RPM</label>
                <input
                  type="number"
                  value={formData.average_rpm}
                  onChange={(e) => setFormData(prev => ({ ...prev, average_rpm: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 rounded-lg"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max RPM</label>
                <input
                  type="number"
                  value={formData.max_rpm}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_rpm: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 rounded-lg"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-3 rounded-lg"
                rows={3}
                placeholder="Event notes, observations, issues, etc."
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Add Event
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

interface MotorDetailModalProps {
  motor: Motor | null;
  events: MotorEvent[];
  onClose: () => void;
  onAddEvent: () => void;
  onEditMotor: () => void;
  onDeleteMotor: () => void;
  eventsLoading: boolean;
}

function MotorDetailModal({ 
  motor, 
  events, 
  onClose, 
  onAddEvent, 
  onEditMotor, 
  onDeleteMotor,
  eventsLoading 
}: MotorDetailModalProps) {
  if (!motor) return null;

  const healthPercentage = Math.max(0, 100 - (motor.total_laps / motor.expected_life_laps) * 100);
  const needsRefresh = healthPercentage <= motor.refresh_threshold;
  const typeInfo = MOTOR_TYPE_INFO[motor.motor_type as keyof typeof MOTOR_TYPE_INFO];

  const getHealthColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBgColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{motor.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{typeInfo?.name || motor.motor_type}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Motor Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Motor Health</h3>
                <div className="flex items-center gap-2">
                  <Activity className={`w-6 h-6 ${getHealthColor(healthPercentage)}`} />
                  <span className={`text-2xl font-bold ${getHealthColor(healthPercentage)}`}>
                    {Math.round(healthPercentage)}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${getHealthBgColor(healthPercentage)}`}
                  style={{ width: `${healthPercentage}%` }}
                />
              </div>

              {needsRefresh && (
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Refresh Recommended</span>
                </div>
              )}
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-4">Motor Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Laps</span>
                  <span className="font-semibold">{motor.total_laps.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Effective Laps</span>
                  <span className="font-semibold">{motor.effective_laps.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Expected Life</span>
                  <span className="font-semibold">{motor.expected_life_laps.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Engine Class</span>
                  <span className="font-semibold">{motor.engine_class || 'Not specified'}</span>
                </div>
                {motor.last_serviced && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Serviced</span>
                    <span className="font-semibold">
                      {new Date(motor.last_serviced).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={onAddEvent}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Event
            </button>
            <button
              onClick={onEditMotor}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit Motor
            </button>
            <button
              onClick={onDeleteMotor}
              className="btn-danger flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete Motor
            </button>
          </div>

          {/* Motor Events History */}
          <div className="glass-panel p-6">
            <h3 className="text-xl font-bold mb-4">Event History</h3>
            
            {eventsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No events recorded yet</p>
                <button
                  onClick={onAddEvent}
                  className="btn-primary mt-4 flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Add First Event
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {events.map((event) => (
                  <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          event.event_type === 'race' ? 'bg-red-500' :
                          event.event_type === 'practice' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <span className="font-semibold capitalize">{event.event_type}</span>
                        {event.track_name && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600 dark:text-gray-400">{event.track_name}</span>
                          </>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Laps:</span>
                        <span className="ml-2 font-medium">{event.laps}</span>
                      </div>
                      {event.average_rpm && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Avg RPM:</span>
                          <span className="ml-2 font-medium">{event.average_rpm.toLocaleString()}</span>
                        </div>
                      )}
                      {event.max_rpm && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Max RPM:</span>
                          <span className="ml-2 font-medium">{event.max_rpm.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {event.notes && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{event.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Motor Type Information */}
          {typeInfo && (
            <div className="glass-panel p-6 mt-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                {typeInfo.name} Information
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{typeInfo.description}</p>
              
              <div>
                <h4 className="font-semibold mb-2">Maintenance Tips:</h4>
                <ul className="space-y-1">
                  {typeInfo.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-brand-gold mt-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function MotorWear() {
  const { user } = useAuth();
  const { 
    saveMotor, 
    addMotorEvent, 
    loadMotors, 
    loadMotorEvents, 
    updateMotor,
    deleteMotor,
    loading, 
    error 
  } = useMotorHealth();

  const [motors, setMotors] = useState<Motor[]>([]);
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);
  const [motorEvents, setMotorEvents] = useState<MotorEvent[]>([]);
  const [showAddMotorModal, setShowAddMotorModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditMotorModal, setShowEditMotorModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);

  useEffect(() => {
    if (user) {
      loadMotorsData();
    }
  }, [user]);

  const loadMotorsData = async () => {
    const motorsData = await loadMotors();
    setMotors(motorsData);
  };

  const loadMotorEventsData = async (motorId: string) => {
    setEventsLoading(true);
    const events = await loadMotorEvents(motorId);
    setMotorEvents(events);
    setEventsLoading(false);
  };

  const handleAddMotor = async (motorData: Partial<Motor>) => {
    const result = await saveMotor(motorData);
    if (result) {
      await loadMotorsData();
      setShowAddMotorModal(false);
    }
  };

  const handleAddEvent = async (eventData: Omit<MotorEvent, 'id' | 'created_at'>) => {
    const result = await addMotorEvent(eventData);
    if (result && selectedMotor) {
      await loadMotorEventsData(selectedMotor.id);
      await loadMotorsData(); // Reload to update lap counts
      setShowAddEventModal(false);
    }
  };

  const handleMotorSelect = async (motor: Motor) => {
    setSelectedMotor(motor);
    await loadMotorEventsData(motor.id);
  };

  const handleDeleteMotor = async (motorId: string) => {
    if (deleteStep === 1) {
      setDeleteStep(2);
      return;
    }

    const success = await deleteMotor(motorId);
    if (success) {
      setMotors(prev => prev.filter(m => m.id !== motorId));
      setShowDeleteConfirm(null);
      setSelectedMotor(null);
      setDeleteStep(1);
    }
  };

  const calculateHealthPercentage = (totalLaps: number, expectedLife: number) => {
    return Math.max(0, 100 - (totalLaps / expectedLife) * 100);
  };

  const getHealthColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBgColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-red-600 dark:text-red-400">Motor Health Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage your racing engines across all categories
            </p>
          </div>
          
          <button
            onClick={() => setShowAddMotorModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Motor
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Motor Type Information */}
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-bold mb-6">Racing Motor Life Expectancy Guide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(MOTOR_TYPE_INFO).map(([key, info]) => (
            <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{info.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Expected Life:</span>
                  <span className="font-medium">{info.expectedLife.toLocaleString()} laps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Refresh at:</span>
                  <span className="font-medium">{info.refreshThreshold}% health</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 line-clamp-3">
                {info.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Motors Dashboard */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Motors</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {motors.length} of 7 motors maximum per category
          </div>
        </div>

        {loading && motors.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
          </div>
        ) : motors.length === 0 ? (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Motors Added Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start tracking your racing engines by adding your first motor.
            </p>
            <button
              onClick={() => setShowAddMotorModal(true)}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Add Your First Motor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {motors.map((motor) => {
                const healthPercentage = calculateHealthPercentage(motor.total_laps, motor.expected_life_laps);
                const needsRefresh = healthPercentage <= motor.refresh_threshold;
                const typeInfo = MOTOR_TYPE_INFO[motor.motor_type as keyof typeof MOTOR_TYPE_INFO];
                
                return (
                  <motion.div 
                    key={motor.id}
                    className="glass-panel p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    onClick={() => handleMotorSelect(motor)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold truncate">{motor.name}</h3>
                      <div className="flex items-center gap-2">
                        <Activity className={`w-6 h-6 ${getHealthColor(healthPercentage)}`} />
                        <span className={`text-lg font-bold ${getHealthColor(healthPercentage)}`}>
                          {Math.round(healthPercentage)}%
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {typeInfo?.name || motor.motor_type} • {motor.engine_class || 'Unspecified Class'}
                    </p>

                    {/* Health Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${getHealthBgColor(healthPercentage)}`}
                        style={{ width: `${healthPercentage}%` }}
                      />
                    </div>

                    {/* Status Alert */}
                    {needsRefresh && (
                      <div className="mb-4 p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs font-medium">Refresh Recommended</span>
                      </div>
                    )}

                    {/* Motor Stats */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Laps</span>
                        <span className="font-semibold">{motor.total_laps.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Expected Life</span>
                        <span className="font-semibold">{motor.expected_life_laps.toLocaleString()}</span>
                      </div>
                      {motor.last_serviced && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Last Serviced</span>
                          <span className="font-semibold">
                            {new Date(motor.last_serviced).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {motor.notes && (
                      <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{motor.notes}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 text-center">
          <Database className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{motors.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Motors</div>
        </div>

        <div className="glass-panel p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {motors.filter(motor => 
              calculateHealthPercentage(motor.total_laps, motor.expected_life_laps) > motor.refresh_threshold
            ).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Healthy</div>
        </div>

        <div className="glass-panel p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {motors.filter(motor => {
              const health = calculateHealthPercentage(motor.total_laps, motor.expected_life_laps);
              return health <= motor.refresh_threshold && health > 20;
            }).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Need Service</div>
        </div>

        <div className="glass-panel p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {motors.filter(motor => 
              calculateHealthPercentage(motor.total_laps, motor.expected_life_laps) <= 20
            ).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Critical</div>
        </div>
      </div>

      {/* Modals */}
      <AddMotorModal
        isOpen={showAddMotorModal}
        onClose={() => setShowAddMotorModal(false)}
        onSave={handleAddMotor}
        loading={loading}
      />

      <AddEventModal
        isOpen={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
        onSave={handleAddEvent}
        motorId={selectedMotor?.id || ''}
        loading={loading}
      />

      <MotorDetailModal
        motor={selectedMotor}
        events={motorEvents}
        onClose={() => setSelectedMotor(null)}
        onAddEvent={() => setShowAddEventModal(true)}
        onEditMotor={() => setShowEditMotorModal(true)}
        onDeleteMotor={() => setShowDeleteConfirm(selectedMotor?.id || null)}
        eventsLoading={eventsLoading}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <h3 className="text-xl font-bold">Delete Motor - Step {deleteStep} of 2</h3>
              </div>
              
              {deleteStep === 1 ? (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete this motor? This will permanently remove all associated events and data.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(null);
                        setDeleteStep(1);
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteMotor(showDeleteConfirm)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Continue to Step 2
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-red-600 dark:text-red-400 mb-6 font-medium">
                    FINAL CONFIRMATION: This action cannot be undone. All motor data and events will be permanently deleted.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(null);
                        setDeleteStep(1);
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteMotor(showDeleteConfirm)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          Delete Permanently
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default MotorWear;