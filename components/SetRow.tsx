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
      return { icon: '↑', color: 'text-green-600', label: 'Subiu' };
    case 'down':
      return { icon: '↓', color: 'text-red-600', label: 'Desceu' };
    case 'equal':
      return { icon: '=', color: 'text-gray-400', label: 'Igual' };
    case 'new':
      return { icon: 'NEW', color: 'text-blue-600', label: 'Novo' };
    default:
      return { icon: '-', color: 'text-gray-400', label: '' };
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
    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 w-8 text-center font-semibold text-gray-600">
        {set.setNumber}ª
      </div>

      {isEditing ? (
        <>
          <input
            type="number"
            step="0.5"
            value={set.weight}
            onChange={(e) =>
              onUpdate({
                ...set,
                weight: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="kg"
            className="w-20 px-2 py-2 border border-gray-300 rounded text-sm"
          />
          <span className="text-gray-500 text-sm">kg</span>

          <span className="text-gray-500">×</span>

          <input
            type="number"
            value={set.reps}
            onChange={(e) =>
              onUpdate({
                ...set,
                reps: parseInt(e.target.value) || 0,
              })
            }
            placeholder="reps"
            className="w-16 px-2 py-2 border border-gray-300 rounded text-sm"
          />
          <span className="text-gray-500 text-sm">reps</span>

          <button
            onClick={onDelete}
            className="ml-auto px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
          >
            ✕
          </button>
        </>
      ) : (
        <>
          <div className="flex-1 flex items-center gap-2">
            <span className="font-semibold">{set.weight}</span>
            <span className="text-gray-500">kg ×</span>
            <span className="font-semibold">{set.reps}</span>
            <span className="text-gray-500">reps</span>
          </div>

          <div className={`font-bold text-lg flex items-center gap-1 ${comparison.color}`}>
            {comparison.icon === 'NEW' ? (
              <span className="text-xs font-bold">{comparison.icon}</span>
            ) : (
              <span>{comparison.icon}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
