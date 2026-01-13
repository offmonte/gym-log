'use client';

import { useState } from 'react';
import { Exercise } from '@/lib/types';

interface ExerciseFormProps {
  onAddExercise: (exercise: Exercise) => void;
}

export default function ExerciseForm({ onAddExercise }: ExerciseFormProps) {
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState([{ setNumber: 1, weight: 0, reps: 0 }]);

  const handleAddSet = () => {
    setSets([
      ...sets,
      {
        setNumber: sets.length + 1,
        weight: 0,
        reps: 0,
      },
    ]);
  };

  const handleUpdateSet = (index: number, field: string, value: any) => {
    const newSets = [...sets];
    newSets[index] = {
      ...newSets[index],
      [field]: field === 'reps' ? parseInt(value) || 0 : parseFloat(value) || 0,
    };
    setSets(newSets);
  };

  const handleRemoveSet = (index: number) => {
    const newSets = sets
      .filter((_, i) => i !== index)
      .map((set, i) => ({
        ...set,
        setNumber: i + 1,
      }));
    setSets(newSets);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!exerciseName.trim()) {
      alert('Por favor, insira o nome do exercício');
      return;
    }

    if (sets.some(s => s.weight === 0 || s.reps === 0)) {
      alert('Por favor, preencha peso e repetições para todas as séries');
      return;
    }

    onAddExercise({
      name: exerciseName,
      sets,
    });

    // Reset form
    setExerciseName('');
    setSets([{ setNumber: 1, weight: 0, reps: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Adicionar Exercício</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Exercício
        </label>
        <input
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          placeholder="Ex: Supino Reto"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Séries
        </label>
        <div className="space-y-3">
          {sets.map((set, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-shrink-0">
                <label className="text-xs text-gray-600">Série</label>
                <input
                  type="text"
                  value={set.setNumber}
                  disabled
                  className="w-12 px-2 py-2 border border-gray-300 rounded bg-gray-100 text-center text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600">Carga (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={set.weight || ''}
                  onChange={(e) => handleUpdateSet(index, 'weight', e.target.value)}
                  placeholder="0"
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600">Reps</label>
                <input
                  type="number"
                  value={set.reps || ''}
                  onChange={(e) => handleUpdateSet(index, 'reps', e.target.value)}
                  placeholder="0"
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSet(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddSet}
          className="mt-3 w-full py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          + Adicionar Série
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
      >
        Adicionar Exercício
      </button>
    </form>
  );
}
