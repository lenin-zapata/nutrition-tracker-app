import React from 'react';
import { View, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-1664097504847565/6691954597';

export const AdBanner = () => {
  const insets = useSafeAreaInsets();

  // 🛡️ LÓGICA DE SEGURIDAD:
  // Si hay botones (insets.bottom es ~48px), usamos eso.
  // Si es gestos (insets.bottom es ~0-15px), forzamos mínimo 20px.
  // Esto aleja el anuncio del borde para evitar clics accidentales al hacer swipe.
  const bottomPadding = Math.max(insets.bottom, 20);

  return (
    <View style={{ 
      width: '100%', 
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff', 
      paddingBottom: bottomPadding, // ✅ Usamos el valor calculado
      paddingTop: 10, // Un poco de aire arriba también queda bien
    }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};