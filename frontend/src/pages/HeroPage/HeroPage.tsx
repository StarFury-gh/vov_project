import { useParams, Link } from 'react-router-dom'
import styles from './HeroPage.module.css'

const HeroPage = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Герой с ID: {id}</h1>
        <p className={styles.text}>
          Здесь в дальнейшем можно будет вывести подробную информацию о герое:
          биографию, фотографии, награды и другие исторические данные.
        </p>

        <Link to="/" className={styles.backLink}>
          ← Вернуться к списку героев
        </Link>
      </div>
    </main>
  )
}

export default HeroPage

