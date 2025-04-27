import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '../../contexts/LocaleContext';
import { getTranslation } from '../../utils/localization';
import { Character } from '../../types/characters';
import styles from './ResultCard.module.css';

interface ResultCardProps {
  character: Character;
  onPlayAgain: () => void;
  onCorrectAnswer: (isCorrect: boolean) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
  character,
  onPlayAgain,
  onCorrectAnswer
}) => {
  const { locale } = useLocale();
  
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.resultBox}>
        <motion.div
          className={styles.genie}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0] 
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          🧞‍♂️
        </motion.div>
        
        <h2 className={styles.resultTitle}>
          {getTranslation('iGuessedTitle', locale)}
        </h2>
        
        <div className={styles.characterResult}>
          <h1 className={styles.characterName}>{character.name}</h1>
        </div>
        
        <p className={styles.guessQuestion}>
          {getTranslation('correctGuess', locale)}
        </p>
        
        <div className={styles.feedbackButtons}>
          <motion.button
            className={`${styles.button} ${styles.correctButton}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCorrectAnswer(true)}
          >
            {getTranslation('guessedRight', locale)}
          </motion.button>
          
          <motion.button
            className={`${styles.button} ${styles.incorrectButton}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCorrectAnswer(false)}
          >
            {getTranslation('guessedWrong', locale)}
          </motion.button>
        </div>
      </div>
      
      <motion.button
        className={`${styles.button} ${styles.playAgainButton}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlayAgain}
      >
        {getTranslation('playAgain', locale)}
      </motion.button>
    </motion.div>
  );
};

export default ResultCard; 