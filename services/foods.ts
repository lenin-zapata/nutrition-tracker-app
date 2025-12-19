import { supabase, Food } from './supabase';

export const foodsService = {
  /**
   * Busca alimentos por nombre en la tabla `foods` de Supabase.
   * Si `query` está vacío, devuelve hasta 50 alimentos (búsqueda general).
   */
  async searchFoods(query: string): Promise<Food[]> {
    const trimmed = query.trim();
    // Si no hay query, usamos '%' para traer resultados genéricos
    const pattern = trimmed === '' ? '%' : `%${trimmed}%`;

    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .ilike('name', pattern)
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

