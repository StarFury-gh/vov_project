import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
    return (
        <header className={styles["header"]}>
            <nav>
                <ul className={styles["nav-list"]}>
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/about">О проекте</Link></li>
                    <li><Link to="/svo">СВО</Link></li>
                    <li><Link to="/vov">ВОВ</Link></li>
                    <li><Link to="/add">Добавить</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;