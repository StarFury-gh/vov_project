import { Link, useNavigate } from 'react-router-dom';

import styles from './HomePage.module.css';

function HomePage() {

    const navigate = useNavigate()

    return (
        <div className={styles['home-page']}>
            <h1 className={styles['home-page__title']}>Справочник героев СВО и ВОВ</h1>
            <section>
                <div className={styles['home-page__content-block']} onClick={() => navigate("/about")}>
                    <img
                        src="/docs.jpeg"
                        alt="/docs.jpeg"
                        className={styles['home-page__content-block-img']}
                    />
                    <div className={styles['home-page__content-block-text']}>
                        <h2 className={styles['home-page__content-block-title']}>Цель проекта</h2>
                        <p className={styles['home-page__content-block-description']}>«Никто не забыт, ничто не забыто» — для нас это не просто строка из стихотворения, а ежедневный труд.</p>
                        <Link className={styles["link"]} to="/about">Подробнее</Link>
                    </div>
                </div>
                <div className={styles['home-page__content-block']} onClick={() => navigate("/vov")}>
                    <img src="/vov.jpeg" alt="" className={styles['home-page__content-block-img']} />
                    <div className={styles['home-page__content-block-text']}>
                        <h2 className={styles['home-page__content-block-title']}>Инфомарция о Героях Великой Отечественной Войны</h2>
                        <Link className={styles["link"]} to="/vov">Перейти</Link>
                    </div>
                </div>
                <div className={styles['home-page__content-block']} onClick={() => navigate("/svo")}>
                    <img src="/svo.jpeg" alt="" className={styles['home-page__content-block-img']} />
                    <div className={styles['home-page__content-block-text']}>
                        <h2 className={styles['home-page__content-block-title']}>Информация о Героях Специальной Военной Операции</h2>
                        <Link className={styles["link"]} to="/svo">Перейти</Link>
                    </div>
                </div>
                <div className={styles['home-page__content-block']} onClick={() => navigate("/about")}>
                    <img src="/lenta.jpeg" alt="" className={styles['home-page__content-block-img']} />
                    <div className={styles['home-page__content-block-text']}>
                        <h2 className={styles['home-page__content-block-title']}>О нас</h2>
                        <p className={styles['home-page__content-block-description']}>Читайте подробнее</p>
                        <Link className={styles["link"]} to={"/about"}>Читать</Link>
                    </div>
                </div>
                <div className={styles['home-page__content-block']} onClick={() => navigate("/add")}>
                    <img src="/lenta.jpeg" alt="" className={styles['home-page__content-block-img']} />
                    <div className={styles['home-page__content-block-text']}>
                        <h2 className={styles['home-page__content-block-title']}>Вы можете добавить информацию о герое, которого нет на нашем сайте</h2>
                        <Link className={styles["link"]} to={"/add"}>Добавить</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage
