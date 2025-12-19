# 🚀 Crear Assets Rápidamente para el Build

El build está fallando porque faltan los archivos de assets. Aquí tienes opciones **RÁPIDAS** para crearlos:

## ⚡ Opción 1: Generador Online (MÁS RÁPIDO - 2 minutos)

1. Ve a [AppIcon.co](https://www.appicon.co/)
2. Sube cualquier imagen (puede ser temporal)
3. Descarga el paquete completo
4. Extrae los archivos a la carpeta `assets/`:
   - `icon.png` (1024x1024)
   - `splash.png` (usa el tamaño más grande disponible)
   - `adaptive-icon.png` (1024x1024)
   - `favicon.png` (48x48)

## ⚡ Opción 2: Crear Placeholders Simples (1 minuto)

Si solo necesitas que el build funcione AHORA, crea imágenes simples:

### Usando Paint (Windows) o cualquier editor:

1. **icon.png** (1024x1024px):
   - Abre Paint
   - Cambia el tamaño a 1024x1024px
   - Rellena con color #4F46E5 (Indigo)
   - Agrega texto "NT" o "Nutrition" en el centro
   - Guarda como PNG

2. **adaptive-icon.png** (1024x1024px):
   - Copia el mismo archivo que `icon.png`
   - Renómbralo a `adaptive-icon.png`

3. **splash.png** (1242x2436px o 1080x1920px):
   - Crea una imagen con fondo #4F46E5
   - Agrega el logo centrado (más grande)
   - Guarda como PNG

4. **favicon.png** (48x48px):
   - Crea una versión pequeña del icono
   - Guarda como PNG

## ⚡ Opción 3: Usar Expo Asset Generator

```bash
npm install -g @expo/asset-generator
npx asset-generator --help
```

## 📁 Estructura Final

Después de crear los assets, tu carpeta `assets/` debe tener:

```
assets/
├── icon.png              (1024x1024px)
├── splash.png            (1242x2436px o 1080x1920px)
├── adaptive-icon.png     (1024x1024px)
└── favicon.png           (48x48px)
```

## ✅ Verificación Rápida

Ejecuta esto para verificar que los archivos existen:

```bash
# Windows PowerShell
Get-ChildItem assets\*.png

# O simplemente verifica en el explorador de archivos
```

## 🎨 Colores del Tema

- **Fondo principal:** #4F46E5 (Indigo)
- **Texto:** Blanco (#FFFFFF) o Negro (#000000) según contraste

## 🚨 IMPORTANTE

**Los assets son OBLIGATORIOS para el build.** Sin ellos, el build fallará.

Una vez que tengas los assets (aunque sean placeholders simples), el build debería funcionar.

---

**¿Necesitas ayuda para crear los assets?** Puedo guiarte paso a paso con cualquier herramienta.

