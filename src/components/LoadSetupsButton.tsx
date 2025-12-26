import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database } from 'lucide-react';

interface LoadSetupsButtonProps {
  carType: string;
  onLoadSetup: (setup: any) => void;
}

function LoadSetupsButton({ carType }: LoadSetupsButtonProps) {
  const navigate = useNavigate();

  const handleLoadSetups = () => {
    // Navigate to the dedicated setups page for this car type
    navigate(`/setups/${carType}`);
  };

  return (
    <button
      onClick={handleLoadSetups}
      className="w-full md:w-auto btn-primary flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 rounded-xl"
    >
      <Database className="w-7 h-7" />
      <span>Load Saved Setups</span>
    </button>
  );
}

export default LoadSetupsButton;