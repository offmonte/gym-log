'use client';

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
        <div className="grid grid-cols-12 gap-2 md:gap-3 p-4 bg-tertiary/30 rounded-lg items-end">
          {/* Serie number */}
          <div className="col-span-2 md:col-span-2">
            <p className="md:hidden text-xs text-text-secondary mb-2">Série</p>
            <div className="text-center font-semibold text-text-secondary text-lg">
              {set.setNumber}ª
            </div>
          </div>

          {/* Weight input */}
          <div className="col-span-5 md:col-span-5">
            <p className="md:hidden text-xs text-text-secondary mb-2">Carga</p>
            <div className="flex items-center gap-2">
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
                className="flex-1 text-center text-lg font-semibold"
                inputMode="decimal"
              />
              <span className="text-text-secondary font-medium text-sm md:text-base">kg</span>
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
              className="w-full text-center text-lg font-semibold"
              inputMode="numeric"
            />
          </div>

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="col-span-2 md:col-span-2 flex items-center justify-center w-full h-12 md:h-10 rounded-lg font-bold hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: 'var(--color-down)',
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between py-3 md:py-4 px-4 md:px-5 bg-tertiary/20 rounded-lg">
          {/* Left side - series info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1 md:gap-2 flex-wrap">
              <span className="text-xs md:text-sm text-text-secondary">Série {set.setNumber}:</span>
              <span className="text-base md:text-lg font-semibold text-white">{set.weight}</span>
              <span className="text-xs md:text-sm text-text-secondary">kg</span>
              <span className="text-text-secondary mx-0.5 md:mx-1">×</span>
              <span className="text-base md:text-lg font-semibold text-white">{set.reps}</span>
              <span className="text-xs md:text-sm text-text-secondary">reps</span>
            </div>
          </div>

          {/* Right side - indicator */}
          <div className={`flex-shrink-0 ml-2 md:ml-4 text-xl md:text-2xl font-bold ${comparison.className}`}>
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
