import styles from './Footer.module.css'
import { AppButton } from '../buttons'

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <section className={styles.contacts}>
                    <h2 className={styles.title}>Контакты</h2>
                    <ul className={styles.list}>
                        <li>kitp@mail.ru</li>
                        <li>8 (492) 247-96-96</li>
                        <li>ул. Горького, 87, Владимир, Владимирская обл., 600026</li>
                    </ul>
                </section>

                <AppButton
                    to='/admin'
                    type="button"
                    variant="primary"
                    className={styles.authButton}
                    icon={<span className={styles.authIcon} aria-hidden="true" />}
                >
                    Авторизация для администратора
                </AppButton>
            </div>
        </footer>
    )
}

export default Footer
