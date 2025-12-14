import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface AdsComponentProps {
  type?: 'banner' | 'direct';
  style?: any;
}

export default function AdsComponent({ type = 'banner', style }: AdsComponentProps) {
  // En Expo, las variables de entorno con EXPO_PUBLIC_ están disponibles directamente
  const siteId = process.env.EXPO_PUBLIC_MONETAG_SITE_ID;

  // Si no hay site ID, mostrar un placeholder para desarrollo
  if (!siteId) {
    return (
      <View style={[styles.container, style, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={{ padding: 16, backgroundColor: '#E5E7EB', borderRadius: 8 }}>
          <Text style={{ color: '#6B7280', fontSize: 12, textAlign: 'center' }}>
            Anuncio (Configura EXPO_PUBLIC_MONETAG_SITE_ID)
          </Text>
        </View>
      </View>
    );
  }

  // HTML para el anuncio de Monetag
  // Nota: El Site ID de Monetag puede venir en formato URL o solo el ID
  const cleanSiteId = siteId.replace('https://', '').replace('http://', '').split('/').pop() || siteId;
  
  const getAdHtml = () => {
    if (type === 'direct') {
      // Direct Link de Monetag
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              html, body { width: 100%; height: 100%; overflow: hidden; }
            </style>
          </head>
          <body>
            <div id="monetag-ad-container" style="width: 100%; height: 100%;"></div>
            <script>
              (function() {
                try {
                  var container = document.getElementById('monetag-ad-container');
                  var script = document.createElement('script');
                  script.src = 'https://s.monetag.com/direct/${cleanSiteId}';
                  script.async = true;
                  script.onerror = function() {
                    container.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">Error cargando anuncio</div>';
                  };
                  document.body.appendChild(script);
                } catch(e) {
                  console.error('Error loading ad:', e);
                }
              })();
            </script>
          </body>
        </html>
      `;
    } else {
      // Banner de Monetag
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              html, body { width: 100%; height: 100%; overflow: hidden; }
              #monetag-banner { width: 100%; height: 100%; min-height: 50px; }
            </style>
          </head>
          <body>
            <div id="monetag-banner"></div>
            <script>
              (function() {
                try {
                  var script = document.createElement('script');
                  script.src = 'https://s.monetag.com/banner/${cleanSiteId}';
                  script.async = true;
                  script.onerror = function() {
                    var banner = document.getElementById('monetag-banner');
                    if (banner) {
                      banner.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">Error cargando anuncio</div>';
                    }
                  };
                  document.body.appendChild(script);
                } catch(e) {
                  console.error('Error loading ad:', e);
                }
              })();
            </script>
          </body>
        </html>
      `;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html: getAdHtml() }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView HTTP error: ', nativeEvent);
        }}
        renderError={(errorName) => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error cargando anuncio</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 50,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  errorText: {
    color: '#6B7280',
    fontSize: 12,
  },
});
