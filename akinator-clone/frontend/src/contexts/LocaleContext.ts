import { createContext, useContext } from 'react';

// Тип контекста локализации
interface LocaleContextType {
  locale: 'ru' | 'en';
  changeLocale: (locale: 'ru' | 'en') => void;
}

// Создаем контекст с начальными значениями по умолчанию
export const LocaleContext = createContext<LocaleContextType>({
  locale: 'ru',
  changeLocale: () => {},
});

// Хук для использования контекста локализации
export const useLocale = () => useContext(LocaleContext); 