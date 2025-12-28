import React, { useState, Suspense, useRef, useEffect } from 'react';
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const activeToolData = tools.find(t => t.id === activeTool);
  const isNative = Capacitor.isNativePlatform();

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    }
  };

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
    setTimeout(() => updateDropdownPosition(), 0);
  };

  useEffect(() => {
    if (!showDropdown) return;

    updateDropdownPosition();

    const handleScroll = () => {
      updateDropdownPosition();
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        if (buttonRef.current && !buttonRef.current.contains(target)) {
          setShowDropdown(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleToolChange = (toolId: string) => {
    if (toolId === activeTool) return;

    setIsChanging(true);
    setShowDropdown(false);

    setTimeout(() => {
      setActiveTool(toolId);
      setIsChanging(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen pb-20 safe-area-bottom">
      <div className="carbon-fiber-panel p-4 sm:p-6 mb-4 sm:mb-6 bg-gradient-to-br from-blue-500/30 to-orange-500/30 safe-area-top">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <button
            onClick={handleBackClick}
            className="p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors active:scale-95"
            aria-label="Go back to previous page"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <img
              src="/android-icon-192-192.png"
              alt="PIT-BOX.COM"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">Racing Tools</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
                Professional tools to help you win races
              </p>
            </div>
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
          >
            Select a Tool
          </label>
          <div className="relative w-full">
            <button
              ref={buttonRef}
              onClick={handleDropdownClick}
              disabled={isChanging}
              className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-brand-gold focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-left flex items-center justify-between"
              style={{ minHeight: '52px' }}
              aria-label="Select a racing tool"
              aria-haspopup="listbox"
              aria-expanded={showDropdown}
            >
              <span>{activeToolData?.name || 'Select a tool...'}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform flex-shrink-0 ${showDropdown ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-pointer"
                    onClick={() => setShowDropdown(false)}
                    style={{ pointerEvents: 'auto' }}
                    aria-hidden="true"
                  />
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="fixed bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
                    style={{
                      top: `${dropdownPos.top}px`,
                      left: `${Math.max(8, dropdownPos.left)}px`,
                      width: `${dropdownPos.width}px`,
                      maxWidth: 'calc(100vw - 16px)',
                      pointerEvents: 'auto'
                    }}
                    role="listbox"
                  >
                    <button
                      onClick={() => {
                        setActiveTool('');
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 font-medium"
                      role="option"
                    >
                      Select a tool...
                    </button>
                    {tools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleToolChange(tool.id)}
                        className={`w-full px-4 py-3 text-left font-medium transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                          activeTool === tool.id
                            ? 'bg-brand-gold/10 text-brand-gold'
                            : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        role="option"
                        aria-selected={activeTool === tool.id}
                      >
                        {tool.name}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
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
            className="space-y-6"
          >
            {/* Hero Promo Section */}
            <div className="carbon-fiber-panel p-8 bg-gradient-to-br from-brand-gold/25 to-brand-gold-dark/20 text-center">
              <div className="mb-6">
                <Wrench className="w-16 h-16 text-brand-gold mx-auto mb-4 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gold-gradient">
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
              <div className="glass-panel p-6 card-interactive">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Track & Monitor</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Keep detailed records of motor health, tire wear, maintenance schedules, and track conditions.
                  Never miss a rebuild or lose track of your equipment again.
                </p>
              </div>

              <div className="glass-panel p-6 card-interactive">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Calculate Precisely</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Make data-driven decisions with calculators for gear ratios, weight distribution,
                  spring rates, stagger, fuel requirements, and more.
                </p>
              </div>

              <div className="glass-panel p-6 card-interactive">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Stay Organized</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive checklists ensure nothing gets missed. Pre-race, post-race, and shop
                  maintenance all in one place.
                </p>
              </div>
            </div>

            {/* Available Tools List */}
            <div className="glass-panel p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <h3 className="text-2xl font-bold mb-6 text-center">
                12 Professional Tools at Your Fingertips
              </h3>
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center gap-3 p-4 rounded-lg bg-white/80 dark:bg-gray-700/60 hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer"
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
            <div className="glass-panel p-8 text-center bg-gradient-to-br from-brand-gold/35 via-brand-gold/25 to-brand-gold/20">
              <h3 className="text-2xl font-bold mb-4">Ready to Win More Races?</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Select a tool from the dropdown above and start making better decisions today.
                Used by champions across all racing disciplines.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => navigate('/subscription')}
                  className="btn-primary flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Upgrade to Premium
                </button>
                <button
                  onClick={() => navigate('/community')}
                  className="btn-secondary flex items-center gap-2"
                >
                  Join Racing Community
                </button>
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
            className="glass-panel p-4 sm:p-6"
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
