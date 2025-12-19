const fs = require('fs');
const path = require('path');

// Crear carpeta assets si no existe
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Crear un PNG básico usando un enfoque simple
// Nota: Este script crea archivos PNG mínimos válidos
function createPlaceholderPNG(width, height, filename) {
  // PNG header básico (formato simplificado)
  // En producción, deberías usar una librería como 'sharp' o 'jimp'
  // Por ahora, creamos un archivo de texto que indica que es un placeholder
  
  const placeholderInfo = `# Placeholder para ${filename}
# Tamaño requerido: ${width}x${height}px
# 
# Para crear el asset real:
# 1. Usa una herramienta de diseño (Figma, Photoshop, Canva)
# 2. Crea una imagen ${width}x${height}px
# 3. Guárdala como PNG en este directorio con el nombre: ${filename}
#
# Herramientas recomendadas:
# - https://www.appicon.co/ (generador automático)
# - https://icon.kitchen/ (iconos adaptativos)
# - Figma (diseño desde cero)
`;

  fs.writeFileSync(
    path.join(assetsDir, filename.replace('.png', '.txt')),
    placeholderInfo
  );
  
  console.log(`✓ Creado placeholder info para ${filename}`);
}

console.log('Generando información de placeholders...\n');

// Crear información para cada asset requerido
createPlaceholderPNG(1024, 1024, 'icon.png');
createPlaceholderPNG(1242, 2436, 'splash.png');
createPlaceholderPNG(1024, 1024, 'adaptive-icon.png');
createPlaceholderPNG(48, 48, 'favicon.png');

console.log('\n⚠️  IMPORTANTE: Los archivos .txt son solo información.');
console.log('Necesitas crear los archivos PNG reales antes de hacer el build.\n');
console.log('Opciones rápidas:');
console.log('1. Usa https://www.appicon.co/ para generar todos los assets');
console.log('2. Crea imágenes simples de 1024x1024px con un color sólido (#4F46E5)');
console.log('3. Descarga iconos gratuitos de https://www.flaticon.com/');

