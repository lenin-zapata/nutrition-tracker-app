import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { useMealsStore } from '@/store/mealsStore';
import { foodsService } from '@/services/foods';
import { Food } from '@/services/supabase';
import { mockFoods } from '@/data/mockData';
import { Ionicons } from '@expo/vector-icons';

const MEAL_TYPES = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Snack',
};

export default function AddFoodScreen() {
  const { mealType } = useLocalSearchParams<{ mealType?: string }>();
  const { user } = useAuthStore();
  const { profile } = useUserProfileStore();
  const { addMeal } = useMealsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const currentMealType = (mealType as keyof typeof MEAL_TYPES) || 'breakfast';
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Cargar alimentos mock inicialmente
    loadMockFoods();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchFoods();
    } else if (searchQuery.length === 0) {
      loadMockFoods();
    }
  }, [searchQuery]);

  const loadMockFoods = async () => {
    // Convertir mockFoods a formato Food con IDs temporales
    const mockFoodsWithIds: Food[] = mockFoods.map((food, index) => ({
      ...food,
      id: `mock-${index}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    setFoods(mockFoodsWithIds);
  };

  const searchFoods = async () => {
    setSearching(true);
    try {
      // Primero buscar en la base de datos
      const dbFoods = await foodsService.searchFoods(searchQuery);
      
      // Si no hay resultados, buscar en mockData
      if (dbFoods.length === 0) {
        const filtered = mockFoods.filter((food) =>
          food.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const mockFoodsWithIds: Food[] = filtered.map((food, index) => ({
          ...food,
          id: `mock-${index}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        setFoods(mockFoodsWithIds);
      } else {
        setFoods(dbFoods);
      }
    } catch (error) {
      console.error('Error searching foods:', error);
      loadMockFoods();
    } finally {
      setSearching(false);
    }
  };

  const handleAddMeal = async () => {
    if (!user || !selectedFood) {
      Alert.alert('Error', 'Por favor selecciona un alimento');
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert('Error', 'Por favor ingresa una cantidad válida');
      return;
    }

    setLoading(true);

    try {
      // Calcular valores nutricionales basados en la cantidad
      const multiplier = quantityNum / 100;
      const calories = selectedFood.calories_per_100g * multiplier;
      const protein = selectedFood.protein_per_100g * multiplier;
      const carbs = selectedFood.carbs_per_100g * multiplier;
      const fats = selectedFood.fats_per_100g * multiplier;

      // Si el alimento es mock, primero crearlo en la BD
      let foodId = selectedFood.id;
      if (foodId.startsWith('mock-')) {
        const created = await foodsService.createFood({
          name: selectedFood.name,
          brand: selectedFood.brand,
          barcode: selectedFood.barcode,
          calories_per_100g: selectedFood.calories_per_100g,
          protein_per_100g: selectedFood.protein_per_100g,
          carbs_per_100g: selectedFood.carbs_per_100g,
          fats_per_100g: selectedFood.fats_per_100g,
          fiber_per_100g: selectedFood.fiber_per_100g,
          sugar_per_100g: selectedFood.sugar_per_100g,
        });
        if (created) {
          foodId = created.id;
        } else {
          throw new Error('Error al crear el alimento');
        }
      }

      const success = await addMeal({
        user_id: user.id,
        food_id: foodId,
        meal_type: currentMealType,
        quantity_grams: quantityNum,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fats: fats,
        meal_date: today,
      });

      if (success) {
        Alert.alert('Éxito', 'Comida agregada correctamente', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Error', 'Error al agregar la comida');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al agregar la comida');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">
            Agregar {MEAL_TYPES[currentMealType]}
          </Text>
        </View>

        {/* Buscador */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-4">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Buscar alimento..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        {selectedFood ? (
          // Vista de detalles del alimento seleccionado
          <View className="px-6 py-6">
            <View className="bg-indigo-50 rounded-xl p-6 mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-2">{selectedFood.name}</Text>
              {selectedFood.brand && (
                <Text className="text-sm text-gray-600 mb-4">{selectedFood.brand}</Text>
              )}

              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Calorías (100g)</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {selectedFood.calories_per_100g} kcal
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Proteínas</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {selectedFood.protein_per_100g}g
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Carbohidratos</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {selectedFood.carbs_per_100g}g
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Grasas</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {selectedFood.fats_per_100g}g
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Cantidad (gramos)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="100"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
              />
            </View>

            {quantity && !isNaN(parseFloat(quantity)) && parseFloat(quantity) > 0 && (
              <View className="bg-gray-50 rounded-xl p-4 mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">Valores nutricionales</Text>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-gray-600">Calorías</Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    {Math.round((selectedFood.calories_per_100g * parseFloat(quantity)) / 100)} kcal
                  </Text>
                </View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-gray-600">Proteínas</Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    {Math.round((selectedFood.protein_per_100g * parseFloat(quantity)) / 100)}g
                  </Text>
                </View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-gray-600">Carbohidratos</Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    {Math.round((selectedFood.carbs_per_100g * parseFloat(quantity)) / 100)}g
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Grasas</Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    {Math.round((selectedFood.fats_per_100g * parseFloat(quantity)) / 100)}g
                  </Text>
                </View>
              </View>
            )}

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-lg py-4"
                onPress={() => setSelectedFood(null)}
              >
                <Text className="text-center font-semibold text-gray-700">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-indigo-600 rounded-lg py-4"
                onPress={handleAddMeal}
                disabled={loading}
              >
                <Text className="text-center font-semibold text-white">
                  {loading ? 'Agregando...' : 'Agregar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Lista de alimentos
          <View className="px-6 py-4">
            {searching && (
              <Text className="text-center text-gray-600 mb-4">Buscando...</Text>
            )}
            {foods.length === 0 && !searching && (
              <Text className="text-center text-gray-600 mb-4">
                No se encontraron alimentos
              </Text>
            )}
            {foods.map((food) => (
              <TouchableOpacity
                key={food.id}
                className="bg-gray-50 rounded-xl p-4 mb-3"
                onPress={() => setSelectedFood(food)}
              >
                <Text className="text-base font-semibold text-gray-900 mb-1">{food.name}</Text>
                {food.brand && (
                  <Text className="text-sm text-gray-600 mb-2">{food.brand}</Text>
                )}
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">
                    {food.calories_per_100g} kcal / 100g
                  </Text>
                  <Text className="text-sm text-gray-600">
                    P: {food.protein_per_100g}g • C: {food.carbs_per_100g}g • G: {food.fats_per_100g}g
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

