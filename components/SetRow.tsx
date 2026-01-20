'use client';

import { Trash2 } from 'lucide-react';
import { ExerciseSet, ComparisonResult } from '@/lib/types';

interface SetRowProps {
  set: ExerciseSet;
  onUpdate: (set: ExerciseSet) => void;
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
        <div className="grid grid-cols-12 gap-2 sm:gap-3 p-3 sm:p-3 bg-tertiary/30 rounded items-end">
          {/* Serie number */}
          <div className="col-span-2">
            <p className="md:hidden text-xs text-text-secondary mb-2">Série</p>
            <div className="text-center font-semibold text-text-secondary text-sm">
              {set.setNumber}ª
            </div>
          </div>

          {/* Weight input */}
          <div className="col-span-5">
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
                className="w-full text-center text-sm font-semibold pr-6"
                inputMode="decimal"
              />
              <span className="absolute right-2 text-text-secondary font-medium text-xs pointer-events-none">kg</span>
            </div>
          </div>

          {/* Reps input */}
          <div className="col-span-5">
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
              className="w-full text-center text-sm font-semibold"
              inputMode="numeric"
            />
          </div>

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="col-span-2 flex items-center justify-center w-full h-10 sm:h-11 rounded font-bold hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: 'var(--color-down)',
            }}
            aria-label="Remover série"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between py-3 sm:py-3 px-3 sm:px-4 bg-tertiary/20 rounded">
          {/* Left side - series info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
              <span className="text-xs sm:text-sm text-text-secondary shrink-0">Série {set.setNumber}:</span>
              <span className="text-sm sm:text-base font-semibold text-white">{set.weight}</span>
              <span className="text-xs sm:text-sm text-text-secondary shrink-0">kg</span>
              <span className="text-text-secondary mx-1 shrink-0">×</span>
              <span className="text-sm sm:text-base font-semibold text-white">{set.reps}</span>
              <span className="text-xs sm:text-sm text-text-secondary shrink-0">reps</span>
            </div>
          </div>

          {/* Right side - indicator */}
          <div className={`flex-shrink-0 ml-2 sm:ml-3 text-lg sm:text-xl font-bold ${comparison.className}`}>
            {comparison.icon === 'NEW' ? (
              <span className="text-xs font-bold">{comparison.icon}</span>
            ) : (
              comparison.icon
            )}
          </div>
        </div>
      )}
    </div>
  );
}
