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

interface VehicleTypeExtended extends VehicleType {
  image: string;
}

const vehicleTypes: VehicleTypeExtended[] = [
  { id: 'late-model', name: 'Dirt Late Model', icon: '🏎️', image: '/late_model.jpeg' },
  { id: 'modified', name: 'Dirt Modified', icon: '🏁', image: '/imca_southern_sportmod.jpg' },
  { id: 'sprint-car', name: 'Sprint Car', icon: '⚡', image: '/495479702_1321020539654208_5408440298677452810_n.jpg' },
  { id: 'sportmod', name: 'Sport Mod', icon: '🚗', image: '/imca_southern_sportmod.jpg' },
  { id: 'street-stock', name: 'Street Stock', icon: '🚙', image: '/392307_articlesection_xl_d10ca69f-828b-441c-9ca4-ab7730ded7ee.png' },
  { id: 'midget', name: 'Midget', icon: '🏎️', image: '/midget_cars.jpg' },
  { id: 'mini-sprint', name: 'Mini Sprint', icon: '⚡', image: '/073020_scs_worldofoutlaws4wide_bytrentgower.jpg' }
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
    source: 'Rocket Chassis',
    url: 'https://www.rocketchassis.com',
    description: 'Industry-leading late model chassis - setup sheets, spring rates, weight distribution, shock valving for all track conditions'
  },
  {
    vehicle: 'Dirt Late Model',
    source: 'Longhorn Chassis',
    url: 'https://www.longhornchassismfg.com',
    description: 'Professional late model chassis with detailed technical support - J-bar, lift bar, and suspension geometry'
  },
  {
    vehicle: 'Dirt Late Model',
    source: 'MasterSbilt Race Cars',
    url: 'https://www.mastersbilt.com',
    description: 'Proven late model designs - comprehensive setup guides for slick to heavy tracks'
  },
  {
    vehicle: 'Dirt Modified',
    source: 'Bicknell Racing Products',
    url: 'https://www.bicknellracingproducts.com',
    description: 'Modified chassis experts - panhard bar, pull bar, caster/camber, spring rates'
  },
  {
    vehicle: 'Dirt Modified',
    source: 'TEO Pro Car',
    url: 'https://www.teoprocar.com',
    description: 'Modified chassis manufacturer - technical bulletins on weight distribution and suspension adjustments'
  },
  {
    vehicle: 'Sprint Car',
    source: 'Maxim Chassis',
    url: 'https://www.maximracing.com',
    description: 'Leading sprint car chassis - torsion bars, birdcage positions, stagger, wing angles'
  },
  {
    vehicle: 'Sprint Car',
    source: 'J&J Auto Racing',
    url: 'https://www.jjauto.com',
    description: 'Sprint car chassis and components - setup sheets, shock valving, chassis tuning'
  },
  {
    vehicle: 'Sprint Car',
    source: 'Triple X Race Co.',
    url: 'https://www.triplexraceco.com',
    description: 'Sprint car chassis manufacturer - technical support and setup recommendations'
  },
  {
    vehicle: 'Sport Mod',
    source: 'Shaw Race Cars',
    url: 'https://www.shawracecars.com',
    description: 'Sport mod and modified specialists - setup guides for IMCA and regional classes'
  },
  {
    vehicle: 'General Racing',
    source: 'Dirt Track Digest',
    url: 'https://dirttrackdigest.com',
    description: 'Dirt racing news and technical articles covering all classes and setup strategies'
  },
  {
    vehicle: 'General Racing',
    source: 'RacingJunk Tech Articles',
    url: 'https://www.racingjunk.com',
    description: 'Technical articles and setup guides from professional chassis builders and crew chiefs'
  }
];

