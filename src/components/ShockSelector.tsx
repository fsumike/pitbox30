import React, { useState, useEffect } from 'react';
import { Search, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useShocks, Shock } from '../hooks/useShocks';
import { useNavigate } from 'react-router-dom';

interface ShockSelectorProps {
  setupId?: string;
  onChange?: (shocks: { LF: string; RF: string; LR: string; RR: string }) => void;
  initialValues?: { LF?: string; RF?: string; LR?: string; RR?: string };
}

export default function ShockSelector({ setupId, onChange, initialValues }: ShockSelectorProps) {
  const { shocks, loading, getShocksBySetup, saveSetupShocks } = useShocks();
  const navigate = useNavigate();
  const [selectedShocks, setSelectedShocks] = useState({
    LF: initialValues?.LF || '',
    RF: initialValues?.RF || '',
    LR: initialValues?.LR || '',
    RR: initialValues?.RR || '',
  });
  const [showPicker, setShowPicker] = useState<'LF' | 'RF' | 'LR' | 'RR' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
      onChange?.(shockMap);
    } catch (error) {
      console.error('Failed to load setup shocks:', error);
    }
  };

  const handleSelectShock = async (position: 'LF' | 'RF' | 'LR' | 'RR', serialNumber: string) => {
    const newSelection = { ...selectedShocks, [position]: serialNumber };
    setSelectedShocks(newSelection);
    onChange?.(newSelection);
    setShowPicker(null);
    setSearchTerm('');

    if (setupId) {
      await saveShockAssignments(setupId, newSelection);
    }
  };

  const handleClearShock = async (position: 'LF' | 'RF' | 'LR' | 'RR') => {
    const newSelection = { ...selectedShocks, [position]: '' };
    setSelectedShocks(newSelection);
    onChange?.(newSelection);

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

  const filteredShocks = shocks.filter((shock) =>
    shock.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const positions: Array<{ key: 'LF' | 'RF' | 'LR' | 'RR'; label: string }> = [
    { key: 'LF', label: 'Left Front' },
    { key: 'RF', label: 'Right Front' },
    { key: 'LR', label: 'Left Rear' },
    { key: 'RR', label: 'Right Rear' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Shocks</h3>
        <button
          onClick={() => navigate('/tools')}
          className="text-sm text-orange-500 hover:text-orange-400 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Manage Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {positions.map(({ key, label }) => {
          const shock = getShockBySerial(selectedShocks[key]);
          return (
            <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">{label}</span>
                {selectedShocks[key] && (
                  <button
                    onClick={() => handleClearShock(key)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {shock ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">{shock.serial_number}</span>
                    <button
                      onClick={() => setShowPicker(key)}
                      className="text-sm text-orange-500 hover:text-orange-400"
                    >
                      Change
                    </button>
                  </div>

                  {shock.dyno_photo_url ? (
                    <div
                      onClick={() => setViewingShock(shock)}
                      className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
                    >
                      <img
                        src={shock.dyno_photo_url}
                        alt={`Dyno sheet for ${shock.serial_number}`}
                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black/50 px-3 py-1 rounded text-white text-xs">
                          View Dyno Sheet
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-600" />
                    </div>
                  )}

                  {shock.last_refurbished && (
                    <p className="text-xs text-gray-400">
                      Refurbished: {new Date(shock.last_refurbished).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowPicker(key)}
                  className="w-full py-8 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-orange-500 transition-colors"
                >
                  <Plus className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-400">Select Shock</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Select Shock for {positions.find((p) => p.key === showPicker)?.label}
                </h3>
                <button
                  onClick={() => {
                    setShowPicker(null);
                    setSearchTerm('');
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : filteredShocks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">
                    {searchTerm ? 'No shocks found' : 'No shocks in inventory'}
                  </p>
                  <button
                    onClick={() => navigate('/tools')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Add Shocks to Inventory
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredShocks.map((shock) => (
                    <button
                      key={shock.id}
                      onClick={() => handleSelectShock(showPicker, shock.serial_number)}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-orange-500 transition-colors text-left"
                    >
                      <h4 className="text-lg font-bold text-white mb-2">
                        {shock.serial_number}
                      </h4>
                      {shock.dyno_photo_url ? (
                        <div className="aspect-video bg-gray-900 rounded overflow-hidden">
                          <img
                            src={shock.dyno_photo_url}
                            alt={`Dyno sheet for ${shock.serial_number}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-900 rounded flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                      {shock.last_refurbished && (
                        <p className="text-xs text-gray-400 mt-2">
                          Refurbished: {new Date(shock.last_refurbished).toLocaleDateString()}
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
                  Last Refurbished:{' '}
                  {new Date(viewingShock.last_refurbished).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
