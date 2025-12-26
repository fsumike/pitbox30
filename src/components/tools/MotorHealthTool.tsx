import React, { useState } from 'react';
import { Activity, AlertTriangle, Plus, Loader2, Trash2, Save, Gauge, TrendingUp, Info } from 'lucide-react';
import { useMotorHealth, Motor } from '../../hooks/useMotorHealth';
import { useAuth } from '../../contexts/AuthContext';

const MOTOR_PRESETS = {
  'Sprint Car 360': {
    expected_life_laps: 1000,
    lap_range: '800-1,200',
    refresh_threshold: 80,
    typical_rpm_range: '7800-8200',
    notes: 'ASCS-style 360s; some stretch to 1,500 with careful tuning.'
  },
  'Sprint Car 410': {
    expected_life_laps: 700,
    lap_range: '500-900',
    refresh_threshold: 80,
    typical_rpm_range: '8000-8400',
    notes: 'Higher horsepower & RPM = shorter life. World of Outlaws teams rebuild often.'
  },
  'Sprint Car Crate': {
    expected_life_laps: 1750,
    lap_range: '1,500-2,000',
    refresh_threshold: 80,
    typical_rpm_range: '6800-7200',
    notes: 'Factory-sealed crate motors (e.g., GM 604) are lower-stress, longer-lived.'
  },
  'Modified Big Block': {
    expected_life_laps: 1250,
    lap_range: '1,000-1,500',
    refresh_threshold: 80,
    typical_rpm_range: '6500-7000',
    notes: 'Powerful but not run as hard as sprint motors; depends on track size.'
  },
  'Modified Small Block': {
    expected_life_laps: 1500,
    lap_range: '1,200-1,800',
    refresh_threshold: 80,
    typical_rpm_range: '7000-7500',
    notes: 'Slightly less stress than big block; better lap longevity.'
  },
  'Modified Crate': {
    expected_life_laps: 2150,
    lap_range: '1,800-2,500',
    refresh_threshold: 80,
    typical_rpm_range: '6200-6800',
    notes: 'Similar to crate Late Models; lower RPM = longer life.'
  },
  'Late Model Crate': {
    expected_life_laps: 2150,
    lap_range: '1,800-2,500',
    refresh_threshold: 80,
    typical_rpm_range: '6500-7000',
    notes: 'Sealed crate (e.g., GM 604/602); longevity depends on track conditions.'
  },
  'Late Model Open': {
    expected_life_laps: 1000,
    lap_range: '800-1,200',
    refresh_threshold: 80,
    typical_rpm_range: '7500-8000',
    notes: 'Custom-built, high-compression engines; high power means shorter life.'
  },
  'Super Late Model': {
    expected_life_laps: 850,
    lap_range: '700-1,000',
    refresh_threshold: 80,
    typical_rpm_range: '7800-8500',
    notes: 'Equivalent to national-level open engines; extremely high stress.'
  },
  'Midget': {
    expected_life_laps: 800,
    lap_range: '600-1,000',
    refresh_threshold: 80,
    typical_rpm_range: '7500-8000',
    notes: 'High RPM, short tracks; rebuild frequency similar to 410 sprint engines.'
  },
  'Micro Sprint': {
    expected_life_laps: 1250,
    lap_range: '1,000-1,500',
    refresh_threshold: 80,
    typical_rpm_range: '6500-7200',
    notes: 'Motorcycle-based 600cc engines; some run longer with regular oil changes.'
  },
  'Mini Sprint': {
    expected_life_laps: 1000,
    lap_range: '800-1,200',
    refresh_threshold: 80,
    typical_rpm_range: '7000-7500',
    notes: 'Larger motorcycle-style 1000cc engines; heat cycles limit lifespan.'
  },
  'Custom': {
    expected_life_laps: 1300,
    lap_range: '600-2,000+',
    refresh_threshold: 80,
    typical_rpm_range: '6000-8000',
    notes: 'Depends on build & application. Could range 600-2,000+ laps.'
  }
};

