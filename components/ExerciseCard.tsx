'use client';

import { Exercise } from '@/lib/types';
import SetRow from './SetRow';
import { useState } from 'react';

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  onDelete: () => void;
}

export default function ExerciseCard({
  exercise,
  onUpdate,
  onDelete,
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{exercise.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            {isEditing ? 'Pronto' : 'Editar'}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Deletar
          </button>
        </div>
      </div>

      <div className="space-y-3">
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

      {isEditing && (
        <button
          onClick={handleAddSet}
          className="mt-4 w-full py-2 bg-green-100 text-green-700 rounded font-semibold hover:bg-green-200"
        >
          + Adicionar Série
        </button>
      )}
    </div>
  );
}
