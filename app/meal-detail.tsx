import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useMealsStore } from '@/store/mealsStore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const MEAL_TYPES: Record<string, { label: string; icon: string }> = {
  breakfast: { label: 'Desayuno', icon: 'sunny' },
  lunch: { label: 'Almuerzo', icon: 'restaurant' },
  dinner: { label: 'Cena', icon: 'moon' },
  snack: { label: 'Snack', icon: 'cafe' },
};

export default function MealDetailScreen() {
  const router = useRouter();
  const { mealType } = useLocalSearchParams<{ mealType: string }>();
  
  const meals = useMealsStore((state) => state.meals);
  const deleteMeal = useMealsStore((state) => state.deleteMeal); 
  
  const filteredMeals = meals.filter((meal) => meal.meal_type === mealType);
  const totalCalories = filteredMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const currentType = MEAL_TYPES[mealType || 'snack'];

  const handleDelete = (id: string) => {
    Alert.alert(
      "Eliminar alimento",
      "¿Estás seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
             if (deleteMeal) await deleteMeal(id);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        
        {/* Cabecera */}
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{currentType.label}</Text>
          <View style={{ width: 40 }} /> 
        </View>

        {/* Resumen */}
        <View style={styles.summaryCard}>
          <View style={styles.iconContainer}>
            <Ionicons name={currentType.icon as any} size={32} color="#4F46E5" />
          </View>
          <View>
            <Text style={styles.totalLabel}>Total {currentType.label}</Text>
            <Text style={styles.totalValue}>{Math.round(totalCalories)} kcal</Text>
          </View>
        </View>

        {/* Lista */}
        <FlatList
          data={filteredMeals}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay alimentos registrados.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.mealCard}>
              <View style={styles.mealInfo}>
                {/* --- CORRECCIÓN CLAVE AQUÍ --- */}
                {/* Intentamos leer item.foods.name (unión de tablas) o item.name (directo) */}
                <Text style={styles.mealName}>
                  {item.foods?.name || item.name || 'Alimento sin nombre'}
                </Text>

                <View style={styles.macrosContainer}>
                  <Text style={styles.macroText}>
                    {item.protein ? `P: ${item.protein}g` : 'P: 0g'} • 
                    {item.carbs ? ` C: ${item.carbs}g` : ' C: 0g'} • 
                    {item.fats ? ` G: ${item.fats}g` : ' G: 0g'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.mealActions}>
                <Text style={styles.caloriesText}>{Math.round(item.calories)} kcal</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Botón Agregar */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push(`/(tabs)/add-food?mealType=${mealType}`)}
          >
            <Ionicons name="add" size={24} color="#FFF" />
            <Text style={styles.addButtonText}>Agregar Alimento</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1 },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: { padding: 8, borderRadius: 8, backgroundColor: '#F3F4F6' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: { backgroundColor: '#EEF2FF', padding: 16, borderRadius: 12, marginRight: 16 },
  totalLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginBottom: 4 },
  totalValue: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#9CA3AF', fontSize: 16 },
  mealCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  mealInfo: { flex: 1, marginRight: 8 },
  mealName: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 6 },
  macrosContainer: { flexDirection: 'row' },
  macroText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  mealActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  caloriesText: { fontSize: 16, fontWeight: 'bold', color: '#4F46E5' },
  deleteButton: { padding: 8, backgroundColor: '#FEF2F2', borderRadius: 8 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});