import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Activity, Gauge, Calculator, BookOpen, Droplet, Weight, Settings, Ruler, ChevronDown, Zap, Camera, Axis3d } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import { Capacitor } from '@capacitor/core';

const MotorHealthTool = React.lazy(() => import('../components/tools/MotorHealthTool'));
const TireManagementTool = React.lazy(() => import('../components/tools/TireManagementTool'));
const MaintenanceTool = React.lazy(() => import('../components/tools/MaintenanceTool'));
const GearCalculatorTool = React.lazy(() => import('../components/tools/GearCalculatorTool'));
const TrackNotebookTool = React.lazy(() => import('../components/tools/TrackNotebookTool'));
const FuelCalculatorTool = React.lazy(() => import('../components/tools/FuelCalculatorTool'));
const WeightCalculatorTool = React.lazy(() => import('../components/tools/WeightCalculatorTool'));
const SpringCalculatorTool = React.lazy(() => import('../components/tools/SpringCalculatorTool'));
const StaggerCalculatorTool = React.lazy(() => import('../components/tools/StaggerCalculatorTool'));
const TorsionBarTool = React.lazy(() => import('../components/tools/TorsionBarTool'));
const ShockInventoryTool = React.lazy(() => import('../components/tools/ShockInventoryTool'));
const PinionAngleCalculatorTool = React.lazy(() => import('../components/tools/PinionAngleCalculatorTool'));

interface Tool {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  component: React.ReactNode;
  category: 'tracking' | 'calculator' | 'maintenance';
}

const tools: Tool[] = [
  {
    id: 'motor-health',
    name: 'Motor Health',
    icon: Activity,
    description: 'Track engine hours, maintenance, and refresh schedules',
    component: <MotorHealthTool />,
    category: 'tracking'
  },
  {
    id: 'tire-management',
    name: 'Tire Management',
    icon: Gauge,
    description: 'Manage tire inventory, track wear patterns, and optimize tire strategy',
    component: <TireManagementTool />,
    category: 'tracking'
  },
  {
    id: 'maintenance',
    name: 'Maintenance Checklist',
    icon: Wrench,
    description: 'Pre-race, post-race, and shop maintenance checklists',
    component: <MaintenanceTool />,
    category: 'maintenance'
  },
  {
    id: 'gear-calculator',
    name: 'Gear Ratio Calculator',
    icon: Calculator,
    description: 'Calculate optimal gear ratios for your track and conditions',
    component: <GearCalculatorTool />,
    category: 'calculator'
  },
  {
    id: 'track-notebook',
    name: 'Track Notebook',
    icon: BookOpen,
    description: 'Keep detailed notes on track conditions, setups, and results',
    component: <TrackNotebookTool />,
    category: 'tracking'
  },
  {
    id: 'fuel-calculator',
    name: 'Fuel Calculator',
    icon: Droplet,
    description: 'Calculate fuel requirements and track consumption',
    component: <FuelCalculatorTool />,
    category: 'calculator'
  },
  {
    id: 'weight-calculator',
    name: 'Weight Distribution',
    icon: Weight,
    description: 'Calculate cross-weight, wedge, and weight percentages',
    component: <WeightCalculatorTool />,
    category: 'calculator'
  },
  {
    id: 'spring-calculator',
    name: 'Spring Rate Calculator',
    icon: Settings,
    description: 'Calculate wheel rates and spring forces',
    component: <SpringCalculatorTool />,
    category: 'calculator'
  },
  {
    id: 'stagger-calculator',
    name: 'Stagger Calculator',
    icon: Ruler,
    description: 'Calculate tire stagger for optimal handling',
    component: <StaggerCalculatorTool />,
    category: 'calculator'
  },
  {
    id: 'torsion-bar',
    name: 'Torsion Bar Calculator',
    icon: Zap,
    description: 'Calculate torsion bar rates and manage inventory for sprint cars',
    component: <TorsionBarTool />,
    category: 'calculator'
  },
  {
    id: 'shock-inventory',
    name: 'Shock Inventory',
    icon: Camera,
    description: 'Track shock serial numbers and dyno sheets for easy reference',
    component: <ShockInventoryTool />,
    category: 'tracking'
  },
  {
    id: 'pinion-angle',
    name: 'Pinion Angle Calculator',
    icon: Axis3d,
    description: 'Calculate driveline angles to eliminate vibration and maximize power',
    component: <PinionAngleCalculatorTool />,
    category: 'calculator'
  }
];

