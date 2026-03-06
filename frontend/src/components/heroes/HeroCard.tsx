import styles from './HeroCard.module.css'

interface HeroCardProps {
  id: number | string
  name: string
  lifeDates?: string
  rank?: string
  image?: string
  onClick?: () => void
}

// Карточка героя: крупная фотография, ФИО, даты жизни и звание.
const HeroCard = ({ name, lifeDates, rank, image, onClick }: HeroCardProps) => {
  const firstLetter = name.trim().charAt(0).toUpperCase()

  return (
    <article className={styles.card} onClick={onClick}>
      <div className={styles.photo}>
        {image ? (
          <img
            src={image}
            alt={name}
            className={styles.photoImage}
            loading="lazy"
          />
        ) : (
          <span>{firstLetter || '?'}</span>
        )}
      </div>

      <div className={styles.content}>
        <h2 className={styles.name}>{name}</h2>
        {lifeDates && <p className={styles.dates}>{lifeDates}</p>}
        {rank && <p className={styles.rank}>{rank}</p>}
      </div>
    </article>
  )
}

export default HeroCard

