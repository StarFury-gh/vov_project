import { Link } from 'react-router-dom';
import styles from './Header.module.css';

import useAuth from '../../../hooks/useAuth';

function Header() {
    const isAuthenticated = useAuth();
    return (
        <header className={styles["header"]}>
            <nav>
                <ul className={styles["nav-list"]}>
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/about">О проекте</Link></li>
                    <li><Link to="/svo">СВО</Link></li>
                    <li><Link to="/vov">ВОВ</Link></li>
                    <li><Link to="/add">Добавить</Link></li>
                    {
                        isAuthenticated && <li><Link to="/requests">Панель администратора</Link></li>
                    }
                </ul>
            </nav>
        </header>
    );
}

export default Header;