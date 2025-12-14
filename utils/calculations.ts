export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose_weight' | 'maintain' | 'gain_muscle';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_MULTIPLIERS: Record<Goal, number> = {
  lose_weight: 0.85,
  maintain: 1.0,
  gain_muscle: 1.15,
};

export function calculateBMR(weightKg: number, heightCm: number, age: number, isMale: boolean): number {
  // Fórmula de Mifflin-St Jeor
  if (isMale) {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

export function calculateDailyCalorieGoal(tdee: number, goal: Goal): number {
  return Math.round(tdee * GOAL_MULTIPLIERS[goal]);
}

export function calculateMacroGoals(calories: number, goal: Goal): {
  protein: number;
  carbs: number;
  fats: number;
} {
  let proteinRatio: number;
  let carbsRatio: number;
  let fatsRatio: number;

  if (goal === 'lose_weight') {
    // Alto en proteína, moderado en carbohidratos, bajo en grasas
    proteinRatio = 0.35;
    carbsRatio = 0.35;
    fatsRatio = 0.30;
  } else if (goal === 'gain_muscle') {
    // Alto en proteína y carbohidratos, moderado en grasas
    proteinRatio = 0.30;
    carbsRatio = 0.45;
    fatsRatio = 0.25;
  } else {
    // Mantenimiento: balanceado
    proteinRatio = 0.30;
    carbsRatio = 0.40;
    fatsRatio = 0.30;
  }

  // 1g proteína = 4 cal, 1g carb = 4 cal, 1g grasa = 9 cal
  const proteinGrams = Math.round((calories * proteinRatio) / 4);
  const carbsGrams = Math.round((calories * carbsRatio) / 4);
  const fatsGrams = Math.round((calories * fatsRatio) / 9);

  return {
    protein: proteinGrams,
    carbs: carbsGrams,
    fats: fatsGrams,
  };
}

