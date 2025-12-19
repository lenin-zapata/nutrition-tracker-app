# Nutrition Tracker App

Aplicación móvil completa de seguimiento de comidas y nutrición desarrollada con React Native, Expo, TypeScript y Supabase.

## 🚀 Características

- ✅ Autenticación completa con Supabase Auth
- ✅ Cálculo automático de TDEE y BMR
- ✅ Dashboard con visualización de calorías y macronutrientes
- ✅ Registro de comidas por tipo (Desayuno, Almuerzo, Cena, Snack)
- ✅ Búsqueda y agregado de alimentos
- ✅ Base de datos de alimentos con 20 alimentos comunes pre-cargados
- ✅ Preparado para despliegue en Google Play Store

## 📋 Requisitos Previos

- Node.js 18+ y npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- Cuenta de Supabase (gratuita)

- EAS CLI para builds (`npm install -g eas-cli`)

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

```bash
# Instalar dependencias
npm install
# o
yarn install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

**Obtener credenciales de Supabase:**
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a Settings > API
4. Copia la "URL" y la "anon public" key

### 3. Configurar la base de datos

1. En el dashboard de Supabase, ve a SQL Editor
2. Copia y ejecuta el contenido completo del archivo `schema.sql`
3. Esto creará todas las tablas necesarias con las políticas de seguridad (RLS)

### 4. Crear assets (iconos y splash screen)

Necesitas crear los siguientes archivos en la carpeta `assets/`:

- `icon.png` - Icono de la app (1024x1024px)
- `splash.png` - Pantalla de inicio (1242x2436px recomendado)
- `adaptive-icon.png` - Icono adaptativo para Android (1024x1024px)
- `favicon.png` - Favicon para web (48x48px)

**Herramientas recomendadas:**
- [Expo Asset Generator](https://www.npmjs.com/package/@expo/asset-generator)
- O usa herramientas online como [AppIcon.co](https://www.appicon.co/)

### 5. Configurar EAS (Expo Application Services)

```bash
# Iniciar sesión en EAS
eas login

# Configurar el proyecto (si es la primera vez)
eas build:configure
```

Esto creará/actualizará el archivo `eas.json` con la configuración necesaria.

## 🏃 Ejecutar la aplicación

### Modo desarrollo

```bash
# Iniciar el servidor de desarrollo
npm start
# o
expo start

# Para Android
npm run android

# Para iOS (solo en macOS)
npm run ios
```

### Ejecutar en dispositivo físico

1. Instala la app Expo Go en tu dispositivo
2. Escanea el código QR que aparece en la terminal
3. La app se cargará en tu dispositivo

## 📦 Construir para producción

### Android (Google Play Store)

#### 1. Configurar el proyecto en EAS

```bash
# Asegúrate de estar logueado
eas login

# Configurar el build
eas build:configure
```

#### 2. Actualizar app.json

Edita el archivo `app.json` y actualiza:
- `android.package`: Cambia `com.nutritiontracker.app` por tu package único (ej: `com.tunombre.nutritionapp`)
- `extra.eas.projectId`: Se generará automáticamente al ejecutar `eas build:configure`

#### 3. Generar el Android App Bundle (.aab)

```bash
# Build para producción
eas build --platform android --profile production

# O build local (requiere Android SDK configurado)
eas build --platform android --profile production --local
```

El build puede tardar 10-20 minutos. Una vez completado, recibirás un enlace para descargar el `.aab`.

#### 4. Subir a Google Play Store

1. Ve a [Google Play Console](https://play.google.com/console)
2. Crea una nueva aplicación
3. Ve a "Producción" > "Crear nueva versión"
4. Sube el archivo `.aab` descargado
5. Completa la información requerida (descripción, screenshots, etc.)
6. Envía para revisión

### Configuración adicional para Google Play

#### Keystore (manejado automáticamente por EAS)

EAS maneja automáticamente el keystore. Si necesitas usar tu propio keystore:

```bash
# Generar keystore
keytool -genkeypair -v -storetype PKCS12 -keystore nutrition-app-key.jks -alias nutrition-app -keyalg RSA -keysize 2048 -validity 10000

