import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gauge, ChevronDown, ChevronUp, AlertCircle, 
  Clock, Activity, ThermometerSun, Droplets 
} from 'lucide-react';

interface TireManagementContainerProps {
  className?: string;
}

interface TireInfo {
  compound: string;
  age: string;
  laps: number;
  pressure: string;
  temperature: string;
  wear: string;
  grooving: string;
  siping: string;
  stagger: string;
  durometer: string;
}

function TireManagementContainer({ className = '' }: TireManagementContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const tires: Record<string, TireInfo> = {
    'Left Front': {
      compound: 'Hoosier D35',
      age: '2 days',
      laps: 0,
      pressure: '12 psi',
      temperature: '95°F',
      wear: 'New',
      grooving: 'Standard',
      siping: 'Full',
      stagger: 'N/A',
      durometer: '55'
    },
    'Right Front': {
      compound: 'Hoosier D35',
      age: '2 days',
      laps: 0,
      pressure: '14 psi',
      temperature: '98°F',
      wear: 'New',
      grooving: 'Standard',
      siping: 'Full',
      stagger: 'N/A',
      durometer: '55'
    },
    'Left Rear': {
      compound: 'Hoosier RD12',
      age: '1 day',
      laps: 0,
      pressure: '8 psi',
      temperature: '92°F',
      wear: 'New',
      grooving: 'Deep',
      siping: 'Full',
      stagger: '2 inches',
      durometer: '50'
    },
    'Right Rear': {
      compound: 'Hoosier RD12',
      age: '1 day',
      laps: 0,
      pressure: '10 psi',
      temperature: '94°F',
      wear: 'New',
      grooving: 'Deep',
      siping: 'Full',
      stagger: '2 inches',
      durometer: '50'
    }
  };

  const getStatusColor = (tire: TireInfo) => {
    if (tire.laps === 0 && tire.age.includes('day')) return 'text-green-500';
    if (tire.laps < 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBgGradient = (position: string) => {
    switch (position) {
      case 'Left Front':
        return 'from-green-500/10 to-emerald-500/10';
      case 'Right Front':
        return 'from-blue-500/10 to-indigo-500/10';
      case 'Left Rear':
        return 'from-purple-500/10 to-pink-500/10';
      case 'Right Rear':
        return 'from-orange-500/10 to-red-500/10';
      default:
        return '';
    }
  };

  return (
    <div className={`glass-panel p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">Tire Management</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track tire wear, temperatures, and pressures
          </p>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-5 h-5" />
              <span className="text-sm font-medium">Hide Details</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5" />
              <span className="text-sm font-medium">Show Details</span>
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Track Conditions Alert */}
          <div className="p-3 rounded-lg bg-brand-gold/10 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-brand-gold" />
            <p className="text-sm">
              Track conditions may require tire pressure adjustments. Monitor temperatures closely.
            </p>
          </div>

          {/* Tire Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(tires).map(([position, tire]) => (
              <div 
                key={position} 
                className={`glass-panel p-4 bg-gradient-to-br ${getBgGradient(position)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold">{position}</h4>
                  <span className={`text-sm font-medium ${getStatusColor(tire)}`}>
                    {tire.wear}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Compound</span>
                      <p className="font-medium">{tire.compound}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Age</span>
                      <p className="font-medium">{tire.age}</p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <ThermometerSun className="w-4 h-4 text-gray-400" />
                      <span>{tire.temperature}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-gray-400" />
                      <span>{tire.pressure}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span>{tire.durometer}</span>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Grooving</span>
                      <span>{tire.grooving}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Siping</span>
                      <span>{tire.siping}</span>
                    </div>
                    {position.includes('Rear') && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Stagger</span>
                        <span>{tire.stagger}</span>
                      </div>
                    )}
                  </div>

                  {/* Usage Stats */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Laps: {tire.laps}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/tire-tool" 
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Gauge className="w-5 h-5" />
              <span>Open Tire Management</span>
            </Link>
            <button className="btn-secondary flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              <span>View History</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TireManagementContainer;