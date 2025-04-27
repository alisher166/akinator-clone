import { NavLink } from 'react-router-dom';
import { useLocale } from '../../contexts/LocaleContext';
import { getTranslation } from '../../utils/localization';
import styles from './Header.module.css';

const Header = () => {
  const { locale, changeLocale } = useLocale();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <NavLink to="/" className={styles.logo}>
          {getTranslation('appName', locale)}
        </NavLink>
        
        <nav className={styles.nav}>
          <NavLink 
            to="/"
            className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}
          >
            {getTranslation('home', locale)}
          </NavLink>
          <NavLink 
            to="/about"
            className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}
          >
            {getTranslation('about', locale)}
          </NavLink>
        </nav>
        
        <div className={styles.localeSwitch}>
          <button 
            className={locale === 'ru' ? styles.activeLocale : styles.localeButton}
            onClick={() => changeLocale('ru')}
          >
            RU
          </button>
          <span className={styles.localeSeparator}>|</span>
          <button 
            className={locale === 'en' ? styles.activeLocale : styles.localeButton}
            onClick={() => changeLocale('en')}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 