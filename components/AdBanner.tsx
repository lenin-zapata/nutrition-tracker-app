import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Usamos TestIds.BANNER en desarrollo para evitar baneos de Google.
// En producción (cuando compiles la app real), usará tu ID real.
const adUnitId = __DEV__ 
  ? TestIds.BANNER 
  : 'ca-app-pub-1664097504847565/6691954597'; // <--- TU ID DEL BANNER

export const AdBanner = () => {
  return (
    <View style={{ alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e5e5' }}>
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