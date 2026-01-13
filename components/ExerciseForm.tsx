'use client';

import { useState } from 'react';
import { Exercise } from '@/lib/types';

interface ExerciseFormProps {
  onAddExercise: (exercise: Exercise) => void;
}

export default function ExerciseForm({ onAddExercise }: ExerciseFormProps) {
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState([{ setNumber: 1, weight: 0, reps: 0 }]);
  const [error, setError] = useState('');

  const handleAddSet = () => {
    setSets([
      ...sets,
      {
        setNumber: sets.length + 1,
        weight: 0,
        reps: 0,
      },
    ]);
    setError('');
  };

  const handleUpdateSet = (index: number, field: string, value: any) => {
    const newSets = [...sets];
    newSets[index] = {
      ...newSets[index],
      [field]: field === 'reps' ? parseInt(value) || 0 : parseFloat(value) || 0,
    };
    setSets(newSets);
    setError('');
  };

  const handleRemoveSet = (index: number) => {
    if (sets.length === 1) return;
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
    setError('');

    if (!exerciseName.trim()) {
      setError('Insira o nome do exercício');
      return;
    }

    if (sets.some(s => s.weight === 0 || s.reps === 0)) {
      setError('Preencha peso e reps em todas as séries');
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
    <form onSubmit={handleSubmit} className="card mb-8 sm:mb-10 md:mb-12">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 sm:mb-7 md:mb-8">
        Adicionar Exercício
      </h3>

      {/* Exercise name input */}
      <div className="mb-6 sm:mb-7 md:mb-8">
        <input
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          placeholder="Nome do exercício"
          className="w-full text-base"
        />
      </div>

      {/* Series section */}
      <div className="mb-6 sm:mb-7 md:mb-8">
        <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-4 sm:mb-5">
          Séries
        </label>

        {/* Column headers for desktop/tablet */}
        <div className="hidden md:grid grid-cols-12 gap-3 mb-4 sm:mb-5 md:mb-5">
          <div className="col-span-2 text-xs font-medium text-text-tertiary">
            Série
          </div>
          <div className="col-span-5 text-xs font-medium text-text-tertiary">
            Carga
          </div>
          <div className="col-span-5 text-xs font-medium text-text-tertiary">
            Reps
          </div>
        </div>

        {/* Series list */}
        <div className="space-y-3 sm:space-y-4">
          {sets.map((set, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-3 p-3 sm:p-4 md:p-4 bg-tertiary/30 rounded-lg items-end"
            >
              {/* Serie number - fixed */}
              <div className="col-span-2 md:col-span-2">
                <p className="md:hidden text-xs text-text-secondary mb-2">Série</p>
                <input
                  type="text"
                  value={set.setNumber}
                  disabled
                  className="w-full text-center bg-secondary text-white font-semibold text-base"
                />
              </div>

              {/* Weight input */}
              <div className="col-span-5 md:col-span-5">
                <p className="md:hidden text-xs text-text-secondary mb-2">Carga</p>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.5"
                    value={set.weight || ''}
                    onChange={(e) => handleUpdateSet(index, 'weight', e.target.value)}
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
                  onChange={(e) => handleUpdateSet(index, 'reps', e.target.value)}
                  placeholder="0"
                  className="w-full text-center text-base font-semibold"
                  inputMode="numeric"
                />
              </div>

              {/* Delete button */}
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSet(index)}
                  className="col-span-2 md:col-span-2 flex items-center justify-center w-full h-12 sm:h-11 md:h-10 rounded-lg font-bold hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: 'var(--color-down)',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-400 mt-3 sm:mt-4">
            ⚠ {error}
          </p>
        )}

        {/* Add series button */}
        <button
          type="button"
          onClick={handleAddSet}
          className="w-full mt-4 sm:mt-5 md:mt-5 py-3 sm:py-3 md:py-4 text-primary font-semibold rounded-lg bg-tertiary hover:opacity-80 transition-all text-sm sm:text-base md:text-base"
        >
          + Série
        </button>
      </div>

      {/* Submit button */}
      <button type="submit" className="btn-primary w-full text-base sm:text-base md:text-lg">
        Adicionar Exercício
      </button>
    </form>
  );
}
