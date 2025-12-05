import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, CheckCircle, AlertCircle, Sliders, Eye, EyeOff, Clock, RotateCcw, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSetups } from '../hooks/useSetups';
import { useSetupCustomization } from '../hooks/useSetupCustomization';
import { useCustomFieldTemplates } from '../hooks/useCustomFieldTemplates';
import NumberInput from './NumberInput';
import CustomizeFieldsModal from './CustomizeFieldsModal';
import CollapsibleShockSelector from './CollapsibleShockSelector';
import { supabase } from '../lib/supabase';
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
  const {
    templates: customFieldTemplates,
    loading: templatesLoading,
    saveTemplates: saveCustomFieldTemplates
  } = useCustomFieldTemplates(carType);

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
  const [selectedCustomField, setSelectedCustomField] = useState<{
    sectionKey: string;
    fieldId: string;
    fieldName: string;
  } | null>(null);
  const [deleteCustomFieldConfirm, setDeleteCustomFieldConfirm] = useState<{
    sectionKey: string;
    fieldId: string;
    fieldName: string;
  } | null>(null);
  const [savedFieldId, setSavedFieldId] = useState<string | null>(null);

  // Initialize custom fields from templates
  useEffect(() => {
    if (!customFieldTemplates || Object.keys(customFieldTemplates).length === 0) return;

    // Merge templates with existing values
    const mergedFields: Record<string, CustomField[]> = {};

    Object.keys(customFieldTemplates).forEach(sectionKey => {
      const templates = customFieldTemplates[sectionKey] || [];
      const existingFields = customFields[sectionKey] || [];

      // Create fields from templates, preserving existing values
      mergedFields[sectionKey] = templates.map(template => {
        const existing = existingFields.find(f => f.id === template.id);
        return {
          id: template.id,
          name: template.name,
          value: existing?.value || '',
          comment: existing?.comment || ''
        };
      });
    });

    setCustomFields(mergedFields);
  }, [customFieldTemplates]);

  // Initialize setup data from loaded setup or localStorage draft
  useEffect(() => {
    if (initialSetup?.setup_data) {
      setSetupData(initialSetup.setup_data);
      if (initialSetup?.best_lap_time) {
        setBestLapTime(initialSetup.best_lap_time.toString());
      }
      if (initialSetup?.race_type) {
        setRaceType(initialSetup.race_type);
      }
      if (initialSetup?.custom_fields) {
        // Merge saved values with templates
        const savedFields = initialSetup.custom_fields as Record<string, CustomField[]>;
        setCustomFields(prev => {
          const merged: Record<string, CustomField[]> = { ...prev };
          Object.keys(savedFields).forEach(sectionKey => {
            if (merged[sectionKey]) {
              merged[sectionKey] = merged[sectionKey].map(field => {
                const saved = savedFields[sectionKey]?.find(f => f.id === field.id);
                return saved ? { ...field, value: saved.value, comment: saved.comment || '' } : field;
              });
            }
          });
          return merged;
        });
      }
    } else if (user) {
      // Load draft setup data from localStorage if no saved setup
      const draftDataKey = `setup_draft_data_${carType}_${user.id}`;
      const savedDraftData = localStorage.getItem(draftDataKey);
      if (savedDraftData) {
        try {
          const draft = JSON.parse(savedDraftData);
          if (draft.setupData) setSetupData(draft.setupData);
          if (draft.bestLapTime) setBestLapTime(draft.bestLapTime);
          if (draft.raceType) setRaceType(draft.raceType);
        } catch (err) {
          console.error('Error loading draft setup data:', err);
        }
      }

      // Load draft custom field values from localStorage if no saved setup
      const draftKey = `setup_draft_custom_fields_${carType}_${user.id}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const draftFields = JSON.parse(savedDraft);
          setCustomFields(prev => {
            const merged: Record<string, CustomField[]> = { ...prev };
            Object.keys(draftFields).forEach(sectionKey => {
              if (merged[sectionKey]) {
                merged[sectionKey] = merged[sectionKey].map(field => {
                  const draft = draftFields[sectionKey]?.find((f: CustomField) => f.id === field.id);
                  return draft ? { ...field, value: draft.value, comment: draft.comment || '' } : field;
                });
              }
            });
            return merged;
          });
        } catch (err) {
          console.error('Error loading draft custom fields:', err);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSetup?.id, carType]);

  // Prevent body scroll when delete confirmation modal is open (for mobile)
  useEffect(() => {
    if (deleteCustomFieldConfirm) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      };
    }
  }, [deleteCustomFieldConfirm]);

  // Save custom fields to localStorage as draft (auto-save)
  useEffect(() => {
    if (!initialSetup && user) {
      const draftKey = `setup_draft_custom_fields_${carType}_${user.id}`;
      localStorage.setItem(draftKey, JSON.stringify(customFields));
    }
  }, [customFields, carType, user, initialSetup]);

  // Save setup data to localStorage as draft (auto-save)
  useEffect(() => {
    if (!initialSetup && user) {
      const draftKey = `setup_draft_data_${carType}_${user.id}`;
      localStorage.setItem(draftKey, JSON.stringify({
        setupData,
        bestLapTime,
        raceType
      }));
    }
  }, [setupData, bestLapTime, raceType, carType, user, initialSetup]);

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
    if (savedCustomization && Array.isArray(savedCustomization)) {
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

      console.log('Saving setup with custom fields:', customFields);

      // Pass savedSetupId to update existing setup or create new one
      const result = await saveSetup(
        carType,
        setupData,
        customFields,
        lapTimeValue,
        raceTypeValue,
        savedSetupId
      );

      if (result) {
        console.log('Setup saved successfully with ID:', result.id);
        console.log('Custom fields saved:', result.custom_fields);
        setSavedSetupId(result.id);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);

        // Clear localStorage drafts after successful save
        const draftDataKey = `setup_draft_data_${carType}_${user.id}`;
        const draftFieldsKey = `setup_draft_custom_fields_${carType}_${user.id}`;
        localStorage.removeItem(draftDataKey);
        localStorage.removeItem(draftFieldsKey);
      }
    } catch (err) {
      console.error('Error saving setup:', err);
    }
  };

  const handleAddCustomField = async (sectionKey: string) => {
    if (!newFieldName.trim()) return;

    const newField: CustomField = {
      id: crypto.randomUUID(),
      name: newFieldName.trim(),
      value: '',
      comment: ''
    };

    const updatedFields = {
      ...customFields,
      [sectionKey]: [...(customFields[sectionKey] || []), newField]
    };

    setCustomFields(updatedFields);

    // Save to templates so it persists across sessions
    const newTemplates = {
      ...customFieldTemplates,
      [sectionKey]: [
        ...(customFieldTemplates[sectionKey] || []),
        { id: newField.id, name: newField.name }
      ]
    };
    await saveCustomFieldTemplates(newTemplates);

    setNewFieldName('');
    setShowAddFieldModal(null);
  };


  const handleDeleteCustomField = (sectionKey: string, fieldId: string) => {
    const field = customFields[sectionKey]?.find(f => f.id === fieldId);
    if (field) {
      setDeleteCustomFieldConfirm({
        sectionKey,
        fieldId,
        fieldName: field.name
      });
    }
  };

  const confirmDeleteCustomField = async () => {
    if (!deleteCustomFieldConfirm) return;

    const { sectionKey, fieldId } = deleteCustomFieldConfirm;

    setCustomFields(prev => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter(f => f.id !== fieldId)
    }));

    // Remove from templates so it doesn't come back
    const newTemplates = {
      ...customFieldTemplates,
      [sectionKey]: (customFieldTemplates[sectionKey] || []).filter(t => t.id !== fieldId)
    };
    await saveCustomFieldTemplates(newTemplates);

    // Clear saved state if this field was marked as saved
    if (savedFieldId === fieldId) {
      setSavedFieldId(null);
    }

    setDeleteCustomFieldConfirm(null);
  };

  const handleCustomFieldValueUpdate = (sectionKey: string, fieldId: string, value: string) => {
    setCustomFields(prev => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).map(f =>
        f.id === fieldId ? { ...f, value } : f
      )
    }));

    // Clear saved state when field is modified
    if (savedFieldId === fieldId) {
      setSavedFieldId(null);
    }
  };

  const handleCustomFieldClick = (sectionKey: string, fieldId: string, fieldName: string) => {
    setSelectedCustomField({
      sectionKey,
      fieldId,
      fieldName
    });
  };

  const handleCustomFieldValueChange = (value: string) => {
    if (!selectedCustomField) return;
    handleCustomFieldValueUpdate(selectedCustomField.sectionKey, selectedCustomField.fieldId, value);
  };

  const getCustomFieldValue = (sectionKey: string, fieldId: string): string => {
    const field = customFields[sectionKey]?.find(f => f.id === fieldId);
    return field?.value || '';
  };

  const handleCustomFieldCommentUpdate = (sectionKey: string, fieldId: string, comment: string) => {
    setCustomFields(prev => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).map(f =>
        f.id === fieldId ? { ...f, comment } : f
      )
    }));

    // Clear saved state when field is modified
    if (savedFieldId === fieldId) {
      setSavedFieldId(null);
    }
  };

  const handleSaveCustomField = async (sectionKey: string, fieldId: string) => {
    if (!user) return;

    try {
      // Show saving state
      setSavedFieldId(fieldId);

      // If we have a saved setup, update it immediately with the custom field values
      if (savedSetupId) {
        const { error } = await supabase
          .from('setups')
          .update({
            custom_fields: customFields,
            updated_at: new Date().toISOString()
          })
          .eq('id', savedSetupId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error saving custom field to database:', error);
          setSavedFieldId(null);
          return;
        }
      }

      // Save to localStorage for draft values
      const draftKey = `setup_draft_custom_fields_${carType}_${user.id}`;
      localStorage.setItem(draftKey, JSON.stringify(customFields));

      // Keep the saved state (don't auto-clear it)
      // The button will remain hidden because savedFieldId stays set
    } catch (err) {
      console.error('Error in handleSaveCustomField:', err);
      setSavedFieldId(null);
    }
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
    setRaceType('');
    setCustomFields({});
    setShowResetConfirm(false);
    setSaveSuccess(false);

    // Clear localStorage drafts when resetting
    if (user) {
      const draftDataKey = `setup_draft_data_${carType}_${user.id}`;
      const draftFieldsKey = `setup_draft_custom_fields_${carType}_${user.id}`;
      localStorage.removeItem(draftDataKey);
      localStorage.removeItem(draftFieldsKey);
    }
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
          {Object.values(customFields).some(fields => fields.length > 0) && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
              <strong>Important:</strong> Click "Save Setup" to save all fields (including new fields) to your database
            </p>
          )}
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

                    {/* New Fields */}
                    {(customFields[sectionKey] || []).map((customField) => (
                      <div key={customField.id} className="space-y-2">
                        <div className="flex items-center justify-between min-h-[20px]">
                          <label className="block text-sm font-medium text-brand-gold">
                            {customField.name} <span className="text-xs text-gray-500">(New Field)</span>
                          </label>
                          <button
                            onClick={() => handleDeleteCustomField(sectionKey, customField.id)}
                            className="p-1 min-w-[32px] min-h-[32px] flex items-center justify-center active:bg-red-100 dark:active:bg-red-900/30 rounded transition-colors touch-manipulation -mr-1"
                            title="Delete field"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleCustomFieldClick(sectionKey, customField.id, customField.name)}
                          className="w-full p-3 text-left bg-white dark:bg-gray-800 rounded-lg border-2 border-brand-gold/50 dark:border-brand-gold/30 hover:border-brand-gold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm font-medium"
                        >
                          <span className={customField.value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}>
                            {customField.value || 'Click to enter value'}
                          </span>
                        </button>
                        <textarea
                          value={customField.comment || ''}
                          onChange={(e) => handleCustomFieldCommentUpdate(sectionKey, customField.id, e.target.value)}
                          placeholder="Add notes or comments..."
                          className="w-full p-3 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-colors shadow-sm placeholder:text-gray-400"
                          rows={2}
                        />
                        {(customField.value || customField.comment) && savedFieldId !== customField.id && (
                          <button
                            onClick={() => handleSaveCustomField(sectionKey, customField.id)}
                            className="w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Save className="w-4 h-4" />
                            Save Field
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Field Button */}
                  <div className="col-span-full mt-2">
                    <button
                      onClick={() => setShowAddFieldModal(sectionKey)}
                      className="w-full min-h-[48px] py-3 px-4 bg-brand-gold/10 active:bg-brand-gold/20 border-2 border-dashed border-brand-gold rounded-lg transition-colors flex items-center justify-center gap-2 text-brand-gold font-medium touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-sm sm:text-base">Add New Field</span>
                    </button>
                  </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Number Input Modal - Regular Fields */}
      {selectedField && (
        <NumberInput
          value={getFieldValue(selectedField.sectionKey, selectedField.fieldKey)}
          onChange={handleFieldUpdate}
          title={selectedField.title}
          onClose={() => setSelectedField(null)}
        />
      )}

      {/* Number Input Modal - New Fields */}
      {selectedCustomField && (
        <NumberInput
          value={getCustomFieldValue(selectedCustomField.sectionKey, selectedCustomField.fieldId)}
          onChange={handleCustomFieldValueChange}
          title={`Enter ${selectedCustomField.fieldName}`}
          onClose={() => setSelectedCustomField(null)}
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

      {/* Delete New Field Confirmation Modal */}
      {deleteCustomFieldConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteCustomFieldConfirm(null);
            }
          }}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 my-auto">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Delete New Field</h3>
                <p className="text-gray-600 dark:text-gray-300 select-none">
                  Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-gray-100">"{deleteCustomFieldConfirm.fieldName}"</span>? This will remove the field and its data permanently.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteCustomFieldConfirm(null)}
                className="flex-1 px-4 py-3 min-h-[48px] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg active:bg-gray-300 dark:active:bg-gray-600 transition-colors font-medium touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCustomField}
                className="flex-1 px-4 py-3 min-h-[48px] bg-red-500 text-white rounded-lg active:bg-red-600 transition-colors font-medium touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Field Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Plus className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Add New Field</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Enter a name for your new field
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
                className="flex-1 px-4 py-3 min-h-[48px] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg active:bg-gray-300 dark:active:bg-gray-600 transition-colors font-medium touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddCustomField(showAddFieldModal)}
                disabled={!newFieldName.trim()}
                className="flex-1 px-4 py-3 min-h-[48px] bg-brand-gold text-white rounded-lg active:bg-brand-gold-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
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