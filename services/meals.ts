import { supabase, Meal, Food } from './supabase';

export const mealsService = {
  async getMealsByDate(userId: string, date: string): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select(`
        *,
        food:foods(*)
      `)
      .eq('user_id', userId)
      .eq('meal_date', date)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching meals:', error);
      return [];
    }
    return data || [];
  },

  async addMeal(meal: Omit<Meal, 'id' | 'created_at' | 'updated_at'>): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .insert(meal)
      .select(`
        *,
        food:foods(*)
      `)
      .single();

    if (error) {
      console.error('Error adding meal:', error);
      return null;
    }
    return data;
  },

  async updateMeal(mealId: string, updates: Partial<Meal>): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .update(updates)
      .eq('id', mealId)
      .select(`
        *,
        food:foods(*)
      `)
      .single();

    if (error) {
      console.error('Error updating meal:', error);
      return null;
    }
    return data;
  },

  async deleteMeal(mealId: string): Promise<boolean> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId);

    if (error) {
      console.error('Error deleting meal:', error);
      return false;
    }
    return true;
  },

  async getDailyTotals(userId: string, date: string) {
    const meals = await this.getMealsByDate(userId, date);
    
    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    return totals;
  },
};

