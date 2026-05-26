import { useState, useEffect } from 'react';
import { AppState, BodyMetric, DailyLog, WorkoutPlanItem, MuscleGroup } from '../types';

const STORAGE_KEY = 'gym-tracker-pro-state';

const defaultState: AppState = {
  metrics: [],
  weeklyPlan: [],
  dailyLogs: {},
};

export function useGymStore() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultState;
    } catch (e) {
      console.error("Failed to load state from local storage", e);
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addMetric = (metric: Omit<BodyMetric, 'id'>) => {
    setState(s => ({
      ...s,
      metrics: [...s.metrics, { ...metric, id: Date.now().toString() }],
    }));
  };

  const removeMetric = (id: string) => {
    setState(s => ({
      ...s,
      metrics: s.metrics.filter(m => m.id !== id)
    }));
  }

  const saveWeeklyPlan = (dayOfWeek: number, primaryMuscle: MuscleGroup, secondaryMuscles: MuscleGroup[], exercises: WorkoutPlanItem['exercises']) => {
    setState(s => {
      const newPlan = s.weeklyPlan.filter(p => p.dayOfWeek !== dayOfWeek);
      newPlan.push({ id: Date.now().toString(), dayOfWeek, primaryMuscle, secondaryMuscles, exercises });
      return { ...s, weeklyPlan: newPlan };
    });
  };

  const clearWeeklyPlanDay = (dayOfWeek: number) => {
    setState(s => ({
      ...s,
      weeklyPlan: s.weeklyPlan.filter(p => p.dayOfWeek !== dayOfWeek)
    }));
  };

  const toggleDailyExercise = (date: string, exercisePlanId: string) => {
    setState(s => {
      const currentLog = s.dailyLogs[date] || { date, completedExercises: [] };
      const isCompleted = currentLog.completedExercises.includes(exercisePlanId);
      
      const newCompleted = isCompleted 
        ? currentLog.completedExercises.filter(id => id !== exercisePlanId)
        : [...currentLog.completedExercises, exercisePlanId];
        
      return {
        ...s,
        dailyLogs: {
          ...s.dailyLogs,
          [date]: { ...currentLog, completedExercises: newCompleted }
        }
      };
    });
  };

  return { state, addMetric, removeMetric, saveWeeklyPlan, clearWeeklyPlanDay, toggleDailyExercise };
}
