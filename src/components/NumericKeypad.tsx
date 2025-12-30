import React from 'react';
import { Delete } from 'lucide-react';

interface NumericKeypadProps {
  onNumberClick: (num: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

function NumericKeypad({ onNumberClick, onBackspace, disabled = false }: NumericKeypadProps) {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {numbers.map((num, index) => {
        if (num === '') {
          return <div key={index} />;
        }

        if (num === 'backspace') {
          return (
            <button
              key={index}
              type="button"
              onClick={onBackspace}
              disabled={disabled}
              className="aspect-square rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Delete className="w-6 h-6" />
            </button>
          );
        }

        return (
          <button
            key={index}
            type="button"
            onClick={() => onNumberClick(num)}
            disabled={disabled}
            className="aspect-square rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 font-semibold text-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}

export default NumericKeypad;
