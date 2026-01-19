'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Calendar, Settings, Trash2 } from 'lucide-react';
import { Workout, Exercise } from '@/lib/types';
import {
  getWorkouts,
  saveWorkout,
  findLastExercise,
  addComparisons,
  generateId,
  getTodayDate,
  getDayOfWeek,
  formatDateForDisplay,
} from '@/lib/workoutUtils';
import WorkoutCard from '@/components/WorkoutCard';
import ExerciseForm from '@/components/ExerciseForm';
import BottomNav, { NavTab } from '@/components/BottomNav';
import ClearDataModal from '@/components/ClearDataModal';

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('workout');
  const [showClearDataModal, setShowClearDataModal] = useState(false);

  useEffect(() => {
    const loadedWorkouts = getWorkouts();
    setWorkouts(loadedWorkouts);
    setIsLoading(false);
  }, []);

  const getCurrentWorkout = (): Workout => {
    const existing = workouts.find(w => w.date === selectedDate);
    if (existing) return existing;

    return {
      id: generateId(),
      date: selectedDate,
      exercises: [],
    };
  };

  const handleAddExercise = (exercise: Exercise) => {
    const currentWorkout = getCurrentWorkout();
    const lastExercise = findLastExercise(exercise.name, selectedDate);
    const exerciseWithComparisons = addComparisons(exercise, lastExercise);

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

  const sortedWorkouts = [...workouts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const currentWorkout = getCurrentWorkout();
  const currentDayOfWeek = getDayOfWeek(selectedDate);
  const currentFormattedDate = formatDateForDisplay(selectedDate);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-text-secondary">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-screen">
      {/* WORKOUT TAB */}
      {activeTab === 'workout' && (
        <div className="w-full flex justify-center px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-5 md:py-6 lg:py-8">
          <div className="w-full max-w-5xl space-y-4 sm:space-y-5 md:space-y-6">
            {/* Header */}
            <div className="mb-5 sm:mb-6 md:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <Dumbbell size={32} className="text-white flex-shrink-0" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Gym Log</h1>
              </div>
              <p className="text-text-secondary mt-1 text-xs sm:text-sm">
                {currentDayOfWeek} • {currentFormattedDate}
              </p>
            </div>

            {/* Workout info card */}
            <div className="card !gap-3 sm:!gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Data
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Treino (opcional)
                  </label>
                  <input
                    type="text"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="Ex: Peito e Tríceps"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Exercise form */}
            <ExerciseForm onAddExercise={handleAddExercise} />

            {/* Current exercises section */}
            {currentWorkout.exercises.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5">
                  Exercícios de Hoje
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {currentWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="card">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                        {exercise.name}
                      </h3>

                      <div className="space-y-2 sm:space-y-3">
                        {exercise.sets.map((set) => {
                          const getComparisonIcon = (comp?: string) => {
                            switch (comp) {
                              case 'up': return '↑';
                              case 'down': return '↓';
                              case 'equal': return '=';
                              case 'new': return 'NEW';
                              default: return '';
                            }
                          };

                          const getComparisonColor = (comp?: string) => {
                            switch (comp) {
                              case 'up': return 'text-up';
                              case 'down': return 'text-down';
                              case 'equal': return 'text-equal';
                              case 'new': return 'text-new';
                              default: return '';
                            }
                          };

                          return (
                            <div
                              key={set.setNumber}
                              className="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 bg-tertiary/20 rounded"
                            >
                              <div className="flex items-baseline gap-1 sm:gap-2 flex-1 min-w-0">
                                <span className="text-xs sm:text-sm text-text-secondary shrink-0">
                                  Série {set.setNumber}:
                                </span>
                                <span className="text-sm sm:text-base font-semibold text-white">
                                  {set.weight}
                                </span>
                                <span className="text-xs text-text-secondary shrink-0">kg</span>
                                <span className="text-text-secondary mx-1 shrink-0">×</span>
                                <span className="text-sm sm:text-base font-semibold text-white">
                                  {set.reps}
                                </span>
                                <span className="text-xs text-text-secondary shrink-0">reps</span>
                              </div>

                              <div
                                className={`flex-shrink-0 ml-2 sm:ml-3 text-lg sm:text-xl font-bold ${getComparisonColor(
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
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {currentWorkout.exercises.length === 0 && (
              <div className="card text-center py-10 sm:py-12 !gap-0">
                <p className="text-text-secondary text-sm sm:text-base">
                  Nenhum exercício adicionado
                </p>
                <p className="text-text-tertiary text-xs mt-1">
                  Adicione um exercício acima para começar
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="w-full flex justify-center px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-5 md:py-6 lg:py-8">
          <div className="w-full max-w-5xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
              <Calendar size={32} className="text-white flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Histórico</h1>
            </div>

            {sortedWorkouts.length === 0 ? (
              <div className="card text-center py-10 sm:py-12">
                <p className="text-text-secondary text-sm sm:text-base">
                  Nenhum treino registrado
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
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
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="w-full flex justify-center px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-5 md:py-6 lg:py-8">
          <div className="w-full max-w-5xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
              <Settings size={32} className="text-white flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Ajustes</h1>
            </div>

            <div className="card">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Sobre</h3>
              <p className="text-text-secondary text-xs sm:text-sm mb-4 sm:mb-6">
                Gym Log v1.0 - Seu companheiro de treino na academia
              </p>

              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Armazenamento</h3>
              <p className="text-text-secondary text-xs sm:text-sm mb-4">
                Total de treinos: {workouts.length}
              </p>

              <button
                onClick={() => setShowClearDataModal(true)}
                className="w-full py-2.5 sm:py-3 btn-danger text-xs sm:text-sm px-4 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Limpar Dados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Clear Data Modal */}
      <ClearDataModal
        isOpen={showClearDataModal}
        onConfirm={() => {
          localStorage.removeItem('gymlog_workouts');
          setWorkouts([]);
          setShowClearDataModal(false);
        }}
        onCancel={() => setShowClearDataModal(false)}
      />
    </div>
  );
}
