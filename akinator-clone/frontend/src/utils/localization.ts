// Тип для переводов
interface Translations {
  [key: string]: {
    ru: string;
    en: string;
  };
}

// Словарь переводов
export const translations: Translations = {
  // Общие
  appName: {
    ru: 'Акинатор',
    en: 'Akinator'
  },
  loading: {
    ru: 'Загрузка...',
    en: 'Loading...'
  },
  
  // Навигация
  home: {
    ru: 'Главная',
    en: 'Home'
  },
  about: {
    ru: 'О проекте',
    en: 'About'
  },
  
  // Главная страница
  welcomeTitle: {
    ru: 'Добро пожаловать в мир Акинатора!',
    en: 'Welcome to the world of Akinator!'
  },
  welcomeDescription: {
    ru: 'Загадайте любого персонажа, а я попробую его угадать, задавая вопросы.',
    en: 'Think of any character and I will try to guess it by asking questions.'
  },
  startGame: {
    ru: 'Начать игру',
    en: 'Start Game'
  },
  
  // Страница игры
  thinkingQuestion: {
    ru: 'Дайте мне подумать...',
    en: 'Let me think...'
  },
  answerYes: {
    ru: 'Да',
    en: 'Yes'
  },
  answerNo: {
    ru: 'Нет',
    en: 'No'
  },
  answerDontKnow: {
    ru: 'Не знаю',
    en: 'Don\'t know'
  },
  progressLabel: {
    ru: 'Прогресс:',
    en: 'Progress:'
  },
  
  // Страница результатов
  iGuessedTitle: {
    ru: 'Я думаю, что это...',
    en: 'I think it\'s...'
  },
  correctGuess: {
    ru: 'Я угадал?',
    en: 'Did I guess correctly?'
  },
  guessedRight: {
    ru: 'Да, верно!',
    en: 'Yes, that\'s right!'
  },
  guessedWrong: {
    ru: 'Нет, это не так',
    en: 'No, that\'s not it'
  },
  playAgain: {
    ru: 'Играть снова',
    en: 'Play Again'
  },
  
  // Страница "О проекте"
  aboutTitle: {
    ru: 'О проекте "Акинатор"',
    en: 'About "Akinator" Project'
  },
  howToPlay: {
    ru: 'Как играть',
    en: 'How to Play'
  },
  howToPlayDesc: {
    ru: '1. Загадайте любого персонажа (реального или вымышленного)\n2. Отвечайте на мои вопросы "Да", "Нет" или "Не знаю"\n3. Я попытаюсь угадать вашего персонажа',
    en: '1. Think of any character (real or fictional)\n2. Answer my questions with "Yes", "No", or "Don\'t know"\n3. I will try to guess your character'
  },
  aboutTechnology: {
    ru: 'Технологии',
    en: 'Technologies'
  },
  aboutTechnologyDesc: {
    ru: 'Этот проект создан с использованием React для фронтенда и Node.js для бэкенда. Алгоритм использует древовидную структуру вопросов для определения персонажа.',
    en: 'This project was built using React for the frontend and Node.js for the backend. The algorithm uses a tree-like structure of questions to determine the character.'
  },
  
  // Футер
  footerText: {
    ru: '© 2023 Акинатор Клон. Все права защищены.',
    en: '© 2023 Akinator Clone. All rights reserved.'
  }
};

// Функция для получения перевода
export function getTranslation(key: string, locale: 'ru' | 'en'): string {
  if (!translations[key]) {
    console.warn(`Translation key "${key}" not found.`);
    return key;
  }
  return translations[key][locale];
} 