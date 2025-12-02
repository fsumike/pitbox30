import React, { useState } from 'react';
import { Droplet, Save, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function FuelCalculatorTool() {
  const { user } = useAuth();
  const [inputs, setInputs] = useState({
    tankCapacity: 22,
    raceLaps: 30,
    fuelPerLap: 1.0,
    safetyMargin: 2
  });

  const calculateResults = () => {
    const { tankCapacity, raceLaps, fuelPerLap, safetyMargin } = inputs;

    const totalFuelNeeded = (raceLaps * fuelPerLap) + safetyMargin;
    const startingFuel = Math.min(totalFuelNeeded, tankCapacity);
    const canComplete = totalFuelNeeded <= tankCapacity;
    const excessFuel = Math.max(0, tankCapacity - totalFuelNeeded);
    const shortfall = Math.max(0, totalFuelNeeded - tankCapacity);
    const weightPenalty = excessFuel * 6.6;
    const maxLapsOnTank = Math.floor((tankCapacity - safetyMargin) / fuelPerLap);

    return {
      totalFuelNeeded: totalFuelNeeded.toFixed(1),
      startingFuel: startingFuel.toFixed(1),
      canComplete,
      excessFuel: excessFuel.toFixed(1),
      shortfall: shortfall.toFixed(1),
      weightPenalty: weightPenalty.toFixed(1),
      maxLapsOnTank
    };
  };

  const results = calculateResults();

  const handleSaveLog = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('fuel_logs')
      .insert({
        user_id: user.id,
        track_name: 'Quick Calculation',
        laps_completed: inputs.raceLaps,
        fuel_used: parseFloat(results.totalFuelNeeded),
        fuel_per_lap: inputs.fuelPerLap,
        starting_fuel: parseFloat(results.startingFuel)
      });

    if (!error) {
      alert('Fuel log saved!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Race Parameters</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Fuel Tank Capacity (gallons)
            </label>
            <input
              type="number"
              value={inputs.tankCapacity}
              onChange={(e) => setInputs({ ...inputs, tankCapacity: parseFloat(e.target.value) })}
              className="w-full p-3 rounded-lg"
              step="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Total capacity of your fuel cell
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Race Distance (laps)
            </label>
            <input
              type="number"
              value={inputs.raceLaps}
              onChange={(e) => setInputs({ ...inputs, raceLaps: parseInt(e.target.value) })}
              className="w-full p-3 rounded-lg"
              step="5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Expected number of laps
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Fuel Consumption (gal/lap)
            </label>
            <input
              type="number"
              value={inputs.fuelPerLap}
              onChange={(e) => setInputs({ ...inputs, fuelPerLap: parseFloat(e.target.value) })}
              className="w-full p-3 rounded-lg"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Typical range: 0.8-1.5 gal/lap (methanol)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Safety Margin (gallons)
            </label>
            <input
              type="number"
              value={inputs.safetyMargin}
              onChange={(e) => setInputs({ ...inputs, safetyMargin: parseFloat(e.target.value) })}
              className="w-full p-3 rounded-lg"
              step="0.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Extra fuel buffer for safety
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Fuel Strategy</h3>

          <div className={`rounded-lg p-6 ${results.canComplete ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Race Status</div>
            <div className={`text-2xl font-bold ${results.canComplete ? 'text-green-600' : 'text-red-600'}`}>
              {results.canComplete ? '✓ Can Complete' : '✗ Fuel Short'}
            </div>
            {!results.canComplete && (
              <p className="text-sm text-red-600 mt-2">
                Need {results.shortfall} more gallons
              </p>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fuel Needed</div>
            <div className="text-4xl font-bold text-blue-600">{results.totalFuelNeeded} gal</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Including {inputs.safetyMargin} gal safety margin
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Starting Fuel</span>
              <span className="font-semibold">{results.startingFuel} gal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Max Laps Possible</span>
              <span className="font-semibold">{results.maxLapsOnTank} laps</span>
            </div>
            {parseFloat(results.excessFuel) > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Excess Fuel</span>
                  <span className="font-semibold text-orange-600">{results.excessFuel} gal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Weight Penalty</span>
                  <span className="font-semibold text-orange-600">{results.weightPenalty} lbs</span>
                </div>
              </>
            )}
          </div>

          {user && (
            <button
              onClick={handleSaveLog}
              className="w-full px-4 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark inline-flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Fuel Log
            </button>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Droplet className="w-5 h-5 text-blue-600" />
          Methanol Fuel Strategy Tips
        </h4>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
          <li>• Methanol weighs approximately 6.6 lbs/gallon</li>
          <li>• Methanol engines use roughly 2x more fuel than gasoline engines</li>
          <li>• Less fuel = lighter car = better handling and speed</li>
          <li>• Track your actual consumption during practice sessions</li>
          <li>• Factor in caution laps for longer races (reduced consumption)</li>
          <li>• Always include a safety margin for unexpected conditions</li>
          <li>• Yellow flags reduce consumption, green racing increases it</li>
          <li>• Methanol provides better cooling and higher compression ratios</li>
        </ul>
      </div>
    </div>
  );
}
