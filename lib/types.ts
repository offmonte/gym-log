export type ComparisonResult = 'up' | 'down' | 'equal' | 'new';

export interface ExerciseSet {
  setNumber: number;
  weight: number;
  reps: number;
  comparison?: ComparisonResult;
}

export interface Exercise {
  name: string;
  sets: ExerciseSet[];
}

export interface Workout {
  id: string;
  date: string;
  name?: string;
  exercises: Exercise[];
}
