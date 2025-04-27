import { useLocale } from '../../contexts/LocaleContext';
import { getTranslation } from '../../utils/localization';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const { locale } = useLocale();
  const roundedProgress = Math.round(progress);
  
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressLabel}>
        {getTranslation('progressLabel', locale)} {roundedProgress}%
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${roundedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar; 