import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Settings,
  X,
  ChevronRight,
  Info,
  Award,
  Sparkles,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  LogIn,
  LogOut
} from 'lucide-react';

interface VehicleType {
  id: string;
  name: string;
  icon: string;
}

interface Adjustment {
  part: string;
  direction: 'up' | 'down';
  amount?: string;
}

interface Reference {
  vehicle: string;
  source: string;
  url: string;
  description: string;
}

const vehicleTypes: VehicleType[] = [
  { id: 'late-model', name: 'Dirt Late Model', icon: '🏎️' },
  { id: 'modified', name: 'Dirt Modified', icon: '🏁' },
  { id: 'sprint-car', name: 'Sprint Car', icon: '⚡' },
  { id: 'sportmod', name: 'Sport Mod', icon: '🚗' },
  { id: 'street-stock', name: 'Street Stock', icon: '🚙' },
  { id: 'midget', name: 'Midget', icon: '🏎️' },
  { id: 'mini-sprint', name: 'Mini Sprint', icon: '⚡' }
];

const handlingAdjustments: Record<string, Record<string, Record<string, Adjustment[]>>> = {
  entry: {
    tight: {
      'late-model': [
        { part: 'Left Front Spring', direction: 'down', amount: '25-50 lb/in' },
        { part: 'Crossweight', direction: 'up', amount: '1-2%' },
        { part: 'Right Rear Position', direction: 'up', amount: '1/8" forward' },
        { part: 'J-Bar/Lift Bar Height', direction: 'up', amount: '1/2"' },
        { part: 'LF Shock Compression', direction: 'down' }
      ],
      'sprint-car': [
        { part: 'Left Rear Torsion Bar', direction: 'down', amount: '50 lb/in' },
        { part: 'Wing Angle', direction: 'down', amount: '2-3 degrees' },
        { part: 'Birdcage Position', direction: 'up', amount: '1 hole forward' },
        { part: 'Stagger', direction: 'down', amount: '1/2"' }
      ],
      'modified': [
        { part: 'Left Front Spring', direction: 'down', amount: '25-50 lb/in' },
        { part: 'Panhard Bar (left side)', direction: 'down', amount: '1/2"' },
        { part: 'Right Rear Position', direction: 'up', amount: '1/8" forward' },
        { part: 'Right Rear Spring', direction: 'down', amount: '25 lb/in' }
      ],
      'default': [
        { part: 'Front Springs', direction: 'down', amount: '25-50 lb/in' },
        { part: 'Weight Position', direction: 'up', amount: '1-2" forward' },
        { part: 'Rear Steer', direction: 'up', amount: 'RR forward' }
      ]
    },
    loose: {
      'late-model': [
        { part: 'Left Front Spring', direction: 'up', amount: '25-50 lb/in' },
        { part: 'Crossweight', direction: 'down', amount: '1-2%' },
        { part: 'Right Rear Position', direction: 'down', amount: '1/8" back' },
        { part: 'J-Bar/Lift Bar Height', direction: 'down', amount: '1/2"' },
        { part: 'Right Rear Spring', direction: 'up', amount: '25 lb/in' }
      ],
      'sprint-car': [
        { part: 'Left Rear Torsion Bar', direction: 'up', amount: '50 lb/in' },
        { part: 'Wing Angle', direction: 'up', amount: '2-3 degrees' },
        { part: 'Birdcage Position', direction: 'down', amount: '1 hole back' },
        { part: 'Stagger', direction: 'up', amount: '1/2"' }
      ],
      'modified': [
        { part: 'Left Front Spring', direction: 'up', amount: '25-50 lb/in' },
        { part: 'Panhard Bar (left side)', direction: 'up', amount: '1/2"' },
        { part: 'Right Rear Position', direction: 'down', amount: '1/8" back' },
        { part: 'Right Rear Spring', direction: 'up', amount: '25 lb/in' }
      ],
      'default': [
        { part: 'Front Springs', direction: 'up', amount: '25-50 lb/in' },
        { part: 'Weight Position', direction: 'down', amount: '1-2" rearward' },
        { part: 'Rear Steer', direction: 'down', amount: 'reduce angle' }
      ]
    }
  },
  exit: {
    tight: {
      'late-model': [
        { part: 'J-Bar/Lift Bar Height', direction: 'down', amount: '1/2"-1"' },
        { part: 'Right Rear Spring', direction: 'down', amount: '25 lb/in' },
        { part: 'Right Rear Position', direction: 'up', amount: '1/8" forward' },
        { part: 'RR Shock Rebound', direction: 'down' }
      ],
      'sprint-car': [
        { part: 'Right Rear Torsion Bar', direction: 'up', amount: '50-100 lb/in' },
        { part: 'Stagger', direction: 'up', amount: '1/2"-1"' },
        { part: 'Wing Angle', direction: 'up', amount: '2-3 degrees' },
        { part: 'Weight Position', direction: 'down', amount: '1" rearward' }
      ],
      'modified': [
        { part: 'Pull Bar/J-Bar Height', direction: 'down' },
        { part: 'Right Rear Spring', direction: 'down', amount: '25 lb/in' },
        { part: 'Panhard Bar (right side)', direction: 'down' }
      ],
      'default': [
        { part: 'Rear Springs', direction: 'down' },
        { part: 'Weight Position', direction: 'down', amount: 'rearward' }
      ]
    },
    loose: {
      'late-model': [
        { part: 'J-Bar/Lift Bar Height', direction: 'up', amount: '1/2"-1"' },
        { part: 'Right Rear Spring', direction: 'up', amount: '25-50 lb/in' },
        { part: 'Right Rear Position', direction: 'down', amount: '1/8" back' },
        { part: 'RR Shock Compression', direction: 'up' }
      ],
      'sprint-car': [
        { part: 'Right Rear Torsion Bar', direction: 'down', amount: '50-100 lb/in' },
        { part: 'Stagger', direction: 'down', amount: '1/2"' },
        { part: 'Wing Angle', direction: 'down', amount: '2-3 degrees' },
        { part: 'Weight Position', direction: 'down', amount: 'add RR weight' }
      ],
      'modified': [
        { part: 'Pull Bar/J-Bar Height', direction: 'up' },
        { part: 'Right Rear Spring', direction: 'up', amount: '25-50 lb/in' },
        { part: 'Panhard Bar (right side)', direction: 'up' }
      ],
      'default': [
        { part: 'Rear Springs', direction: 'up' },
        { part: 'Weight Position', direction: 'down', amount: 'rearward' }
      ]
    }
  }
};

