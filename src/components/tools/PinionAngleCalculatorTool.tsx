import React, { useState } from 'react';
import { Calculator, AlertTriangle, CheckCircle, Info, RotateCcw } from 'lucide-react';

export default function PinionAngleCalculatorTool() {
  const [transmissionAngle, setTransmissionAngle] = useState<string>('');
  const [pinionAngle, setPinionAngle] = useState<string>('');
  const [driveShaftAngle, setDriveShaftAngle] = useState<string>('');
  const [results, setResults] = useState<{
    transmissionOperatingAngle: number;
    rearOperatingAngle: number;
    angleDifference: number;
    maxOperatingAngle: number;
    status: 'pass' | 'warning' | 'fail';
    recommendations: string[];
  } | null>(null);

  const calculateAngles = () => {
    const transAngle = parseFloat(transmissionAngle) || 0;
    const pinAngle = parseFloat(pinionAngle) || 0;
    const dsAngle = parseFloat(driveShaftAngle) || 0;

    const transmissionOperatingAngle = Math.abs(transAngle - dsAngle);
    const rearOperatingAngle = Math.abs(pinAngle - dsAngle);
    const angleDifference = Math.abs(transmissionOperatingAngle - rearOperatingAngle);
    const maxOperatingAngle = Math.max(transmissionOperatingAngle, rearOperatingAngle);

    let status: 'pass' | 'warning' | 'fail' = 'pass';
    const recommendations: string[] = [];

    if (maxOperatingAngle > 3) {
      status = 'fail';
      recommendations.push('Operating angle exceeds 3° - expect reduced U-joint life and potential vibration');
      recommendations.push('Adjust pinion or transmission angle to reduce operating angles');
    } else if (maxOperatingAngle > 2.5) {
      status = 'warning';
      recommendations.push('Operating angle is acceptable but could be optimized');
      recommendations.push('Consider adjusting for better U-joint longevity');
    } else {
      recommendations.push('Excellent! Operating angles are within optimal range');
    }

    if (angleDifference > 0.5) {
      if (status === 'pass') status = 'warning';
      recommendations.push(`Angle difference (${angleDifference.toFixed(2)}°) exceeds 0.5° - adjust for better balance`);
    } else {
      recommendations.push('U-joint operating angles are well balanced');
    }

    if (Math.abs(transAngle - pinAngle) > 1) {
      recommendations.push('Transmission and pinion angles should be parallel (within 1°) for best results');
    }

    setResults({
      transmissionOperatingAngle,
      rearOperatingAngle,
      angleDifference,
      maxOperatingAngle,
      status,
      recommendations
    });
  };

  const handleReset = () => {
    setTransmissionAngle('');
    setPinionAngle('');
    setDriveShaftAngle('');
    setResults(null);
  };

  const getStatusIcon = () => {
    if (!results) return null;
    switch (results.status) {
      case 'pass':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 'fail':
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    if (!results) return '';
    switch (results.status) {
      case 'pass':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'fail':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p className="font-semibold">How to Measure Driveline Angles:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Transmission Angle:</strong> Measure the angle of the transmission output shaft from level (use digital level or angle finder)</li>
              <li><strong>Driveshaft Angle:</strong> Measure the angle of the driveshaft from level</li>
              <li><strong>Pinion Angle:</strong> Measure the angle of the rear pinion from level</li>
              <li>Positive angles = pointing up, Negative angles = pointing down</li>
              <li>All measurements should be taken with the vehicle at ride height</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Transmission Angle (degrees)
          </label>
          <input
            type="number"
            step="0.1"
            value={transmissionAngle}
            onChange={(e) => setTransmissionAngle(e.target.value)}
            placeholder="e.g., -2.5"
            className="input-field w-full text-lg"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Output shaft angle from level
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Driveshaft Angle (degrees)
          </label>
          <input
            type="number"
            step="0.1"
            value={driveShaftAngle}
            onChange={(e) => setDriveShaftAngle(e.target.value)}
            placeholder="e.g., -1.0"
            className="input-field w-full text-lg"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Driveshaft angle from level
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Pinion Angle (degrees)
          </label>
          <input
            type="number"
            step="0.1"
            value={pinionAngle}
            onChange={(e) => setPinionAngle(e.target.value)}
            placeholder="e.g., -2.0"
            className="input-field w-full text-lg"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Rear pinion angle from level
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={calculateAngles}
          className="btn-primary flex items-center gap-2 flex-1"
        >
          <Calculator className="w-5 h-5" />
          Calculate Angles
        </button>
        <button
          onClick={handleReset}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {results && (
        <div className={`border-2 rounded-lg p-6 ${getStatusColor()}`}>
          <div className="flex items-center gap-3 mb-4">
            {getStatusIcon()}
            <h3 className="text-xl font-bold">
              {results.status === 'pass' && 'Setup Looks Good!'}
              {results.status === 'warning' && 'Setup Needs Attention'}
              {results.status === 'fail' && 'Setup Requires Adjustment'}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Transmission U-Joint Angle
              </p>
              <p className="text-3xl font-bold text-brand-gold">
                {results.transmissionOperatingAngle.toFixed(2)}°
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Rear U-Joint Angle
              </p>
              <p className="text-3xl font-bold text-brand-gold">
                {results.rearOperatingAngle.toFixed(2)}°
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Angle Difference
              </p>
              <p className="text-3xl font-bold">
                {results.angleDifference.toFixed(2)}°
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Should be ≤ 0.5°
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Maximum Operating Angle
              </p>
              <p className="text-3xl font-bold">
                {results.maxOperatingAngle.toFixed(2)}°
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Should be ≤ 3°
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Recommendations:</h4>
            <ul className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex gap-2 text-sm">
                  <span className="text-brand-gold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-brand-gold" />
          Key Guidelines for Racing Setup
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <p className="font-medium mb-1">Target Operating Angles:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Ideal: 1-2° for maximum U-joint life</li>
              <li>Acceptable: 2-3° for most applications</li>
              <li>Caution: 3-4° reduces U-joint life significantly</li>
              <li>Critical: Over 4° expect failure and vibration</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Setup Tips:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Measure at ride height with fuel and driver weight</li>
              <li>Transmission and pinion should be parallel (±0.5°)</li>
              <li>Front and rear U-joint angles should be equal</li>
              <li>For drag racing, account for pinion rise under load</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-semibold mb-2">Common Adjustments:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Pinion Angle Too Steep:</strong> Add shims under rear spring mounts to rotate pinion down</li>
              <li><strong>Pinion Angle Too Shallow:</strong> Remove shims or adjust 4-link bars to rotate pinion up</li>
              <li><strong>Transmission Angle Off:</strong> Adjust motor mounts or transmission mount</li>
              <li><strong>Vibration at Speed:</strong> Check driveshaft balance and ensure angles match within 0.5°</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