# Configurar en eas.json (sección android.credentials)
```

#### Permisos

Los permisos necesarios ya están configurados en `app.json`:
- `INTERNET`: Para conexión a Supabase
- `ACCESS_NETWORK_STATE`: Para verificar conectividad

## 🗂️ Estructura del Proyecto

```
nutrition-tracker-app/
├── app/                    # Pantallas (Expo Router)
│   ├── (auth)/            # Pantallas de autenticación
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/            # Pantallas principales con tabs
│   │   ├── home.tsx       # Dashboard
│   │   ├── add-food.tsx   # Agregar alimentos
│   │   └── profile.tsx    # Perfil del usuario
│   ├── onboarding.tsx     # Configuración inicial
│   ├── _layout.tsx        # Layout principal
│   └── index.tsx          # Punto de entrada
├── components/            # Componentes reutilizables
│   ├── CircularProgress.tsx
│   └── MacroProgressBar.tsx
├── services/              # Servicios de API
│   ├── supabase.ts       # Cliente de Supabase
│   ├── auth.ts           # Servicio de autenticación
│   ├── userProfile.ts    # Servicio de perfil
│   ├── meals.ts          # Servicio de comidas
│   └── foods.ts          # Servicio de alimentos
├── store/                 # Zustand stores
│   ├── authStore.ts
│   ├── userProfileStore.ts
│   └── mealsStore.ts
├── utils/                 # Utilidades
│   └── calculations.ts   # Cálculos de TDEE, BMR, etc.
├── data/                  # Datos mock
│   └── mockData.ts       # 20 alimentos comunes
├── assets/                # Imágenes y recursos
├── schema.sql            # Esquema de base de datos
├── app.json              # Configuración de Expo
├── eas.json              # Configuración de EAS Build
├── package.json
└── README.md
```

Este repositorio ya no incluye integración con Monetag; los anuncios fueron eliminados de la aplicación.

## 📱 Funcionalidades Principales

### Autenticación
- Registro de nuevos usuarios
- Inicio de sesión
- Persistencia de sesión
- Cierre de sesión

### Onboarding
- Formulario para calcular TDEE y BMR
- Inputs: Edad, peso, altura, género, nivel de actividad, objetivo
- Cálculo automático de metas calóricas y de macronutrientes

### Dashboard
- Visualización de calorías consumidas vs. meta diaria (gráfico circular)
- Desglose de macronutrientes (Proteínas, Carbs, Grasas) con barras de progreso
- Listado de comidas del día por tipo
- Pull-to-refresh para actualizar datos

### Registro de Alimentos
- Búsqueda de alimentos (base de datos + mock data)
- Agregar comida con cantidad personalizada
- Cálculo automático de valores nutricionales
- Organización por tipo de comida (Desayuno, Almuerzo, Cena, Snack)

### Perfil
- Visualización de información personal
- Metas diarias configuradas
- Métricas calculadas (BMR, TDEE)
- Opción para editar perfil
- Cerrar sesión

## 🐛 Solución de Problemas

### Error: "Missing Supabase environment variables"
- Asegúrate de que el archivo `.env` existe en la raíz del proyecto
- Verifica que las variables comienzan con `EXPO_PUBLIC_`
- Reinicia el servidor de desarrollo después de crear/modificar `.env`

### Error al conectar con Supabase
- Verifica que la URL y la clave anónima son correctas
- Asegúrate de que el proyecto de Supabase está activo
- Verifica que las políticas RLS están configuradas correctamente

### Error en el build de Android
- Verifica que `eas.json` está configurado correctamente
- Asegúrate de que el `package` en `app.json` es único
- Verifica que tienes los permisos necesarios en Google Play Console



## 📚 Recursos Adicionales

- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de NativeWind](https://www.nativewind.dev/)
- [Documentación de Zustand](https://zustand-demo.pmnd.rs/)
- [Documentación de EAS Build](https://docs.expo.dev/build/introduction/)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la sección de "Solución de Problemas"
2. Consulta la documentación oficial de las tecnologías usadas
3. Abre un issue en el repositorio

---

**¡Desarrollado con ❤️ usando React Native y Expo!**