const references: Reference[] = [
  {
    vehicle: 'Dirt Late Model',
    source: 'Rocket Chassis Setup Guide',
    url: 'https://www.rocketchassis.com',
    description: 'Comprehensive setup sheets for various track conditions - spring rates, weight distribution, shock valving'
  },
  {
    vehicle: 'Dirt Late Model',
    source: 'Barry Wright Race Cars',
    url: 'https://www.barrywright.com',
    description: 'Technical bulletins covering J-bar height, rear steer, crossweight adjustments'
  },
  {
    vehicle: 'Dirt Late Model',
    source: 'Sweet-Bloomquist Race Cars',
    url: 'https://www.bloomquistracecars.com',
    description: 'Setup recommendations for changing track conditions throughout the night'
  },
  {
    vehicle: 'Dirt Modified',
    source: 'Bicknell Racing Products',
    url: 'https://www.bicknellracingproducts.com',
    description: 'Modified chassis setup guides - caster, camber, spring rates, shock valving'
  },
  {
    vehicle: 'Dirt Modified',
    source: 'TEO Pro Car',
    url: 'https://www.teoprocar.com',
    description: 'Panhard bar positioning, pull bar adjustments, weight distribution'
  },
  {
    vehicle: 'Sprint Car',
    source: 'Maxim Racing',
    url: 'https://www.maximracing.com',
    description: 'Sprint car setup sheets - torsion bar rates, birdcage positions, stagger'
  },
  {
    vehicle: 'Sprint Car',
    source: 'J&J Auto Racing',
    url: 'https://www.jjauto.com',
    description: 'Wing angle recommendations, shock valving, chassis adjustments'
  },
  {
    vehicle: 'Sprint Car',
    source: 'World of Outlaws Setup Guides',
    url: 'https://www.worldofoutlaws.com',
    description: 'Professional-level setup information from top World of Outlaws teams'
  },
  {
    vehicle: 'General Dirt Racing',
    source: 'Circle Track Magazine',
    url: 'https://www.circletrack.com',
    description: 'Technical articles covering dirt racing setup across all classes'
  }
];

