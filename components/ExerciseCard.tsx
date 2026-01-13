'use client';

import { Exercise } from '@/lib/types';
import SetRow from './SetRow';
import { useState } from 'react';

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
    <div className="card mb-4 animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
          {lastDate && (
            <p className="text-sm text-text-secondary mt-1">Último: {lastDate}</p>
          )}
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary ml-2 text-sm"
          >
            ✎
          </button>
        )}
      </div>

      {/* Sets */}
      <div className="mb-4">
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
        <div className="space-y-3 border-t border-bg-tertiary pt-4">
          <button
            onClick={handleAddSet}
            className="w-full py-3 bg-green-500/20 text-green-400 rounded-lg font-semibold text-sm hover:bg-green-500/30 transition-all"
          >
            + Série
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 btn-secondary text-green-400"
            >
              Pronto
            </button>
            <button
              onClick={onDelete}
              className="flex-1 btn-danger text-sm"
            >
              Deletar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
