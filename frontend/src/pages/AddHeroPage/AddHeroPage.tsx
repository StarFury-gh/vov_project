import styles from './AddHeroPage.module.css'
import AddHeroForm from '../../components/admin/AddHeroForm'
import { AppButton } from '../../components/common/buttons'

import AllAwardsList from '../../components/awards/AllAwards'
import AllRanksList from '../../components/ranks/AllRanks'

const AdminPage = () => {
    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Добавление героя</h1>
                <AppButton to="/" variant="secondary" className={styles.backButton}>
                    ← На главную
                </AppButton>
            </header>

            <section className={styles.formsSection}>
                <div className={styles.formCard}>
                    <AddHeroForm />
                </div>
            </section>
            <section className={styles.formsSection}>
                <AllAwardsList />
                <AllRanksList />
            </section>
        </main>
    )
}

export default AdminPage
