import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import es from './es';
import en from './en';

const getDeviceLanguage = () => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    return locales[0].languageCode ?? 'es'; 
  }
  return 'es'; 
};

i18n
  .use(initReactI18next)
  .init({
    // compatibilityJSON: 'v3', 
    
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: getDeviceLanguage(), 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;