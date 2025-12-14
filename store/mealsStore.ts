import { create } from 'zustand';
import { Meal } from '@/services/supabase';
import { mealsService } from '@/services/meals';

interface MealsState {
  meals: Meal[];
  loading: boolean;
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  fetchMeals: (userId: string, date: string) => Promise<void>;
  addMeal: (meal: Omit<Meal, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateMeal: (mealId: string, updates: Partial<Meal>) => Promise<boolean>;
  deleteMeal: (mealId: string) => Promise<boolean>;
  refreshTotals: (userId: string, date: string) => Promise<void>;
}

export const useMealsStore = create<MealsState>((set) => ({
  meals: [],
  loading: false,
  dailyTotals: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  },
  
  fetchMeals: async (userId: string, date: string) => {
    set({ loading: true });
    const meals = await mealsService.getMealsByDate(userId, date);
    const totals = await mealsService.getDailyTotals(userId, date);
    set({ meals, dailyTotals: totals, loading: false });
  },
  
  addMeal: async (meal) => {
    set({ loading: true });
    const added = await mealsService.addMeal(meal);
    if (added) {
      const newMeals = [...(await mealsService.getMealsByDate(meal.user_id, meal.meal_date))];
      const totals = await mealsService.getDailyTotals(meal.user_id, meal.meal_date);
      set({ meals: newMeals, dailyTotals: totals, loading: false });
      return true;
    }
    set({ loading: false });
    return false;
  },
  
  updateMeal: async (mealId, updates) => {
    set({ loading: true });
    const updated = await mealsService.updateMeal(mealId, updates);
    if (updated) {
      const newMeals = [...(await mealsService.getMealsByDate(updated.user_id, updated.meal_date))];
      const totals = await mealsService.getDailyTotals(updated.user_id, updated.meal_date);
      set({ meals: newMeals, dailyTotals: totals, loading: false });
      return true;
    }
    set({ loading: false });
    return false;
  },
  
  deleteMeal: async (mealId) => {
    set({ loading: true });
    const state = useMealsStore.getState();
    const meal = state.meals.find(m => m.id === mealId);
    if (!meal) {
      set({ loading: false });
      return false;
    }
    
    const success = await mealsService.deleteMeal(mealId);
    if (success) {
      const newMeals = await mealsService.getMealsByDate(meal.user_id, meal.meal_date);
      const totals = await mealsService.getDailyTotals(meal.user_id, meal.meal_date);
      set({ meals: newMeals, dailyTotals: totals, loading: false });
      return true;
    }
    set({ loading: false });
    return false;
  },
  
  refreshTotals: async (userId: string, date: string) => {
    const totals = await mealsService.getDailyTotals(userId, date);
    set({ dailyTotals: totals });
  },
}));

