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

    setExerciseName('');
    setSets([{ setNumber: 1, weight: 0, reps: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="card mb-6 animate-slide-in">
      <h3 className="text-lg font-semibold text-white mb-6">Adicionar Exercício</h3>

      {/* Exercise name input - BIG */}
      <input
        type="text"
        value={exerciseName}
        onChange={(e) => setExerciseName(e.target.value)}
        placeholder="Nome do exercício"
        className="w-full mb-6 text-lg"
      />

      {/* Series */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-4">
          Séries
        </label>
        <div className="space-y-3">
          {sets.map((set, index) => (
            <div
              key={index}
              className="flex items-end gap-2 p-4 bg-tertiary/30 rounded-lg"
            >
              {/* Serie number - fixed width */}
              <div className="w-12 flex-shrink-0">
                <p className="text-xs text-text-secondary mb-2">Série</p>
                <input
                  type="text"
                  value={set.setNumber}
                  disabled
                  className="w-full text-center bg-secondary text-white font-semibold text-lg"
                />
              </div>

              {/* Weight input - BIGGER */}
              <div className="flex-1">
                <p className="text-xs text-text-secondary mb-2">Carga</p>
                <input
                  type="number"
                  step="0.5"
                  value={set.weight || ''}
                  onChange={(e) => handleUpdateSet(index, 'weight', e.target.value)}
                  placeholder="0"
                  className="w-full text-center text-lg font-semibold"
                  inputMode="decimal"
                />
              </div>

              <span className="text-text-secondary font-medium mb-3">kg</span>

              {/* Separator */}
              <span className="text-text-secondary text-lg mb-3">×</span>

              {/* Reps input - BIGGER */}
              <div className="flex-1">
                <p className="text-xs text-text-secondary mb-2">Reps</p>
                <input
                  type="number"
                  value={set.reps || ''}
                  onChange={(e) => handleUpdateSet(index, 'reps', e.target.value)}
                  placeholder="0"
                  className="w-full text-center text-lg font-semibold"
                  inputMode="numeric"
                />
              </div>

              {/* Delete button - thumb-friendly */}
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSet(index)}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/20 text-down font-bold hover:bg-red-500/30 transition-all mb-3"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add series button */}
        <button
          type="button"
          onClick={handleAddSet}
          className="w-full mt-4 py-3 text-text-primary font-semibold rounded-lg bg-bg-tertiary hover:bg-bg-tertiary/80 transition-all text-sm"
        >
          + Adicionar Série
        </button>
      </div>

      {/* Submit button - PRIMARY CTA */}
      <button type="submit" className="btn-primary mb-4">
        Adicionar Exercício
      </button>
    </form>
  );
}
