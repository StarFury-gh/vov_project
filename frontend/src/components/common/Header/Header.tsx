import { useLocation } from 'react-router-dom';
import { AppButton } from '../buttons';
import styles from './Header.module.css';

import useAuth from '../../../hooks/useAuth';

function Header() {
    const location = useLocation();
    const isAuthenticated = useAuth();

    const isRouteActive = (route: string) =>
        route === '/' ? location.pathname === '/' : location.pathname.startsWith(route);

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.leftGroup}>
                    <AppButton
                        to="/"
                        variant="primary"
                        selected={isRouteActive('/')}
                        className={styles.headerButton}
                    >
                        Главная
                    </AppButton>
                </div>

                <div className={styles.centerLinks}>
                    <AppButton to="/about" selected={isRouteActive('/about')} className={styles.headerButton}>
                        О проекте
                    </AppButton>
                    <AppButton to="/svo" selected={isRouteActive('/svo')} className={styles.headerButton}>
                        СВО
                    </AppButton>
                    <AppButton to="/vov" selected={isRouteActive('/vov')} className={styles.headerButton}>
                        ВОВ
                    </AppButton>
                    <AppButton to="/add" selected={isRouteActive('/add')} className={styles.headerButton}>
                        Добавить
                    </AppButton>
                </div>

                <div className={styles.authWrap}>
                    {isAuthenticated ? (
                        <AppButton
                            to="/requests"
                            variant="primary"
                            selected={isRouteActive('/requests')}
                            className={styles.headerButton}
                        >
                            Панель администратора
                        </AppButton>
                    ) : null}
                </div>
            </nav>
        </header>
    );
}

export default Header;
