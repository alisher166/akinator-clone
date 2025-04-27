import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocale } from '../contexts/LocaleContext';
import { getTranslation } from '../utils/localization';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { locale } = useLocale();
  
  const startGame = () => {
    navigate('/game');
  };
  
  return (
    <div className={styles.homePage}>
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div 
          className={styles.genieLamp}
          initial={{ rotate: -10 }}
          animate={{ rotate: 10 }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          🪔
        </motion.div>
        
        <motion.div 
          className={styles.genieCharacter}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.5, 
            duration: 1
          }}
        >
          <div className={styles.genieSmokeContainer}>
            <div className={styles.genieSmoke}>💨</div>
            <div className={styles.genieSmoke}>💨</div>
            <div className={styles.genieSmoke}>💨</div>
          </div>
          <div className={styles.genie}>🧞‍♂️</div>
        </motion.div>
        
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {getTranslation('welcomeTitle', locale)}
        </motion.h1>
        
        <motion.p 
          className={styles.description}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          {getTranslation('welcomeDescription', locale)}
        </motion.p>
        
        <motion.button
          className={styles.startButton}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
        >
          {getTranslation('startGame', locale)}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HomePage; 