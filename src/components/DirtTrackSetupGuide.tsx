import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  BookOpen,
  TrendingUp,
  Settings,
  Zap,
  X,
  ChevronRight,
  Target,
  Wind,
  Gauge,
  Wrench,
  Info,
  Award,
  Sparkles
} from 'lucide-react';

interface TrackZone {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface VehicleType {
  id: string;
  name: string;
  icon: string;
}

interface SetupTip {
  title: string;
  description: string;
  icon: React.ElementType;
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

const trackZones: TrackZone[] = [
  {
    id: 'front-stretch',
    name: 'Front Stretch',
    description: 'Acceleration and straightaway speed',
    icon: Zap,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'turn-1-2',
    name: 'Turns 1 & 2',
    description: 'Entry and mid-corner handling',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'back-stretch',
    name: 'Back Stretch',
    description: 'Top speed and stability',
    icon: Wind,
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'turn-3-4',
    name: 'Turns 3 & 4',
    description: 'Exit and drive off',
    icon: Target,
    color: 'from-orange-500 to-red-600'
  }
];

const setupData: Record<string, Record<string, SetupTip[]>> = {
  'front-stretch': {
    'late-model': [
      {
        title: 'Rear Gear Selection',
        description: 'Choose gear for max acceleration off turn 4. Aim for peak RPM at finish line on heavy tracks, slightly lower on slick tracks.',
        icon: Settings
      },
      {
        title: 'Weight Distribution',
        description: '52-54% rear weight. More rear weight for better acceleration on dry-slick tracks.',
        icon: Gauge
      },
      {
        title: 'Shock Valving',
        description: 'Softer rebound on rear shocks to maintain traction during acceleration.',
        icon: Wrench
      }
    ],
    'modified': [
      {
        title: 'Transmission Gear',
        description: 'Set final drive ratio for peak RPM at start/finish line. Lower gear for heavy tracks.',
        icon: Settings
      },
      {
        title: 'J-Bar Height',
        description: 'Lower J-bar for more forward bite during acceleration.',
        icon: Gauge
      },
      {
        title: 'Pinion Angle',
        description: '3-5 degrees negative for maximum power transfer on acceleration.',
        icon: Wrench
      }
    ],
    'sprint-car': [
      {
        title: 'Wing Angle',
        description: 'Higher wing angle for more downforce if track is heavy. Less angle for speed on slick tracks.',
        icon: Wind
      },
      {
        title: 'Torsion Bar Rates',
        description: 'Stiffer right rear bar for better acceleration on straightaway.',
        icon: Settings
      },
      {
        title: 'Stagger',
        description: '1-2 inches stagger. More stagger on slick tracks for forward drive.',
        icon: Gauge
      }
    ],
    'default': [
      {
        title: 'Gear Selection',
        description: 'Choose gear for optimal RPM at finish line based on track conditions.',
        icon: Settings
      },
      {
        title: 'Weight Distribution',
        description: 'Balance rear weight for maximum traction during acceleration.',
        icon: Gauge
      },
      {
        title: 'Shock Setup',
        description: 'Adjust shock valving for controlled weight transfer.',
        icon: Wrench
      }
    ]
  },
  'turn-1-2': {
    'late-model': [
      {
        title: 'Front Springs',
        description: 'Softer left front spring (200-250 lb/in) on tacky tracks for better bite. Stiffer (275-325 lb/in) on slick tracks.',
        icon: Settings
      },
      {
        title: 'Crossweight',
        description: 'Start at 50% crossweight. Add crossweight (up to 52%) on slick tracks for better entry.',
        icon: Gauge
      },
      {
        title: 'Rear Steer',
        description: '1/8" to 1/4" right rear forward for better turn entry. More on slick tracks.',
        icon: Target
      }
    ],
    'sprint-car': [
      {
        title: 'Left Rear Torsion Bar',
        description: 'Softer LR bar (850-900 lb/in) for tacky tracks. Stiffer (950-1000 lb/in) for slick.',
        icon: Settings
      },
      {
        title: 'Front Wing',
        description: 'Lower angle (6-10 degrees) on slick tracks for better rotation.',
        icon: Wind
      },
      {
        title: 'Birdcage Position',
        description: 'Forward position for more bite entering corners.',
        icon: Target
      }
    ],
    'default': [
      {
        title: 'Turn Entry Setup',
        description: 'Adjust front end geometry for smooth corner entry.',
        icon: Settings
      },
      {
        title: 'Weight Transfer',
        description: 'Control weight transfer to maintain grip.',
        icon: Gauge
      },
      {
        title: 'Steering Response',
        description: 'Fine-tune for immediate steering response.',
        icon: Target
      }
    ]
  },
  'back-stretch': {
    'late-model': [
      {
        title: 'Rear Spoiler',
        description: 'More spoiler angle (60-65 degrees) on slick tracks for stability. Less (55-60) on tacky.',
        icon: Wind
      },
      {
        title: 'Shock Valving',
        description: 'Stiffer compression on all corners for high-speed stability.',
        icon: Settings
      },
      {
        title: 'Toe Settings',
        description: '1/16" to 1/8" total toe-in for straight-line stability.',
        icon: Gauge
      }
    ],
    'sprint-car': [
      {
        title: 'Top Wing',
        description: 'Higher angle (12-15 degrees) for maximum downforce and stability.',
        icon: Wind
      },
      {
        title: 'Shock Settings',
        description: 'High-speed compression valving to control car at top speed.',
        icon: Settings
      },
      {
        title: 'Weight Distribution',
        description: 'Balance front-to-rear for stable high-speed handling.',
        icon: Gauge
      }
    ],
    'default': [
      {
        title: 'Stability Setup',
        description: 'Optimize for maximum straight-line stability.',
        icon: Settings
      },
      {
        title: 'Aerodynamics',
        description: 'Balance downforce and drag for top speed.',
        icon: Wind
      },
      {
        title: 'Shock Control',
        description: 'Firm compression for high-speed control.',
        icon: Wrench
      }
    ]
  },
  'turn-3-4': {
    'late-model': [
      {
        title: 'Rear Spring Split',
        description: 'Stiffer RR spring (225-275 lb/in) for better exit drive. More split on slick tracks.',
        icon: Settings
      },
      {
        title: 'Lift Bar/J-Bar',
        description: 'Raise bar for more forward drive off corner. 14-16" on slick tracks.',
        icon: Gauge
      },
      {
        title: 'Exit Shock',
        description: 'Softer rebound on RR shock to plant tire and maximize exit traction.',
        icon: Wrench
      }
    ],
    'sprint-car': [
      {
        title: 'RR Torsion Bar',
        description: 'Stiffer RR bar (1000-1100 lb/in) for maximum exit drive.',
        icon: Settings
      },
      {
        title: 'Stagger',
        description: '2-3" stagger. Maximum stagger on dry-slick tracks.',
        icon: Gauge
      },
      {
        title: 'Wing Angle',
        description: 'Increase angle exiting corner for more forward bite.',
        icon: Wind
      }
    ],
    'default': [
      {
        title: 'Exit Traction',
        description: 'Maximize rear tire grip for corner exit.',
        icon: Settings
      },
      {
        title: 'Forward Drive',
        description: 'Setup for optimal acceleration off corner.',
        icon: Gauge
      },
      {
        title: 'Weight Transfer',
        description: 'Control weight transfer for maximum drive.',
        icon: Wrench
      }
    ]
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
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('late-model');
  const [showReferences, setShowReferences] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const currentZone = trackZones.find(z => z.id === selectedZone);
  const currentSetupTips = selectedZone
    ? (setupData[selectedZone]?.[selectedVehicle] || setupData[selectedZone]?.['default'] || [])
    : [];

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
              Interactive 3D Track Guide
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
            Professional setup recommendations for every section of the track
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
                onClick={() => setSelectedVehicle(vehicle.id)}
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

        {/* 3D Track Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="relative w-full max-w-6xl mx-auto mb-12"
          style={{ perspective: '1500px' }}
        >
          <div
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
            style={{
              aspectRatio: '16/10',
              transformStyle: 'preserve-3d',
              transform: 'rotateX(20deg)'
            }}
          >
            {/* Track Container with 3D effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-amber-900 to-yellow-900">
              {/* Dirt texture overlay */}
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.3) 0%, transparent 50%),
                  repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(101, 67, 33, 0.1) 10px, rgba(101, 67, 33, 0.1) 11px)
                `
              }} />

              {/* Animated dust particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-amber-300/30 rounded-full"
                    initial={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      opacity: 0.3
                    }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 10 + Math.random() * 10,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                ))}
              </div>

              {/* 3D Track Zones - CORRECTED LAYOUT */}
              <div className="absolute inset-0 p-8">
                {/* Front Stretch (bottom) */}
                <motion.div
                  className="absolute bottom-[10%] left-[15%] right-[15%] h-[25%] cursor-pointer rounded-2xl"
                  style={{
                    background: selectedZone === 'front-stretch' || hoveredZone === 'front-stretch'
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(16, 185, 129, 0.5))'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
                    boxShadow: selectedZone === 'front-stretch' || hoveredZone === 'front-stretch'
                      ? '0 20px 60px rgba(34, 197, 94, 0.4), inset 0 0 40px rgba(34, 197, 94, 0.2)'
                      : '0 10px 30px rgba(0, 0, 0, 0.3)',
                    border: '2px solid rgba(34, 197, 94, 0.5)',
                    transform: selectedZone === 'front-stretch' || hoveredZone === 'front-stretch'
                      ? 'translateZ(20px) scale(1.02)'
                      : 'translateZ(0px)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedZone('front-stretch')}
                  onMouseEnter={() => setHoveredZone('front-stretch')}
                  onMouseLeave={() => setHoveredZone(null)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl md:text-4xl font-black text-white drop-shadow-lg">
                      FRONT STRETCH
                    </span>
                  </div>
                </motion.div>

                {/* Turn 1-2 (RIGHT side - first turn after front stretch) */}
                <motion.div
                  className="absolute top-[10%] right-[10%] w-[35%] h-[35%] cursor-pointer rounded-full"
                  style={{
                    background: selectedZone === 'turn-1-2' || hoveredZone === 'turn-1-2'
                      ? 'radial-gradient(circle, rgba(59, 130, 246, 0.5), rgba(37, 99, 235, 0.5))'
                      : 'radial-gradient(circle, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
                    boxShadow: selectedZone === 'turn-1-2' || hoveredZone === 'turn-1-2'
                      ? '0 20px 60px rgba(59, 130, 246, 0.4), inset 0 0 40px rgba(59, 130, 246, 0.2)'
                      : '0 10px 30px rgba(0, 0, 0, 0.3)',
                    border: '2px solid rgba(59, 130, 246, 0.5)',
                    transform: selectedZone === 'turn-1-2' || hoveredZone === 'turn-1-2'
                      ? 'translateZ(20px) scale(1.02)'
                      : 'translateZ(0px)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedZone('turn-1-2')}
                  onMouseEnter={() => setHoveredZone('turn-1-2')}
                  onMouseLeave={() => setHoveredZone(null)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl md:text-3xl font-black text-white drop-shadow-lg">
                      TURN 1-2
                    </span>
                  </div>
                </motion.div>

                {/* Back Stretch (top) */}
                <motion.div
                  className="absolute top-[10%] left-[15%] right-[15%] h-[25%] cursor-pointer rounded-2xl"
                  style={{
                    background: selectedZone === 'back-stretch' || hoveredZone === 'back-stretch'
                      ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(147, 51, 234, 0.5))'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
                    boxShadow: selectedZone === 'back-stretch' || hoveredZone === 'back-stretch'
                      ? '0 20px 60px rgba(168, 85, 247, 0.4), inset 0 0 40px rgba(168, 85, 247, 0.2)'
                      : '0 10px 30px rgba(0, 0, 0, 0.3)',
                    border: '2px solid rgba(168, 85, 247, 0.5)',
                    transform: selectedZone === 'back-stretch' || hoveredZone === 'back-stretch'
                      ? 'translateZ(20px) scale(1.02)'
                      : 'translateZ(0px)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedZone('back-stretch')}
                  onMouseEnter={() => setHoveredZone('back-stretch')}
                  onMouseLeave={() => setHoveredZone(null)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl md:text-4xl font-black text-white drop-shadow-lg">
                      BACK STRETCH
                    </span>
                  </div>
                </motion.div>

                {/* Turn 3-4 (LEFT side - second turn after back stretch) */}
                <motion.div
                  className="absolute bottom-[10%] left-[10%] w-[35%] h-[35%] cursor-pointer rounded-full"
                  style={{
                    background: selectedZone === 'turn-3-4' || hoveredZone === 'turn-3-4'
                      ? 'radial-gradient(circle, rgba(249, 115, 22, 0.5), rgba(234, 88, 12, 0.5))'
                      : 'radial-gradient(circle, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
                    boxShadow: selectedZone === 'turn-3-4' || hoveredZone === 'turn-3-4'
                      ? '0 20px 60px rgba(249, 115, 22, 0.4), inset 0 0 40px rgba(249, 115, 22, 0.2)'
                      : '0 10px 30px rgba(0, 0, 0, 0.3)',
                    border: '2px solid rgba(249, 115, 22, 0.5)',
                    transform: selectedZone === 'turn-3-4' || hoveredZone === 'turn-3-4'
                      ? 'translateZ(20px) scale(1.02)'
                      : 'translateZ(0px)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedZone('turn-3-4')}
                  onMouseEnter={() => setHoveredZone('turn-3-4')}
                  onMouseLeave={() => setHoveredZone(null)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl md:text-3xl font-black text-white drop-shadow-lg">
                      TURN 3-4
                    </span>
                  </div>
                </motion.div>

                {/* Direction Arrow - Counter-Clockwise (showing proper direction) */}
                <motion.div
                  className="absolute top-[45%] right-[48%]"
                  animate={{
                    rotate: [0, -360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-60" />
                    <div className="relative bg-black/80 backdrop-blur-sm px-8 py-6 rounded-full border-4 border-amber-400 shadow-2xl">
                      <div className="flex items-center justify-center">
                        <div className="text-6xl font-black text-amber-400">↺</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Direction Label */}
                <motion.div
                  className="absolute bottom-[40%] right-[5%]"
                  animate={{
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-400 blur-xl opacity-50" />
                    <div className="relative bg-black/70 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-amber-400 shadow-xl">
                      <div className="text-center">
                        <div className="text-2xl font-black text-amber-400">TURNING LEFT</div>
                        <div className="text-sm text-amber-300">Counter-Clockwise</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Track center infield */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] h-[50%] rounded-full bg-gradient-to-br from-green-900/40 to-green-800/40 shadow-inner" />
            </div>
          </div>

          {/* Floating instruction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-8 py-4 rounded-full text-white font-bold flex items-center gap-3 shadow-2xl border border-amber-500/30"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Info className="w-6 h-6 text-amber-400" />
            </motion.div>
            <span className="text-lg">Click any track zone to see setup tips</span>
          </motion.div>
        </motion.div>

        {/* Setup Tips Panel */}
        <AnimatePresence mode="wait">
          {selectedZone && currentZone && (
            <motion.div
              key={selectedZone}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              className="mt-12"
            >
              <div className={`p-8 rounded-3xl bg-gradient-to-r ${currentZone.color} mb-8 shadow-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      {React.createElement(currentZone.icon, {
                        className: "w-10 h-10 text-white"
                      })}
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">{currentZone.name}</h3>
                      <p className="text-lg text-white/90">{currentZone.description}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setSelectedZone(null)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                  >
                    <X className="w-8 h-8 text-white" />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentSetupTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="liquid-glass-card relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${currentZone.color} flex items-center justify-center mb-4 shadow-lg`}>
                        {React.createElement(tip.icon, {
                          className: "w-7 h-7 text-white"
                        })}
                      </div>
                      <h4 className="text-xl font-bold mb-3">{tip.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tip.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

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
                      Track Condition Tip
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      These recommendations are starting points. Always adjust based on your specific track conditions,
                      tire compound, and how the track changes throughout the race day. Heavy/tacky tracks typically need
                      softer springs and less wedge, while dry-slick tracks need stiffer springs and more wedge.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
