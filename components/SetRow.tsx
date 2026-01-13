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
    <div className="flex items-center gap-3 mb-3 animate-slide-in">
      {isEditing ? (
        <>
          {/* Serie number display during edit */}
          <div className="w-10 flex-shrink-0 text-center font-semibold text-text-secondary text-sm">
            {set.setNumber}ª
          </div>

          {/* Weight input */}
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
            placeholder="kg"
            className="w-16 text-center text-lg font-semibold"
            inputMode="decimal"
          />
          
          <span className="text-text-secondary font-medium">kg</span>
          <span className="text-text-secondary">×</span>

          {/* Reps input */}
          <input
            type="number"
            value={set.reps || ''}
            onChange={(e) =>
              onUpdate({
                ...set,
                reps: parseInt(e.target.value) || 0,
              })
            }
            placeholder="reps"
            className="w-16 text-center text-lg font-semibold"
            inputMode="numeric"
          />
          
          <span className="text-text-secondary font-medium">reps</span>

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="ml-auto flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/20 text-down font-bold hover:bg-red-500/30"
          >
            ✕
          </button>
        </>
      ) : (
        <>
          {/* Series number */}
          <div className="w-10 flex-shrink-0 text-center font-semibold text-text-secondary text-sm">
            {set.setNumber}ª
          </div>

          {/* Series info */}
          <div className="flex-1 flex items-baseline gap-1">
            <span className="text-lg font-semibold text-white">{set.weight}</span>
            <span className="text-sm text-text-secondary">kg</span>
            <span className="text-text-secondary mx-1">×</span>
            <span className="text-lg font-semibold text-white">{set.reps}</span>
            <span className="text-sm text-text-secondary">reps</span>
          </div>

          {/* Indicator */}
          <div className={`flex-shrink-0 text-2xl font-bold ${comparison.className}`}>
            {comparison.icon === 'NEW' ? (
              <span className="text-xs font-bold">{comparison.icon}</span>
            ) : (
              comparison.icon
            )}
          </div>
        </>
      )}
    </div>
  );
}
