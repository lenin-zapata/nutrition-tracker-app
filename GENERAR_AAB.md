# 📦 Cómo Generar el Archivo .AAB

El archivo `.aab` (Android App Bundle) **NO existe todavía**. Necesitas generarlo usando EAS Build.

## 🚀 Pasos para Generar el .AAB

### 1. Instalar EAS CLI (si no lo tienes)

```bash
npm install -g eas-cli
```

### 2. Iniciar sesión en EAS

```bash
eas login
```

Usa tu cuenta de Expo (puedes crear una en [expo.dev](https://expo.dev))

### 3. Configurar el proyecto (primera vez)

```bash
eas build:configure
```

Esto actualizará el `projectId` en `app.json` automáticamente.

### 4. Verificar configuración

Antes de hacer el build, verifica que:

- ✅ Tienes los assets creados (`assets/icon.png`, `assets/splash.png`, etc.)
- ✅ Las variables de entorno están configuradas en `.env`
- ✅ El `package` en `app.json` es único (cambia `com.nutritiontracker.app` si es necesario)

### 5. Generar el .AAB

```bash
eas build --platform android --profile production
```

**Este proceso:**
- Tarda entre 10-20 minutos
- Se ejecuta en los servidores de Expo (en la nube)
- Te dará un enlace para descargar el `.aab` cuando termine

### 6. Descargar el .AAB

Una vez completado el build:

1. **Opción 1**: EAS te dará un enlace directo en la terminal
2. **Opción 2**: Ve a [expo.dev](https://expo.dev) > Tu proyecto > Builds
3. **Opción 3**: Usa el comando:
   ```bash
   eas build:list
   ```
   Y luego descarga con:
   ```bash
   eas build:download [BUILD_ID]
   ```

## 📍 Dónde se Guarda el .AAB

Después de descargarlo:

- **Si usas el enlace**: Se descarga en tu carpeta de Descargas
- **Si usas `eas build:download`**: Se guarda en la carpeta actual del proyecto
- **Tamaño aproximado**: 20-50 MB

## 🔍 Verificar Builds Existentes

Si ya hiciste un build antes, puedes ver la lista:

```bash
eas build:list --platform android
```

## ⚠️ Requisitos Antes del Build

1. **Assets necesarios** (en `assets/`):
   - `icon.png` (1024x1024px)
   - `splash.png` (1242x2436px recomendado)
   - `adaptive-icon.png` (1024x1024px)
   - `favicon.png` (48x48px)

2. **Variables de entorno** (en `.env`):
   ```env
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. **Package único** en `app.json`:
   ```json
   "android": {
     "package": "com.tunombre.nutritionapp"
   }
   ```

## 🏗️ Build Local (Opcional)

Si prefieres hacer el build localmente (requiere Android SDK):

```bash
eas build --platform android --profile production --local
```

El `.aab` se generará en: `./builds/`

## 📤 Subir a Google Play Store

Una vez que tengas el `.aab`:

1. Ve a [Google Play Console](https://play.google.com/console)
2. Selecciona tu app (o créala)
3. Ve a "Producción" > "Crear nueva versión"
4. Sube el archivo `.aab`
5. Completa la información requerida
6. Envía para revisión

## 🐛 Problemas Comunes

### "No project ID found"
```bash
eas build:configure
```

### "Missing assets"
Crea los archivos en `assets/` según `ASSETS_INSTRUCTIONS.md`

### "Build failed"
- Revisa los logs en [expo.dev](https://expo.dev)
- Verifica que todas las dependencias están instaladas
- Asegúrate de que el `package` es único

## 💡 Nota Importante

**El archivo .AAB solo se genera cuando ejecutas el comando de build.** No existe en el proyecto hasta que lo generes.

---

**¿Listo para generar tu .AAB?** Ejecuta:
```bash
eas build --platform android --profile production
```

