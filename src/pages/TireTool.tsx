import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TireManagement from '../components/TireManagement';

function TireTool() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Tire Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage your race tire inventory
            </p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400">
          Keep detailed records of your tire inventory, track wear patterns, and optimize your tire strategy for race day. 
          Monitor tire life, performance characteristics, and maintenance history all in one place.
        </p>
      </div>

      {/* Tire Management Container */}
      <div className="glass-panel p-6">
        <TireManagement />
      </div>
    </div>
  );
}

export default TireTool;