import { Workout, Exercise, Set, ComparisonResult } from './types';

const STORAGE_KEY = 'gymlog_workouts';

// Local Storage operations
export const getWorkouts = (): Workout[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveWorkout = (workout: Workout): void => {
  const workouts = getWorkouts();
  const existingIndex = workouts.findIndex(w => w.id === workout.id);

  if (existingIndex >= 0) {
    workouts[existingIndex] = workout;
  } else {
    workouts.push(workout);
  }

  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
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

// Filter workouts by period
type TimePeriod = 'week' | 'month' | 'all';

export const filterWorkoutsByPeriod = (workouts: Workout[], period: TimePeriod): Workout[] => {
  const today = new Date();
  let startDate = new Date();

  if (period === 'week') {
    startDate.setDate(today.getDate() - 7);
  } else if (period === 'month') {
    startDate.setMonth(today.getMonth() - 1);
  } else if (period === 'all') {
    return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return workouts
    .filter(w => new Date(w.date) >= startDate && new Date(w.date) <= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Format workouts as plain text
export const formatWorkoutsAsText = (workouts: Workout[]): string => {
  if (workouts.length === 0) {
    return 'Nenhum treino registrado no período selecionado.';
  }

  let text = 'TREINOS EXPORTADOS\n';
  text += '='.repeat(50) + '\n\n';

  workouts.forEach(workout => {
    const dayOfWeek = getDayOfWeek(workout.date);
    const formattedDate = formatDateForDisplay(workout.date);
    text += `${dayOfWeek} (${formattedDate})\n`;
    text += '-'.repeat(40) + '\n\n';

    if (workout.exercises.length === 0) {
      text += 'Nenhum exercício registrado.\n\n';
      return;
    }

    workout.exercises.forEach(exercise => {
      text += `${exercise.name}\n`;
      exercise.sets.forEach(set => {
        text += `  Série ${set.setNumber}: ${set.weight}kg — ${set.reps} reps\n`;
      });
      text += '\n';
    });

    text += '\n';
  });

  return text;
};

// Format workouts as CSV
export const formatWorkoutsAsCSV = (workouts: Workout[]): string => {
  if (workouts.length === 0) {
    return 'dia,exercicio,serie_1,serie_2,serie_3,serie_4,serie_5';
  }

  let csv = 'dia,exercicio,serie_1,serie_2,serie_3,serie_4,serie_5\n';

  workouts.forEach(workout => {
    const formattedDate = formatDateForDisplay(workout.date);

    workout.exercises.forEach(exercise => {
      const setData: string[] = [];

      // Add up to 5 series
      for (let i = 0; i < 5; i++) {
        const set = exercise.sets[i];
        if (set) {
          setData.push(`${set.weight}kg ${set.reps}reps`);
        } else {
          setData.push('');
        }
      }

      const row = [formattedDate, exercise.name, ...setData].join(',');
      csv += row + '\n';
    });
  });

  return csv;
};

// Download file
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// Get unique exercise names from all workouts
export const getUniqueExerciseNames = (): string[] => {
  const workouts = getWorkouts();
  const exerciseNames = new Set<string>();

  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exerciseNames.add(exercise.name);
    });
  });

  return Array.from(exerciseNames).sort();
};