export default function DirtTrackSetupGuide() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('late-model');
  const [showReferences, setShowReferences] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<'entry' | 'exit' | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<'tight' | 'loose' | null>(null);

  const currentAdjustments = selectedPhase && selectedProblem
    ? (handlingAdjustments[selectedPhase]?.[selectedProblem]?.[selectedVehicle] ||
       handlingAdjustments[selectedPhase]?.[selectedProblem]?.['default'] || [])
    : [];

  const handleSelection = (phase: 'entry' | 'exit', problem: 'tight' | 'loose') => {
    setSelectedPhase(phase);
    setSelectedProblem(problem);
  };

  const resetSelection = () => {
    setSelectedPhase(null);
    setSelectedProblem(null);
  };

  return (
    <div className="relative mb-8">
      <div className="liquid-glass-hero overflow-hidden">
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-4 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 mb-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <Award className="w-16 h-16 text-brand-gold relative z-10" />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 relative"
          >
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Setup Quick Fix Guide
            </span>
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-3xl -z-10" />
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            See exactly what to raise or lower to fix your handling
            <Sparkles className="w-5 h-5 text-amber-500" />
          </motion.p>

          {/* Vehicle Type Selector */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {vehicleTypes.map((vehicle) => (
              <motion.button
                key={vehicle.id}
                onClick={() => {
                  setSelectedVehicle(vehicle.id);
                  resetSelection();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                  selectedVehicle === vehicle.id
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-black shadow-amber-500/50'
                    : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70'
                }`}
              >
                <span className="mr-2 text-2xl">{vehicle.icon}</span>
                {vehicle.name}
              </motion.button>
            ))}
          </motion.div>

          {/* References Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setShowReferences(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="liquid-glass-btn flex items-center gap-2 mx-auto shadow-xl"
          >
            <BookOpen className="w-5 h-5" />
            View All References & Sources
          </motion.button>
        </div>

        {/* Main Selection Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                What's Your Handling Problem?
              </span>
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Click the phase and problem you're experiencing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* CORNER ENTRY */}
            <div className="liquid-glass-card">
              <div className="flex items-center justify-center gap-3 mb-6">
                <LogIn className="w-8 h-8 text-blue-500" />
                <h4 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                  CORNER ENTRY
                </h4>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Problem entering the corner?
              </p>
              <div className="space-y-4">
                <motion.button
                  onClick={() => handleSelection('entry', 'tight')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-6 rounded-2xl font-bold text-xl transition-all ${
                    selectedPhase === 'entry' && selectedProblem === 'tight'
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-2xl shadow-red-500/50'
                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}
                >
                  <div className="text-5xl mb-3">🔴</div>
                  TIGHT ON ENTRY
                  <div className="text-sm mt-2 opacity-75">Car won't turn / Pushes</div>
                </motion.button>
                <motion.button
                  onClick={() => handleSelection('entry', 'loose')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-6 rounded-2xl font-bold text-xl transition-all ${
                    selectedPhase === 'entry' && selectedProblem === 'loose'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-2xl shadow-blue-500/50'
                      : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  <div className="text-5xl mb-3">🔵</div>
                  LOOSE ON ENTRY
                  <div className="text-sm mt-2 opacity-75">Rear slides out / Oversteer</div>
                </motion.button>
              </div>
            </div>

            {/* CORNER EXIT */}
            <div className="liquid-glass-card">
              <div className="flex items-center justify-center gap-3 mb-6">
                <LogOut className="w-8 h-8 text-orange-500" />
                <h4 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  CORNER EXIT
                </h4>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Problem exiting the corner?
              </p>
              <div className="space-y-4">
                <motion.button
                  onClick={() => handleSelection('exit', 'tight')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-6 rounded-2xl font-bold text-xl transition-all ${
                    selectedPhase === 'exit' && selectedProblem === 'tight'
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-2xl shadow-red-500/50'
                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}
                >
                  <div className="text-5xl mb-3">🔴</div>
                  TIGHT ON EXIT
                  <div className="text-sm mt-2 opacity-75">No forward drive / Push</div>
                </motion.button>
                <motion.button
                  onClick={() => handleSelection('exit', 'loose')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-6 rounded-2xl font-bold text-xl transition-all ${
                    selectedPhase === 'exit' && selectedProblem === 'loose'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-2xl shadow-blue-500/50'
                      : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  <div className="text-5xl mb-3">🔵</div>
                  LOOSE ON EXIT
                  <div className="text-sm mt-2 opacity-75">Rear spins / Wheel spin</div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Adjustments Panel */}
        <AnimatePresence mode="wait">
          {selectedPhase && selectedProblem && (
            <motion.div
              key={`${selectedPhase}-${selectedProblem}`}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              className="mt-12"
            >
              <div className={`p-8 rounded-3xl ${
                selectedProblem === 'tight'
                  ? 'bg-gradient-to-r from-red-500 to-orange-600'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-600'
              } mb-8 shadow-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <AlertCircle className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg uppercase">
                        {selectedPhase === 'entry' ? 'ENTRY' : 'EXIT'} - {selectedProblem === 'tight' ? 'TIGHT' : 'LOOSE'}
                      </h3>
                      <p className="text-lg md:text-xl text-white/90">
                        {vehicleTypes.find(v => v.id === selectedVehicle)?.name}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={resetSelection}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                  >
                    <X className="w-8 h-8 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Adjustments List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAdjustments.map((adjustment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.03, x: 5 }}
                    className="liquid-glass-card relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`w-20 h-20 rounded-2xl ${
                        adjustment.direction === 'up'
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                          : 'bg-gradient-to-br from-orange-500 to-red-600'
                      } flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        {adjustment.direction === 'up' ? (
                          <ArrowUp className="w-10 h-10 text-white" strokeWidth={3} />
                        ) : (
                          <ArrowDown className="w-10 h-10 text-white" strokeWidth={3} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl md:text-2xl font-black mb-1">{adjustment.part}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${
                            adjustment.direction === 'up'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-orange-600 dark:text-orange-400'
                          }`}>
                            {adjustment.direction === 'up' ? 'RAISE' : 'LOWER'}
                          </span>
                          {adjustment.amount && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ({adjustment.amount})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pro Tip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-xl">
                    <Info className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-amber-900 dark:text-amber-400 mb-2">
                      Pro Tip
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Make ONE adjustment at a time and test. Start with the first item on the list.
                      If that doesn't work, move to the next. Track conditions change throughout the night -
                      what works in hot slick may not work when tacky. Write down what works!
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Getting Started Info */}
        {!selectedPhase && !selectedProblem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-700"
          >
            <div className="flex items-start gap-6">
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold mb-4">How to Use This Guide</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-bold mb-2">1. Select Your Vehicle</p>
                    <p>Choose your race car class from the buttons above</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">2. Identify the Problem</p>
                    <p>Click whether you're tight or loose on entry or exit</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">3. See What to Adjust</p>
                    <p>Green arrows = raise, Orange arrows = lower</p>
                  </div>
                  <div>
                    <p className="font-bold mb-2">4. Make ONE Change</p>
                    <p>Start at top of list, test, then try next if needed</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* References Modal */}
      <AnimatePresence>
        {showReferences && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowReferences(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[85vh] z-50 liquid-glass rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-2xl">
                    <BookOpen className="w-8 h-8 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">Setup References & Sources</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Legitimate dirt racing chassis manufacturers and technical sources
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowReferences(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="space-y-4">
                  {references.map((ref, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="liquid-glass-card relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <ChevronRight className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                              {ref.vehicle}
                            </span>
                          </div>
                          <h4 className="text-xl font-bold mb-2">{ref.source}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                            {ref.description}
                          </p>
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-2 group"
                          >
                            Visit Website
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-gray-100 dark:bg-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    <strong className="text-gray-900 dark:text-gray-100">Disclaimer:</strong> All setup information is compiled from publicly available
                    manufacturer guidelines, technical bulletins, and industry-standard practices for dirt
                    track racing. Always consult your chassis manufacturer's specific recommendations and
                    adjust based on your track conditions, tire compound, and racing class rules.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
