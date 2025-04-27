import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ResultCard from '../components/ResultCard';
import { akinatorApi } from '../services/api';
import { Character } from '../types/characters';
import styles from './ResultPage.module.css';

interface LocationState {
  result: Character;
  gameId: string;
}

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Получаем данные о результате из state навигации
  const state = location.state as LocationState | null;
  const result = state?.result;
  const gameId = state?.gameId;
  
  // Перенаправляем на главную, если нет результата
  useEffect(() => {
    if (!result) {
      navigate('/');
    }
  }, [result, navigate]);
  
  const handlePlayAgain = async () => {
    setIsLoading(true);
    try {
      if (gameId) {
        await akinatorApi.restartGame(gameId);
        navigate('/game');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error restarting game:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCorrectAnswer = (isCorrect: boolean) => {
    // Здесь можно было бы отправить фидбек о правильности ответа
    // Пока просто перенаправляем на главную или предлагаем сыграть снова
    if (isCorrect) {
      setTimeout(() => {
        handlePlayAgain();
      }, 1500);
    } else {
      // Если джинн угадал неверно, можно было бы предложить добавить персонажа
      navigate('/');
    }
  };
  
  if (!result) {
    return null;
  }
  
  return (
    <div className={styles.resultPage}>
      <motion.div
        className={styles.resultContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ResultCard
          character={result}
          onPlayAgain={handlePlayAgain}
          onCorrectAnswer={handleCorrectAnswer}
        />
      </motion.div>
    </div>
  );
};

export default ResultPage; 