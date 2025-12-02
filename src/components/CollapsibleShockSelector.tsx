import React, { useState, useEffect } from 'react';
import { ChevronDown, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useShocks, Shock } from '../hooks/useShocks';
import { useNavigate } from 'react-router-dom';

interface CollapsibleShockSelectorProps {
  setupId?: string;
}

export default function CollapsibleShockSelector({ setupId }: CollapsibleShockSelectorProps) {
  const { shocks, loading, getShocksBySetup, saveSetupShocks } = useShocks();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedShocks, setSelectedShocks] = useState({
    LF: '',
    RF: '',
    LR: '',
    RR: '',
  });
  const [showPicker, setShowPicker] = useState<'LF' | 'RF' | 'LR' | 'RR' | null>(null);
  const [viewingShock, setViewingShock] = useState<Shock | null>(null);

  useEffect(() => {
    if (setupId) {
      loadSetupShocks();
    }
  }, [setupId]);

  const loadSetupShocks = async () => {
    if (!setupId) return;
    try {
      const setupShocks = await getShocksBySetup(setupId);
      const shockMap: any = { LF: '', RF: '', LR: '', RR: '' };
      setupShocks.forEach((ss) => {
        if (ss.shock) {
          shockMap[ss.position] = ss.shock.serial_number;
        }
      });
      setSelectedShocks(shockMap);
    } catch (error) {
      console.error('Failed to load setup shocks:', error);
    }
  };

  const handleSelectShock = async (position: 'LF' | 'RF' | 'LR' | 'RR', serialNumber: string) => {
    const newSelection = { ...selectedShocks, [position]: serialNumber };
    setSelectedShocks(newSelection);
    setShowPicker(null);

    if (setupId) {
      await saveShockAssignments(setupId, newSelection);
    }
  };

  const handleClearShock = async (position: 'LF' | 'RF' | 'LR' | 'RR') => {
    const newSelection = { ...selectedShocks, [position]: '' };
    setSelectedShocks(newSelection);

    if (setupId) {
      await saveShockAssignments(setupId, newSelection);
    }
  };

  const saveShockAssignments = async (setupId: string, selections: { LF: string; RF: string; LR: string; RR: string }) => {
    try {
      const shockIds = Object.entries(selections)
        .filter(([, serialNumber]) => serialNumber.trim() !== '')
        .map(([position, serialNumber]) => {
          const shock = getShockBySerial(serialNumber);
          return shock ? { position: position as 'LF' | 'RF' | 'LR' | 'RR', shock_id: shock.id } : null;
        })
        .filter(Boolean) as { position: 'LF' | 'RF' | 'LR' | 'RR'; shock_id: string }[];

      await saveSetupShocks(setupId, shockIds);
    } catch (error) {
      console.error('Failed to save shock assignments:', error);
    }
  };

  const getShockBySerial = (serialNumber: string): Shock | undefined => {
    return shocks.find((s) => s.serial_number === serialNumber);
  };

  const positions: Array<{ key: 'LF' | 'RF' | 'LR' | 'RR'; label: string }> = [
    { key: 'LF', label: 'Left Front' },
    { key: 'RF', label: 'Right Front' },
    { key: 'LR', label: 'Left Rear' },
    { key: 'RR', label: 'Right Rear' },
  ];

  const assignedCount = Object.values(selectedShocks).filter(s => s.trim() !== '').length;

  return (
    <>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-brand-gold/10 to-brand-gold-dark/10 hover:from-brand-gold/20 hover:to-brand-gold-dark/20 dark:from-orange-500/10 dark:to-orange-600/10 dark:hover:from-orange-500/20 dark:hover:to-orange-600/20 rounded-lg transition-all border border-brand-gold/30 hover:border-brand-gold dark:border-orange-500/20 dark:hover:border-orange-500/40"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/20 dark:bg-orange-500/20 rounded-lg">
            <ImageIcon className="w-5 h-5 text-brand-gold dark:text-orange-500" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Managed Shock Inventory</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {assignedCount === 0 ? 'No shocks assigned' : `${assignedCount} of 4 shocks assigned`}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-brand-gold dark:text-orange-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/tools')}
              className="text-sm text-brand-gold hover:text-brand-gold-dark dark:text-orange-500 dark:hover:text-orange-400 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Manage Inventory
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {positions.map(({ key, label }) => {
              const shock = getShockBySerial(selectedShocks[key]);
              return (
                <div
                  key={key}
                  className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-brand-gold dark:hover:border-orange-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-brand-gold dark:text-orange-500 uppercase tracking-wider">
                      {label}
                    </span>
                    {selectedShocks[key] && (
                      <button
                        onClick={() => handleClearShock(key)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <X className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </div>

                  {shock ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 dark:text-white text-lg">{shock.serial_number}</span>
                        <button
                          onClick={() => setShowPicker(key)}
                          className="text-xs text-brand-gold hover:text-brand-gold-dark dark:text-orange-500 dark:hover:text-orange-400 transition-colors"
                        >
                          Change
                        </button>
                      </div>

                      {shock.dyno_photo_url ? (
                        <div
                          onClick={() => setViewingShock(shock)}
                          className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-900 rounded overflow-hidden cursor-pointer group"
                        >
                          <img
                            src={shock.dyno_photo_url}
                            alt={`Dyno sheet for ${shock.serial_number}`}
                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <span className="bg-brand-gold dark:bg-orange-500 px-3 py-1 rounded text-white text-xs font-medium">
                              View Dyno Sheet
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-900 rounded flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                        </div>
                      )}

                      {shock.last_refurbished && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Refurb: {new Date(shock.last_refurbished).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowPicker(key)}
                      className="w-full py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded hover:border-brand-gold dark:hover:border-orange-500 transition-colors flex flex-col items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-500">Select Shock</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Select Shock for {positions.find((p) => p.key === showPicker)?.label}
                </h3>
                <button
                  onClick={() => setShowPicker(null)}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : shocks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No shocks in inventory</p>
                  <button
                    onClick={() => navigate('/tools')}
                    className="px-4 py-2 bg-brand-gold hover:bg-brand-gold-dark dark:bg-orange-500 text-white rounded-lg dark:hover:bg-orange-600 transition-colors"
                  >
                    Add Shocks to Inventory
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {shocks.map((shock) => (
                    <button
                      key={shock.id}
                      onClick={() => handleSelectShock(showPicker, shock.serial_number)}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-brand-gold dark:hover:border-orange-500 transition-colors text-left"
                    >
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{shock.serial_number}</h4>
                      {shock.dyno_photo_url ? (
                        <div className="aspect-video bg-gray-200 dark:bg-gray-900 rounded overflow-hidden">
                          <img
                            src={shock.dyno_photo_url}
                            alt={`Dyno sheet for ${shock.serial_number}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-200 dark:bg-gray-900 rounded flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                        </div>
                      )}
                      {shock.last_refurbished && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Refurb: {new Date(shock.last_refurbished).toLocaleDateString()}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {viewingShock && viewingShock.dyno_photo_url && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingShock(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setViewingShock(null)}
              className="absolute -top-12 right-0 text-white hover:text-orange-500 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={viewingShock.dyno_photo_url}
              alt={`Dyno sheet for ${viewingShock.serial_number}`}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-bold">Shock: {viewingShock.serial_number}</h3>
              {viewingShock.last_refurbished && (
                <p className="text-gray-400 mt-1">
                  Last Refurbished: {new Date(viewingShock.last_refurbished).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
