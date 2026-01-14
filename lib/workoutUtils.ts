import { Workout, Exercise, Set, ComparisonResult } from './types';

const STORAGE_KEY = 'gymlog_workouts';

// Local Storage operations
export const getWorkouts = (): Workout[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveWorkouts = (workouts: Workout[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
};

export const saveWorkout = (workout: Workout): void => {
  const workouts = getWorkouts();
  const existingIndex = workouts.findIndex(w => w.id === workout.id);
  
  if (existingIndex >= 0) {
    workouts[existingIndex] = workout;
  } else {
    workouts.push(workout);
  }
  
  saveWorkouts(workouts);
};

// Find last exercise by name
export const findLastExercise = (exerciseName: string, currentDate: string): Exercise | null => {
  const workouts = getWorkouts();
  
  // Sort by date descending to get most recent first
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  for (const workout of sortedWorkouts) {
    // Skip current date
    if (workout.date === currentDate) continue;
    
    const exercise = workout.exercises.find(
      e => e.name.toLowerCase() === exerciseName.toLowerCase()
    );
    
    if (exercise) {
      return exercise;
    }
  }
  
  return null;
};

// Compare sets
export const compareSet = (current: Set, previous: Set | undefined): ComparisonResult => {
  if (!previous) return 'new';
  
  if (current.weight > previous.weight) {
    return 'up';
  } else if (current.weight < previous.weight) {
    return 'down';
  } else {
    // Weight is equal, compare reps
    if (current.reps > previous.reps) {
      return 'up';
    } else if (current.reps < previous.reps) {
      return 'down';
    } else {
      return 'equal';
    }
  }
};

// Add comparisons to exercise based on last execution
export const addComparisons = (exercise: Exercise, lastExercise: Exercise | null): Exercise => {
  if (!lastExercise) {
    return {
      ...exercise,
      sets: exercise.sets.map(set => ({
        ...set,
        comparison: 'new' as ComparisonResult
      }))
    };
  }
  
  return {
    ...exercise,
    sets: exercise.sets.map(set => {
      const previousSet = lastExercise.sets.find(s => s.setNumber === set.setNumber);
      return {
        ...set,
        comparison: compareSet(set, previousSet)
      };
    })
  };
};

// Format date to DD/MM format
export const formatDateForDisplay = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}`;
};

// Get day of week in Portuguese
export const getDayOfWeek = (dateString: string): string => {
  // Parse manually to avoid timezone issues
  const [year, month, day] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[date.getDay()];
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
