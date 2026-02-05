const { withAndroidManifest } = require('@expo/config-plugins');

const withAdId = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Buscar si ya existe la sección de permisos
    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }

    const permissions = androidManifest.manifest['uses-permission'];
    
    // Verificar si el permiso ya está para no duplicarlo
    const hasPermission = permissions.some(
      (p) => p.$['android:name'] === 'com.google.android.gms.permission.AD_ID'
    );

    if (!hasPermission) {
      // INYECTAR EL PERMISO A LA FUERZA
      permissions.push({
        $: {
          'android:name': 'com.google.android.gms.permission.AD_ID',
          'tools:node': 'merge', // Esto asegura que se fusione y no se borre
        },
      });
    }

    // Asegurarnos de agregar el namespace 'tools' si no existe
    if (!androidManifest.manifest.$['xmlns:tools']) {
      androidManifest.manifest.$['xmlns:tools'] = "http://schemas.android.com/tools";
    }

    return config;
  });
};

module.exports = withAdId;