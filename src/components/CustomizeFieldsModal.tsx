import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Save, Loader2, AlertCircle, RefreshCw, Sliders } from 'lucide-react';
import type { FieldGroup } from '../hooks/useSetupCustomization';

interface CustomizeFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldGroups: FieldGroup[];
  onSave: (groups: FieldGroup[]) => void;
  onReset?: () => void;
  loading?: boolean;
  error?: string | null;
}

function CustomizeFieldsModal({ 
  isOpen, 
  onClose, 
  fieldGroups,
  onSave,
  onReset,
  loading = false,
  error = null
}: CustomizeFieldsModalProps) {
  const [groups, setGroups] = useState<FieldGroup[]>(fieldGroups);

  // Update groups when fieldGroups prop changes
  useEffect(() => {
    setGroups([...fieldGroups]);
  }, [fieldGroups]);

  const handleToggleField = (groupIndex: number, field: string) => {
    setGroups(prev => {
      const newGroups = [...prev];
      newGroups[groupIndex] = {
        ...newGroups[groupIndex],
        visibleFields: {
          ...newGroups[groupIndex].visibleFields,
          [field]: !newGroups[groupIndex].visibleFields[field]
        }
      };
      return newGroups;
    });
  };

  const handleToggleAllFields = (groupIndex: number, visible: boolean) => {
    setGroups(prev => {
      const newGroups = [...prev];
      const group = newGroups[groupIndex];
      const updatedVisibleFields = Object.keys(group.visibleFields).reduce((acc, field) => {
        acc[field] = visible;
        return acc;
      }, {} as Record<string, boolean>);
      
      newGroups[groupIndex] = {
        ...group,
        visibleFields: updatedVisibleFields
      };
      return newGroups;
    });
  };

  const handleReset = async () => {
    if (onReset) {
      // First call the parent's reset function to reset in the database
      const success = await onReset();
      
      if (success) {
        // Create default groups where all fields are visible
        const defaultGroups = fieldGroups.map(group => {
          // Create a new visibleFields object with all fields set to true
          const defaultVisibleFields = group.fields.reduce((acc, field) => {
            acc[field] = true;
            return acc;
          }, {} as Record<string, boolean>);
          
          return {
            ...group,
            visibleFields: defaultVisibleFields
          };
        });
        
        // Update the local state with the default groups
        setGroups(defaultGroups);
      }
    } else {
      // If no onReset function is provided, just reset to the original fieldGroups
      // but ensure all fields are visible
      const defaultGroups = fieldGroups.map(group => {
        const defaultVisibleFields = group.fields.reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {} as Record<string, boolean>);
        
        return {
          ...group,
          visibleFields: defaultVisibleFields
        };
      });
      
      setGroups(defaultGroups);
    }
  };

  const handleSave = () => {
    onSave(groups);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <Sliders className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">Customize Fields</h2>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {groups.map((group, groupIndex) => (
              <div key={group.title} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{group.title}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAllFields(groupIndex, true)}
                      className="p-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Show All</span>
                    </button>
                    <button
                      onClick={() => handleToggleAllFields(groupIndex, false)}
                      className="p-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <EyeOff className="w-4 h-4" />
                      <span>Hide All</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {group.fields.map(field => (
                    <button
                      key={field}
                      onClick={() => handleToggleField(groupIndex, field)}
                      className={`p-2 rounded-lg text-left transition-colors flex items-center justify-between ${
                        group.visibleFields[field]
                          ? 'bg-brand-gold/10 hover:bg-brand-gold/20'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{field}</span>
                      {group.visibleFields[field] ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomizeFieldsModal;