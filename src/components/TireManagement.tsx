import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, Gauge, Settings, Save, Plus, Trash2,
  RefreshCw, AlertCircle, Loader2, CheckCircle, Calendar,
  FileText, BarChart2, Download, Upload, Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NumberInput from './NumberInput';

interface TireDetail {
  id: string;
  manufacturer: string;
  compound: string;
  car: string;
  vendor: string;
  dateNew: string;
  corner: string;
  wheel: string;
  rollout: string;
  setNumber: string;
  offset: string;
  rimWidth: string;
  rimOffset: string;
  matchingTireId?: string;
  matchingPosition?: 'left' | 'right';
  shortCode: string;
  serialNumber: string;
  dateCode: string;
  group: string;
  tireSize: string;
  inflatedSize: string;
  durometer: string;
  springRate: string;
  condition: number;
  comment: string;
  runs: number;
  laps: number;
  active: boolean;
}

interface TireSet {
  id: string;
  name: string;
  leftTireId: string;
  rightTireId: string;
  position: 'front' | 'rear';
  totalLaps: number;
  averageRollout: string;
  offsetDifference: string;
  dateCreated: string;
  lastUsed: string;
  notes: string;
}

function TireManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedTire, setSelectedTire] = useState<TireDetail | null>(null);
  const [showSetModal, setShowSetModal] = useState(false);
  const [selectedField, setSelectedField] = useState<{
    fieldKey: string;
    title: string;
  } | null>(null);
  const [tireSets, setTireSets] = useState<TireSet[]>([]);
  const [filter, setFilter] = useState<'all' | 'active'>('all');

  const initialTireDetail: TireDetail = {
    id: crypto.randomUUID(),
    manufacturer: '',
    compound: '',
    car: 'All Cars',
    vendor: '',
    dateNew: new Date().toISOString().split('T')[0],
    corner: '',
    wheel: '',
    rollout: '',
    setNumber: '',
    offset: '',
    rimWidth: '',
    rimOffset: '',
    shortCode: '',
    serialNumber: '',
    dateCode: '',
    group: '',
    tireSize: '',
    inflatedSize: '',
    durometer: '',
    springRate: '',
    condition: 5,
    comment: '',
    runs: 0,
    laps: 0,
    active: true
  };

  const [tireDetail, setTireDetail] = useState<TireDetail>(initialTireDetail);

  const manufacturers = [
    'Hoosier',
    'American Racer',
    'Goodyear',
    'McCreary',
    'Other'
  ];

  const compounds = {
    'Hoosier': ['D12', 'D15', 'D25', 'D35', 'D55', 'RD12', 'RD15', 'RD20'],
    'American Racer': ['M28', 'M32', 'M44', 'SD44', 'SD48'],
    'Goodyear': ['D10', 'D12', 'D14', 'D16'],
    'McCreary': ['M28', 'M32', 'M44'],
    'Other': ['Custom']
  };

  const corners = ['Left Front', 'Right Front', 'Left Rear', 'Right Rear'];
  const rimWidths = ['10"', '12"', '14"', '15"', '16"'];

  const rimOffsets = [
    { value: '-4', label: '-4 inches' },
    { value: '-3', label: '-3 inches' },
    { value: '-2', label: '-2 inches' },
    { value: '-1', label: '-1 inch' },
    { value: '0', label: '0 (neutral)' },
    { value: '1', label: '+1 inch' },
    { value: '2', label: '+2 inches' },
    { value: '3', label: '+3 inches' },
    { value: '4', label: '+4 inches' }
  ];

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    
    try {
      // Save logic will be implemented here
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Error saving tire details:', err);
      setError('Failed to save tire details');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Export tire data as CSV
    const csvContent = `Pit Logic Tire,,,,,,,Exported:,${new Date().toLocaleDateString()},,
Tire:,,,,Car:,${tireDetail.car},,,,,
Mfg:,${tireDetail.manufacturer},,,,Compound:,${tireDetail.compound},,,,
Vendor:,${tireDetail.vendor},,,,Date New:,${tireDetail.dateNew},,,,,
Corner:,${tireDetail.corner},,,,Wheel:,${tireDetail.wheel},,,,,
Date Code:,${tireDetail.dateCode},,,,Group:,${tireDetail.group},,,,
Size:,${tireDetail.tireSize},,,,Inflated:,${tireDetail.inflatedSize},,,,
Durometer:,${tireDetail.durometer},,,,Spring Rate:,${tireDetail.springRate},,,,
Comment:,${tireDetail.comment},,,,,,,,,,
`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tire_${tireDetail.id}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleNumberClick = (field: keyof TireDetail, title: string) => {
    setSelectedField({
      fieldKey: field,
      title
    });
  };

  return (
    <>
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-brand-gold text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All Tires
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${
              filter === 'active'
                ? 'bg-brand-gold text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Active Only
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setSelectedTire(null)}
            className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 px-4 py-2"
          >
            <Plus className="w-5 h-5" />
            <span className="whitespace-nowrap">New Tire</span>
          </button>
          <button 
            className="flex-1 sm:flex-none btn-secondary flex items-center justify-center gap-2 px-4 py-2"
          >
            <BarChart2 className="w-5 h-5" />
            <span className="whitespace-nowrap">Analytics</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex-1 sm:flex-none btn-secondary flex items-center justify-center gap-2 px-4 py-2"
          >
            <Download className="w-5 h-5" />
            <span className="whitespace-nowrap">Export</span>
          </button>
          <button 
            className="flex-1 sm:flex-none btn-secondary flex items-center justify-center gap-2 px-4 py-2"
          >
            <Upload className="w-5 h-5" />
            <span className="whitespace-nowrap">Import</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Manufacturer</label>
          <select 
            value={tireDetail.manufacturer}
            onChange={(e) => setTireDetail(prev => ({ ...prev, manufacturer: e.target.value }))}
            className="w-full p-2 rounded-lg"
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map(mfg => (
              <option key={mfg} value={mfg}>{mfg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Compound</label>
          <select 
            value={tireDetail.compound}
            onChange={(e) => setTireDetail(prev => ({ ...prev, compound: e.target.value }))}
            className="w-full p-2 rounded-lg"
          >
            <option value="">Select Compound</option>
            {tireDetail.manufacturer && compounds[tireDetail.manufacturer as keyof typeof compounds].map(compound => (
              <option key={compound} value={compound}>{compound}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Corner</label>
          <select 
            value={tireDetail.corner}
            onChange={(e) => setTireDetail(prev => ({ ...prev, corner: e.target.value }))}
            className="w-full p-2 rounded-lg"
          >
            <option value="">Select Corner</option>
            {corners.map(corner => (
              <option key={corner} value={corner}>{corner}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date New</label>
          <input
            type="date"
            value={tireDetail.dateNew}
            onChange={(e) => setTireDetail(prev => ({ ...prev, dateNew: e.target.value }))}
            className="w-full p-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tire Size</label>
          <button
            onClick={() => handleNumberClick('tireSize', 'Enter Tire Size')}
            className="w-full p-2 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600"
          >
            {tireDetail.tireSize || 'Click to enter size'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Durometer</label>
          <button
            onClick={() => handleNumberClick('durometer', 'Enter Durometer')}
            className="w-full p-2 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600"
          >
            {tireDetail.durometer || 'Click to enter durometer'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rollout</label>
          <button
            onClick={() => handleNumberClick('rollout', 'Enter Rollout')}
            className="w-full p-2 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600"
          >
            {tireDetail.rollout || 'Click to enter rollout'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rim Width</label>
          <select
            value={tireDetail.rimWidth}
            onChange={(e) => setTireDetail(prev => ({ ...prev, rimWidth: e.target.value }))}
            className="w-full p-2 rounded-lg"
          >
            <option value="">Select Width</option>
            {rimWidths.map(width => (
              <option key={width} value={width}>{width}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rim Offset</label>
          <select
            value={tireDetail.rimOffset}
            onChange={(e) => setTireDetail(prev => ({ ...prev, rimOffset: e.target.value }))}
            className="w-full p-2 rounded-lg"
          >
            <option value="">Select Offset</option>
            {rimOffsets.map(offset => (
              <option key={offset.value} value={offset.value}>{offset.label}</option>
            ))}
          </select>
        </div>

        {/* Condition Rating */}
        <div className="col-span-full">
          <label className="block text-sm font-medium mb-2">Condition</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setTireDetail(prev => ({ ...prev, condition: rating }))}
                className={`w-8 h-8 rounded-full ${
                  rating <= tireDetail.condition
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="col-span-full">
          <label className="block text-sm font-medium mb-1">Comments</label>
          <textarea
            value={tireDetail.comment}
            onChange={(e) => setTireDetail(prev => ({ ...prev, comment: e.target.value }))}
            className="w-full p-2 rounded-lg"
            rows={4}
            placeholder="Add notes about the tire..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setTireDetail(initialTireDetail)}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Tire
            </>
          )}
        </button>
      </div>

      {/* Numeric Input Modal */}
      {selectedField && (
        <NumberInput
          value={tireDetail[selectedField.fieldKey as keyof TireDetail] as string}
          onChange={(value) => {
            setTireDetail(prev => ({
              ...prev,
              [selectedField.fieldKey]: value
            }));
            setSelectedField(null);
          }}
          title={selectedField.title}
          onClose={() => setSelectedField(null)}
        />
      )}
    </>
  );
}

export default TireManagement;