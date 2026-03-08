import { Link } from 'react-router-dom'
import styles from './AdminPage.module.css'
import AddHeroForm from '../../components/admin/AddHeroForm'
import AddRankForm from '../../components/admin/AddRankForm'
import AddAwardForm from '../../components/admin/AddAwardForm'

import AllAwardsList from '../../components/awards/AllAwards'
import AllRanksList from '../../components/ranks/AllRanks'

const AdminPage = () => {
    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Панель администратора</h1>
                <Link to="/" className={styles.backLink}>
                    ← На главную
                </Link>
            </header>

            <section className={styles.formsSection}>
                <div className={styles.formCard}>
                    <AddHeroForm />
                </div>
                <div className={styles.formCard}>
                    <AddRankForm />
                </div>
                <div className={styles.formCard}>
                    <AddAwardForm />
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
