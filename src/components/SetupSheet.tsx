import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, CheckCircle, AlertCircle, Sliders, Eye, EyeOff, Clock, RotateCcw, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSetups } from '../hooks/useSetups';
import { useSetupCustomization } from '../hooks/useSetupCustomization';
import NumberInput from './NumberInput';
import CustomizeFieldsModal from './CustomizeFieldsModal';
import CollapsibleShockSelector from './CollapsibleShockSelector';
import type { Setup } from '../lib/supabase';
import { RACE_TYPE_OPTIONS } from '../types';

interface SetupValue {
  feature: string;
  comment: string;
}

interface CustomField {
  id: string;
  name: string;
  value: string;
  comment?: string;
}

interface SetupSection {
  title: string;
  fields: string[];
  bgColor?: string;
}

interface SetupSheetProps {
  title: string;
  carType: string;
  description: string;
  initialSetup?: Setup | null;
  initialSetupData: Record<string, Record<string, SetupValue>>;
  sections: SetupSection[];
  customizeButtonClassName?: string;
  carNumber?: string;
  trackName?: string;
  date?: string;
}

function SetupSheet({
  title,
  carType,
  description,
  initialSetup,
  initialSetupData,
  sections,
  customizeButtonClassName = 'bg-red-500 hover:bg-red-700 text-white',
  carNumber,
  trackName,
  date
}: SetupSheetProps) {
  const { user } = useAuth();
  const { saveSetup, loading: saveLoading, error: saveError } = useSetups();
  const {
    savedCustomization,
    loading: customizationLoading,
    error: customizationError,
    saveCustomization,
    resetCustomization
  } = useSetupCustomization(carType);

  const [setupData, setSetupData] = useState<Record<string, Record<string, SetupValue>>>(initialSetupData);
  const [selectedField, setSelectedField] = useState<{
    sectionKey: string;
    fieldKey: string;
    title: string;
  } | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldGroups, setFieldGroups] = useState<any[]>([]);
  const [bestLapTime, setBestLapTime] = useState<string>('');
  const [raceType, setRaceType] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedSetupId, setSavedSetupId] = useState<string | null>(initialSetup?.id || null);
  const [customFields, setCustomFields] = useState<Record<string, CustomField[]>>({});
  const [showAddFieldModal, setShowAddFieldModal] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState('');

  // Initialize setup data from loaded setup
  useEffect(() => {
    if (initialSetup?.setup_data) {
      setSetupData(initialSetup.setup_data);
    }
    if (initialSetup?.best_lap_time) {
      setBestLapTime(initialSetup.best_lap_time.toString());
    }
    if (initialSetup?.race_type) {
      setRaceType(initialSetup.race_type);
    }
    if (initialSetup?.custom_fields) {
      setCustomFields(initialSetup.custom_fields as Record<string, CustomField[]>);
    }
  }, [initialSetup]);

  // Sync car number, track name, and date from parent props
  useEffect(() => {
    if (carNumber !== undefined || trackName !== undefined || date !== undefined) {
      setSetupData(prev => ({
        ...prev,
        general: {
          ...prev.general,
          ...(carNumber !== undefined && {
            car_number: { ...prev.general?.car_number, feature: carNumber }
          }),
          ...(trackName !== undefined && {
            track_track: { ...prev.general?.track_track, feature: trackName }
          }),
          ...(date !== undefined && {
            date: { ...prev.general?.date, feature: date }
          })
        }
      }));
    }
  }, [carNumber, trackName, date]);

  // Apply customization when loaded
  useEffect(() => {
    if (savedCustomization) {
      setFieldGroups(savedCustomization);
    } else {
      // Create default field groups
      const defaultGroups = sections.map(section => ({
        title: section.title,
        fields: section.fields,
        expanded: true,
        visibleFields: section.fields.reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {} as Record<string, boolean>),
        bgColor: section.bgColor
      }));
      setFieldGroups(defaultGroups);
    }
  }, [savedCustomization, sections]);

  const handleFieldClick = (sectionKey: string, fieldKey: string) => {
    const fieldTitle = fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    setSelectedField({
      sectionKey,
      fieldKey,
      title: `Enter ${fieldTitle}`
    });
  };

  const handleFieldUpdate = (value: string) => {
    if (!selectedField) return;

    setSetupData(prev => ({
      ...prev,
      [selectedField.sectionKey]: {
        ...prev[selectedField.sectionKey],
        [selectedField.fieldKey]: {
          ...prev[selectedField.sectionKey]?.[selectedField.fieldKey],
          feature: value
        }
      }
    }));
  };

  const handleCommentUpdate = (sectionKey: string, fieldKey: string, comment: string) => {
    setSetupData(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldKey]: {
          ...prev[sectionKey]?.[fieldKey],
          comment
        }
      }
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const lapTimeValue = bestLapTime ? parseFloat(bestLapTime) : null;
      const raceTypeValue = raceType || null;
      const result = await saveSetup(carType, setupData, customFields, lapTimeValue, raceTypeValue);
      if (result) {
        setSavedSetupId(result.id);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving setup:', err);
    }
  };

  const handleAddCustomField = (sectionKey: string) => {
    if (!newFieldName.trim()) return;

    const newField: CustomField = {
      id: crypto.randomUUID(),
      name: newFieldName.trim(),
      value: '',
      comment: ''
    };

    setCustomFields(prev => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), newField]
    }));

    setNewFieldName('');
    setShowAddFieldModal(null);
  };

  const handleDeleteCustomField = (sectionKey: string, fieldId: string) => {
    setCustomFields(prev => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter(f => f.id !== fieldId)
    }));
  };

  const handleCustomFieldValueUpdate = (sectionKey: string, fieldId: string, value: string) => {
    setCustomFields(prev => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).map(f =>
        f.id === fieldId ? { ...f, value } : f
      )
    }));
  };

  const handleCustomFieldCommentUpdate = (sectionKey: string, fieldId: string, comment: string) => {
    setCustomFields(prev => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).map(f =>
        f.id === fieldId ? { ...f, comment } : f
      )
    }));
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const handleCustomizeSave = async (groups: any[]) => {
    const success = await saveCustomization(groups);
    if (success) {
      setFieldGroups(groups);
      setShowCustomizeModal(false);
    }
  };

  const handleCustomizeReset = async () => {
    const success = await resetCustomization();
    if (success) {
      // Reset to default groups
      const defaultGroups = sections.map(section => ({
        title: section.title,
        fields: section.fields,
        expanded: true,
        visibleFields: section.fields.reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {} as Record<string, boolean>),
        bgColor: section.bgColor
      }));
      setFieldGroups(defaultGroups);
    }
    return success;
  };

  const getFieldValue = (sectionKey: string, fieldKey: string): string => {
    return setupData[sectionKey]?.[fieldKey]?.feature || '';
  };

  const getFieldComment = (sectionKey: string, fieldKey: string): string => {
    return setupData[sectionKey]?.[fieldKey]?.comment || '';
  };

  const formatFieldName = (fieldKey: string): string => {
    return fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const isFieldVisible = (sectionTitle: string, fieldKey: string): boolean => {
    const group = fieldGroups.find(g => g.title === sectionTitle);
    return group?.visibleFields?.[fieldKey] !== false;
  };

  const getSectionBgColor = (sectionTitle: string): string => {
    const section = sections.find(s => s.title === sectionTitle);
    if (section?.bgColor) return section.bgColor;

    // Use subtle, brand-aligned colors - alternating between warm and neutral tones
    // This provides gentle visual distinction without being loud or distracting
    const colorMap: Record<string, string> = {
      'General': 'from-brand-gold/10 to-brand-gold-dark/10 dark:from-brand-gold/15 dark:to-brand-gold-dark/15',
      'Other': 'from-gray-400/10 to-gray-500/10 dark:from-gray-400/15 dark:to-gray-500/15',
      'Left Front': 'from-brand-gold/8 to-amber-600/8 dark:from-brand-gold/12 dark:to-amber-600/12',
      'Right Front': 'from-gray-400/10 to-gray-500/10 dark:from-gray-400/15 dark:to-gray-500/15',
      'Left Rear': 'from-brand-gold/8 to-amber-600/8 dark:from-brand-gold/12 dark:to-amber-600/12',
      'Right Rear': 'from-gray-400/10 to-gray-500/10 dark:from-gray-400/15 dark:to-gray-500/15',
      'Rear': 'from-brand-gold/8 to-amber-600/8 dark:from-brand-gold/12 dark:to-amber-600/12',
      'Front': 'from-gray-400/10 to-gray-500/10 dark:from-gray-400/15 dark:to-gray-500/15',
      'Suspension': 'from-gray-400/10 to-gray-500/10 dark:from-gray-400/15 dark:to-gray-500/15',
      'Shocks': 'from-brand-gold/8 to-amber-600/8 dark:from-brand-gold/12 dark:to-amber-600/12',
      'Wings': 'from-gray-400/10 to-gray-500/10 dark:from-gray-400/15 dark:to-gray-500/15',
      'Engine': 'from-brand-gold/10 to-brand-gold-dark/10 dark:from-brand-gold/15 dark:to-brand-gold-dark/15',
    };

    return colorMap[sectionTitle] || 'from-gray-400/10 to-gray-500/10 dark:from-gray-400/15 dark:to-gray-500/15';
  };

  const handleRestoreDefaults = () => {
    setSetupData(initialSetupData);
    setBestLapTime('');
    setCustomFields({});
    setShowResetConfirm(false);
    setSaveSuccess(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{title} Setup Sheet</h2>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowCustomizeModal(true)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${customizeButtonClassName}`}
            >
              <Sliders className="w-5 h-5" />
              <span>Customize Fields</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saveLoading || !user}
              className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saveLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Setup
                </>
              )}
            </button>
          </div>
        </div>

        {/* Best Lap Time Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Clock className="w-4 h-4 text-brand-gold" />
            Best Lap Time (optional)
          </label>
          <div className="flex gap-2 items-center max-w-md">
            <input
              type="text"
              inputMode="decimal"
              value={bestLapTime}
              onChange={(e) => setBestLapTime(e.target.value)}
              placeholder="15.234"
              className="flex-1 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">seconds</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enter your best lap time for this setup
          </p>
        </div>

        {/* Race Type Selector */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Settings className="w-4 h-4 text-brand-gold" />
            Race Type (optional)
          </label>
          <select
            value={raceType}
            onChange={(e) => setRaceType(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          >
            <option value="">Select race type...</option>
            {RACE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track what type of race this setup was used for
          </p>
        </div>

        {/* Shock Tracking */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <CollapsibleShockSelector setupId={savedSetupId || undefined} />
        </div>

        {(saveError || customizationError) && (
          <div className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {saveError || customizationError}
          </div>
        )}
      </div>

      {/* Setup Sections */}
      <div className="space-y-4">
        {fieldGroups.map((group, groupIndex) => {
          const sectionKey = group.title.toLowerCase().replace(/\s+/g, '_');
          const isExpanded = expandedSections.includes(sectionKey);
          const visibleFieldsCount = group.fields.filter((field: string) => isFieldVisible(group.title, field)).length;
          
          if (visibleFieldsCount === 0) return null;

          return (
            <div key={group.title} className={`glass-panel overflow-hidden bg-gradient-to-br ${getSectionBgColor(group.title)} border-2 border-gray-200 dark:border-gray-700 shadow-md`}>
              <button
                onClick={() => toggleSection(sectionKey)}
                className="w-full p-4 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <h3 className="text-xl font-bold">{group.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {visibleFieldsCount} fields
                  </span>
                  <Settings className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-4">
                  <div className="bg-white/60 dark:bg-gray-900/40 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.fields.map((fieldKey: string) => {
                      if (!isFieldVisible(group.title, fieldKey)) return null;

                      const value = getFieldValue(sectionKey, fieldKey);
                      const comment = getFieldComment(sectionKey, fieldKey);

                      return (
                        <div key={fieldKey} className="space-y-2">
                          <label className="block text-sm font-medium">
                            {formatFieldName(fieldKey)}
                          </label>
                          <button
                            onClick={() => handleFieldClick(sectionKey, fieldKey)}
                            className="w-full p-3 text-left bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-brand-gold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm font-medium"
                          >
                            <span className={value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}>
                              {value || 'Click to enter value'}
                            </span>
                          </button>
                          <textarea
                            value={comment}
                            onChange={(e) => handleCommentUpdate(sectionKey, fieldKey, e.target.value)}
                            placeholder="Add notes or comments..."
                            className="w-full p-3 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-colors shadow-sm placeholder:text-gray-400"
                            rows={2}
                          />
                        </div>
                      );
                    })}

                    {/* Custom Fields */}
                    {(customFields[sectionKey] || []).map((customField) => (
                      <div key={customField.id} className="space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-brand-gold">
                            {customField.name}
                          </label>
                          <button
                            onClick={() => handleDeleteCustomField(sectionKey, customField.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Delete custom field"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={customField.value}
                          onChange={(e) => handleCustomFieldValueUpdate(sectionKey, customField.id, e.target.value)}
                          placeholder="Enter value"
                          className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-brand-gold/50 dark:border-brand-gold/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-colors shadow-sm"
                        />
                        <textarea
                          value={customField.comment || ''}
                          onChange={(e) => handleCustomFieldCommentUpdate(sectionKey, customField.id, e.target.value)}
                          placeholder="Add notes or comments..."
                          className="w-full p-3 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-colors shadow-sm placeholder:text-gray-400"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Field Button */}
                  <button
                    onClick={() => setShowAddFieldModal(sectionKey)}
                    className="mt-4 w-full py-3 px-4 bg-brand-gold/10 hover:bg-brand-gold/20 border-2 border-dashed border-brand-gold rounded-lg transition-colors flex items-center justify-center gap-2 text-brand-gold font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Add Custom Field
                  </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Number Input Modal */}
      {selectedField && (
        <NumberInput
          value={getFieldValue(selectedField.sectionKey, selectedField.fieldKey)}
          onChange={handleFieldUpdate}
          title={selectedField.title}
          onClose={() => setSelectedField(null)}
        />
      )}

      {/* Customize Fields Modal */}
      <CustomizeFieldsModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        fieldGroups={fieldGroups}
        onSave={handleCustomizeSave}
        onReset={handleCustomizeReset}
        loading={customizationLoading}
        error={customizationError}
      />

      {/* Bottom Action Buttons */}
      <div className="glass-panel p-6 bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <button
            onClick={handleSave}
            disabled={saveLoading || !user}
            className="flex-1 sm:flex-initial px-6 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-lg"
          >
            {saveLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="w-6 h-6" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                Save Setup
              </>
            )}
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex-1 sm:flex-initial px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <RotateCcw className="w-5 h-5" />
            Restore Default Settings
          </button>
        </div>

        {!user && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Sign in to save your setups
          </p>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Confirm Reset</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to restore default settings? This will clear all your current setup data and cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRestoreDefaults}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Field Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Plus className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Add Custom Field</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Enter a name for your custom field
                </p>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomField(showAddFieldModal);
                    } else if (e.key === 'Escape') {
                      setShowAddFieldModal(null);
                      setNewFieldName('');
                    }
                  }}
                  placeholder="e.g., Left Front Panhard Bar"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowAddFieldModal(null);
                  setNewFieldName('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddCustomField(showAddFieldModal)}
                disabled={!newFieldName.trim()}
                className="flex-1 px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SetupSheet;