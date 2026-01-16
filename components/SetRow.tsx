'use client';

import { Trash2 } from 'lucide-react';
import { Set, ComparisonResult } from '@/lib/types';

interface SetRowProps {
  set: Set;
  onUpdate: (set: Set) => void;
  onDelete: () => void;
  isEditing: boolean;
}

const getComparisonDisplay = (comparison?: ComparisonResult) => {
  switch (comparison) {
    case 'up':
      return { icon: '↑', className: 'text-up' };
    case 'down':
      return { icon: '↓', className: 'text-down' };
    case 'equal':
      return { icon: '=', className: 'text-equal' };
    case 'new':
      return { icon: 'NEW', className: 'text-new' };
    default:
      return { icon: '-', className: 'text-text-tertiary' };
  }
};

export default function SetRow({
  set,
  onUpdate,
  onDelete,
  isEditing,
}: SetRowProps) {
  const comparison = getComparisonDisplay(set.comparison);

  return (
    <div className="animate-slide-in">
      {isEditing ? (
        <div className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-3 p-3 sm:p-4 md:p-4 bg-tertiary/30 rounded-lg items-end">
          {/* Serie number */}
          <div className="col-span-2 md:col-span-2">
            <p className="md:hidden text-xs text-text-secondary mb-2">Série</p>
            <div className="text-center font-semibold text-text-secondary text-base">
              {set.setNumber}ª
            </div>
          </div>

          {/* Weight input */}
          <div className="col-span-5 md:col-span-5">
            <p className="md:hidden text-xs text-text-secondary mb-2">Carga</p>
            <div className="relative flex items-center">
              <input
                type="number"
                step="0.5"
                value={set.weight || ''}
                onChange={(e) =>
                  onUpdate({
                    ...set,
                    weight: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
                className="w-full text-center text-base font-semibold pr-8"
                inputMode="decimal"
              />
              <span className="absolute right-3 text-text-secondary font-medium text-xs pointer-events-none">kg</span>
            </div>
          </div>

          {/* Reps input */}
          <div className="col-span-5 md:col-span-5">
            <p className="md:hidden text-xs text-text-secondary mb-2">Reps</p>
            <input
              type="number"
              value={set.reps || ''}
              onChange={(e) =>
                onUpdate({
                  ...set,
                  reps: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
              className="w-full text-center text-base font-semibold"
              inputMode="numeric"
            />
          </div>

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="col-span-2 md:col-span-2 flex items-center justify-center w-full h-12 sm:h-11 md:h-10 rounded-lg font-bold hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: 'var(--color-down)',
            }}
            aria-label="Remover série"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between py-3 sm:py-4 md:py-4 px-3 sm:px-4 md:px-5 bg-tertiary/20 rounded-lg">
          {/* Left side - series info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 sm:gap-2 md:gap-3 flex-wrap">
              <span className="text-xs sm:text-sm md:text-sm text-text-secondary shrink-0">Série {set.setNumber}:</span>
              <span className="text-base sm:text-lg md:text-lg font-semibold text-white">{set.weight}</span>
              <span className="text-xs sm:text-sm md:text-sm text-text-secondary shrink-0">kg</span>
              <span className="text-text-secondary mx-1 md:mx-2 shrink-0">×</span>
              <span className="text-base sm:text-lg md:text-lg font-semibold text-white">{set.reps}</span>
              <span className="text-xs sm:text-sm md:text-sm text-text-secondary shrink-0">reps</span>
            </div>
          </div>

          {/* Right side - indicator */}
          <div className={`flex-shrink-0 ml-3 sm:ml-4 md:ml-5 text-xl sm:text-2xl md:text-2xl font-bold ${comparison.className}`}>
            {comparison.icon === 'NEW' ? (
              <span className="text-xs sm:text-xs md:text-sm font-bold">{comparison.icon}</span>
            ) : (
              comparison.icon
            )}
          </div>
        </div>
      )}
    </div>
  );
}
