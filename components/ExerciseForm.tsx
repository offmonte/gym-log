'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import { Exercise } from '@/lib/types';
import { getUniqueExerciseNames } from '@/lib/workoutUtils';

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
    <form onSubmit={handleSubmit} className="card">
      <h3 className="text-lg sm:text-xl font-semibold text-white">
        Adicionar Exercício
      </h3>

      {/* Exercise name input */}
      <div>
        <input
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          placeholder="Nome do exercício"
          className="w-full"
        />
      </div>

      {/* Series section */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-3">
          Séries
        </label>

        {/* Column headers for desktop/tablet */}
        <div className="hidden md:grid grid-cols-12 gap-3 mb-4 px-1">
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
        <div className="space-y-2 sm:space-y-3">
          {sets.map((set, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 sm:gap-3 p-3 sm:p-3 md:p-2 bg-tertiary/30 rounded-lg items-end"
            >
              {/* Serie number - fixed */}
              <div className="col-span-2">
                <p className="md:hidden text-xs text-text-secondary mb-2">Série</p>
                <input
                  type="text"
                  value={set.setNumber}
                  disabled
                  className="w-full text-center bg-tertiary/50 text-white font-semibold text-sm rounded"
                />
              </div>

              {/* Weight input */}
              <div className="col-span-5">
                <p className="md:hidden text-xs text-text-secondary mb-2">Carga</p>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.5"
                    value={set.weight || ''}
                    onChange={(e) => handleUpdateSet(index, 'weight', e.target.value)}
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
                  onChange={(e) => handleUpdateSet(index, 'reps', e.target.value)}
                  placeholder="0"
                  className="w-full text-center text-sm font-semibold"
                  inputMode="numeric"
                />
              </div>

              {/* Delete button */}
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSet(index)}
                  className="col-span-2 flex items-center justify-center w-full h-10 sm:h-11 rounded font-bold hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: 'var(--color-down)',
                  }}
                  aria-label="Remover série"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400 mt-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Buttons container - side by side */}
      <div className="flex gap-2 sm:gap-3 md:gap-3">
        {/* Add series button */}
        <button
          type="button"
          onClick={handleAddSet}
          className="flex-1 py-3 sm:py-3 font-bold rounded text-xs sm:text-sm hover:opacity-80 transition-all flex items-center justify-center gap-2"
          style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-new)' }}
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Série</span>
          <span className="sm:hidden">+</span>
        </button>

        {/* Submit button */}
        <button
          type="submit"
          className="flex-1 py-3 btn-primary font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>Adicionar Exercício</span>
        </button>
      </div>
    </form>
  );
}
