# Instrucciones para Crear Assets

Este archivo contiene instrucciones para crear los assets necesarios para la aplicación.

## Assets Requeridos

Necesitas crear los siguientes archivos en la carpeta `assets/`:

### 1. `icon.png`
- **Tamaño:** 1024x1024px
- **Formato:** PNG
- **Fondo:** Transparente o sólido
- **Descripción:** Icono principal de la aplicación

### 2. `splash.png`
- **Tamaño:** 1242x2436px (recomendado para iOS) o 1080x1920px (Android)
- **Formato:** PNG
- **Fondo:** Sólido (recomendado #4F46E5 para coincidir con el tema)
- **Descripción:** Pantalla de inicio/splash screen

### 3. `adaptive-icon.png`
- **Tamaño:** 1024x1024px
- **Formato:** PNG
- **Fondo:** Sólido (recomendado #4F46E5)
- **Descripción:** Icono adaptativo para Android (se muestra en diferentes formas según el dispositivo)

### 4. `favicon.png`
- **Tamaño:** 48x48px (mínimo)
- **Formato:** PNG
- **Fondo:** Transparente o sólido
- **Descripción:** Favicon para la versión web

## Herramientas Recomendadas

### Opción 1: Generador Automático de Expo
```bash
npm install -g @expo/asset-generator
npx asset-generator --help
```

### Opción 2: Herramientas Online
- [AppIcon.co](https://www.appicon.co/) - Genera todos los tamaños necesarios
- [IconKitchen](https://icon.kitchen/) - Generador de iconos adaptativos
- [Figma](https://www.figma.com/) - Para diseñar desde cero

### Opción 3: Herramientas de Diseño
- Adobe Photoshop
- Adobe Illustrator
- Sketch
- Canva

## Pasos Rápidos

1. **Diseña tu icono principal** (1024x1024px)
   - Puede ser un logo, símbolo o ilustración relacionada con nutrición/comidas
   - Asegúrate de que sea reconocible en tamaños pequeños

2. **Crea el splash screen**
   - Usa el mismo diseño del icono pero centrado
   - O crea un diseño específico para la pantalla de inicio
   - El fondo debe ser sólido (#4F46E5 según la configuración actual)

3. **Genera el adaptive icon**
   - Para Android, el sistema puede recortar los bordes
   - Mantén el contenido importante en el centro (80% del área)
   - Usa el mismo diseño del icono principal

4. **Crea el favicon**
   - Versión simplificada del icono
   - Debe ser legible en 48x48px

## Colores del Tema

- **Primario:** #4F46E5 (Indigo)
- **Secundario:** #10B981 (Verde para proteínas)
- **Azul:** #3B82F6 (Para carbohidratos)
- **Amarillo:** #F59E0B (Para grasas)

## Verificación

Después de crear los assets, verifica que:
- Todos los archivos están en la carpeta `assets/`
- Los nombres de archivo son exactos (case-sensitive)
- Los tamaños son correctos
- Los formatos son PNG

## Nota

Si no tienes los assets listos, puedes usar placeholders temporales:
- Crea imágenes simples con texto o colores sólidos
- Reemplázalas más tarde con los diseños finales

