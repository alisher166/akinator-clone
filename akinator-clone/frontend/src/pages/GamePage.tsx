import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuestionCard from '../components/QuestionCard';
import { akinatorApi } from '../services/api';
import styles from './GamePage.module.css';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [gameId, setGameId] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState<string>('');
  const [questionTextEn, setQuestionTextEn] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [result, setResult] = useState<any>(null);
  
  // Инициализируем игру при загрузке компонента
  useEffect(() => {
    startGame();
  }, []);
  
  // Если получен результат, перенаправляем на страницу результата
  useEffect(() => {
    if (result) {
      navigate('/result', { state: { result, gameId } });
    }
  }, [result, navigate, gameId]);
  
  // Начинаем новую игру
  const startGame = async () => {
    try {
      setIsLoading(true);
      const response = await akinatorApi.startGame();
      
      setGameId(response.gameId);
      setQuestionId(response.question.id);
      setQuestionText(response.question.text);
      setQuestionTextEn(response.question.textEn);
      setProgress(response.progress);
      
    } catch (error) {
      console.error('Error starting game:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Обрабатываем ответ пользователя
  const handleAnswer = async (answer: boolean | null) => {
    if (!gameId || questionId === null) return;
    
    try {
      setIsLoading(true);
      const response = await akinatorApi.answerQuestion(gameId, questionId, answer);
      
      if ('result' in response) {
        // Получили результат
        setResult(response.result);
      } else if ('question' in response) {
        // Получили следующий вопрос
        setQuestionId(response.question.id);
        setQuestionText(response.question.text);
        setQuestionTextEn(response.question.textEn);
        setProgress(response.progress);
      }
      
    } catch (error) {
      console.error('Error answering question:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.gamePage}>
      <motion.div
        className={styles.questionContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <QuestionCard
          questionText={questionText}
          questionTextEn={questionTextEn}
          progress={progress}
          onAnswer={handleAnswer}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
};

export default GamePage; 