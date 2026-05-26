export type MuscleGroup = 'Ngực' | 'Lưng' | 'Chân' | 'Vai' | 'Tay' | 'Bụng' | 'Cardio';

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: string;
  description?: string;
  youtubeId?: string;
}

export interface BodyMetric {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
}

export interface WorkoutPlanItem {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  exercises: { id: string; exerciseId: string; sets: number; reps: string }[];
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completedExercises: string[]; // exercise plan IDs
}

export interface NutritionLog {
  id: string;
  date: string;
  foodQuery: string;
  tdee: number;
  targetCalories: number;
  foodAnalysis: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  advice: string;
  imageBase64?: string;
}

export interface AppState {
  metrics: BodyMetric[];
  weeklyPlan: WorkoutPlanItem[];
  dailyLogs: Record<string, DailyLog>; // key is YYYY-MM-DD
  nutritionLogs: NutritionLog[];
}

export const MuscleSynergy: Record<MuscleGroup, MuscleGroup[]> = {
  'Ngực': ['Tay', 'Vai'], // Triceps, Front delts
  'Lưng': ['Tay', 'Bụng'], // Biceps, Core
  'Chân': ['Bụng', 'Cardio'],
  'Vai': ['Tay', 'Bụng'],
  'Tay': ['Bụng'],
  'Bụng': ['Cardio'],
  'Cardio': ['Bụng'],
};
