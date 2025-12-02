import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { decimalToFraction } from '../utils/validation';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  onClose?: () => void;
  showFractions?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  title = '',
  onClose,
  showFractions = true
}) => {
  const [displayValue, setDisplayValue] = useState(value || '0');

  useEffect(() => {
    setDisplayValue(value || '0');
  }, [value]);

  const fractions = [
    '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8', '1'
  ];

  const handleNumberClick = (num: string) => {
    if (displayValue === '0') {
      setDisplayValue(num);
    } else {
      setDisplayValue(displayValue + num);
    }
  };

  const handleBackspace = () => {
    const newValue = displayValue.slice(0, -1) || '0';
    setDisplayValue(newValue);
  };

  const handleToggleNegative = () => {
    if (displayValue === '0') {
      setDisplayValue('-');
      return;
    }

    if (displayValue.startsWith('-')) {
      setDisplayValue(displayValue.substring(1));
    } else {
      setDisplayValue('-' + displayValue);
    }
  };

  const handleDecimalPoint = () => {
    if (!displayValue.includes('.') && !displayValue.includes('/')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleSlash = () => {
    if (!displayValue.includes('/')) {
      setDisplayValue(displayValue + '/');
    }
  };

  const handleSpace = () => {
    setDisplayValue(displayValue + ' ');
  };

  const handleFractionClick = (fraction: string) => {
    if (displayValue === '0') {
      setDisplayValue(fraction);
    } else {
      const lastChar = displayValue[displayValue.length - 1];
      if (lastChar >= '0' && lastChar <= '9' && !displayValue.includes('.') && !displayValue.includes('/')) {
        setDisplayValue(displayValue + '.' + fraction);
      } else {
        setDisplayValue(displayValue + ' ' + fraction);
      }
    }
  };

  const handleNegativeFractionClick = (fraction: string) => {
    if (displayValue === '0') {
      setDisplayValue('-' + fraction);
    } else {
      const lastChar = displayValue[displayValue.length - 1];
      if (lastChar >= '0' && lastChar <= '9' && !displayValue.includes('.') && !displayValue.includes('/') && !displayValue.includes(' ')) {
        setDisplayValue('-' + displayValue + '.' + fraction);
      } else {
        setDisplayValue(displayValue + ' -' + fraction);
      }
    }
  };

  const handleClear = () => {
    setDisplayValue('0');
  };

  const handleOK = () => {
    onChange(displayValue);
    onClose?.();
  };

  const handleCancel = () => {
    setDisplayValue(value);
    onClose?.();
  };

  // Get border and header colors based on title
  const getColors = () => {
    const cleanTitle = title.toLowerCase().replace('enter ', '');
    if (cleanTitle.includes('left front')) {
      return {
        border: 'border-yellow-500',
        bg: 'bg-yellow-500',
        gradient: 'from-yellow-500/10 to-yellow-600/10',
        shadow: 'shadow-yellow-500/20'
      };
    }
    if (cleanTitle.includes('right front')) {
      return {
        border: 'border-green-500',
        bg: 'bg-green-500',
        gradient: 'from-green-500/10 to-green-600/10',
        shadow: 'shadow-green-500/20'
      };
    }
    if (cleanTitle.includes('left rear')) {
      return {
        border: 'border-purple-500',
        bg: 'bg-purple-500',
        gradient: 'from-purple-500/10 to-purple-600/10',
        shadow: 'shadow-purple-500/20'
      };
    }
    if (cleanTitle.includes('right rear')) {
      return {
        border: 'border-blue-500',
        bg: 'bg-blue-500',
        gradient: 'from-blue-500/10 to-blue-600/10',
        shadow: 'shadow-blue-500/20'
      };
    }
    return {
      border: 'border-brand-gold',
      bg: 'bg-brand-gold',
      gradient: 'from-brand-gold/10 to-brand-gold-dark/10',
      shadow: 'shadow-brand-gold/20'
    };
  };

  const colors = getColors();
  // Remove "Enter" from the title if present
  const displayTitle = title.replace(/^Enter\s+/i, '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden`}>
        {/* Header with curved border */}
        <div className={`relative ${colors.bg} rounded-t-xl shadow-lg ${colors.shadow}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-t-xl" />
          <div className="px-4 py-3 flex items-center justify-between relative">
            <h2 className="text-lg font-medium text-white">{displayTitle}</h2>
            {onClose && (
              <button 
                onClick={onClose} 
                className={`p-1 hover:bg-white/20 rounded transition-colors`}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>

        <div className={`p-4 bg-gradient-to-br ${colors.gradient}`}>
          {/* Display */}
          <input
            type="text"
            value={displayValue}
            readOnly
            className="w-full px-4 py-3 text-right text-2xl font-mono bg-white dark:bg-gray-800 rounded-lg mb-4 shadow-inner"
          />

          <div className="grid grid-cols-5 gap-2">
            {/* Main Keypad */}
            <div className="col-span-3 grid grid-cols-3 gap-2">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num.toString())}
                  className="p-4 text-xl font-medium bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleToggleNegative}
                className="p-4 text-base font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 shadow-sm"
              >
                +/-
              </button>
              <button
                onClick={() => handleNumberClick('0')}
                className="p-4 text-xl font-medium bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                0
              </button>
              <button
                onClick={handleDecimalPoint}
                className="p-4 text-xl font-medium bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                .
              </button>
              <button
                onClick={handleSpace}
                className="p-3 text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm"
              >
                Space
              </button>
              <button
                onClick={handleSlash}
                className="p-3 text-xl font-medium bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                /
              </button>
              <button
                onClick={handleBackspace}
                className="p-3 text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm"
              >
                Back
              </button>
            </div>

            {/* Fractions Column - Both + and - */}
            {showFractions && (
              <div className="col-span-2 grid grid-cols-2 gap-1 overflow-y-auto max-h-[380px]">
                {fractions.map(fraction => (
                  <React.Fragment key={fraction}>
                    <button
                      onClick={() => handleNegativeFractionClick(fraction)}
                      className="p-2 text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shadow-sm whitespace-nowrap"
                    >
                      -{fraction}
                    </button>
                    <button
                      onClick={() => handleFractionClick(fraction)}
                      className="p-2 text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors shadow-sm whitespace-nowrap"
                    >
                      +{fraction}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="p-4 text-base font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleClear}
              className="p-4 text-base font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 shadow-sm"
            >
              Clear
            </button>
            <button
              onClick={handleOK}
              className={`p-4 text-base font-medium ${colors.bg} text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberInput;