import React, { useState } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useSetups } from '../hooks/useSetups';

interface SaveSetupButtonProps {
  carType: string;
  carNumber: string;
  trackName: string;
  date: string;
  className?: string;
}

function SaveSetupButton({ carType, carNumber, trackName, date, className = '' }: SaveSetupButtonProps) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { saveSetup } = useSetups();

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Create minimal setup data with just the fields we want to save
      const setupData = {
        car_number: { feature: carNumber, comment: '' },
        track_track: { feature: trackName, comment: '' },
        date: { feature: date, comment: '' }
      };

      // Create empty track conditions object
      const trackConditions = {};

      // Save the setup
      const result = await saveSetup(carType, setupData, trackConditions);
      
      if (result) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to save setup');
      }
    } catch (err) {
      console.error('Error saving setup:', err);
      setError('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || !carNumber.trim()}
        className="w-full md:w-auto btn-primary flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 rounded-xl disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
      >
        {saving ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Saving...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-6 h-6" />
            <span>Saved!</span>
          </>
        ) : (
          <>
            <Save className="w-6 h-6" />
            <span>Save Setup</span>
          </>
        )}
      </button>
    </div>
  );
}

export default SaveSetupButton;