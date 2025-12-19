-- Extender la tabla auth.users con datos físicos del usuario
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  age INTEGER,
  weight_kg DECIMAL(5,2),
  height_cm INTEGER,
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal TEXT CHECK (goal IN ('lose_weight', 'maintain', 'gain_muscle')),
  bmr DECIMAL(8,2),
  tdee DECIMAL(8,2),
  daily_calorie_goal DECIMAL(8,2),
  daily_protein_goal DECIMAL(8,2),
  daily_carbs_goal DECIMAL(8,2),
  daily_fats_goal DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de alimentos (base de datos de alimentos)
CREATE TABLE IF NOT EXISTS public.foods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT,
  calories_per_100g DECIMAL(8,2) NOT NULL,
  protein_per_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  carbs_per_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  fats_per_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  fiber_per_100g DECIMAL(8,2) DEFAULT 0,
  sugar_per_100g DECIMAL(8,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de comidas registradas por usuario
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  food_id UUID REFERENCES public.foods(id) ON DELETE CASCADE NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  quantity_grams DECIMAL(8,2) NOT NULL,
  calories DECIMAL(8,2) NOT NULL,
  protein DECIMAL(8,2) NOT NULL DEFAULT 0,
  carbs DECIMAL(8,2) NOT NULL DEFAULT 0,
  fats DECIMAL(8,2) NOT NULL DEFAULT 0,
  meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON public.meals(user_id, meal_date);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_foods_name ON public.foods(name);
CREATE INDEX IF NOT EXISTS idx_foods_barcode ON public.foods(barcode);

-- Row Level Security (RLS) Policies

-- Habilitar RLS en todas las tablas
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para foods (todos pueden leer, solo admins pueden escribir - por ahora todos pueden insertar)
CREATE POLICY "Anyone can view foods"
  ON public.foods FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert foods"
  ON public.foods FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Políticas para meals
CREATE POLICY "Users can view their own meals"
  ON public.meals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals"
  ON public.meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
  ON public.meals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
  ON public.meals FOR DELETE
  USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_foods_updated_at BEFORE UPDATE ON public.foods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON public.meals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- (Opcional) Datos iniciales para la tabla foods
-- Ejecuta estas inserciones solo una vez en Supabase si quieres precargar alimentos básicos.
-- Puedes comentar o eliminar esta sección si no la necesitas.

INSERT INTO public.foods (name, brand, barcode, calories_per_100g, protein_per_100g, carbs_per_100g, fats_per_100g, fiber_per_100g, sugar_per_100g)
VALUES
  ('Pechuga de Pollo', NULL, NULL, 165, 31, 0, 3.6, 0, 0),
  ('Arroz Blanco Cocido', NULL, NULL, 130, 2.7, 28, 0.3, 0.4, 0.1),
  ('Salmón', NULL, NULL, 208, 20, 0, 12, 0, 0),
  ('Avena', NULL, NULL, 389, 17, 66, 7, 11, 0.99),
  ('Huevo Cocido', NULL, NULL, 155, 13, 1.1, 11, 0, 1.1),
  ('Plátano', NULL, NULL, 89, 1.1, 23, 0.3, 2.6, 12),
  ('Brócoli', NULL, NULL, 34, 2.8, 7, 0.4, 2.6, 1.5),
  ('Pasta Cocida', NULL, NULL, 131, 5, 25, 1.1, 1.8, 0.6),
  ('Aguacate', NULL, NULL, 160, 2, 9, 15, 7, 0.7),
  ('Yogur Griego', NULL, NULL, 59, 10, 3.6, 0.4, 0, 3.6),
  ('Pechuga de Pavo', NULL, NULL, 135, 30, 0, 1, 0, 0),
  ('Batata', NULL, NULL, 86, 1.6, 20, 0.1, 3, 4.2),
  ('Atún en Lata', NULL, NULL, 116, 26, 0, 1, 0, 0),
  ('Quinoa Cocida', NULL, NULL, 120, 4.4, 22, 1.9, 2.8, 0.9),
  ('Manzana', NULL, NULL, 52, 0.3, 14, 0.2, 2.4, 10),
  ('Espinacas', NULL, NULL, 23, 2.9, 3.6, 0.4, 2.2, 0.4),
  ('Almendras', NULL, NULL, 579, 21, 22, 50, 12, 4.4),
  ('Pechuga de Pollo a la Plancha', NULL, NULL, 165, 31, 0, 3.6, 0, 0),
  ('Leche Desnatada', NULL, NULL, 34, 3.4, 5, 0.1, 0, 5),
  ('Pan Integral', NULL, NULL, 247, 13, 41, 4.2, 7, 5.7);


