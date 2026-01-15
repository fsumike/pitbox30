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
  Info
} from 'lucide-react';

interface TrackZone {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  position: string;
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
    color: 'from-green-500 to-emerald-600',
    position: 'top-[42%] left-[20%] right-[20%]'
  },
  {
    id: 'turn-1-2',
    name: 'Turns 1 & 2',
    description: 'Entry and mid-corner handling',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-600',
    position: 'top-[15%] right-[10%]'
  },
  {
    id: 'back-stretch',
    name: 'Back Stretch',
    description: 'Top speed and stability',
    icon: Wind,
    color: 'from-purple-500 to-violet-600',
    position: 'top-[42%] left-[20%] right-[20%]'
  },
  {
    id: 'turn-3-4',
    name: 'Turns 3 & 4',
    description: 'Exit and drive off',
    icon: Target,
    color: 'from-orange-500 to-red-600',
    position: 'bottom-[15%] left-[10%]'
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
    'sportmod': [
      {
        title: 'Final Drive Ratio',
        description: 'Optimize for track speed - typically 5.13-5.57 gear ratio.',
        icon: Settings
      },
      {
        title: 'Weight Balance',
        description: '52-53% rear weight for traction off corners.',
        icon: Gauge
      },
      {
        title: 'Anti-Roll Bar',
        description: 'Softer rear bar for better straight-line traction.',
        icon: Wrench
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
    'modified': [
      {
        title: 'Caster Split',
        description: '2-4 degrees more positive caster on right side for better turn-in.',
        icon: Settings
      },
      {
        title: 'Panhard Bar',
        description: 'Lower left side for more left rear bite in corners. 10-12" left side height on slick tracks.',
        icon: Gauge
      },
      {
        title: 'Front Shock Compression',
        description: 'Stiffer compression to control dive on entry. 6-8 valving on slick tracks.',
        icon: Wrench
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
    'sportmod': [
      {
        title: 'Camber Settings',
        description: '1-2 degrees negative left front camber for better grip.',
        icon: Settings
      },
      {
        title: 'Spring Rates',
        description: 'Softer right front (250 lb/in) on slick tracks.',
        icon: Gauge
      },
      {
        title: 'Shock Valving',
        description: 'Medium compression on front shocks for controlled entry.',
        icon: Wrench
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
    'modified': [
      {
        title: 'Chassis Height',
        description: 'Lower center of gravity for high-speed stability. 2-3" ground clearance.',
        icon: Settings
      },
      {
        title: 'Anti-Roll Bar',
        description: 'Stiffer front bar for reduced body roll at speed.',
        icon: Wrench
      },
      {
        title: 'Camber',
        description: 'Zero to slight positive camber on right side for stability.',
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
    'sportmod': [
      {
        title: 'Ride Height',
        description: 'Lower for better aerodynamics and stability.',
        icon: Settings
      },
      {
        title: 'Shock Compression',
        description: 'Firm all around for high-speed control.',
        icon: Wrench
      },
      {
        title: 'Rear Spoiler',
        description: 'Adjust angle for downforce vs. drag trade-off.',
        icon: Wind
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
    'modified': [
      {
        title: 'Rear Stagger',
        description: '1.5-2.5" stagger for exit drive. More stagger on slick tracks.',
        icon: Settings
      },
      {
        title: 'Pull Bar',
        description: 'Higher pull bar (split 17-19") for better exit bite.',
        icon: Gauge
      },
      {
        title: 'LR Spring',
        description: 'Softer LR spring (175-200 lb/in) for better exit rotation.',
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
    'sportmod': [
      {
        title: 'Differential',
        description: 'Limited-slip setting for equal drive from both rear tires.',
        icon: Settings
      },
      {
        title: 'Rear Weight',
        description: 'Move weight back for better exit traction.',
        icon: Gauge
      },
      {
        title: 'Shock Rebound',
        description: 'Softer rebound for planting rear tires.',
        icon: Wrench
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
    vehicle: 'Dirt Modified',
    source: 'Harris Auto Racing',
    url: 'https://www.harrisautoracing.com',
    description: 'Technical articles on modified setup for dirt track racing'
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
    source: 'King Racing Shocks',
    url: 'https://www.kingshocks.com',
    description: 'Shock valving recommendations for sprint cars on various track conditions'
  },
  {
    vehicle: 'Sprint Car',
    source: 'World of Outlaws Setup Guides',
    url: 'https://www.worldofoutlaws.com',
    description: 'Professional-level setup information from top World of Outlaws teams'
  },
  {
    vehicle: 'Sport Mod',
    source: 'LG2 Chassis',
    url: 'https://www.lg2chassis.com',
    description: 'Sport mod setup recommendations for IMCA dirt tracks'
  },
  {
    vehicle: 'Sport Mod',
    source: 'Shaw Race Cars',
    url: 'https://www.shawracecars.com',
    description: 'Technical bulletins covering suspension geometry and weight distribution'
  },
  {
    vehicle: 'Modified',
    source: 'Medieval Chassis',
    url: 'https://www.medievalchassis.com',
    description: 'UMP Modified setup guides for dirt track racing'
  },
  {
    vehicle: 'Street Stock',
    source: 'Factory Stock Racing',
    url: 'https://www.factorystockracing.com',
    description: 'Street stock setup basics for dirt oval racing'
  },
  {
    vehicle: 'Midget',
    source: 'Spike Chassis',
    url: 'https://www.spikechassis.com',
    description: 'Midget car setup information and technical specifications'
  },
  {
    vehicle: 'General Dirt Racing',
    source: 'Circle Track Magazine',
    url: 'https://www.circletrack.com',
    description: 'Technical articles covering dirt racing setup across all classes'
  },
  {
    vehicle: 'General Dirt Racing',
    source: 'Dirt Track Digest',
    url: 'https://www.dirttrackdigest.com',
    description: 'Setup tips and technical information for dirt track racers'
  }
];

export default function DirtTrackSetupGuide() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('late-model');
  const [showReferences, setShowReferences] = useState(false);

  const currentZone = trackZones.find(z => z.id === selectedZone);
  const currentSetupTips = selectedZone
    ? (setupData[selectedZone]?.[selectedVehicle] || setupData[selectedZone]?.['default'] || [])
    : [];

  return (
    <div className="relative mb-8">
      <div className="liquid-glass-hero overflow-hidden">
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-block p-3 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 mb-4">
            <MapPin className="w-12 h-12 text-brand-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-gold via-amber-400 to-orange-500 bg-clip-text text-transparent">
            Interactive Dirt Track Setup Guide
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Professional setup recommendations for every section of the track.
            Click on any zone to see specific adjustments for your vehicle type.
          </p>

          {/* Vehicle Type Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {vehicleTypes.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedVehicle === vehicle.id
                    ? 'bg-gradient-to-r from-brand-gold to-amber-500 text-black shadow-lg scale-105'
                    : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70'
                }`}
              >
                <span className="mr-2">{vehicle.icon}</span>
                {vehicle.name}
              </button>
            ))}
          </div>

          {/* References Button */}
          <button
            onClick={() => setShowReferences(true)}
            className="liquid-glass-btn flex items-center gap-2 mx-auto"
          >
            <BookOpen className="w-5 h-5" />
            View All References & Sources
          </button>
        </div>

        {/* Interactive Track Visualization */}
        <div className="relative w-full max-w-5xl mx-auto mb-8" style={{ aspectRatio: '16/9' }}>
          {/* Track Background */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            {/* Dirt texture background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-amber-800 opacity-90" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />

            {/* Racing oval track */}
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Outer track boundary */}
              <ellipse
                cx="400"
                cy="300"
                rx="350"
                ry="240"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
                strokeDasharray="10,5"
              />

              {/* Inner track boundary */}
              <ellipse
                cx="400"
                cy="300"
                rx="250"
                ry="140"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
                strokeDasharray="10,5"
              />

              {/* Clickable zones with hover effects */}
              {/* Front Stretch */}
              <motion.path
                d="M 150 240 L 650 240 L 650 360 L 150 360 Z"
                fill={selectedZone === 'front-stretch' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255,255,255,0.1)'}
                stroke="rgba(34, 197, 94, 0.8)"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onClick={() => setSelectedZone('front-stretch')}
                whileHover={{ fill: 'rgba(34, 197, 94, 0.3)' }}
              />

              {/* Turn 1-2 */}
              <motion.ellipse
                cx="650"
                cy="300"
                rx="150"
                ry="150"
                fill={selectedZone === 'turn-1-2' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255,255,255,0.1)'}
                stroke="rgba(59, 130, 246, 0.8)"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onClick={() => setSelectedZone('turn-1-2')}
                whileHover={{ fill: 'rgba(59, 130, 246, 0.3)' }}
              />

              {/* Back Stretch */}
              <motion.path
                d="M 150 240 L 150 360 L 650 360 L 650 240"
                fill={selectedZone === 'back-stretch' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255,255,255,0.1)'}
                stroke="rgba(168, 85, 247, 0.8)"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onClick={() => setSelectedZone('back-stretch')}
                whileHover={{ fill: 'rgba(168, 85, 247, 0.3)' }}
                style={{ strokeDasharray: '5,5' }}
              />

              {/* Turn 3-4 */}
              <motion.ellipse
                cx="150"
                cy="300"
                rx="150"
                ry="150"
                fill={selectedZone === 'turn-3-4' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(255,255,255,0.1)'}
                stroke="rgba(249, 115, 22, 0.8)"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onClick={() => setSelectedZone('turn-3-4')}
                whileHover={{ fill: 'rgba(249, 115, 22, 0.3)' }}
              />

              {/* Zone Labels */}
              <text x="400" y="290" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" className="pointer-events-none">
                FRONT STRETCH
              </text>
              <text x="650" y="200" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" className="pointer-events-none">
                TURN 1-2
              </text>
              <text x="400" y="480" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" className="pointer-events-none">
                BACK STRETCH
              </text>
              <text x="150" y="390" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" className="pointer-events-none">
                TURN 3-4
              </text>

              {/* Direction arrow */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="rgba(251, 191, 36, 1)" />
                </marker>
              </defs>
              <path
                d="M 400 130 Q 600 130, 680 300"
                stroke="rgba(251, 191, 36, 0.8)"
                strokeWidth="4"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              <text x="500" y="120" textAnchor="middle" fill="rgba(251, 191, 36, 1)" fontSize="18" fontWeight="bold">
                DIRECTION →
              </text>
            </svg>
          </div>

          {/* Floating instruction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold flex items-center gap-2 shadow-xl"
          >
            <Info className="w-5 h-5 text-brand-gold" />
            Click any track zone to see setup tips
          </motion.div>
        </div>

        {/* Setup Tips Panel */}
        <AnimatePresence mode="wait">
          {selectedZone && currentZone && (
            <motion.div
              key={selectedZone}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <div className={`p-6 rounded-2xl bg-gradient-to-r ${currentZone.color} mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {React.createElement(currentZone.icon, {
                      className: "w-8 h-8 text-white"
                    })}
                    <div>
                      <h3 className="text-2xl font-bold text-white">{currentZone.name}</h3>
                      <p className="text-white/90">{currentZone.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentSetupTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="liquid-glass-card hover:scale-105 transition-transform"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentZone.color} flex items-center justify-center mb-4`}>
                      {React.createElement(tip.icon, {
                        className: "w-6 h-6 text-white"
                      })}
                    </div>
                    <h4 className="text-lg font-bold mb-2">{tip.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-400 mb-1">
                      Track Condition Tip
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      These recommendations are starting points. Always adjust based on your specific track conditions,
                      tire compound, and how the track changes throughout the race day. Heavy/tacky tracks typically need
                      softer springs and less wedge, while dry-slick tracks need stiffer springs and more wedge.
                    </p>
                  </div>
                </div>
              </div>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowReferences(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[80vh] z-50 liquid-glass rounded-3xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-brand-gold" />
                  <div>
                    <h3 className="text-2xl font-bold">Setup References & Sources</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Legitimate dirt racing chassis manufacturers and technical sources
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReferences(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {references.map((ref, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="liquid-glass-card hover:scale-102 transition-transform"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-gold to-amber-500 flex items-center justify-center flex-shrink-0">
                          <ChevronRight className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-brand-gold/20 text-brand-gold">
                              {ref.vehicle}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold mb-1">{ref.source}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {ref.description}
                          </p>
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                          >
                            Visit Website
                            <ChevronRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Disclaimer:</strong> All setup information is compiled from publicly available
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
