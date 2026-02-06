export default {
  common: {
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
  },
  auth: {
    welcome: "Bienvenido",
    subtitle: "Inicia sesión en tu cuenta",
    email: "Email",
    password: "Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    loginButton: "Iniciar Sesión",
    loggingIn: "Iniciando sesión...",
    noAccount: "¿No tienes cuenta?",
    register: "Regístrate",
    placeholderEmail: "tu@email.com",
    errorMissingFields: "Por favor completa todos los campos",
  },
  onboarding: {
    title: "Configura tu Perfil",
    subtitle: "Necesitamos algunos datos para calcular tus metas",
    gender: "Género",
    male: "Hombre",
    female: "Mujer",
    age: "Edad",
    weight: "Peso (kg)",
    height: "Altura (cm)",
    activityLevel: "Nivel de Actividad",
    goal: "Objetivo",
    submit: "Continuar",
    saving: "Guardando...",
    successTitle: "Éxito",
    successMessage: "Perfil configurado correctamente",
    errorAuth: "Usuario no autenticado",
    errorValidation: "Por favor completa todos los campos correctamente",
    errorSave: "Error al guardar el perfil",
    activities: {
      sedentary: "Sedentario",
      light: "Ligero",
      moderate: "Moderado",
      active: "Activo",
      very_active: "Muy Activo",
    },
    editTitle: "Editar Perfil",
    update: "Actualizar Perfil",
    goals: {
      lose_weight: "Perder Peso",
      maintain: "Mantener",
      gain_muscle: "Ganar Músculo",
    }
  },
  home: {
    title: "Hoy",
    verifying: "Verificando perfil...",
    calories: "Calorías",
    ofTarget: "de {{target}} kcal", // {{target}} es variable
    macros: "Macronutrientes",
    proteins: "Proteínas",
    carbs: "Carbohidratos",
    fats: "Grasas",
    mealsTitle: "Comidas",
    add: "Agregar",
    // Pluralización automática de i18next:
    mealItems_one: "{{count}} comida",  // Singular
    mealItems_other: "{{count}} comidas", // Plural
    mealTypes: {
      breakfast: "Desayuno",
      lunch: "Almuerzo",
      dinner: "Cena",
      snack: "Snack",
    }
  },
  tabs: {
    home: "Inicio",
    add: "Agregar",
    profile: "Perfil",
  },
  addFood: {
    title: "Agregar a {{mealType}}", // {{mealType}} is a variable
    searchPlaceholder: "Buscar alimento (ej. Manzana)...",
    sectionTitle: "Datos del Alimento (por {{quantity}}g):",
    nameLabel: "Nombre",
    namePlaceholder: "Ej. Pechuga de Pollo",
    caloriesLabel: "Calorías",
    quantityLabel: "Cantidad (g)",
    macrosTitle: "Macronutrientes",
    proteinLabel: "Proteína",
    carbsLabel: "Carbos",
    fatsLabel: "Grasas",
    saveButton: "Guardar Comida",
    genericBrand: "Genérico",
    alerts: {
      missingDataTitle: "Faltan datos",
      missingDataMsg: "Por favor ingresa al menos el nombre y las calorías",
      successTitle: "¡Éxito!",
      successMsg: "Comida agregada correctamente",
      errorTitle: "Error",
      errorMsg: "Hubo un problema al guardar la comida.",
    }
  },
  profile: {
    title: "Perfil",
    loading: "Cargando...",
    personalInfo: "Información Personal",
    email: "Email",
    age: "Edad",
    years: "años",
    weight: "Peso",
    height: "Altura",
    dailyGoals: "Metas Diarias",
    calories: "Calorías",
    protein: "Proteínas",
    carbs: "Carbohidratos",
    fats: "Grasas",
    metrics: "Métricas",
    bmr: "BMR (Metabolismo Basal)",
    tdee: "TDEE (Gasto Calórico Total)",
    editProfile: "Editar Perfil",
    logout: "Cerrar Sesión",
    // Alertas
    logoutAlert: {
      title: "Cerrar Sesión",
      message: "¿Estás seguro de que quieres cerrar sesión?",
      cancel: "Cancelar",
      confirm: "Cerrar Sesión",
    }
  },
  forgotPassword: {
    title: "Recuperar Contraseña",
    subtitle: "Ingresa tu correo y te enviaremos las instrucciones para restablecerla.",
    emailLabel: "Correo Electrónico",
    emailPlaceholder: "ejemplo@correo.com",
    sendButton: "Enviar Instrucciones",
    alerts: {
      missingEmail: "Por favor ingresa tu correo electrónico",
      successTitle: "Correo enviado",
      successMsg: "Revisa tu bandeja de entrada. Hemos enviado un enlace para restablecer tu contraseña.",
      backToLogin: "Volver al Login",
      errorTitle: "Error",
      errorMsg: "No se pudo enviar el correo",
    }
  },
  resetPassword: {
    screenTitle: "Cambiar Contraseña",
    title: "Nueva Contraseña",
    subtitle: "Ingresa tu nueva contraseña para recuperar el acceso.",
    newPasswordLabel: "Nueva Contraseña",
    confirmPasswordLabel: "Confirmar Contraseña",
    updateButton: "Actualizar Contraseña",
    alerts: {
      fillAll: "Por favor completa todos los campos",
      mismatch: "Las contraseñas no coinciden",
      minLength: "La contraseña debe tener al menos 6 caracteres",
      successTitle: "¡Éxito!",
      successMsg: "Tu contraseña ha sido actualizada.",
      goHome: "Ir al Inicio"
    }
  },
  mealDetail: {
    totalLabel: "Total {{label}}", // ej: Total Desayuno
    emptyList: "No hay alimentos registrados.",
    deleteTitle: "Eliminar alimento",
    deleteMessage: "¿Estás seguro?",
    deleteConfirm: "Eliminar",
    cancel: "Cancelar",
    addButton: "Agregar Alimento",
    noName: "Alimento sin nombre",
  },
  "macros": {
    "p": "P",
    "c": "C",
    "f": "G"
  }
};