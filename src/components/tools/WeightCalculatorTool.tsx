import React, { useState } from 'react';
import { Weight, Save, Bookmark, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function WeightCalculatorTool() {
  const { user } = useAuth();
  const [inputs, setInputs] = useState({
    leftFront: 500,
    rightFront: 550,
    leftRear: 425,
    rightRear: 475
  });
  const [saveName, setSaveName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateResults = () => {
    const { leftFront, rightFront, leftRear, rightRear } = inputs;

    const totalWeight = leftFront + rightFront + leftRear + rightRear;
    const frontWeight = leftFront + rightFront;
    const rearWeight = leftRear + rightRear;
    const leftSideWeight = leftFront + leftRear;
    const rightSideWeight = rightFront + rightRear;

    const frontPercent = (frontWeight / totalWeight) * 100;
    const rearPercent = (rearWeight / totalWeight) * 100;
    const leftPercent = (leftSideWeight / totalWeight) * 100;
    const rightPercent = (rightSideWeight / totalWeight) * 100;

    const crossWeight = leftRear + rightFront;
    const crossPercent = (crossWeight / totalWeight) * 100;

    const wedge = crossPercent - 50;

    const diagonal1 = leftFront + rightRear;
    const diagonal2 = rightFront + leftRear;

    return {
      totalWeight: totalWeight.toFixed(0),
      frontWeight: frontWeight.toFixed(0),
      rearWeight: rearWeight.toFixed(0),
      leftSideWeight: leftSideWeight.toFixed(0),
      rightSideWeight: rightSideWeight.toFixed(0),
      frontPercent: frontPercent.toFixed(1),
      rearPercent: rearPercent.toFixed(1),
      leftPercent: leftPercent.toFixed(1),
      rightPercent: rightPercent.toFixed(1),
      crossWeight: crossWeight.toFixed(0),
      crossPercent: crossPercent.toFixed(2),
      wedge: wedge.toFixed(2),
      diagonal1: diagonal1.toFixed(0),
      diagonal2: diagonal2.toFixed(0)
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
        calculation_type: 'weight_distribution',
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

  const getWedgeStatus = (wedge: number) => {
    const wedgeNum = parseFloat(wedge.toString());
    if (wedgeNum > 0) return { text: 'Tight', color: 'text-red-600' };
    if (wedgeNum < 0) return { text: 'Loose', color: 'text-blue-600' };
    return { text: 'Neutral', color: 'text-green-600' };
  };

  const wedgeStatus = getWedgeStatus(parseFloat(results.wedge));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Corner Weights (lbs)</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Left Front
              </label>
              <input
                type="number"
                value={inputs.leftFront}
                onChange={(e) => setInputs({ ...inputs, leftFront: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 rounded-lg"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Right Front
              </label>
              <input
                type="number"
                value={inputs.rightFront}
                onChange={(e) => setInputs({ ...inputs, rightFront: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 rounded-lg"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Left Rear
              </label>
              <input
                type="number"
                value={inputs.leftRear}
                onChange={(e) => setInputs({ ...inputs, leftRear: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 rounded-lg"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Right Rear
              </label>
              <input
                type="number"
                value={inputs.rightRear}
                onChange={(e) => setInputs({ ...inputs, rightRear: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 rounded-lg"
                step="1"
              />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Weight Distribution</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Front:</span>
                <span className="font-semibold">{results.frontWeight} lbs ({results.frontPercent}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rear:</span>
                <span className="font-semibold">{results.rearWeight} lbs ({results.rearPercent}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Left:</span>
                <span className="font-semibold">{results.leftSideWeight} lbs ({results.leftPercent}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Right:</span>
                <span className="font-semibold">{results.rightSideWeight} lbs ({results.rightPercent}%)</span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between font-semibold">
                  <span>Total Weight:</span>
                  <span>{results.totalWeight} lbs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Analysis</h3>

          <div className="bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10 rounded-lg p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cross Weight</div>
            <div className="text-4xl font-bold text-brand-gold">{results.crossPercent}%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              LR + RF = {results.crossWeight} lbs
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Wedge</div>
            <div className={`text-4xl font-bold ${wedgeStatus.color}`}>
              {results.wedge}%
            </div>
            <p className={`text-sm mt-2 font-semibold ${wedgeStatus.color}`}>
              {wedgeStatus.text}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {parseFloat(results.wedge) > 0 ? 'Add left side weight to loosen' : parseFloat(results.wedge) < 0 ? 'Add right side weight to tighten' : 'Perfectly balanced'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Diagonal (LF + RR)</span>
              <span className="font-semibold">{results.diagonal1} lbs</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Diagonal (RF + LR)</span>
              <span className="font-semibold">{results.diagonal2} lbs</span>
            </div>
          </div>

          {user && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full px-4 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark inline-flex items-center justify-center gap-2"
            >
              <Bookmark className="w-5 h-5" />
              Save Weight Setup
            </button>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Weight className="w-5 h-5 text-blue-600" />
          Weight Distribution Tips
        </h4>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
          <li>• Cross weight (wedge) of 50% = neutral handling</li>
          <li>• Above 50% = tight (push), below 50% = loose (free)</li>
          <li>• Typical range: 48-52% depending on track and driver preference</li>
          <li>• Left side weight typically 52-56% for oval tracks</li>
          <li>• Front weight percentage affects steering and braking</li>
          <li>• Make small adjustments (0.5-1% wedge) and test</li>
        </ul>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Save Weight Setup</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Setup Name *</label>
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    className="w-full p-3 rounded-lg"
                    placeholder="e.g., Eldora Balanced Setup"
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
