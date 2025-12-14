import { supabase, Food } from './supabase';

export const foodsService = {
  async searchFoods(query: string): Promise<Food[]> {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(50);

    if (error) {
      console.error('Error searching foods:', error);
      return [];
    }
    return data || [];
  },

  async getFoodById(foodId: string): Promise<Food | null> {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('id', foodId)
      .single();

    if (error) {
      console.error('Error fetching food:', error);
      return null;
    }
    return data;
  },

  async createFood(food: Omit<Food, 'id' | 'created_at' | 'updated_at'>): Promise<Food | null> {
    const { data, error } = await supabase
      .from('foods')
      .insert(food)
      .select()
      .single();

    if (error) {
      console.error('Error creating food:', error);
      return null;
    }
    return data;
  },
};

