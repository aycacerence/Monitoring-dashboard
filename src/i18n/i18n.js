import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import trTranslation from '../locales/tr/translation.json';
import enTranslation from '../locales/en/translation.json';

const savedRole = localStorage.getItem('userRole') || 'admin';
const savedLang = localStorage.getItem(`i18nLang_${savedRole}`) || localStorage.getItem('i18nLang') || 'tr';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: trTranslation },
      en: { translation: enTranslation },
    },
    lng: savedLang,
    fallbackLng: 'tr',
    interpolation: { escapeValue: false },
  });

export default i18n;
