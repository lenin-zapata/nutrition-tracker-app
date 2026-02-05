import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMealsStore } from '@/store/mealsStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/services/supabase';
import { useTranslation } from 'react-i18next';

export default function AddFoodScreen() {
  const { t, i18n } = useTranslation(); // ✅ Traemos i18n para detectar el idioma
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const rawMealType = (params.mealType as string) || 'breakfast';
  const displayMealType = t(`home.mealTypes.${rawMealType}`, { defaultValue: rawMealType });

  const { addMeal, loading } = useMealsStore();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Formulario
  const [foodId, setFoodId] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [quantity, setQuantity] = useState('100'); 

  // ✅ Variable auxiliar para saber si estamos en inglés
  const isEnglish = i18n.language.startsWith('en');

  // --- LÓGICA DE BÚSQUEDA INTELIGENTE ---
  useEffect(() => {
    const searchFoods = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);

      // ✅ 1. Decidimos en qué columna buscar según el idioma
      const searchColumn = isEnglish ? 'name_en' : 'name';

      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .ilike(searchColumn, `%${searchQuery}%`) // ✅ Buscamos en la columna correcta
        .limit(10); // Aumenté el límite a 10 para ver más opciones

      if (!error && data) {
        setSearchResults(data);
      }
      setIsSearching(false);
    };

    const delayDebounce = setTimeout(() => {
      searchFoods();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, isEnglish]); // Se ejecuta si cambia el texto o el idioma

  // --- SELECCIONAR ALIMENTO ---
  const handleSelectFood = (food: any) => {
    setFoodId(food.id);
    
    // ✅ 2. Al seleccionar, usamos el nombre en el idioma actual
    // Si estamos en inglés y existe name_en, úsalo. Si no, usa el normal.
    const selectedName = isEnglish && food.name_en ? food.name_en : food.name;
    setFoodName(selectedName);
    
    // Calorías
    const cal = food.calories || food.calories_per_100g || '';
    // Proteínas
    const prot = food.protein || food.protein_per_100g || food.proteins || food.proteins_per_100g || '';
    // Carbohidratos
    const carb = food.carbs || food.carbs_per_100g || food.carbohydrates || food.carbohydrates_per_100g || '';
    // Grasas
    const fat = food.fats || food.fats_per_100g || food.fat || food.fat_per_100g || '';

    setCalories(cal ? cal.toString() : '');
    setProtein(prot ? prot.toString() : '');
    setCarbs(carb ? carb.toString() : '');
    setFats(fat ? fat.toString() : '');
    
    setQuantity('100'); 
    setSearchResults([]);
    setSearchQuery(''); 
  };

  const handleAddFood = async () => {
    if (!foodName || !calories) {
      Alert.alert(t('addFood.alerts.missingDataTitle'), t('addFood.alerts.missingDataMsg'));
      return;
    }

    if (!user) return;

    try {
      await addMeal({
        user_id: user.id,
        food_id: foodId,
        meal_type: rawMealType,
        name: foodName,
        calories: Number(calories),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fats: Number(fats) || 0,
        quantity_grams: Number(quantity) || 100,
      });

      Alert.alert(t('addFood.alerts.successTitle'), t('addFood.alerts.successMsg'), [
        { text: 'OK', onPress: () => router.back() }
      ]);
      
    } catch (error) {
      console.error(error);
      Alert.alert(t('addFood.alerts.errorTitle'), t('addFood.alerts.errorMsg'));
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>
           {t('addFood.title', { mealType: displayMealType })}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        
        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('addFood.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {isSearching && <ActivityIndicator size="small" color="#4F46E5" />}
        </View>

        {/* RESULTADOS */}
        {searchResults.length > 0 && (
          <View style={styles.resultsList}>
            {searchResults.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.resultItem}
                onPress={() => handleSelectFood(item)}
              >
                <View>
                  {/* ✅ 3. Visualización en la lista: Mostramos el nombre según idioma */}
                  <Text style={styles.resultName}>
                    {isEnglish && item.name_en ? item.name_en : item.name}
                  </Text>
                  <Text style={styles.resultBrand}>{item.brand || t('addFood.genericBrand')}</Text>
                </View>
                <Ionicons name="add-circle-outline" size={24} color="#4F46E5" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* FORMULARIO */}
        <Text style={styles.sectionTitle}>
          {t('addFood.sectionTitle', { quantity: quantity })}
        </Text>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addFood.nameLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addFood.namePlaceholder')}
              value={foodName}
              onChangeText={setFoodName}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>{t('addFood.caloriesLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder="kcal"
                keyboardType="numeric"
                value={calories}
                onChangeText={setCalories}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>{t('addFood.quantityLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder="100g"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
          </View>

          <Text style={styles.macrosTitle}>{t('addFood.macrosTitle')}</Text>
          <View style={styles.row}>
            <View style={styles.macroInput}>
              <Text style={styles.label}>{t('addFood.proteinLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder="0g"
                keyboardType="numeric"
                value={protein}
                onChangeText={setProtein}
              />
            </View>
            <View style={styles.macroInput}>
              <Text style={styles.label}>{t('addFood.carbsLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder="0g"
                keyboardType="numeric"
                value={carbs}
                onChangeText={setCarbs}
              />
            </View>
            <View style={styles.macroInput}>
              <Text style={styles.label}>{t('addFood.fatsLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder="0g"
                keyboardType="numeric"
                value={fats}
                onChangeText={setFats}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleAddFood}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="checkmark" size={24} color="#FFF" />
              <Text style={styles.saveButtonText}>{t('addFood.saveButton')}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  backButton: { padding: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111827', textTransform: 'capitalize' },
  content: { padding: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  resultsList: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 200, 
    zIndex: 10,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  resultName: { fontSize: 16, color: '#111827', fontWeight: '500' },
  resultBrand: { fontSize: 12, color: '#6B7280' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#6B7280', marginBottom: 6, fontWeight: '500' },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 16,
    color: '#111827',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  macrosTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginTop: 8, marginBottom: 12 },
  macroInput: { flex: 1, marginHorizontal: 4 },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 30,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});