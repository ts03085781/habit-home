import enMessages from '../../messages/en.json';
import zhMessages from '../../messages/zh.json';

export type Locale = 'en' | 'zh';

const messages = {
  en: enMessages,
  zh: zhMessages
} as const;

export function getTranslations(locale: Locale) {
  return {
    t: (key: string): string => {
      const keys = key.split('.');
      let value: any = messages[locale];
      
      for (const k of keys) {
        // Handle array indexing (e.g., key.0, key.1)
        if (!isNaN(Number(k))) {
          value = value?.[parseInt(k)];
        } else {
          value = value?.[k];
        }
      }
      
      return value || key;
    },
    tArray: (key: string): string[] => {
      const keys = key.split('.');
      let value: any = messages[locale];
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return Array.isArray(value) ? value : [key];
    }
  };
}