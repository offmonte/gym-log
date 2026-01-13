'use client';

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
    <div className="card mb-4 sm:mb-5 md:mb-6 cursor-pointer transition-all animate-slide-in">
      <button
        onClick={onToggleExpanded}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">
              {dayOfWeek} • {formattedDate}
            </h2>
            {workout.name && (
              <p className="text-xs sm:text-sm text-text-secondary mt-2">
                {workout.name}
              </p>
            )}
            <p className="text-xs sm:text-xs text-text-tertiary mt-2">
              {workout.exercises.length} exercício(s)
            </p>
          </div>
          <div className="text-2xl text-text-secondary transition-transform flex-shrink-0 ml-3">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-5 sm:mt-6 md:mt-7 border-t border-bg-tertiary pt-5 sm:pt-6 md:pt-7 space-y-4 sm:space-y-5 md:space-y-6">
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
            className="w-full mt-6 sm:mt-7 md:mt-8 py-3 btn-danger text-xs sm:text-sm md:text-base"
          >
            Deletar Treino
          </button>
        </div>
      )}
    </div>
  );
}
