import styles from './AboutPage.module.css';

import { Link } from 'react-router-dom';

function AboutPage() {
    return (
        <div className={styles['about-page']}>
            <h1 className={styles['about-page__title']}>Страница "О нас"</h1>
            <section className={styles['about-page__section']}>
                <h2>
                    Цель проекта
                </h2>
                <p>
                    Проект 'Справочник по героям ВОВ и СВО' создан для того, чтобы объединить два величайших эпопеи в истории нашей страны: Великую Отечественную войну и Специальную военную операцию. Мы видим прямую преемственность: солдат Победы 1945 года и боец СВО — это звенья одной цепи, защитники одного Отечества.
                </p>
                <label>
                    На страницах нашего сайта вы можете найти:
                    <ul>
                        <li>
                            <Link to="/vov">Информацию о героях Великой Отечественной Войны</Link>
                        </li>
                        <li>
                            <Link to="/svo">Информацию о героях Специальной Военной Операции</Link>
                        </li>
                    </ul>
                </label>
            </section>
            <section className={styles['about-page__section']}>
                <h2 className={styles['about-page__section-title']}>Авторы проекта</h2>
                {/* Авторы будут позже*/}
                <ul>
                    <li>
                        Научный руководитель - Шамышева Ольга Николаевна
                    </li>
                    <li>
                        Разработка портала - Елисеев Владимир (ИРсп-124)
                    </li>
                    <li>
                        Поиск информации - Куртыжов Егор (ИРсп-124)
                    </li>
                    <li>
                        Поиск информации - Аношенко Артём (ИРсп-124)
                    </li>
                </ul>
            </section>
            <section className={styles['about-page__section']}>
                <h2 className={styles['about-page__section-title']}>Контакты</h2>
                <div>
                    <ul className={styles['about-page__contact-list']}>
                        <li className={styles['about-page__contact-item']}>kitp@mail.ru</li>
                        <li className={styles['about-page__contact-item']}>8 (492) 247-96-96</li>
                        <li className={styles['about-page__contact-item']}>ул. Горького, 87, Владимир, Владимирская обл., 600026</li>
                    </ul>
                </div>
            </section>
        </div >
    )
}

export default AboutPage