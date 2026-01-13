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
    <div className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4">
      <button
        onClick={onToggleExpanded}
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h2 className="text-lg font-bold text-gray-800">
            {dayOfWeek} — {formattedDate}
          </h2>
          {workout.name && (
            <p className="text-sm text-gray-600 mt-1">Treino: {workout.name}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {workout.exercises.length} exercício(s)
          </p>
        </div>
        <span className="text-2xl text-gray-600">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div className="bg-gray-50 px-4 py-4 border-t border-gray-200">
          {workout.exercises.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum exercício registrado</p>
          ) : (
            <div>
              {workout.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={index}
                  exercise={exercise}
                  onUpdate={(updatedExercise) =>
                    handleUpdateExercise(index, updatedExercise)
                  }
                  onDelete={() => handleDeleteExercise(index)}
                />
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={onDelete}
              className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200"
            >
              Deletar Treino
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
