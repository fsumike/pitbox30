import React, { useState } from 'react';

interface CarNumberBoxProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function CarNumberBox({ value, onChange, className = '' }: CarNumberBoxProps) {
  return (
    <div className={`glass-panel p-4 ${className}`}>
      <label htmlFor="car-number" className="block text-lg font-bold mb-2">Car Number</label>
      <input
        id="car-number"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 text-center text-2xl font-bold rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
        placeholder="#"
      />
    </div>
  );
}

export default CarNumberBox;