import { create } from 'zustand';
import { supabase } from '@/services/supabase';

export interface Meal {
  // CORRECCIÓN DE TIPOS: En tu BD son UUIDs (strings), no números
  id: string; 
  user_id: string;
  food_id: string;
  
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  
  // CORRECCIÓN DE NOMBRE: Coincide con tu captura de pantalla
  quantity_grams: number; 
  
  name?: string; 
  created_at?: string;
  meal_date?: string; 
  foods?: {
    name: string;
    brand?: string;
  };
}

interface MealsState {
  meals: Meal[];
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  loading: boolean;
  fetchMeals: (userId: string, date: string) => Promise<void>;
  addMeal: (meal: any) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>; // id ahora es string
}

export const useMealsStore = create<MealsState>((set, get) => ({
  meals: [],
  dailyTotals: { calories: 0, protein: 0, carbs: 0, fats: 0 },
  loading: false,

  fetchMeals: async (userId: string, dateStr: string) => {
    set({ loading: true });
    
    const startOfDay = new Date(dateStr).toISOString();
    const endOfDay = new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000).toISOString();

    console.log("📥 Pidiendo columnas exactas (Schema verificado)...");

    // SOLICITUD EXACTA SEGÚN TU CAPTURA DE PANTALLA
    const { data, error } = await supabase
      .from('meals')
      .select(`
        id,
        user_id,
        food_id,
        meal_type,
        quantity_grams,
        calories,
        protein,
        carbs,
        fats,
        created_at,
        meal_date,
        foods ( name, brand )
      `)
      .eq('user_id', userId)
      .gte('created_at', startOfDay)
      .lt('created_at', endOfDay)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching meals:', error.message);
      set({ loading: false });
      return; 
    }

    const totals = (data || []).reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fats: acc.fats + (meal.fats || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    set({ meals: data as Meal[], dailyTotals: totals, loading: false });
  },

  addMeal: async (newMeal) => {
    // PREPARACIÓN DE DATOS BLINDADA
    // 1. Sacamos 'date' (no existe columna)
    // 2. Sacamos 'weight_g' (nombre viejo) y lo asignamos a 'quantity_grams'
    // 3. Sacamos 'id' si viene vacío para que la BD genere el UUID
    const { date, name, weight_g, id, ...rest } = newMeal;
    
    const mealDataToSave = {
      ...rest,
      quantity_grams: weight_g || rest.quantity_grams || 100, 
    };

    const { error } = await supabase
      .from('meals')
      .insert([mealDataToSave]);

    if (error) {
      console.error('❌ Error adding meal:', error.message);
      throw error; 
    }

    const refreshDate = date || new Date().toISOString().split('T')[0];
    const { fetchMeals } = get();
    await fetchMeals(newMeal.user_id, refreshDate);
  },

  deleteMeal: async (id: string) => {
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) { console.error(error); return; }
    
    const { meals } = get();
    const updatedMeals = meals.filter((m) => m.id !== id);
    
    const totals = updatedMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fats: acc.fats + (meal.fats || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    set({ meals: updatedMeals, dailyTotals: totals });
  },
}));