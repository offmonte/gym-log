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
    <div className="card mb-4 cursor-pointer transition-all animate-slide-in">
      <button
        onClick={onToggleExpanded}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {dayOfWeek} • {formattedDate}
            </h2>
            {workout.name && (
              <p className="text-sm text-text-secondary mt-1">{workout.name}</p>
            )}
            <p className="text-xs text-text-tertiary mt-2">
              {workout.exercises.length} exercício(s)
            </p>
          </div>
          <div className="text-2xl text-text-secondary transition-transform">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-6 border-t border-bg-tertiary pt-6 space-y-4">
          {workout.exercises.length === 0 ? (
            <p className="text-center text-text-secondary text-sm py-4">
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
            className="w-full mt-6 py-3 btn-danger text-sm"
          >
            Deletar Treino
          </button>
        </div>
      )}
    </div>
  );
}
