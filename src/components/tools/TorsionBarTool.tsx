import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Calculator, Package, TrendingUp, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTorsionBars } from '../../hooks/useTorsionBars';

interface TorsionBar {
  id?: string;
  diameter: number;
  length: number;
  rate: number;
  location: 'LF' | 'RF' | 'LR' | 'RR';
  brand?: string;
  notes?: string;
  in_car: boolean;
}

export default function TorsionBarTool() {
  const { user } = useAuth();
  const { bars, loading, saveTorsionBar, deleteTorsionBar, updateTorsionBar } = useTorsionBars();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(true);

  const [newBar, setNewBar] = useState<TorsionBar>({
    diameter: 1.0,
    length: 36,
    rate: 0,
    location: 'LF',
    brand: '',
    notes: '',
    in_car: false
  });

  const [calcInputs, setCalcInputs] = useState({
    diameter: 1.0,
    length: 36,
    armLength: 12,
    shearModulus: 11500000
  });

  const calculateRate = (diameter: number, length: number, armLength: number = 12, shearModulus: number = 11500000): number => {
    const d = diameter;
    const L = length;
    const a = armLength;
    const G = shearModulus;

    const K = (G * Math.PI * Math.pow(d, 4)) / (32 * L);
    const wheelRate = K / Math.pow(a, 2);

    return Math.round(wheelRate);
  };

  useEffect(() => {
    const rate = calculateRate(calcInputs.diameter, calcInputs.length, calcInputs.armLength, calcInputs.shearModulus);
    setCalcInputs(prev => ({ ...prev, calculatedRate: rate }));
  }, [calcInputs.diameter, calcInputs.length, calcInputs.armLength, calcInputs.shearModulus]);

  const handleAddBar = async () => {
    if (!user) return;

    const barWithRate = {
      ...newBar,
      rate: calculateRate(newBar.diameter, newBar.length)
    };

    const success = await saveTorsionBar(barWithRate);
    if (success) {
      setNewBar({
        diameter: 1.0,
        length: 36,
        rate: 0,
        location: 'LF',
        brand: '',
        notes: '',
        in_car: false
      });
      setShowAddForm(false);
    }
  };

  const handleToggleInCar = async (bar: any) => {
    if (!user || !bar.id) return;
    await updateTorsionBar(bar.id, { in_car: !bar.in_car });
  };

  const handleDeleteBar = async (barId: string) => {
    if (!user || !confirm('Delete this torsion bar?')) return;
    await deleteTorsionBar(barId);
  };

  const getLocationColor = (location: string) => {
    switch (location) {
      case 'LF': return 'bg-blue-500';
      case 'RF': return 'bg-green-500';
      case 'LR': return 'bg-orange-500';
      case 'RR': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const trackRecommendations = [
    { type: 'Slick Track', lfRate: '175-200', rfRate: '200-225', lrRate: '175-200', rrRate: '200-225' },
    { type: 'Heavy Track', lfRate: '200-225', rfRate: '225-250', lrRate: '200-225', rrRate: '225-250' },
    { type: 'Tacky Track', lfRate: '150-175', rfRate: '175-200', lrRate: '150-175', rrRate: '175-200' }
  ];

  if (!user) {
    return (
      <div className="text-center py-12">
        <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">Sign in to manage torsion bars</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate rates, track inventory, and optimize your setup
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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-bold">Torsion Bar Calculator</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Diameter (inches)</label>
            <input
              type="number"
              step="0.0625"
              value={calcInputs.diameter}
              onChange={(e) => setCalcInputs(prev => ({ ...prev, diameter: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"
              style={{ minHeight: '44px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Length (inches)</label>
            <input
              type="number"
              step="1"
              value={calcInputs.length}
              onChange={(e) => setCalcInputs(prev => ({ ...prev, length: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"
              style={{ minHeight: '44px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Arm Length (inches)</label>
            <input
              type="number"
              step="0.5"
              value={calcInputs.armLength}
              onChange={(e) => setCalcInputs(prev => ({ ...prev, armLength: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"
              style={{ minHeight: '44px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Material (Shear Modulus)</label>
            <select
              value={calcInputs.shearModulus}
              onChange={(e) => setCalcInputs(prev => ({ ...prev, shearModulus: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"
              style={{ minHeight: '44px' }}
            >
              <option value="11500000">Steel (Standard)</option>
              <option value="11000000">Steel (Softer)</option>
              <option value="12000000">Steel (Harder)</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-orange-500">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Calculated Wheel Rate</p>
            <p className="text-4xl font-bold text-orange-600">
              {calculateRate(calcInputs.diameter, calcInputs.length, calcInputs.armLength, calcInputs.shearModulus)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">lbs/in</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Track Condition Recommendations</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-200 dark:border-blue-800">
                <th className="text-left py-2 px-2">Track Type</th>
                <th className="text-center py-2 px-2">LF</th>
                <th className="text-center py-2 px-2">RF</th>
                <th className="text-center py-2 px-2">LR</th>
                <th className="text-center py-2 px-2">RR</th>
              </tr>
            </thead>
            <tbody>
              {trackRecommendations.map((rec, idx) => (
                <tr key={idx} className="border-b border-blue-100 dark:border-blue-900/50">
                  <td className="py-2 px-2 font-medium">{rec.type}</td>
                  <td className="text-center py-2 px-2">{rec.lfRate}</td>
                  <td className="text-center py-2 px-2">{rec.rfRate}</td>
                  <td className="text-center py-2 px-2">{rec.lrRate}</td>
                  <td className="text-center py-2 px-2">{rec.rrRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-gold" />
            <h3 className="text-lg font-bold">Bar Inventory</h3>
            <span className="text-sm text-gray-500">({bars.length} bars)</span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark inline-flex items-center gap-2 transition-colors"
            style={{ minHeight: '44px' }}
          >
            <Plus className="w-5 h-5" />
            Add Bar
          </button>
        </div>

        {showAddForm && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Diameter (inches)</label>
                <input
                  type="number"
                  step="0.0625"
                  value={newBar.diameter}
                  onChange={(e) => setNewBar(prev => ({ ...prev, diameter: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"
                  style={{ minHeight: '44px' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Length (inches)</label>
                <input
                  type="number"
                  step="1"
                  value={newBar.length}
                  onChange={(e) => setNewBar(prev => ({ ...prev, length: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"
                  style={{ minHeight: '44px' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <select
                  value={newBar.location}
                  onChange={(e) => setNewBar(prev => ({ ...prev, location: e.target.value as any }))}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"
                  style={{ minHeight: '44px' }}
                >
                  <option value="LF">Left Front</option>
                  <option value="RF">Right Front</option>
                  <option value="LR">Left Rear</option>
                  <option value="RR">Right Rear</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand</label>
                <input
                  type="text"
                  value={newBar.brand}
                  onChange={(e) => setNewBar(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="e.g., Schroeder, AFCO"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"
                  style={{ minHeight: '44px' }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">Notes</label>
                <input
                  type="text"
                  value={newBar.notes}
                  onChange={(e) => setNewBar(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"
                  style={{ minHeight: '44px' }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddBar}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark disabled:opacity-50 font-medium"
                style={{ minHeight: '44px' }}
              >
                Save Bar
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                style={{ minHeight: '44px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {bars.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">No torsion bars in inventory</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bars.map((bar) => (
              <div
                key={bar.id}
                className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-2 ${
                  bar.in_car ? 'border-green-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${getLocationColor(bar.location)}`} />
                    <span className="font-bold text-lg">{bar.location}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteBar(bar.id!)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Diameter:</span>
                    <span className="font-medium">{bar.diameter}"</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Length:</span>
                    <span className="font-medium">{bar.length}"</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                    <span className="font-bold text-brand-gold">{bar.rate} lbs/in</span>
                  </div>
                  {bar.brand && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Brand:</span>
                      <span className="font-medium">{bar.brand}</span>
                    </div>
                  )}
                  {bar.notes && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                      {bar.notes}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleToggleInCar(bar)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    bar.in_car
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  style={{ minHeight: '40px' }}
                >
                  {bar.in_car ? 'In Car' : 'In Storage'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-600" />
          Torsion Bar Tips
        </h4>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
          <li>• Larger diameter = stiffer bar (higher rate)</li>
          <li>• Longer bar = softer bar (lower rate)</li>
          <li>• Mark bars clearly for easy identification</li>
          <li>• Inspect for cracks or damage regularly</li>
          <li>• Keep matched pairs together by rate</li>
          <li>• Clean and oil bars after each race</li>
        </ul>
      </div>
    </div>
  );
}