export default function Tools() {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string>('');
  const [isChanging, setIsChanging] = useState(false);

  const activeToolData = tools.find(t => t.id === activeTool);
  const isNative = Capacitor.isNativePlatform();

  const handleToolChange = (toolId: string) => {
    if (toolId === activeTool) return;

    setIsChanging(true);

    setTimeout(() => {
      setActiveTool(toolId);
      setIsChanging(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-20 safe-area-bottom relative">
      <div className="liquid-orb liquid-orb-gold w-64 h-64 -top-20 -left-20 fixed z-0" />
      <div className="liquid-orb liquid-orb-amber w-48 h-48 bottom-20 -right-10 fixed z-0" style={{ animationDelay: '-8s' }} />

      <div className="liquid-glass-hero p-4 sm:p-6 mb-4 sm:mb-6 safe-area-top relative z-10">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 relative z-10">
          <button
            onClick={handleBackClick}
            className="p-2 sm:p-3 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-colors active:scale-95"
            aria-label="Go back to previous page"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/30 blur-xl rounded-full" />
              <img
                src="/android-icon-192-192.png"
                alt="PIT-BOX.COM"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0 relative z-10"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold truncate bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">Racing Tools</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
                Professional tools to help you win races
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <label
            className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
          >
            Select a Tool
          </label>
          <div className="relative w-full">
            <select
              value={activeTool}
              onChange={(e) => handleToolChange(e.target.value)}
              disabled={isChanging}
              className="liquid-glass-input text-base sm:text-lg font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
              style={{ minHeight: '52px', paddingRight: '40px' }}
              aria-label="Select a racing tool"
            >
              <option value="">Select a tool...</option>
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="w-5 h-5 absolute pointer-events-none text-gray-600 dark:text-gray-400"
              style={{
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!activeTool ? (
          <motion.div
            key="promo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 relative z-10"
          >
            {/* Hero Promo Section */}
            <div className="liquid-glass-hero p-8 text-center relative">
              <div className="mb-6 relative z-10">
                <Wrench className="w-16 h-16 text-brand-gold mx-auto mb-4 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
                  Professional Racing Tools
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                  Access championship-caliber tools designed by racers, for racers.
                  Everything you need to gain a competitive edge and dominate on race day.
                </p>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="liquid-glass-card hover:scale-105 transition-transform">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Track & Monitor</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Keep detailed records of motor health, tire wear, maintenance schedules, and track conditions.
                  Never miss a rebuild or lose track of your equipment again.
                </p>
              </div>

              <div className="liquid-glass-card hover:scale-105 transition-transform">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Calculate Precisely</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Make data-driven decisions with calculators for gear ratios, weight distribution,
                  spring rates, stagger, fuel requirements, and more.
                </p>
              </div>

              <div className="liquid-glass-card hover:scale-105 transition-transform">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Stay Organized</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive checklists ensure nothing gets missed. Pre-race, post-race, and shop
                  maintenance all in one place.
                </p>
              </div>
            </div>

            {/* Available Tools List */}
            <div className="liquid-glass p-8 relative">
              <h3 className="text-2xl font-bold mb-6 text-center relative z-10">
                12 Professional Tools at Your Fingertips
              </h3>
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto relative z-10">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center gap-3 p-4 rounded-2xl liquid-glass-card hover:scale-102 transition-all cursor-pointer"
                    onClick={() => handleToolChange(tool.id)}
                  >
                    {React.createElement(tool.icon, {
                      className: "w-6 h-6 text-brand-gold flex-shrink-0"
                    })}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{tool.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="liquid-glass-hero p-8 text-center relative">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Ready to Win More Races?</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  Select a tool from the dropdown above and start making better decisions today.
                  Used by champions across all racing disciplines.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => navigate('/subscription')}
                    className="liquid-glass-btn flex items-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Upgrade to Premium
                  </button>
                  <button
                    onClick={() => navigate('/community')}
                    className="liquid-glass-card px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    Join Racing Community
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="liquid-glass p-4 sm:p-6 relative z-10"
            role="main"
            aria-live="polite"
            aria-busy={isChanging}
          >
            {activeToolData && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  {React.createElement(activeToolData.icon, {
                    className: "w-6 h-6 text-brand-gold",
                    'aria-hidden': 'true'
                  })}
                  <h2 className="text-2xl font-bold" id="tool-title">
                    {activeToolData.name}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400" id="tool-description">
                  {activeToolData.description}
                </p>
              </div>
            )}

            <Suspense
              fallback={
                <div role="status" aria-label="Loading tool content">
                  <LoadingSpinner />
                </div>
              }
            >
              {activeToolData?.component}
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
