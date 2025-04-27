import { useLocale } from '../../contexts/LocaleContext';
import { getTranslation } from '../../utils/localization';
import styles from './Footer.module.css';

const Footer = () => {
  const { locale } = useLocale();
  
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.copyright}>
          {getTranslation('footerText', locale)}
        </p>
      </div>
    </footer>
  );
};

export default Footer; 