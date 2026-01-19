'use client';

import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Workout, Exercise } from '@/lib/types';
import { getDayOfWeek, formatDateForDisplay } from '@/lib/workoutUtils';
import ExerciseCard from './ExerciseCard';

interface WorkoutCardProps {
  workout: Workout;
  onUpdate: (workout: Workout) => void;
  onDelete: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export default function WorkoutCard({
  workout,
  onUpdate,
  onDelete,
  isExpanded,
  onToggleExpanded,
}: WorkoutCardProps) {
  const dayOfWeek = getDayOfWeek(workout.date);
  const formattedDate = formatDateForDisplay(workout.date);

  const handleUpdateExercise = (index: number, updatedExercise: Exercise) => {
    const newExercises = [...workout.exercises];
    newExercises[index] = updatedExercise;
    onUpdate({
      ...workout,
      exercises: newExercises,
    });
  };

  const handleDeleteExercise = (index: number) => {
    const newExercises = workout.exercises.filter((_, i) => i !== index);
    onUpdate({
      ...workout,
      exercises: newExercises,
    });
  };

  return (
    <div className="card mb-4 sm:mb-5 cursor-pointer transition-all animate-slide-in">
      <button
        onClick={onToggleExpanded}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-white">
              {dayOfWeek} • {formattedDate}
            </h2>
            <p className="text-xs text-text-tertiary mt-1">
              {workout.exercises.length} exercício(s)
            </p>
          </div>
          <div className="text-text-secondary transition-transform flex-shrink-0 ml-3">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 sm:mt-5 border-t border-bg-tertiary pt-4 sm:pt-5 space-y-4 sm:space-y-5">
          {workout.exercises.length === 0 ? (
            <p className="text-center text-text-secondary text-xs sm:text-sm py-4 sm:py-5">
              Nenhum exercício
            </p>
          ) : (
            <>
              {workout.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={index}
                  exercise={exercise}
                  onUpdate={(updatedExercise) =>
                    handleUpdateExercise(index, updatedExercise)
                  }
                  onDelete={() => handleDeleteExercise(index)}
                  lastDate={formatDateForDisplay(workout.date)}
                />
              ))}
            </>
          )}

          {/* Delete workout button */}
          <button
            onClick={onDelete}
            className="w-full mt-4 sm:mt-5 py-2.5 sm:py-3 btn-danger text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Deletar Treino
          </button>
        </div>
      )}
    </div>
  );
}
