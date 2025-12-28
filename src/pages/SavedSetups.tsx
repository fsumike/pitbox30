import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Trash2, AlertCircle, Share2,
  Check, Loader2, Database, Search, Filter, ChevronDown, X, Download, Upload,
  SortAsc, SortDesc, Calendar as CalendarIcon, Clock, Users, Mail, CheckSquare, Square
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { useSetups } from '../hooks/useSetups';
import { useAuth } from '../contexts/AuthContext';
import { Setup, supabase } from '../lib/supabase';
import { RACE_TYPE_OPTIONS, RaceType } from '../types';

function SavedSetups() {
  const { carType } = useParams<{ carType: string }>();
  const navigate = useNavigate();
  const [setups, setSetups] = useState<Setup[]>([]);
  const [filteredSetups, setFilteredSetups] = useState<Setup[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [printSetup, setPrintSetup] = useState<Setup | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [raceTypeFilter, setRaceTypeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'lap-asc' | 'lap-desc'>('date-desc');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [selectedSetups, setSelectedSetups] = useState<Set<string>>(new Set());
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loadSetups, deleteSetup, loading, error } = useSetups();
  const { saveSetup } = useSetups();
  const { user } = useAuth();

  // Format car type for display
  const formatCarType = (type: string | undefined) => {
    if (!type) return '';
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    if (carType) {
      loadSetupsData();
    }
  }, [carType]);

  useEffect(() => {
    filterAndSortSetups();
  }, [searchTerm, sortBy, raceTypeFilter, setups]);

  const loadSetupsData = async () => {
    if (!carType || !user) return;
    
    const loadedSetups = await loadSetups(carType);
    setSetups(loadedSetups);
    setFilteredSetups(loadedSetups);
  };

  const filterAndSortSetups = () => {
    // First filter by search term
    let result = setups;

    if (searchTerm) {
      result = setups.filter(setup => {
        const carNumber = setup.car_number?.toLowerCase() || '';
        const trackName = setup.track_name?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();

        return carNumber.includes(searchLower) || trackName.includes(searchLower);
      });
    }

    // Filter by race type
    if (raceTypeFilter) {
      result = result.filter(setup => setup.race_type === raceTypeFilter);
    }
    
    // Then sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name-asc':
          return (a.car_number || '').localeCompare(b.car_number || '');
        case 'name-desc':
          return (b.car_number || '').localeCompare(a.car_number || '');
        case 'lap-asc':
          const aLap = a.best_lap_time ? Number(a.best_lap_time) : Infinity;
          const bLap = b.best_lap_time ? Number(b.best_lap_time) : Infinity;
          return aLap - bLap;
        case 'lap-desc':
          const aLapDesc = a.best_lap_time ? Number(a.best_lap_time) : -Infinity;
          const bLapDesc = b.best_lap_time ? Number(b.best_lap_time) : -Infinity;
          return bLapDesc - aLapDesc;
        default:
          return 0;
      }
    });
    
    setFilteredSetups(result);
  };

  const handleDeleteSetup = async (setupId: string) => {
    const success = await deleteSetup(setupId);
    if (success) {
      setSetups(prev => prev.filter(setup => setup.id !== setupId));
      setFilteredSetups(prev => prev.filter(setup => setup.id !== setupId));
      setShowDeleteConfirm(null);
    }
  };

  const handleExportSetup = async (setup: Setup) => {
    try {
      // Get user profile for attribution
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, email')
        .eq('id', user?.id)
        .maybeSingle();

      // Filter out sensitive data (shocks, dyno info, weights)
      const filteredSetupData = Object.keys(setup.setup_data || {}).reduce((acc, key) => {
        const section = setup.setup_data[key];
        if (!section || typeof section !== 'object') {
          acc[key] = section;
          return acc;
        }

        const filteredSection = Object.keys(section).reduce((sectionAcc, fieldKey) => {
          // Exclude shock numbers, dyno info, and optionally weights
          if (!fieldKey.includes('shock_number') &&
              !fieldKey.includes('shock_serial') &&
              !fieldKey.includes('shock_id') &&
              !fieldKey.includes('dyno') &&
              !fieldKey.toLowerCase().includes('weight')) {
            sectionAcc[fieldKey] = section[fieldKey];
          }
          return sectionAcc;
        }, {} as any);
        acc[key] = filteredSection;
        return acc;
      }, {} as any);

      // Create export data with attribution
      const exportData = {
        version: '1.0.0',
        exported_at: new Date().toISOString(),
        exported_by: {
          name: profile?.full_name || profile?.username || 'PitBox User',
          email: profile?.email || user?.email || ''
        },
        setup_name: `${setup.car_number ? `Car #${setup.car_number}` : 'Setup'} - ${setup.track_name || 'Track'}`,
        car_type: setup.car_type,
        car_number: setup.car_number,
        track_name: setup.track_name,
        best_lap_time: setup.best_lap_time,
        setup_data: filteredSetupData,
        track_conditions: setup.track_conditions,
        created_at: setup.created_at,
        share_notes: 'Shared from PitBox Racing App'
      };

      // Create JSON string
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create filename
      const carTypeStr = setup.car_type.replace(/-/g, '_');
      const carNumber = setup.car_number ? `_${setup.car_number}` : '';
      const trackName = setup.track_name ? `_${setup.track_name.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
      const date = new Date(setup.created_at).toISOString().split('T')[0];
      const filename = `pitbox_${carTypeStr}${carNumber}${trackName}_${date}.json`;

      // Use native sharing on mobile, fallback to download on web
      if (Capacitor.isNativePlatform()) {
        // Save file to temporary location
        const result = await Filesystem.writeFile({
          path: filename,
          data: jsonString,
          directory: Directory.Cache,
          encoding: Encoding.UTF8
        });

        // Share via native share sheet
        await Share.share({
          title: exportData.setup_name,
          text: `Racing setup from ${exportData.exported_by.name}`,
          url: result.uri,
          dialogTitle: 'Share Setup'
        });
      } else {
        // Web: trigger download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      // Show success message
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Error exporting setup:', err);
      setExportError('Failed to export setup. Please try again.');
      setTimeout(() => setExportError(null), 5000);
    }
  };

  const toggleSetupSelection = (setupId: string) => {
    setSelectedSetups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(setupId)) {
        newSet.delete(setupId);
      } else {
        newSet.add(setupId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedSetups.size === filteredSetups.length) {
      setSelectedSetups(new Set());
    } else {
      setSelectedSetups(new Set(filteredSetups.map(s => s.id)));
    }
  };

  const formatFieldName = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/Lf /g, 'LF ')
      .replace(/Rf /g, 'RF ')
      .replace(/Lr /g, 'LR ')
      .replace(/Rr /g, 'RR ');
  };

  const getRaceTypeLabel = (raceType: string | null | undefined): string => {
    if (!raceType) return 'Not specified';
    const option = RACE_TYPE_OPTIONS.find(opt => opt.value === raceType);
    return option?.label || raceType;
  };

  const handleEmailSetups = async () => {
    if (selectedSetups.size === 0) {
      setEmailError('Please select at least one setup to email');
      setTimeout(() => setEmailError(null), 3000);
      return;
    }

    try {
      const setupsToEmail = setups.filter(s => selectedSetups.has(s.id));

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, email')
        .eq('id', user?.id)
        .maybeSingle();

      const senderName = profile?.full_name || profile?.username || 'PitBox User';
      const emailSubject = `Racing Setups from ${senderName} - ${formatCarType(carType)}`;

      let emailBody = `${senderName} is sharing ${setupsToEmail.length} racing setup${setupsToEmail.length > 1 ? 's' : ''} with you.\n`;
      emailBody += `Car Type: ${formatCarType(carType)}\n`;
      emailBody += `${'='.repeat(50)}\n`;

      setupsToEmail.forEach((setup, index) => {
        emailBody += `\n${'='.repeat(50)}\n`;
        emailBody += `SETUP ${index + 1} of ${setupsToEmail.length}\n`;
        emailBody += `${'='.repeat(50)}\n\n`;

        emailBody += `GENERAL INFORMATION\n`;
        emailBody += `${'-'.repeat(30)}\n`;
        emailBody += `Car Number: ${setup.car_number || '---'}\n`;
        emailBody += `Track: ${setup.track_name || '---'}\n`;
        emailBody += `Race Type: ${getRaceTypeLabel(setup.race_type)}\n`;
        emailBody += `Best Lap Time: ${setup.best_lap_time ? `${setup.best_lap_time}s` : '---'}\n`;
        emailBody += `Date Saved: ${new Date(setup.created_at).toLocaleDateString()}\n`;
        if (setup.location_name) {
          emailBody += `Location: ${setup.location_name}\n`;
        }
        emailBody += `\n`;

        if (setup.setup_data && Object.keys(setup.setup_data).length > 0) {
          emailBody += `SETUP DATA\n`;
          emailBody += `${'-'.repeat(30)}\n`;

          Object.entries(setup.setup_data).forEach(([section, fields]: [string, any]) => {
            if (fields && typeof fields === 'object') {
              const sectionTitle = formatFieldName(section);
              emailBody += `\n[ ${sectionTitle.toUpperCase()} ]\n`;

              const fieldEntries = Object.entries(fields);
              if (fieldEntries.length === 0) {
                emailBody += `  (No data entered)\n`;
              } else {
                fieldEntries.forEach(([key, value]: [string, any]) => {
                  const fieldName = formatFieldName(key);
                  if (value && typeof value === 'object') {
                    const featureValue = value.feature || '---';
                    const commentValue = value.comment ? ` | Note: ${value.comment}` : '';
                    emailBody += `  ${fieldName}: ${featureValue}${commentValue}\n`;
                  } else if (value) {
                    emailBody += `  ${fieldName}: ${value}\n`;
                  } else {
                    emailBody += `  ${fieldName}: ---\n`;
                  }
                });
              }
            }
          });
        }

        const customFields = setup.custom_fields as Record<string, Array<{id: string; name: string; value: string; comment?: string}>> | null;
        if (customFields && Object.keys(customFields).length > 0) {
          const hasAnyCustomFieldData = Object.values(customFields).some(fields =>
            fields && fields.length > 0 && fields.some(f => f.value || f.comment)
          );

          if (hasAnyCustomFieldData) {
            emailBody += `\nCUSTOM FIELDS\n`;
            emailBody += `${'-'.repeat(30)}\n`;

            Object.entries(customFields).forEach(([section, fields]) => {
              if (fields && fields.length > 0) {
                const fieldsWithData = fields.filter(f => f.value || f.comment);
                if (fieldsWithData.length > 0) {
                  const sectionTitle = formatFieldName(section);
                  emailBody += `\n[ ${sectionTitle.toUpperCase()} - Custom ]\n`;

                  fieldsWithData.forEach((field) => {
                    const fieldValue = field.value || '---';
                    const commentValue = field.comment ? ` | Note: ${field.comment}` : '';
                    emailBody += `  ${field.name}: ${fieldValue}${commentValue}\n`;
                  });
                }
              }
            });
          }
        }

        emailBody += `\n`;
      });

      emailBody += `${'='.repeat(50)}\n`;
      emailBody += `Shared from PitBox Racing App\n`;
      emailBody += `www.pitbox.app\n`;

      if (Capacitor.isNativePlatform() && Share) {
        await Share.share({
          title: emailSubject,
          text: emailBody,
          dialogTitle: 'Share Setups'
        });
      } else {
        const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
      }

      setEmailSuccess(true);
      setSelectedSetups(new Set());
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (err) {
      console.error('Error emailing setups:', err);
      setEmailError('Failed to prepare email. Please try again.');
      setTimeout(() => setEmailError(null), 5000);
    }
  };

  const handleImportSetup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    try {
      // Validate file type
      if (!file.name.endsWith('.json')) {
        throw new Error('Please select a valid JSON setup file');
      }

      // Read file content
      const fileContent = await file.text();
      const importData = JSON.parse(fileContent);

      // Validate imported data structure
      if (!importData.car_type || !importData.setup_data) {
        throw new Error('Invalid setup file format');
      }

      // Validate version compatibility
      if (importData.version && importData.version !== '1.0.0') {
        throw new Error('This setup was exported from an incompatible version of PitBox');
      }

      // Validate car type matches current page
      if (importData.car_type !== carType) {
        throw new Error(`This setup is for ${importData.car_type}, but you're viewing ${carType} setups`);
      }

      // Show import preview/confirmation
      const senderName = importData.exported_by?.name || 'Unknown User';
      const confirmed = window.confirm(
        `Import setup from ${senderName}?\n\n` +
        `Setup: ${importData.setup_name || 'Untitled'}\n` +
        `Track: ${importData.track_name || 'N/A'}\n` +
        `Date: ${importData.created_at ? new Date(importData.created_at).toLocaleDateString() : 'N/A'}\n` +
        `${importData.best_lap_time ? `Best Lap: ${Number(importData.best_lap_time).toFixed(3)}s\n` : ''}` +
        `\nThis will be added to your setup library.`
      );

      if (!confirmed) {
        return;
      }

      // Save the imported setup with attribution
      const result = await saveSetup(
        importData.car_type,
        importData.setup_data,
        importData.track_conditions || {},
        importData.best_lap_time || null
      );

      if (result) {
        // Add attribution metadata
        const { error: updateError } = await supabase
          .from('setups')
          .update({
            shared_by_name: importData.exported_by?.name || 'Unknown User',
            shared_by_email: importData.exported_by?.email || null,
            is_imported: true,
            share_notes: importData.share_notes || null
          })
          .eq('id', result.id);

        if (updateError) {
          console.error('Error adding attribution:', updateError);
        }

        // Reload setups to show the new imported setup
        await loadSetupsData();
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      } else {
        throw new Error('Failed to save imported setup');
      }
    } catch (err) {
      console.error('Error importing setup:', err);
      if (err instanceof SyntaxError) {
        setImportError('Invalid JSON file format');
      } else if (err instanceof Error) {
        setImportError(err.message);
      } else {
        setImportError('Failed to import setup');
      }
    } finally {
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handlePrintSetup = async (setup: Setup) => {
    setPrintSetup(setup);
    
    try {
      // Copy setup details to clipboard for sharing
      const setupDetails = `${carType?.toUpperCase()} Setup - Car #${setup.car_number || 'Untitled'} - ${setup.track_name || 'No Track'} - Created: ${new Date(setup.created_at).toLocaleDateString()}`;
      await navigator.clipboard.writeText(setupDetails);
      
      // Show success message
      setShareSuccess(setup.id);
      setTimeout(() => setShareSuccess(null), 2000);
      
      // Print setup
      setTimeout(() => {
        window.print();
        setPrintSetup(null);
      }, 300);
    } catch (err) {
      console.error('Error sharing setup:', err);
    }
  };

  const handleLoadSetup = (setup: Setup) => {
    // Navigate back to the car type page with the setup
    navigate(`/${carType}`, { state: { loadedSetup: setup } });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(`/${carType}`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">{formatCarType(carType)} Saved Setups</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View, load, and manage your saved setups
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by car number or track..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {selectedSetups.size > 0 && (
              <>
                <button
                  onClick={handleEmailSetups}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                  title="Email selected setups"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email ({selectedSetups.size})</span>
                </button>
                <button
                  onClick={() => setSelectedSetups(new Set())}
                  className="px-3 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
                  title="Clear selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filter & Sort</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportSetup}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
              title="Import a setup file from your team"
            >
              <Upload className="w-5 h-5" />
              <span>Import Setup</span>
            </button>

            <button
              onClick={() => navigate(`/${carType}`)}
              className="px-4 py-2 rounded-lg bg-brand-gold text-white hover:bg-brand-gold-dark transition-colors flex items-center gap-2"
            >
              <Database className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Setup</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-fadeIn">
            <div className="flex flex-col gap-6">
              {/* Race Type Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter by Race Type
                </h3>
                <select
                  value={raceTypeFilter}
                  onChange={(e) => setRaceTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                >
                  <option value="">All Race Types</option>
                  {RACE_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Sort By</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSortBy('date-desc')}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                      sortBy === 'date-desc'
                        ? 'bg-brand-gold text-white'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <SortDesc className="w-4 h-4" />
                    Newest First
                  </button>
                  <button
                    onClick={() => setSortBy('date-asc')}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                      sortBy === 'date-asc'
                        ? 'bg-brand-gold text-white'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <SortAsc className="w-4 h-4" />
                    Oldest First
                  </button>
                  <button
                    onClick={() => setSortBy('name-asc')}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                      sortBy === 'name-asc'
                        ? 'bg-brand-gold text-white'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <SortAsc className="w-4 h-4" />
                    Car # (A-Z)
                  </button>
                  <button
                    onClick={() => setSortBy('name-desc')}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                      sortBy === 'name-desc'
                        ? 'bg-brand-gold text-white'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <SortDesc className="w-4 h-4" />
                    Car # (Z-A)
                  </button>
                  <button
                    onClick={() => setSortBy('lap-asc')}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                      sortBy === 'lap-asc'
                        ? 'bg-brand-gold text-white'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <SortAsc className="w-4 h-4" />
                    Fastest Lap
                  </button>
                  <button
                    onClick={() => setSortBy('lap-desc')}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                      sortBy === 'lap-desc'
                        ? 'bg-brand-gold text-white'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <SortDesc className="w-4 h-4" />
                    Slowest Lap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {(importError || importSuccess || exportError || exportSuccess || emailError || emailSuccess) && (
        <div className="glass-panel p-4 space-y-3">
          {importError && (
            <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-3 border border-red-300 dark:border-red-700">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold">Import Failed</div>
                <div className="text-sm">{importError}</div>
              </div>
              <button
                onClick={() => setImportError(null)}
                className="p-1.5 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {importSuccess && (
            <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-3 border border-green-300 dark:border-green-700">
              <Check className="w-6 h-6 flex-shrink-0" />
              <div>
                <div className="font-semibold">Setup Imported!</div>
                <div className="text-sm">Setup has been added to your library</div>
              </div>
            </div>
          )}

          {exportError && (
            <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-3 border border-red-300 dark:border-red-700">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold">Export Failed</div>
                <div className="text-sm">{exportError}</div>
              </div>
              <button
                onClick={() => setExportError(null)}
                className="p-1.5 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {exportSuccess && (
            <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-3 border border-green-300 dark:border-green-700">
              <Check className="w-6 h-6 flex-shrink-0" />
              <div>
                <div className="font-semibold">Setup Exported!</div>
                <div className="text-sm">Share the file with your team via text, email, or AirDrop</div>
              </div>
            </div>
          )}

          {emailError && (
            <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-3 border border-red-300 dark:border-red-700">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold">Email Failed</div>
                <div className="text-sm">{emailError}</div>
              </div>
              <button
                onClick={() => setEmailError(null)}
                className="p-1.5 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {emailSuccess && (
            <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-3 border border-green-300 dark:border-green-700">
              <Check className="w-6 h-6 flex-shrink-0" />
              <div>
                <div className="font-semibold">Email Prepared!</div>
                <div className="text-sm">Your email client should open with the setup details</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Setups List */}
      <div className="glass-panel p-6">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-gold mr-3" />
            <span>Loading setups...</span>
          </div>
        ) : filteredSetups.length === 0 ? (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Setups Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ? 'No setups match your search criteria.' : 'You haven\'t saved any setups for this vehicle yet.'}
            </p>
            <button
              onClick={() => navigate(`/${carType}`)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Setup Page
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {selectedSetups.size === filteredSetups.length ? (
                  <CheckSquare className="w-5 h-5 text-brand-gold" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {selectedSetups.size === filteredSetups.length ? 'Deselect All' : 'Select All'}
                </span>
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredSetups.length} setup{filteredSetups.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSetups.map((setup) => (
              <div
                key={setup.id}
                className={`glass-panel p-5 hover:shadow-lg transition-all rounded-xl relative group border-2 bg-white dark:bg-gray-800 ${
                  selectedSetups.has(setup.id)
                    ? 'border-brand-gold ring-2 ring-brand-gold/30'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Selection Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSetupSelection(setup.id);
                  }}
                  className="absolute top-3 left-3 z-10 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Select setup"
                >
                  {selectedSetups.has(setup.id) ? (
                    <CheckSquare className="w-5 h-5 text-brand-gold" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                <div
                  className="cursor-pointer pl-8"
                  onClick={() => handleLoadSetup(setup)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-xl">
                      {setup.car_number ? `Car #${setup.car_number}` : 'Untitled Setup'}
                    </div>
                  </div>
                  
                  {setup.track_name && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{setup.track_name}</span>
                    </div>
                  )}

                  {setup.best_lap_time && (
                    <div className="flex items-center text-sm font-semibold text-brand-gold mb-2">
                      <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span>Best Lap: {Number(setup.best_lap_time).toFixed(3)}s</span>
                    </div>
                  )}

                  {setup.race_type && (
                    <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mb-2">
                      <Filter className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="font-medium">
                        {RACE_TYPE_OPTIONS.find(opt => opt.value === setup.race_type)?.label || setup.race_type}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <CalendarIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>{formatDate(setup.created_at)}</span>
                    <span className="mx-1">•</span>
                    <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>{formatTime(setup.created_at)}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {setup.setup_data.notes_general?.feature || 
                     setup.setup_data.notes_track?.feature || 
                     setup.notes || 
                     'No additional notes'}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <button
                    onClick={() => handleLoadSetup(setup)}
                    className="px-3 py-1.5 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors text-sm"
                  >
                    Load Setup
                  </button>
                  
                  <div className="flex gap-2">
                    {/* Export/Share button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportSetup(setup);
                      }}
                      className="px-3 py-2 bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm"
                      title="Export setup to share with team"
                    >
                      {exportSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="hidden sm:inline">Exported!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Export</span>
                        </>
                      )}
                    </button>

                    {/* Print button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrintSetup(setup);
                      }}
                      className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg transition-colors"
                      title="Print setup"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>

                    {/* Delete button */}
                    {showDeleteConfirm !== setup.id ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(setup.id);
                        }}
                        className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors"
                        title="Delete setup"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="absolute right-4 top-16 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-red-200 dark:border-red-800 w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <span className="font-medium text-red-700 dark:text-red-300">Delete this setup?</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSetup(setup.id);
                            }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(null);
                            }}
                            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-1 px-3 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </>
        )}
      </div>

      {/* Print View (hidden until print) */}
      {printSetup && (
        <div className="print-only">
          <PrintableSetup setup={printSetup} carType={carType || ''} />
        </div>
      )}
      
      {/* Instructions */}
      <div className="glass-panel p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        <h2 className="text-xl font-bold mb-4">Setup Sharing Instructions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Download className="w-5 h-5 text-green-500" />
              Exporting Setups
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Click the download button on any setup to export it as a JSON file</li>
              <li>• The file will be saved to your device's Downloads folder</li>
              <li>• Share the file with other users via email, messaging, or cloud storage</li>
              <li>• Files are automatically synced to iCloud Drive (iOS) or Google Drive (Android)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Importing Setups
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Click "Import Setup" to select a JSON setup file</li>
              <li>• The setup will be validated and added to your collection</li>
              <li>• Only setups matching the current vehicle type can be imported</li>
              <li>• Imported setups become part of your personal setup library</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Printable Setup Component
function PrintableSetup({ setup, carType }: { setup: Setup, carType: string }) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderSection = (title: string, data: Record<string, any>) => {
    const relevantFields = Object.keys(setup.setup_data).filter(key => 
      key.startsWith(title.toLowerCase() + '_')
    );

    if (relevantFields.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">{title}</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {relevantFields.map(field => {
            const fieldName = field.replace(`${title.toLowerCase()}_`, '');
            const value = setup.setup_data[field]?.feature || 'N/A';
            
            return (
              <div key={field} className="flex justify-between">
                <span className="font-medium capitalize">{fieldName}:</span>
                <span>{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{carType.toUpperCase()} Setup</h1>
        <p className="text-xl">
          {setup.car_number ? `Car #${setup.car_number}` : 'Untitled Setup'}
          {setup.track_name && ` - ${setup.track_name}`}
        </p>
        <p className="text-gray-600">
          {formatDate(setup.track_conditions?.date || setup.created_at)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          {renderSection('Left Front', setup.setup_data)}
          {renderSection('Right Front', setup.setup_data)}
          {renderSection('Engine', setup.setup_data)}
        </div>
        <div>
          {renderSection('Left Rear', setup.setup_data)}
          {renderSection('Right Rear', setup.setup_data)}
          {renderSection('Wing', setup.setup_data)}
          {renderSection('Rear', setup.setup_data)}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Printed from PitBox - Your Digital Crew Chief</p>
        <p>{new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default SavedSetups;