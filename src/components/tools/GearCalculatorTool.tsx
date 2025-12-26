import React, { useState } from 'react';
import { Calculator, Save, Bookmark, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function GearCalculatorTool() {
  const { user } = useAuth();
  const [inputs, setInputs] = useState({
    tireCircumference: 82,
    engineRPM: 8000,
    desiredSpeed: 120,
    rearGear: 5.43,
    transmissionRatio: 1.0
  });
  const [saveName, setSaveName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const calculateResults = () => {
    const { tireCircumference, engineRPM, desiredSpeed, rearGear, transmissionRatio } = inputs;

    const tireRevolutionsPerMile = 63360 / tireCircumference;
    const speedAtRPM = (engineRPM / (rearGear * transmissionRatio * tireRevolutionsPerMile)) * 60;
    const rpmAtSpeed = (desiredSpeed * rearGear * transmissionRatio * tireRevolutionsPerMile) / 60;
    const finalDriveRatio = rearGear * transmissionRatio;

    const recommendedRearGear = (engineRPM * transmissionRatio * tireRevolutionsPerMile) / (desiredSpeed * 60);

    return {
      speedAtRPM: speedAtRPM.toFixed(2),
      rpmAtSpeed: rpmAtSpeed.toFixed(0),
      finalDriveRatio: finalDriveRatio.toFixed(2),
      recommendedRearGear: recommendedRearGear.toFixed(2),
      tireRevolutionsPerMile: tireRevolutionsPerMile.toFixed(0)
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
        calculation_type: 'gear_ratio',
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
          <h3 className="font-semibold text-lg">Inputs</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tire Circumference (inches)
            </label>
            <input
              type="number"
              value={inputs.tireCircumference}
              onChange={(e) => setInputs({ ...inputs, tireCircumference: parseFloat(e.target.value) })}
              className="w-full p-3 rounded-lg"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Standard 15" wheel ≈ 82-86 inches
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Engine RPM
            </label>
            <input
              type="number"
              value={inputs.engineRPM}
              onChange={(e) => setInputs({ ...inputs, engineRPM: parseFloat(e.target.value) })}
              className="w-full p-3 rounded-lg"
              step="100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Typical max RPM for your engine
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Desired Speed (MPH)
            </label>
            <input
              type="number"
              value={inputs.desiredSpeed}
              onChange={(e) => setInputs({ ...inputs, desiredSpeed: parseFloat(e.target.value) })}
              className="w-full p-3 rounded-lg"
              step="5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Target top speed at max RPM
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Rear Gear Ratio
            </label>
            <input
              type="number"
              value={inputs.rearGear}
              onChange={(e) => setInputs({ ...inputs, rearGear: parseFloat(e.target.value) })}
              className="w-full p-3 rounded-lg"
              step="0.01"
            />
            <p className="text-xs text-gray-500 mt-1">
              Quick change gear ratio (e.g., 5.43:1)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Transmission Ratio
            </label>
            <input
              type="number"
              value={inputs.transmissionRatio}
              onChange={(e) => setInputs({ ...inputs, transmissionRatio: parseFloat(e.target.value) })}
              className="w-full p-3 rounded-lg"
              step="0.01"
            />
            <p className="text-xs text-gray-500 mt-1">
              Usually 1.0 for direct drive
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Results</h3>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Speed at {inputs.engineRPM} RPM</div>
            <div className="text-4xl font-bold text-blue-600">{results.speedAtRPM} MPH</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">RPM at {inputs.desiredSpeed} MPH</div>
            <div className="text-4xl font-bold text-green-600">{results.rpmAtSpeed} RPM</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Final Drive Ratio</span>
              <span className="font-semibold">{results.finalDriveRatio}:1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tire Rev/Mile</span>
              <span className="font-semibold">{results.tireRevolutionsPerMile}</span>
            </div>
          </div>

          <div className="bg-brand-gold/10 rounded-lg p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Recommended Rear Gear</div>
            <div className="text-3xl font-bold text-brand-gold">{results.recommendedRearGear}:1</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              To reach {inputs.desiredSpeed} MPH at {inputs.engineRPM} RPM
            </p>
          </div>

          {user && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full px-4 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark inline-flex items-center justify-center gap-2"
            >
              <Bookmark className="w-5 h-5" />
              Save Calculation
            </button>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Quick Tips
        </h4>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
          <li>• Higher gear ratio = more acceleration, lower top speed</li>
          <li>• Lower gear ratio = less acceleration, higher top speed</li>
          <li>• Target 95-98% of max RPM at top speed for best performance</li>
          <li>• Consider track length when choosing gear ratios</li>
          <li>• Quick change gears typically range from 4.5:1 to 6.5:1</li>
        </ul>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Save Calculation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    className="w-full p-3 rounded-lg"
                    placeholder="e.g., Eldora 5.43 Setup"
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