export default function MotorHealthTool() {
  const { user } = useAuth();
  const { motors, loading, saveMotor, updateMotor, deleteMotor, addMotorEvent } = useMotorHealth();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const [newMotor, setNewMotor] = useState({
    name: '',
    engine_class: 'Sprint Car 360',
    motor_type: '',
    description: '',
    expected_life_laps: 350,
    refresh_threshold: 75,
    notes: ''
  });

  const [newEvent, setNewEvent] = useState({
    date: new Date().toISOString().split('T')[0],
    event_type: 'race' as 'race' | 'practice' | 'maintenance',
    laps: 0,
    track_name: '',
    average_rpm: 0,
    max_rpm: 0,
    notes: ''
  });

  const handlePresetChange = (engineClass: string) => {
    const preset = MOTOR_PRESETS[engineClass as keyof typeof MOTOR_PRESETS];
    setNewMotor(prev => ({
      ...prev,
      engine_class: engineClass,
      expected_life_laps: preset.expected_life_laps,
      refresh_threshold: preset.refresh_threshold
    }));
  };

  const handleAddMotor = async () => {
    if (!user || !newMotor.name.trim()) {
      alert('Please enter a motor name');
      return;
    }

    const result = await saveMotor(newMotor);
    if (result) {
      setNewMotor({
        name: '',
        engine_class: 'Sprint Car 360',
        motor_type: '',
        description: '',
        expected_life_laps: 350,
        refresh_threshold: 75,
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const handleAddEvent = async () => {
    if (!selectedMotor || !selectedMotor.id || newEvent.laps <= 0) {
      alert('Please enter lap count');
      return;
    }

    const result = await addMotorEvent({
      motor_id: selectedMotor.id,
      ...newEvent
    });

    if (result) {
      setNewEvent({
        date: new Date().toISOString().split('T')[0],
        event_type: 'race',
        laps: 0,
        track_name: '',
        average_rpm: 0,
        max_rpm: 0,
        notes: ''
      });
      setShowEventForm(false);
      setSelectedMotor(null);
    }
  };

  const handleDeleteClick = (motorId: string) => {
    setDeleteConfirm(motorId);
  };

  const handleDeleteConfirm = async (motorId: string) => {
    await deleteMotor(motorId);
    setDeleteConfirm(null);
  };

  const getHealthColor = (percent: number) => {
    if (percent > 50) return 'text-green-600';
    if (percent > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBgColor = (percent: number) => {
    if (percent > 50) return 'bg-green-600';
    if (percent > 25) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">Sign in to track motor health</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Track engine hours, RPMs, maintenance schedules, and performance data
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  if (showEventForm && selectedMotor) {
    const currentLaps = selectedMotor.total_laps || 0;
    const healthPercent = selectedMotor.expected_life_laps
      ? ((selectedMotor.expected_life_laps - currentLaps) / selectedMotor.expected_life_laps) * 100
      : 100;
    const preset = MOTOR_PRESETS[selectedMotor.engine_class as keyof typeof MOTOR_PRESETS];

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setShowEventForm(false);
              setSelectedMotor(null);
            }}
            className="text-brand-gold hover:text-brand-gold-dark font-semibold"
          >
            ← Back to Motors
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-2xl p-5 sm:p-6 shadow-lg">
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">{selectedMotor.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedMotor.engine_class}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Current Laps</p>
              <p className="text-2xl sm:text-3xl font-bold">{currentLaps}</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Expected Life</p>
              <p className="text-2xl sm:text-3xl font-bold">{selectedMotor.expected_life_laps}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Motor Health</span>
              <span className={`font-bold ${getHealthColor(healthPercent)}`}>{Math.round(healthPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${getHealthBgColor(healthPercent)}`}
                style={{ width: `${Math.max(0, Math.min(100, healthPercent))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Save className="w-6 h-6 text-brand-gold" />
            Add Racing Session
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Date *</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors"
                style={{ minHeight: '48px' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Event Type *</label>
              <select
                value={newEvent.event_type}
                onChange={(e) => setNewEvent(prev => ({ ...prev, event_type: e.target.value as any }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors"
                style={{ minHeight: '48px' }}
              >
                <option value="race">Race</option>
                <option value="practice">Practice</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Laps Run *</label>
            <input
              type="number"
              value={newEvent.laps || ''}
              onChange={(e) => setNewEvent(prev => ({ ...prev, laps: parseInt(e.target.value) || 0 }))}
              placeholder="Enter number of laps"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors text-lg font-medium"
              style={{ minHeight: '52px' }}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold">RPM Tracking</h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Typical range for {selectedMotor.engine_class}: {preset?.typical_rpm_range || 'N/A'} RPM
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Average RPM</label>
                <input
                  type="number"
                  value={newEvent.average_rpm || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, average_rpm: parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 8000"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none"
                  style={{ minHeight: '48px' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max RPM</label>
                <input
                  type="number"
                  value={newEvent.max_rpm || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, max_rpm: parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 8400"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none"
                  style={{ minHeight: '48px' }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Track Name</label>
            <input
              type="text"
              value={newEvent.track_name}
              onChange={(e) => setNewEvent(prev => ({ ...prev, track_name: e.target.value }))}
              placeholder="e.g., Williams Grove Speedway"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors"
              style={{ minHeight: '48px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={newEvent.notes}
              onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any notes about the session..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleAddEvent}
            disabled={loading || newEvent.laps <= 0}
            className="w-full py-4 bg-gradient-to-r from-brand-gold to-orange-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 font-bold text-lg inline-flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ minHeight: '56px' }}
          >
            <Save className="w-6 h-6" />
            Save Session
          </button>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    const preset = MOTOR_PRESETS[newMotor.engine_class as keyof typeof MOTOR_PRESETS];

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-bold">Add New Motor</h3>
          <button
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Motor Name *</label>
            <input
              type="text"
              value={newMotor.name}
              onChange={(e) => setNewMotor(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Primary 410, Backup 360"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors text-lg"
              style={{ minHeight: '52px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Engine Class *</label>
            <select
              value={newMotor.engine_class}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors text-lg font-medium"
              style={{ minHeight: '52px' }}
            >
              {Object.keys(MOTOR_PRESETS).map(presetKey => (
                <option key={presetKey} value={presetKey}>{presetKey}</option>
              ))}
            </select>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-xl p-4">
            <p className="text-sm font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              AI-Calculated Values for {newMotor.engine_class}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="text-gray-600 dark:text-gray-400 text-xs">Expected Life:</span>
                <p className="font-bold text-lg">{newMotor.expected_life_laps} laps</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="text-gray-600 dark:text-gray-400 text-xs">Typical RPM:</span>
                <p className="font-bold text-lg">{preset?.typical_rpm_range}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 italic">
              {preset?.notes}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Motor Type / Builder</label>
            <input
              type="text"
              value={newMotor.motor_type}
              onChange={(e) => setNewMotor(prev => ({ ...prev, motor_type: e.target.value }))}
              placeholder="e.g., Kistler, Weikert, Allen's"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors"
              style={{ minHeight: '48px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <input
              type="text"
              value={newMotor.description}
              onChange={(e) => setNewMotor(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Fresh rebuild, race ready"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors"
              style={{ minHeight: '48px' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Expected Life (laps)</label>
              <input
                type="number"
                value={newMotor.expected_life_laps}
                onChange={(e) => setNewMotor(prev => ({ ...prev, expected_life_laps: parseInt(e.target.value) || 500 }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors"
                style={{ minHeight: '48px' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Refresh at (%)</label>
              <input
                type="number"
                value={newMotor.refresh_threshold}
                onChange={(e) => setNewMotor(prev => ({ ...prev, refresh_threshold: parseInt(e.target.value) || 75 }))}
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors"
                style={{ minHeight: '48px' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={newMotor.notes}
              onChange={(e) => setNewMotor(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-brand-gold focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleAddMotor}
            disabled={loading || !newMotor.name.trim()}
            className="w-full py-4 bg-gradient-to-r from-brand-gold to-orange-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 font-bold text-lg transition-all active:scale-95"
            style={{ minHeight: '56px' }}
          >
            Add Motor
          </button>
        </div>
      </div>
    );
  }

  if (motors.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center py-12 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-2xl shadow-lg">
          <Activity className="w-16 h-16 mx-auto mb-4 text-brand-gold" />
          <h3 className="text-xl sm:text-2xl font-bold mb-2">No motors tracked yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 px-4">
            Start tracking your engine health, RPMs, and rebuild schedules
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-8 py-4 bg-gradient-to-r from-brand-gold to-orange-500 text-white rounded-xl hover:shadow-lg inline-flex items-center gap-2 font-bold text-lg transition-all active:scale-95"
            style={{ minHeight: '56px' }}
          >
            <Plus className="w-6 h-6" />
            Add Your First Motor
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-brand-gold" />
              AI-Calculated Motor Life Expectancy
            </h4>
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="text-brand-gold hover:text-brand-gold-dark font-medium text-sm"
            >
              {showPresets ? 'Hide' : 'Show All'}
            </button>
          </div>

          {showPresets && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {Object.entries(MOTOR_PRESETS).map(([name, preset]) => (
                <div key={name} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-base">{name}</span>
                    <span className="text-brand-gold font-bold text-sm">{preset.lap_range}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p><span className="font-semibold">Typical:</span> {preset.expected_life_laps} laps</p>
                    <p><span className="font-semibold">RPM:</span> {preset.typical_rpm_range}</p>
                    <p className="italic">{preset.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showPresets && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click "Show All" to see detailed engine life expectancy for all motor types based on real-world racing data, RPM ranges, and rebuild cycles.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-xs">
                <h5 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Important Notes
                </h5>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Rebuild = refresh,</strong> not full replacement (bearings, rings, valve work, etc.)</li>
                  <li>• <strong>"Hard" laps</strong> (tacky track, heavy throttle) wear engines faster than "slick" track laps</li>
                  <li>• <strong>Time-based rebuilds</strong> (20-30 engine hours) are common in higher-tier teams</li>
                  <li>• <strong>Oil analysis</strong> and compression/leakdown testing can extend intervals safely</li>
                  <li>• Refresh threshold set at <strong>80%</strong> to give proper warning before critical wear</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Activity className="w-7 h-7 text-brand-gold" />
          Your Motors
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-brand-gold to-orange-500 text-white rounded-xl hover:shadow-lg inline-flex items-center gap-2 font-bold transition-all active:scale-95"
          style={{ minHeight: '48px' }}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Motor</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {motors.map((motor) => {
          const currentLaps = motor.total_laps || 0;
          const healthPercent = motor.expected_life_laps
            ? ((motor.expected_life_laps - currentLaps) / motor.expected_life_laps) * 100
            : 100;
          const isDeleteConfirm = deleteConfirm === motor.id;

          return (
            <div key={motor.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-brand-gold transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg truncate">{motor.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{motor.engine_class}</p>
                  {motor.motor_type && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">{motor.motor_type}</p>
                  )}
                </div>
                <Activity className={`w-6 h-6 flex-shrink-0 ml-2 ${getHealthColor(healthPercent)}`} />
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Current</span>
                    <span className="font-bold text-lg">{currentLaps}</span>
                    <span className="text-xs text-gray-500 ml-1">laps</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Life</span>
                    <span className="font-bold text-lg">{motor.expected_life_laps}</span>
                    <span className="text-xs text-gray-500 ml-1">laps</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-semibold">Motor Health</span>
                    <span className={`font-bold text-sm ${getHealthColor(healthPercent)}`}>
                      {Math.round(healthPercent)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${getHealthBgColor(healthPercent)}`}
                      style={{ width: `${Math.max(0, Math.min(100, healthPercent))}%` }}
                    />
                  </div>
                </div>

                {healthPercent < motor.refresh_threshold && (
                  <div className="flex items-center gap-2 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 px-3 rounded-lg font-medium">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Refresh recommended</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {!isDeleteConfirm ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedMotor(motor);
                          setShowEventForm(true);
                        }}
                        className="flex-1 py-3 bg-gradient-to-r from-brand-gold to-orange-500 text-white rounded-xl hover:shadow-lg font-bold inline-flex items-center justify-center gap-1 text-sm transition-all active:scale-95"
                        style={{ minHeight: '44px' }}
                      >
                        <Plus className="w-4 h-4" />
                        Add Session
                      </button>
                      <button
                        onClick={() => handleDeleteClick(motor.id!)}
                        className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        style={{ minHeight: '44px', minWidth: '44px' }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDeleteConfirm(motor.id!)}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold text-sm transition-all active:scale-95"
                        style={{ minHeight: '44px' }}
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-medium text-sm transition-colors"
                        style={{ minHeight: '44px' }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-lg flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-gold" />
            Engine Lifespan Reference Guide
          </h4>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="text-brand-gold hover:text-brand-gold-dark font-medium text-sm"
          >
            {showPresets ? 'Hide' : 'Show All'}
          </button>
        </div>

        {showPresets && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {Object.entries(MOTOR_PRESETS).map(([name, preset]) => (
                <div key={name} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-base">{name}</span>
                    <span className="text-brand-gold font-bold text-sm">{preset.lap_range}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p><span className="font-semibold">Typical:</span> {preset.expected_life_laps} laps</p>
                    <p><span className="font-semibold">RPM:</span> {preset.typical_rpm_range}</p>
                    <p className="italic">{preset.notes}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-xs">
              <h5 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                Additional Notes
              </h5>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>• <strong>Rebuild = refresh,</strong> not full replacement — often includes bearings, rings, valve work, etc.</li>
                <li>• <strong>"Hard" laps</strong> (tacky track, heavy throttle) wear an engine faster than "slick" track laps</li>
                <li>• <strong>Time-based rebuilds</strong> (e.g., every 20-30 engine hours) are also common in higher-tier teams</li>
                <li>• Proper <strong>oil analysis</strong> and compression/leakdown testing can help extend intervals safely</li>
                <li>• All motors set to <strong>80% refresh threshold</strong> for optimal maintenance scheduling</li>
              </ul>
            </div>
          </div>
        )}

        {!showPresets && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click "Show All" to see detailed engine life expectancy for all 13 motor classes.
            </p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-5 sm:p-6 shadow-lg">
        <h4 className="font-bold mb-3 flex items-center gap-2 text-lg">
          <Info className="w-6 h-6 text-orange-600" />
          Motor Health Tips
        </h4>
        <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-brand-gold font-bold">•</span>
            <span>Track lap count and RPMs after every race and practice session</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-gold font-bold">•</span>
            <span>Schedule refreshes when motor health reaches the 80% threshold</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-gold font-bold">•</span>
            <span>High RPMs reduce motor life - monitor average and max RPMs closely</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-gold font-bold">•</span>
            <span>Different engine classes have vastly different life expectancies (500-2,500 laps)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-gold font-bold">•</span>
            <span>Keep detailed records for warranty claims and resale value</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
