import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '../../contexts/LocaleContext';
import { getTranslation } from '../../utils/localization';
import ProgressBar from '../ProgressBar';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  questionText: string;
  questionTextEn: string;
  progress: number;
  onAnswer: (answer: boolean | null) => void;
  isLoading?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionText,
  questionTextEn,
  progress,
  onAnswer,
  isLoading = false
}) => {
  const { locale } = useLocale();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleAnswer = (answer: boolean | null) => {
    setIsAnimating(true);
    setTimeout(() => {
      onAnswer(answer);
      setIsAnimating(false);
    }, 300);
  };
  
  const text = locale === 'ru' ? questionText : questionTextEn;
  
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.questionBox}>
        <motion.div
          className={styles.genie}
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [-1, 1, -1] 
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          🧞‍♂️
        </motion.div>
        
        <h2 className={styles.question}>
          {isLoading ? getTranslation('thinkingQuestion', locale) : text}
        </h2>
      </div>
      
      <ProgressBar progress={progress} />
      
      <div className={styles.buttonsContainer}>
        <motion.button
          className={`${styles.button} ${styles.yesButton}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAnswer(true)}
          disabled={isLoading || isAnimating}
        >
          {getTranslation('answerYes', locale)}
        </motion.button>
        
        <motion.button
          className={`${styles.button} ${styles.noButton}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAnswer(false)}
          disabled={isLoading || isAnimating}
        >
          {getTranslation('answerNo', locale)}
        </motion.button>
        
        <motion.button
          className={`${styles.button} ${styles.dontKnowButton}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAnswer(null)}
          disabled={isLoading || isAnimating}
        >
          {getTranslation('answerDontKnow', locale)}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuestionCard; 