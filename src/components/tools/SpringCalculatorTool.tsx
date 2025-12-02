import React, { useState } from 'react';
import { Settings, Save, Bookmark, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function SpringCalculatorTool() {
  const { user } = useAuth();
  const [inputs, setInputs] = useState({
    springRate: 400,
    motionRatio: 0.85,
    installRatio: 1.0,
    springTravel: 3.0
  });
  const [saveName, setSaveName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateResults = () => {
    const { springRate, motionRatio, installRatio, springTravel } = inputs;

    const wheelRate = springRate * (motionRatio * motionRatio) * installRatio;

    const forceAtFullCompression = springRate * springTravel;

    const wheelTravel = springTravel / motionRatio;

    const naturalFrequency = Math.sqrt((wheelRate * 386.4) / 100) / (2 * Math.PI);

    return {
      wheelRate: wheelRate.toFixed(1),
      forceAtFullCompression: forceAtFullCompression.toFixed(0),
      wheelTravel: wheelTravel.toFixed(2),
      naturalFrequency: naturalFrequency.toFixed(2)
    };
  };

  const results = calculateResults();

  const handleSave = async () => {
    if (!user || !saveName.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from('saved_calculations')
      .insert({
        user_id: user.id,
        calculation_type: 'spring_rate',
        name: saveName,
        inputs: inputs,
        results: results
      });

    if (!error) {
      setSaveName('');
      setShowSaveModal(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Spring Parameters</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Spring Rate (lbs/in)
            </label>
            <input
              type="number"
              value={inputs.springRate}
              onChange={(e) => setInputs({ ...inputs, springRate: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 rounded-lg"
              step="25"
            />
            <p className="text-xs text-gray-500 mt-1">
              Force required to compress spring 1 inch
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Motion Ratio
            </label>
            <input
              type="number"
              value={inputs.motionRatio}
              onChange={(e) => setInputs({ ...inputs, motionRatio: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 rounded-lg"
              step="0.05"
            />
            <p className="text-xs text-gray-500 mt-1">
              Typical range: 0.75-1.0 (spring travel / wheel travel)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Installation Ratio
            </label>
            <input
              type="number"
              value={inputs.installRatio}
              onChange={(e) => setInputs({ ...inputs, installRatio: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 rounded-lg"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Usually 1.0 for coilovers, varies for pushrod/pullrod
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Spring Travel (inches)
            </label>
            <input
              type="number"
              value={inputs.springTravel}
              onChange={(e) => setInputs({ ...inputs, springTravel: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 rounded-lg"
              step="0.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Available compression travel
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-sm">Common Spring Rates</h4>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Sprint Car Front:</span>
                <span className="font-medium">350-500 lbs/in</span>
              </div>
              <div className="flex justify-between">
                <span>Sprint Car Rear:</span>
                <span className="font-medium">200-300 lbs/in</span>
              </div>
              <div className="flex justify-between">
                <span>Late Model Front:</span>
                <span className="font-medium">400-600 lbs/in</span>
              </div>
              <div className="flex justify-between">
                <span>Late Model Rear:</span>
                <span className="font-medium">250-400 lbs/in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Calculated Values</h3>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Wheel Rate</div>
            <div className="text-4xl font-bold text-blue-600">{results.wheelRate} lbs/in</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Effective spring rate at the wheel
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Force at Full Compression</div>
            <div className="text-4xl font-bold text-green-600">{results.forceAtFullCompression} lbs</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Maximum force when bottomed out
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Wheel Travel</span>
              <span className="font-semibold">{results.wheelTravel} inches</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Natural Frequency</span>
              <span className="font-semibold">{results.naturalFrequency} Hz</span>
            </div>
          </div>

          <div className="bg-brand-gold/10 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Spring Selection Guide</h4>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>• Higher wheel rate = less roll, more responsive</p>
              <p>• Lower wheel rate = more grip, smoother ride</p>
              <p>• Target 1.5-2.5 Hz natural frequency for most dirt cars</p>
              <p>• Motion ratio affects wheel rate significantly</p>
            </div>
          </div>

          {user && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full px-4 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark inline-flex items-center justify-center gap-2"
            >
              <Bookmark className="w-5 h-5" />
              Save Spring Calculation
            </button>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Spring Rate Tips
        </h4>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
          <li>• Wheel rate is what matters for handling, not spring rate</li>
          <li>• Motion ratio varies through suspension travel (non-linear)</li>
          <li>• Stiffer springs reduce body roll but may hurt mechanical grip</li>
          <li>• Front springs mainly affect turn-in and initial handling</li>
          <li>• Rear springs mainly affect drive off corners and stability</li>
          <li>• Always consider total package: springs, shocks, and bars</li>
        </ul>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Save Spring Calculation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Setup Name *</label>
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    className="w-full p-3 rounded-lg"
                    placeholder="e.g., 400lb Front Spring Setup"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading || !saveName.trim()}
                    className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
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
