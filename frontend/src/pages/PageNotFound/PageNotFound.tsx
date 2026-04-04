import styles from './PageNotFound.module.css';
import { AppButton } from '../../components/common/buttons';

function PageNotFound() {
    return (
        <main className={styles["page-not-found"]}>
            <div className={styles.container}>
                <h1 className={styles["error-code"]}>404</h1>
                <p className={styles["error-message"]}>Страница не найдена</p>
                <p className={styles["error-description"]}>К сожалению, запрашиваемая страница не существует или была перемещена.</p>
                <AppButton
                    to="/"
                    variant="primary"
                    showChevrons={false}
                    className={styles['home-page__content-link']}
                >
                    Вернуться на главную
                </AppButton>
            </div>
        </main>
    );
}

export default PageNotFound;