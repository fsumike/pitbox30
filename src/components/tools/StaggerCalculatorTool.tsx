import React, { useState } from 'react';
import { Ruler, Save, Bookmark, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function StaggerCalculatorTool() {
  const { user } = useAuth();
  const [inputs, setInputs] = useState({
    leftRearCirc: 84.0,
    rightRearCirc: 86.0,
    trackWidth: 72,
    turnRadius: 500
  });
  const [saveName, setSaveName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateResults = () => {
    const { leftRearCirc, rightRearCirc, trackWidth, turnRadius } = inputs;

    const stagger = rightRearCirc - leftRearCirc;

    const leftRearRadius = leftRearCirc / (2 * Math.PI);
    const rightRearRadius = rightRearCirc / (2 * Math.PI);

    const innerRadius = turnRadius - (trackWidth / 2);
    const outerRadius = turnRadius + (trackWidth / 2);

    const innerCircumference = 2 * Math.PI * innerRadius;
    const outerCircumference = 2 * Math.PI * outerRadius;

    const leftTireRevs = innerCircumference / leftRearCirc;
    const rightTireRevs = outerCircumference / rightRearCirc;

    const revDifference = Math.abs(rightTireRevs - leftTireRevs);

    const percentageDifference = (stagger / leftRearCirc) * 100;

    const recommendedStagger = (outerCircumference / leftTireRevs) - leftRearCirc;

    return {
      stagger: stagger.toFixed(2),
      leftRearRadius: leftRearRadius.toFixed(2),
      rightRearRadius: rightRearRadius.toFixed(2),
      leftTireRevs: leftTireRevs.toFixed(2),
      rightTireRevs: rightTireRevs.toFixed(2),
      revDifference: revDifference.toFixed(2),
      percentageDifference: percentageDifference.toFixed(2),
      recommendedStagger: recommendedStagger.toFixed(2)
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
        calculation_type: 'stagger',
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

  const getStaggerStatus = (stagger: number) => {
    if (stagger < 1.0) return { text: 'Tight Setup', color: 'text-red-600' };
    if (stagger > 2.5) return { text: 'Loose Setup', color: 'text-blue-600' };
    return { text: 'Balanced Setup', color: 'text-green-600' };
  };

  const staggerStatus = getStaggerStatus(parseFloat(results.stagger));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Tire Specifications</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Left Rear Circumference (inches)
            </label>
            <input
              type="number"
              value={inputs.leftRearCirc}
              onChange={(e) => setInputs({ ...inputs, leftRearCirc: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 rounded-lg"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Measured or calculated tire circumference
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Right Rear Circumference (inches)
            </label>
            <input
              type="number"
              value={inputs.rightRearCirc}
              onChange={(e) => setInputs({ ...inputs, rightRearCirc: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 rounded-lg"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Right rear is typically larger
            </p>
          </div>

          <h3 className="font-semibold text-lg pt-4">Track Information</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Rear Track Width (inches)
            </label>
            <input
              type="number"
              value={inputs.trackWidth}
              onChange={(e) => setInputs({ ...inputs, trackWidth: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 rounded-lg"
              step="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Center-to-center distance between rear tires
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Average Turn Radius (feet)
            </label>
            <input
              type="number"
              value={inputs.turnRadius}
              onChange={(e) => setInputs({ ...inputs, turnRadius: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 rounded-lg"
              step="50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Smaller tracks need more stagger (300-400ft)
              <br />
              Larger tracks need less stagger (600-800ft)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Stagger Analysis</h3>

          <div className="bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10 rounded-lg p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Stagger</div>
            <div className="text-4xl font-bold text-brand-gold">{results.stagger}"</div>
            <p className={`text-sm font-semibold mt-2 ${staggerStatus.color}`}>
              {staggerStatus.text}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recommended Stagger</div>
            <div className="text-4xl font-bold text-blue-600">{results.recommendedStagger}"</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              For {inputs.turnRadius}ft radius turns
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">LR Radius</span>
              <span className="font-semibold">{results.leftRearRadius}"</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">RR Radius</span>
              <span className="font-semibold">{results.rightRearRadius}"</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Stagger %</span>
              <span className="font-semibold">{results.percentageDifference}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Revolution Difference</span>
              <span className="font-semibold">{results.revDifference}</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Typical Stagger Ranges</h4>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Small Tight Tracks:</span>
                <span className="font-medium">2.0-3.0"</span>
              </div>
              <div className="flex justify-between">
                <span>Medium Tracks:</span>
                <span className="font-medium">1.5-2.5"</span>
              </div>
              <div className="flex justify-between">
                <span>Large Fast Tracks:</span>
                <span className="font-medium">1.0-1.5"</span>
              </div>
              <div className="flex justify-between">
                <span>Road Courses:</span>
                <span className="font-medium">0.5-1.0"</span>
              </div>
            </div>
          </div>

          {user && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full px-4 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark inline-flex items-center justify-center gap-2"
            >
              <Bookmark className="w-5 h-5" />
              Save Stagger Calculation
            </button>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-blue-600" />
          Stagger Tips
        </h4>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
          <li>• More stagger = car wants to turn left (loose)</li>
          <li>• Less stagger = car wants to go straight (tight)</li>
          <li>• Stagger affects mid-corner handling primarily</li>
          <li>• Too much stagger can make car unstable on entry</li>
          <li>• Heavier tracks typically need more stagger</li>
          <li>• Slick tracks typically need less stagger</li>
          <li>• Adjust in 0.25-0.5" increments and test</li>
          <li>• Consider tire wear when setting stagger</li>
        </ul>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Save Stagger Calculation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Setup Name *</label>
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    className="w-full p-3 rounded-lg"
                    placeholder="e.g., Eldora 2.0 Stagger"
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
