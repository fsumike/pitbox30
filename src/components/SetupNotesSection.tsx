import React from 'react';

interface SetupNotesProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function SetupNotesSection({ value, onChange, className = '' }: SetupNotesProps) {
  return (
    <div className={`glass-panel p-4 ${className}`}>
      <label className="block text-sm font-medium mb-2">Notes</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
        rows={4}
        placeholder="Add your setup notes here..."
      />
    </div>
  );
}

export default SetupNotesSection;