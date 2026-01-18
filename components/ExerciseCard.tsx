'use client';

import { Exercise } from '@/lib/types';
import SetRow from './SetRow';
import { useState } from 'react';
import { Edit2, Plus, Check, Trash2 } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  onDelete: () => void;
  lastDate?: string;
}

export default function ExerciseCard({
  exercise,
  onUpdate,
  onDelete,
  lastDate,
}: ExerciseCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleAddSet = () => {
    const newSetNumber = exercise.sets.length + 1;
    const newSet = {
      setNumber: newSetNumber,
      weight: 0,
      reps: 0,
    };
    onUpdate({
      ...exercise,
      sets: [...exercise.sets, newSet],
    });
  };

  const handleDeleteSet = (index: number) => {
    const newSets = exercise.sets.filter((_, i) => i !== index);
    onUpdate({
      ...exercise,
      sets: newSets.map((set, i) => ({
        ...set,
        setNumber: i + 1,
      })),
    });
  };

  const handleUpdateSet = (index: number, updatedSet: any) => {
    const newSets = [...exercise.sets];
    newSets[index] = updatedSet;
    onUpdate({
      ...exercise,
      sets: newSets,
    });
  };

  return (
    <div className="card mb-4 sm:mb-5 animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-5">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white">{exercise.name}</h3>
          {lastDate && (
            <p className="text-xs text-text-secondary mt-1">Último: {lastDate}</p>
          )}
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary ml-3 text-xs sm:text-xs px-3 py-2 flex items-center gap-1 flex-shrink-0"
            aria-label="Editar exercício"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>

      {/* Sets */}
      <div className="space-y-2 sm:space-y-3">
        {exercise.sets.map((set, index) => (
          <SetRow
            key={index}
            set={set}
            onUpdate={(updatedSet) => handleUpdateSet(index, updatedSet)}
            onDelete={() => handleDeleteSet(index)}
            isEditing={isEditing}
          />
        ))}
      </div>

      {/* Edit Mode Actions */}
      {isEditing && (
        <div className="space-y-3 sm:space-y-4 md:space-y-4 border-t border-tertiary pt-4 sm:pt-5 md:pt-6">
          <button
            onClick={handleAddSet}
            className="w-full py-3 sm:py-3 md:py-4 font-bold text-xs sm:text-sm md:text-base hover:opacity-80 transition-all rounded-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: 'var(--color-up)', fontWeight: '700' }}
          >
            <Plus size={18} />
            Série
          </button>

          <div className="flex gap-2 sm:gap-3 md:gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 btn-secondary text-xs sm:text-sm md:text-base py-3 flex items-center justify-center gap-1"
            >
              <Check size={16} />
              Pronto
            </button>
            <button
              onClick={onDelete}
              className="flex-1 btn-danger text-xs sm:text-sm md:text-base py-3 flex items-center justify-center gap-1"
            >
              <Trash2 size={16} />
              Deletar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
