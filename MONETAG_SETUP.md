# Configuración de Monetag

Esta guía te ayudará a configurar correctamente los anuncios de Monetag en la aplicación.

## 📋 Pasos para Configurar Monetag

### 1. Crear cuenta en Monetag

1. Ve a [Monetag.com](https://monetag.com)
2. Crea una cuenta nueva
3. Verifica tu email si es necesario

### 2. Crear un nuevo sitio/app

1. En el dashboard de Monetag, haz clic en "Agregar Sitio" o "Nuevo Sitio"
2. Completa el formulario:
   - **Nombre del sitio**: Nutrition Tracker App (o el nombre que prefieras)
   - **URL del sitio**: Puede ser una URL temporal o el dominio de tu app
   - **Categoría**: Selecciona "App Móvil" o "Salud/Fitness"
3. Guarda el sitio

### 3. Obtener el Site ID

Después de crear el sitio, Monetag te proporcionará un **Site ID**. Este puede venir en diferentes formatos:

- **Formato 1**: Solo el ID (ejemplo: `12345678`)
- **Formato 2**: URL completa (ejemplo: `https://monetag.com/12345678`)
- **Formato 3**: URL con ruta (ejemplo: `https://otieu.com/4/10321796`)

**El componente `AdsComponent` maneja automáticamente todos estos formatos**, así que puedes usar cualquiera.

### 4. Configurar en la aplicación

Agrega el Site ID a tu archivo `.env`:

```env
EXPO_PUBLIC_MONETAG_SITE_ID=tu_site_id_aqui
```

**Ejemplos:**
```env
# Si tienes solo el ID
EXPO_PUBLIC_MONETAG_SITE_ID=12345678

# Si tienes una URL completa
EXPO_PUBLIC_MONETAG_SITE_ID=https://otieu.com/4/10321796

# Si tienes otra URL
EXPO_PUBLIC_MONETAG_SITE_ID=https://monetag.com/12345678
```

### 5. Reiniciar la aplicación

Después de agregar la variable de entorno:

1. Detén el servidor de desarrollo (Ctrl+C)
2. Reinicia con `npm start`
3. Recarga la aplicación en tu dispositivo

## 🔍 Verificación

### Si el Site ID está configurado correctamente:

- Verás el anuncio de Monetag en la pantalla de inicio (Home)
- El anuncio aparecerá en un contenedor de 100px de altura

### Si el Site ID NO está configurado:

- Verás un placeholder gris con el texto: "Anuncio (Configura EXPO_PUBLIC_MONETAG_SITE_ID)"
- Esto te indica que necesitas configurar la variable de entorno

## 🐛 Solución de Problemas

### El anuncio no aparece

1. **Verifica la variable de entorno**:
   ```bash
   # En la terminal, verifica que la variable esté cargada
   echo $EXPO_PUBLIC_MONETAG_SITE_ID
   ```

2. **Reinicia el servidor**:
   - Las variables de entorno con `EXPO_PUBLIC_` se cargan al iniciar el servidor
   - Debes reiniciar después de agregar/modificar `.env`

3. **Verifica el formato del Site ID**:
   - Asegúrate de que el Site ID es correcto
   - Puedes probar con solo el ID numérico o con la URL completa

4. **Revisa la consola**:
   - Abre las herramientas de desarrollo
   - Busca errores relacionados con WebView o Monetag
   - Los errores aparecerán en la consola de Metro

### El anuncio muestra "Error cargando anuncio"

1. **Verifica tu conexión a internet**: Los anuncios requieren conexión
2. **Verifica el Site ID**: Asegúrate de que es correcto
3. **Espera unos segundos**: Los anuncios pueden tardar en cargar
4. **Verifica en Monetag**: Asegúrate de que tu sitio está activo en el dashboard

### El anuncio aparece pero está vacío

- Esto puede ser normal si Monetag no tiene anuncios disponibles en ese momento
- Los anuncios se cargan dinámicamente según disponibilidad
- Verifica en el dashboard de Monetag que tu sitio esté activo y aprobado

## 📱 Tipos de Anuncios

El componente `AdsComponent` soporta dos tipos:

### Banner (por defecto)
```tsx
<AdsComponent type="banner" />
```
- Anuncio tipo banner estándar
- Altura: 100px
- Ideal para la parte inferior de pantallas

### Direct Link
```tsx
<AdsComponent type="direct" />
```
- Anuncio de enlace directo
- Altura: 100px
- Útil para integraciones específicas

## 🎨 Personalización

Puedes personalizar el estilo del contenedor del anuncio:

```tsx
<AdsComponent 
  type="banner" 
  style={{ 
    height: 120, 
    marginVertical: 16,
    borderRadius: 12 
  }} 
/>
```

## 📊 Monitoreo

1. Ve al dashboard de Monetag
2. Revisa las estadísticas de tu sitio
3. Verifica las impresiones y clics
4. Ajusta la configuración según tus necesidades

## ⚠️ Notas Importantes

- Los anuncios pueden tardar unos segundos en cargar
- En desarrollo, es normal que algunos anuncios no aparezcan inmediatamente
- Los anuncios funcionan mejor en dispositivos físicos que en emuladores
- Asegúrate de tener una buena conexión a internet

## 🔗 Recursos

- [Documentación de Monetag](https://monetag.com/docs)
- [Dashboard de Monetag](https://monetag.com/dashboard)
- [Soporte de Monetag](https://monetag.com/support)

---

**¿Necesitas ayuda?** Revisa la consola de desarrollo para ver mensajes de error específicos.

