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
  getDayOfWeek,
  formatDateForDisplay,
} from '@/lib/workoutUtils';
import WorkoutCard from '@/components/WorkoutCard';
import ExerciseForm from '@/components/ExerciseForm';
import BottomNav, { NavTab } from '@/components/BottomNav';

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [workoutName, setWorkoutName] = useState('');
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('workout');

  // Load workouts from Local Storage
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
      name: workoutName,
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
        <div className="px-4 py-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">💪 Gym Log</h1>
            <p className="text-text-secondary mt-2">
              {currentDayOfWeek} • {currentFormattedDate}
            </p>
          </div>

          {/* Workout date and name inputs */}
          <div className="card mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full mb-4 text-base"
            />
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Nome do treino (opcional)"
              className="w-full text-base"
            />
          </div>

          {/* Exercise form */}
          <ExerciseForm onAddExercise={handleAddExercise} />

          {/* Current exercises */}
          {currentWorkout.exercises.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Exercícios de Hoje
              </h2>
              {currentWorkout.exercises.map((exercise, index) => (
                <div key={index} className="card mb-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {exercise.name}
                  </h3>
                  <div className="space-y-3">
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
                          className="flex items-center justify-between py-2 px-3 bg-tertiary/30 rounded-lg"
                        >
                          <div className="flex items-baseline gap-1">
                            <span className="font-semibold text-white text-lg">
                              {set.weight}
                            </span>
                            <span className="text-sm text-text-secondary">kg</span>
                            <span className="text-text-secondary mx-1">×</span>
                            <span className="font-semibold text-white text-lg">
                              {set.reps}
                            </span>
                            <span className="text-sm text-text-secondary">reps</span>
                          </div>
                          <span className={`text-2xl font-bold ${getComparisonColor(set.comparison)}`}>
                            {set.comparison === 'new' ? (
                              <span className="text-xs">{getComparisonIcon(set.comparison)}</span>
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
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="px-4 py-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">📅 Histórico</h1>

          {sortedWorkouts.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-text-secondary">Nenhum treino registrado</p>
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
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="px-4 py-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">⚙️ Ajustes</h1>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Sobre</h3>
            <p className="text-text-secondary text-sm mb-6">
              Gym Log v1.0 - Seu companheiro de treino na academia
            </p>
            
            <h3 className="text-lg font-semibold text-white mb-4">Armazenamento</h3>
            <p className="text-text-secondary text-sm mb-4">
              Total de treinos: {workouts.length}
            </p>
            
            <button
              onClick={() => {
                if (window.confirm('Tem certeza? Isso deletará todos os treinos.')) {
                  localStorage.removeItem('gymlog_workouts');
                  setWorkouts([]);
                }
              }}
              className="w-full py-3 btn-danger text-sm"
            >
              Limpar Dados
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
