import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';
import AboutPage from './pages/AboutPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { LocaleContext } from './contexts/LocaleContext';

function App() {
  const [locale, setLocale] = useState<'ru' | 'en'>('ru');

  // Читаем сохраненный язык из localStorage при загрузке
  useEffect(() => {
    const savedLocale = localStorage.getItem('akinator-locale');
    if (savedLocale === 'ru' || savedLocale === 'en') {
      setLocale(savedLocale);
    }
  }, []);

  // Сохраняем выбранный язык в localStorage
  const changeLocale = (newLocale: 'ru' | 'en') => {
    setLocale(newLocale);
    localStorage.setItem('akinator-locale', newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LocaleContext.Provider>
  );
}

export default App; 