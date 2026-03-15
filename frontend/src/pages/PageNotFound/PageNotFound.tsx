import styles from './PageNotFound.module.css';

function PageNotFound() {
    return (
        <div className={styles["page-not-found"]}>
            <h1 className={styles["error-code"]}>404</h1>
            <p className={styles["error-message"]}>Страница не найдена</p>
            <a href="/" className={styles["home-link"]}>Вернуться на главную</a>
        </div>
    );
}

export default PageNotFound;