import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, X, Save, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Setup {
  id: string;
  car_class: string;
  location: string;
  track_conditions: string;
  date: string;
  setup_data: any;
  notes?: string;
}

interface SetupComparisonProps {
  setupA?: Setup;
  setupB?: Setup;
  onClose?: () => void;
}

export const SetupComparison: React.FC<SetupComparisonProps> = ({
  setupA: initialSetupA,
  setupB: initialSetupB,
  onClose,
}) => {
  const [setupA, setSetupA] = useState<Setup | null>(initialSetupA || null);
  const [setupB, setSetupB] = useState<Setup | null>(initialSetupB || null);
  const [userSetups, setUserSetups] = useState<Setup[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [comparisonNotes, setComparisonNotes] = useState('');

  useEffect(() => {
    loadUserSetups();
  }, []);

  const loadUserSetups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('setups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setUserSetups(data || []);
    } catch (error) {
      console.error('Error loading setups:', error);
    }
  };

  const saveComparison = async () => {
    if (!setupA || !setupB) return;

    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('setup_comparisons').insert({
        user_id: user.id,
        setup_a_id: setupA.id,
        setup_b_id: setupB.id,
        notes: comparisonNotes,
      });

      if (error) throw error;
      alert('Comparison saved successfully!');
    } catch (error) {
      console.error('Error saving comparison:', error);
      alert('Failed to save comparison');
    } finally {
      setIsSaving(false);
    }
  };

  const compareValues = (valueA: any, valueB: any) => {
    if (valueA === valueB) return <Minus className="w-4 h-4 text-gray-400" />;

    const numA = parseFloat(valueA);
    const numB = parseFloat(valueB);

    if (!isNaN(numA) && !isNaN(numB)) {
      if (numB > numA) return <TrendingUp className="w-4 h-4 text-green-600" />;
      if (numB < numA) return <TrendingDown className="w-4 h-4 text-red-600" />;
    }

    return <ArrowLeftRight className="w-4 h-4 text-blue-600" />;
  };

  const renderComparisonRow = (label: string, pathA: string[], pathB: string[]) => {
    if (!setupA || !setupB) return null;

    const getNestedValue = (obj: any, path: string[]) => {
      return path.reduce((current, key) => current?.[key], obj);
    };

    const valueA = getNestedValue(setupA.setup_data, pathA) || 'N/A';
    const valueB = getNestedValue(setupB.setup_data, pathB) || 'N/A';
    const isDifferent = valueA !== valueB;

    return (
      <tr className={isDifferent ? 'bg-yellow-50' : ''}>
        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-700 border-r">{label}</td>
        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 border-r">{valueA}</td>
        <td className="px-2 md:px-4 py-2 md:py-3 text-center border-r">
          {compareValues(valueA, valueB)}
        </td>
        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900">{valueB}</td>
      </tr>
    );
  };

  if (!setupA || !setupB) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Compare Setups</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Setup A
            </label>
            <select
              value={setupA?.id || ''}
              onChange={(e) => {
                const setup = userSetups.find((s) => s.id === e.target.value);
                setSetupA(setup || null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a setup...</option>
              {userSetups.map((setup) => (
                <option key={setup.id} value={setup.id}>
                  {setup.car_class} - {setup.location} ({new Date(setup.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Setup B
            </label>
            <select
              value={setupB?.id || ''}
              onChange={(e) => {
                const setup = userSetups.find((s) => s.id === e.target.value);
                setSetupB(setup || null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a setup...</option>
              {userSetups.map((setup) => (
                <option key={setup.id} value={setup.id}>
                  {setup.car_class} - {setup.location} ({new Date(setup.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ArrowLeftRight className="w-6 h-6" />
          Setup Comparison
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">Setup A</h3>
          <p className="text-sm text-blue-800">{setupA.location}</p>
          <p className="text-xs text-blue-600">{new Date(setupA.date).toLocaleDateString()}</p>
          <p className="text-xs text-blue-600">{setupA.track_conditions}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-bold text-green-900 mb-2">Setup B</h3>
          <p className="text-sm text-green-800">{setupB.location}</p>
          <p className="text-xs text-green-600">{new Date(setupB.date).toLocaleDateString()}</p>
          <p className="text-xs text-green-600">{setupB.track_conditions}</p>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full border border-gray-200 rounded-lg text-xs md:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left font-bold text-gray-700 border-r">Setting</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left font-bold text-blue-700 border-r">Setup A</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-center font-bold text-gray-700 border-r">Change</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left font-bold text-green-700">Setup B</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {renderComparisonRow('Left Front Spring', ['springs', 'leftFront'], ['springs', 'leftFront'])}
            {renderComparisonRow('Right Front Spring', ['springs', 'rightFront'], ['springs', 'rightFront'])}
            {renderComparisonRow('Left Rear Spring', ['springs', 'leftRear'], ['springs', 'leftRear'])}
            {renderComparisonRow('Right Rear Spring', ['springs', 'rightRear'], ['springs', 'rightRear'])}
            {renderComparisonRow('LF Shock', ['shocks', 'leftFront'], ['shocks', 'leftFront'])}
            {renderComparisonRow('RF Shock', ['shocks', 'rightFront'], ['shocks', 'rightFront'])}
            {renderComparisonRow('LR Shock', ['shocks', 'leftRear'], ['shocks', 'leftRear'])}
            {renderComparisonRow('RR Shock', ['shocks', 'rightRear'], ['shocks', 'rightRear'])}
            {renderComparisonRow('Stagger', ['tires', 'stagger'], ['tires', 'stagger'])}
            {renderComparisonRow('LF Pressure', ['tires', 'leftFrontPressure'], ['tires', 'leftFrontPressure'])}
            {renderComparisonRow('RF Pressure', ['tires', 'rightFrontPressure'], ['tires', 'rightFrontPressure'])}
            {renderComparisonRow('LR Pressure', ['tires', 'leftRearPressure'], ['tires', 'leftRearPressure'])}
            {renderComparisonRow('RR Pressure', ['tires', 'rightRearPressure'], ['tires', 'rightRearPressure'])}
            {renderComparisonRow('Cross Weight', ['weight', 'crossWeight'], ['weight', 'crossWeight'])}
            {renderComparisonRow('Rear Percentage', ['weight', 'rearPercentage'], ['weight', 'rearPercentage'])}
            {renderComparisonRow('LF Camber', ['alignment', 'leftFrontCamber'], ['alignment', 'leftFrontCamber'])}
            {renderComparisonRow('RF Camber', ['alignment', 'rightFrontCamber'], ['alignment', 'rightFrontCamber'])}
            {renderComparisonRow('LR Camber', ['alignment', 'leftRearCamber'], ['alignment', 'leftRearCamber'])}
            {renderComparisonRow('RR Camber', ['alignment', 'rightRearCamber'], ['alignment', 'rightRearCamber'])}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comparison Notes
        </label>
        <textarea
          value={comparisonNotes}
          onChange={(e) => setComparisonNotes(e.target.value)}
          placeholder="Add notes about the differences and which setup performed better..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={saveComparison}
          disabled={isSaving}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Comparison'}
        </button>
        <button
          onClick={() => {
            setSetupA(null);
            setSetupB(null);
            setComparisonNotes('');
          }}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Compare Different Setups
        </button>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
          <span>Different values</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span>Increased</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingDown className="w-4 h-4 text-red-600" />
          <span>Decreased</span>
        </div>
        <div className="flex items-center gap-1">
          <Minus className="w-4 h-4 text-gray-400" />
          <span>Same</span>
        </div>
      </div>
    </div>
  );
};
