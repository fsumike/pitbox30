import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    try {
      await Haptics.impact({ style });
    } catch (err) {
      // Haptics not available, silently ignore
    }
  };

  useEffect(() => {
    setDisplayValue(value || '0');
  }, [value]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartY.current = touch.clientY;
    setIsDragging(true);
    triggerHaptic(ImpactStyle.Light);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const diff = touch.clientY - dragStartY.current;
    if (diff > 0) {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset > 100) {
      triggerHaptic(ImpactStyle.Medium);
      onClose?.();
    } else {
      setDragOffset(0);
    }
    setIsDragging(false);
  };

  const fractions = [
    '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8', '1'
  ];

  const handleNumberClick = (num: string) => {
    triggerHaptic(ImpactStyle.Light);
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
    // Get the last number segment (after the last space)
    const segments = displayValue.split(' ');
    const lastSegment = segments[segments.length - 1];

    // Don't allow decimal if the current segment has a decimal or slash
    if (!lastSegment.includes('.') && !lastSegment.includes('/')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleSlash = () => {
    // Get the last number segment (after the last space)
    const segments = displayValue.split(' ');
    const lastSegment = segments[segments.length - 1];

    // If the last segment has a decimal, convert it to space + fraction
    // e.g., "1.1" becomes "1 1/" when user types slash
    if (lastSegment.includes('.') && !lastSegment.includes('/')) {
      const updatedValue = displayValue.replace(/\.([^.\s]*)$/, ' $1');
      setDisplayValue(updatedValue + '/');
    } else if (!lastSegment.includes('/')) {
      // Only add slash if there isn't already one
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
    triggerHaptic(ImpactStyle.Medium);
    onChange(displayValue);
    setTimeout(() => {
      onClose?.();
    }, 0);
  };

  const handleCancel = () => {
    triggerHaptic(ImpactStyle.Light);
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
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-md overflow-hidden transition-transform duration-200`}
        style={{
          transform: `translateY(${dragOffset}px)`,
          touchAction: 'none'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle indicator */}
        <div className="w-full flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header with curved border */}
        <div className={`relative ${colors.bg} shadow-lg ${colors.shadow} ${dragOffset === 0 ? 'sm:rounded-t-xl' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="px-4 py-3 flex items-center justify-between relative">
            <h2 className="text-lg font-medium text-white">{displayTitle}</h2>
            {onClose && (
              <button
                onClick={onClose}
                className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/20 active:bg-white/30 rounded transition-colors touch-manipulation`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <X className="w-5 h-5 text-white" />
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
            className="w-full px-4 py-3 text-right text-2xl font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg mb-4 shadow-inner"
          />

          <div className="grid grid-cols-5 gap-2">
            {/* Main Keypad */}
            <div className="col-span-3 grid grid-cols-3 gap-2">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num.toString())}
                  className="min-h-[48px] p-4 text-xl font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg active:bg-gray-100 dark:active:bg-gray-700 transition-colors shadow-sm touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleToggleNegative}
                className="min-h-[48px] p-4 text-base font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg active:bg-orange-200 dark:active:bg-orange-900/50 shadow-sm touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                +/-
              </button>
              <button
                onClick={() => handleNumberClick('0')}
                className="min-h-[48px] p-4 text-xl font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg active:bg-gray-100 dark:active:bg-gray-700 transition-colors shadow-sm touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                0
              </button>
              <button
                onClick={handleDecimalPoint}
                className="min-h-[48px] p-4 text-xl font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg active:bg-gray-100 dark:active:bg-gray-700 transition-colors shadow-sm touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                .
              </button>
              <button
                onClick={handleSpace}
                className="min-h-[48px] p-3 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg active:bg-gray-200 dark:active:bg-gray-600 shadow-sm touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Space
              </button>
              <button
                onClick={handleSlash}
                className="min-h-[48px] p-3 text-xl font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg active:bg-gray-100 dark:active:bg-gray-700 transition-colors shadow-sm touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                /
              </button>
              <button
                onClick={handleBackspace}
                className="min-h-[48px] p-3 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg active:bg-gray-200 dark:active:bg-gray-600 shadow-sm touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
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
                      className="min-h-[44px] p-2 text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg active:bg-red-100 dark:active:bg-red-900/30 transition-colors shadow-sm whitespace-nowrap touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      -{fraction}
                    </button>
                    <button
                      onClick={() => handleFractionClick(fraction)}
                      className="min-h-[44px] p-2 text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg active:bg-green-100 dark:active:bg-green-900/30 transition-colors shadow-sm whitespace-nowrap touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
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
              className="min-h-[48px] p-4 text-base font-medium bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg active:bg-gray-200 dark:active:bg-gray-600 shadow-sm touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Cancel
            </button>
            <button
              onClick={handleClear}
              className="min-h-[48px] p-4 text-base font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg active:bg-red-200 dark:active:bg-red-900/50 shadow-sm touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Clear
            </button>
            <button
              onClick={handleOK}
              className={`min-h-[48px] p-4 text-base font-medium ${colors.bg} text-white rounded-lg active:opacity-90 transition-opacity shadow-sm touch-manipulation`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
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