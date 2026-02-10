import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// CAMBIA ESTO A 'false' SOLO CUANDO SUBAS A PRODUCCIÓN FINAL
const IS_TESTING_RELEASE = true; 

// Lógica mejorada:
// 1. Si estamos en modo debug (__DEV__), usa TestIds.
// 2. Si es una release de prueba (IS_TESTING_RELEASE), usa TestIds.
// 3. Solo si es producción real y NO es prueba, usa tu ID real.
const adUnitId = (__DEV__ || IS_TESTING_RELEASE) 
  ? TestIds.BANNER 
  : 'ca-app-pub-1664097504847565/6691954597';

export const AdBanner = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 20);

  return (
    <View style={{ 
      width: '100%', 
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff', 
      paddingBottom: bottomPadding,
      paddingTop: 10,
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