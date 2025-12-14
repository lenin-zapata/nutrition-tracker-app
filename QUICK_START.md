# 🚀 Inicio Rápido

Guía rápida para poner en marcha la aplicación en 5 minutos.

## Paso 1: Instalar Dependencias

```bash
npm install
```

## Paso 2: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
EXPO_PUBLIC_MONETAG_SITE_ID=tu_site_id_aqui
```

**Obtener credenciales de Supabase:**
1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto
3. Settings > API > Copia URL y anon key

## Paso 3: Configurar Base de Datos

1. En Supabase Dashboard > SQL Editor
2. Copia y pega el contenido de `schema.sql`
3. Ejecuta el script

## Paso 4: Crear Assets (Opcional por ahora)

Si no tienes los assets listos, puedes usar placeholders temporales. Ver `ASSETS_INSTRUCTIONS.md` para más detalles.

## Paso 5: Ejecutar

```bash
npm start
```

Escanea el QR con Expo Go en tu teléfono, o presiona `a` para Android / `i` para iOS.

## ✅ Listo!

La aplicación debería estar funcionando. Si encuentras problemas, revisa el `README.md` completo.

## Próximos Pasos

- [ ] Configurar los assets reales (iconos, splash screen)
- [ ] Configurar Monetag (opcional)
- [ ] Probar todas las funcionalidades
- [ ] Preparar para producción (ver README.md)

