const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');

// Asegurar que la carpeta existe
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Color de fondo (Indigo #4F46E5)
const backgroundColor = { r: 79, g: 70, b: 229 };

// Crear SVG simple con texto
function createSVG(width, height, text) {
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="rgb(79, 70, 229)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 4}" 
        font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
}

async function createAsset(filename, width, height, text) {
  const svg = Buffer.from(createSVG(width, height, text));
  const outputPath = path.join(assetsDir, filename);
  
  await sharp(svg)
    .resize(width, height)
    .png()
    .toFile(outputPath);
  
  console.log(`✓ Creado: ${filename} (${width}x${height}px)`);
}

async function createAllAssets() {
  console.log('Creando assets temporales...\n');
  
  try {
    // Icon principal
    await createAsset('icon.png', 1024, 1024, 'NT');
    
    // Adaptive icon (mismo que icon)
    await createAsset('adaptive-icon.png', 1024, 1024, 'NT');
    
    // Splash screen
    await createAsset('splash.png', 1080, 1920, 'Nutrition\nTracker');
    
    // Favicon
    await createAsset('favicon.png', 48, 48, 'NT');
    
    console.log('\n✅ Todos los assets creados exitosamente!');
    console.log('📝 Nota: Estos son placeholders temporales.');
    console.log('   Puedes reemplazarlos con tus diseños finales más tarde.\n');
  } catch (error) {
    console.error('Error creando assets:', error.message);
    console.log('\n💡 Alternativa: Crea los PNGs manualmente usando Paint o cualquier editor de imágenes.');
    process.exit(1);
  }
}

createAllAssets();

