import { Link } from 'react-router-dom'
import styles from './Header.module.css'

import useAuth from '../../../hooks/useAuth'

function Header() {
    const isAuthenticated = useAuth()

    return (
        <header className={styles["header"]}>
            <nav>
                <ul className={styles["nav-list-desktop"]}>
                    <li><Link className='link' to="/">Главная</Link></li>
                    <li><Link className='link' to="/about">О проекте</Link></li>
                    <li><Link className='link' to="/svo">СВО</Link></li>
                    <li><Link className='link' to="/vov">ВОВ</Link></li>
                    <li><Link className='link' to="/add">Добавить</Link></li>
                    {
                        isAuthenticated && <li><Link to="/requests">Панель администратора</Link></li>
                    }
                </ul>
                <div className={styles["nav-mobile"]}>
                    <select className={styles["nav-select"]} onChange={(e) => e.target.value && (window.location.href = e.target.value)}>
                        <option value="">Меню</option>
                        <option value="/">Главная</option>
                        <option value="/about">О проекте</option>
                        <option value="/svo">СВО</option>
                        <option value="/vov">ВОВ</option>
                        <option value="/add">Добавить</option>
                        {isAuthenticated && <option value="/requests">Панель администратора</option>}
                    </select>
                </div>
            </nav>
        </header>
    )
}

export default Header