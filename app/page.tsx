'use client';

import { useState, useEffect } from 'react';
import { Workout, Exercise } from '@/lib/types';
import {
  getWorkouts,
  saveWorkout,
  findLastExercise,
  addComparisons,
  generateId,
  getTodayDate,
} from '@/lib/workoutUtils';
import WorkoutCard from '@/components/WorkoutCard';
import ExerciseForm from '@/components/ExerciseForm';

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [workoutName, setWorkoutName] = useState('');
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load workouts from Local Storage on mount
  useEffect(() => {
    const loadedWorkouts = getWorkouts();
    setWorkouts(loadedWorkouts);
    setIsLoading(false);
  }, []);

  // Get current workout or create new one
  const getCurrentWorkout = (): Workout => {
    const existing = workouts.find(w => w.date === selectedDate);
    if (existing) return existing;

    return {
      id: generateId(),
      date: selectedDate,
      name: workoutName,
      exercises: [],
    };
  };

  const handleAddExercise = (exercise: Exercise) => {
    const currentWorkout = getCurrentWorkout();

    // Find last execution of this exercise
    const lastExercise = findLastExercise(exercise.name, selectedDate);

    // Add comparisons to the exercise
    const exerciseWithComparisons = addComparisons(exercise, lastExercise);

    // Check if exercise already exists in current workout
    const existingIndex = currentWorkout.exercises.findIndex(
      e => e.name.toLowerCase() === exercise.name.toLowerCase()
    );

    let updatedWorkout: Workout;

    if (existingIndex >= 0) {
      const updatedExercises = [...currentWorkout.exercises];
      updatedExercises[existingIndex] = exerciseWithComparisons;
      updatedWorkout = {
        ...currentWorkout,
        exercises: updatedExercises,
      };
    } else {
      updatedWorkout = {
        ...currentWorkout,
        exercises: [...currentWorkout.exercises, exerciseWithComparisons],
      };
    }

    saveWorkout(updatedWorkout);
    setWorkouts(getWorkouts());
  };

  const handleUpdateWorkout = (updatedWorkout: Workout) => {
    saveWorkout(updatedWorkout);
    setWorkouts(getWorkouts());
  };

  const handleDeleteWorkout = (workoutId: string) => {
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    const updatedExpandedWorkouts = new Set(expandedWorkouts);
    updatedExpandedWorkouts.delete(workoutId);
    setExpandedWorkouts(updatedExpandedWorkouts);
    getWorkouts().forEach((w) => {
      if (w.id !== workoutId) {
        saveWorkout(w);
      }
    });
    localStorage.setItem('gymlog_workouts', JSON.stringify(updatedWorkouts));
    setWorkouts(updatedWorkouts);
  };

  const toggleWorkoutExpanded = (workoutId: string) => {
    const newExpanded = new Set(expandedWorkouts);
    if (newExpanded.has(workoutId)) {
      newExpanded.delete(workoutId);
    } else {
      newExpanded.add(workoutId);
    }
    setExpandedWorkouts(newExpanded);
  };

  // Sort workouts by date descending
  const sortedWorkouts = [...workouts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const currentWorkout = getCurrentWorkout();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">💪 GymLog</h1>
          <p className="text-gray-600">Monitore seus treinos e veja seu progresso</p>
        </div>

        {/* Date and Name Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-blue-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Nova Sessão de Treino</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Treino (Opcional)
              </label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Ex: Peito e Tríceps"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {currentWorkout.exercises.length > 0 && (
            <p className="text-sm text-gray-600">
              {currentWorkout.exercises.length} exercício(s) adicionado(s)
            </p>
          )}
        </div>

        {/* Exercise Form */}
        <ExerciseForm onAddExercise={handleAddExercise} />

        {/* Current Workout Exercises */}
        {currentWorkout.exercises.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Exercícios de Hoje
            </h2>
            {currentWorkout.exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 mb-4 last:mb-0"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    {exercise.name}
                  </h3>
                </div>

                <div className="space-y-2">
                  {exercise.sets.map((set) => {
                    const getComparisonColor = (comparison?: string) => {
                      switch (comparison) {
                        case 'up':
                          return 'text-green-600 font-bold';
                        case 'down':
                          return 'text-red-600 font-bold';
                        case 'equal':
                          return 'text-gray-400 font-bold';
                        case 'new':
                          return 'text-blue-600 font-bold';
                        default:
                          return '';
                      }
                    };

                    const getComparisonIcon = (comparison?: string) => {
                      switch (comparison) {
                        case 'up':
                          return '↑';
                        case 'down':
                          return '↓';
                        case 'equal':
                          return '=';
                        case 'new':
                          return 'NEW';
                        default:
                          return '';
                      }
                    };

                    return (
                      <div
                        key={set.setNumber}
                        className="flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-200"
                      >
                        <span className="text-sm text-gray-600">
                          Série {set.setNumber}: {set.weight}kg × {set.reps} reps
                        </span>
                        <span
                          className={`text-lg ${getComparisonColor(
                            set.comparison
                          )}`}
                        >
                          {set.comparison === 'new' ? (
                            <span className="text-xs font-bold">
                              {getComparisonIcon(set.comparison)}
                            </span>
                          ) : (
                            getComparisonIcon(set.comparison)
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Workouts List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📋 Histórico de Treinos
          </h2>

          {sortedWorkouts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
              <p className="text-gray-500 mb-2">Nenhum treino registrado</p>
              <p className="text-gray-400 text-sm">
                Comece adicionando exercícios acima
              </p>
            </div>
          ) : (
            <div>
              {sortedWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onUpdate={handleUpdateWorkout}
                  onDelete={() => handleDeleteWorkout(workout.id)}
                  isExpanded={expandedWorkouts.has(workout.id)}
                  onToggleExpanded={() => toggleWorkoutExpanded(workout.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