export default function DirtTrackSetupGuide() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showReferences, setShowReferences] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<'entry' | 'exit' | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<'tight' | 'loose' | null>(null);

  const currentAdjustments = selectedPhase && selectedProblem && selectedVehicle
    ? (handlingAdjustments[selectedPhase]?.[selectedProblem]?.[selectedVehicle] ||
       handlingAdjustments[selectedPhase]?.[selectedProblem]?.['default'] || [])
    : [];

  const resetToVehicle = () => {
    setSelectedPhase(null);
    setSelectedProblem(null);
  };

  const resetAll = () => {
    setSelectedVehicle(null);
    setSelectedPhase(null);
    setSelectedProblem(null);
  };

  return (
    <div className="relative mb-6">
      <div className="liquid-glass overflow-hidden p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl md:text-3xl font-bold mb-2"
          >
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Setup Quick Fix
            </span>
          </motion.h2>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-600 dark:text-gray-400 mb-4"
          >
            See what to raise or lower to fix your handling
          </motion.p>

          {/* References Button */}
          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowReferences(true)}
            whileHover={{ scale: 1.02 }}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mx-auto"
          >
            <BookOpen className="w-3 h-3" />
            View References
          </motion.button>
        </div>

        {/* Step 1: Vehicle Selection */}
        {!selectedVehicle && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <div className="text-center mb-4">
              <h3 className="text-base font-bold mb-1">
                Choose Your Vehicle Type
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Click to get started
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {vehicleTypes.map((vehicle, index) => (
                <motion.button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden rounded-xl shadow-lg h-32 group"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 brightness-125 dark:brightness-100"
                    style={{
                      backgroundImage: `url(${vehicle.image})`,
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40" />
                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-3">
                    <h4 className="text-lg font-black text-white text-center leading-tight" style={{
                      textShadow: '0 0 10px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.9), 0 3px 6px rgba(0,0,0,1), 3px 3px 6px rgba(0,0,0,1), -3px -3px 6px rgba(0,0,0,1)',
                      fontWeight: '900'
                    }}>
                      {vehicle.name}
                    </h4>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Phase Selection (Entry/Exit) - Only show after vehicle selected */}
        <AnimatePresence mode="wait">
          {selectedVehicle && !selectedPhase && (
            <motion.div
              key="phase-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <div className="text-center mb-3">
                <div className="inline-block px-3 py-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
                  {vehicleTypes.find(v => v.id === selectedVehicle)?.name}
                </div>
                <h3 className="text-base font-bold mb-1">
                  When does the problem happen?
                </h3>
                <button
                  onClick={resetAll}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Change vehicle
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* CORNER ENTRY */}
                <motion.button
                  onClick={() => setSelectedPhase('entry')}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 p-5 rounded-xl font-semibold text-sm transition-all"
                >
                  <LogIn className="w-6 h-6 mx-auto mb-2" />
                  ENTRY
                  <div className="text-xs mt-1 opacity-75">Entering corner</div>
                </motion.button>

                {/* CORNER EXIT */}
                <motion.button
                  onClick={() => setSelectedPhase('exit')}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 p-5 rounded-xl font-semibold text-sm transition-all"
                >
                  <LogOut className="w-6 h-6 mx-auto mb-2" />
                  EXIT
                  <div className="text-xs mt-1 opacity-75">Exiting corner</div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Problem Selection (Tight/Loose) - Only show after phase selected */}
        <AnimatePresence mode="wait">
          {selectedVehicle && selectedPhase && !selectedProblem && (
            <motion.div
              key="problem-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <div className="text-center mb-3">
                <div className="inline-block px-3 py-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
                  {vehicleTypes.find(v => v.id === selectedVehicle)?.name} • {selectedPhase === 'entry' ? 'Entry' : 'Exit'}
                </div>
                <h3 className="text-base font-bold mb-1">
                  What's the problem?
                </h3>
                <button
                  onClick={resetToVehicle}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Back
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => setSelectedProblem('tight')}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 p-5 rounded-xl font-semibold text-sm transition-all"
                >
                  <div className="text-3xl mb-2">🔴</div>
                  TIGHT
                  <div className="text-xs mt-1 opacity-75">
                    {selectedPhase === 'entry' ? "Won't turn / Push" : "No drive / Push"}
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => setSelectedProblem('loose')}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 p-5 rounded-xl font-semibold text-sm transition-all"
                >
                  <div className="text-3xl mb-2">🔵</div>
                  LOOSE
                  <div className="text-xs mt-1 opacity-75">
                    {selectedPhase === 'entry' ? "Slides out" : "Spins / Wheel spin"}
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 4: Adjustments Panel */}
        <AnimatePresence mode="wait">
          {selectedVehicle && selectedPhase && selectedProblem && (
            <motion.div
              key={`${selectedPhase}-${selectedProblem}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4"
            >
              <div className={`p-4 rounded-lg ${
                selectedProblem === 'tight'
                  ? 'bg-red-500'
                  : 'bg-blue-500'
              } mb-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-white" />
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase">
                        {selectedPhase === 'entry' ? 'ENTRY' : 'EXIT'} - {selectedProblem === 'tight' ? 'TIGHT' : 'LOOSE'}
                      </h3>
                      <p className="text-xs text-white/80">
                        {vehicleTypes.find(v => v.id === selectedVehicle)?.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProblem(null)}
                    className="text-white/80 hover:text-white text-xs"
                  >
                    Back
                  </button>
                </div>
              </div>

              {/* Adjustments List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {currentAdjustments.map((adjustment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg ${
                      adjustment.direction === 'up'
                        ? 'bg-green-500'
                        : 'bg-orange-500'
                    } flex items-center justify-center flex-shrink-0`}>
                      {adjustment.direction === 'up' ? (
                        <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
                      ) : (
                        <ArrowDown className="w-5 h-5 text-white" strokeWidth={2.5} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold mb-0.5 truncate">{adjustment.part}</h4>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs font-semibold ${
                          adjustment.direction === 'up'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-orange-600 dark:text-orange-400'
                        }`}>
                          {adjustment.direction === 'up' ? 'RAISE' : 'LOWER'}
                        </span>
                        {adjustment.amount && (
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {adjustment.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pro Tip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
              >
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-400 mb-1">
                      Pro Tip
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                      Make ONE adjustment at a time and test. Start at the top. Track conditions change - write down what works!
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Getting Started Info - Only show when no vehicle selected */}
        {!selectedVehicle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 dark:border-amber-500/20"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 rounded-lg flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold mb-2">How It Works</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-semibold mb-0.5">1. Pick Your Car</p>
                    <p className="opacity-75">Choose vehicle type</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-0.5">2. Entry or Exit</p>
                    <p className="opacity-75">When it happens</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-0.5">3. Tight or Loose</p>
                    <p className="opacity-75">What's wrong</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-0.5">4. Get Solutions</p>
                    <p className="opacity-75">Fix it one step at a time</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Start Over Button - Show when deep in the flow */}
        {selectedVehicle && selectedPhase && selectedProblem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-center"
          >
            <button
              onClick={resetAll}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
            >
              Start over with different vehicle
            </button>
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[80vh] z-50 liquid-glass rounded-xl overflow-hidden flex flex-col shadow-xl"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0 bg-amber-500/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Setup References</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Chassis manufacturers & technical sources
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowReferences(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {references.map((ref, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                          <ChevronRight className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                              {ref.vehicle}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold mb-1">{ref.source}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                            {ref.description}
                          </p>
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                          >
                            Visit Website
                            <ChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    <strong className="text-gray-900 dark:text-gray-100">Disclaimer:</strong> All setup information from publicly available
                    manufacturer guidelines and industry practices. Always consult your chassis manufacturer and
                    adjust based on track conditions and class rules.
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
