import styles from './HeroCard.module.css'

interface HeroCardProps {
  id: number | string
  fullName: string
  birthDate: string
  deathDate: string
  photoUrl: string
  rankName?: string
  summaryInfo?: string
  onClick?: () => void
}

// Карточка героя: крупная фотография, ФИО, даты жизни и звание.
const HeroCard = ({
  fullName,
  birthDate,
  deathDate,
  photoUrl,
  rankName,
  onClick,
}: HeroCardProps) => {
  const firstLetter = fullName.trim().charAt(0).toUpperCase()

  const lifeDates =
    birthDate || deathDate
      ? `${birthDate || '—'} — ${deathDate || 'н/д'}`
      : undefined

  return (
    <article className={styles.card} onClick={onClick}>
      <div className={styles.photo}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={fullName}
            className={styles.photoImage}
            loading="lazy"
          />
        ) : (
          <span>{firstLetter || '?'}</span>
        )}
      </div>

      <div className={styles.content}>
        <h2 className={styles.name}>{fullName}</h2>
        {lifeDates && <p className={styles.dates}>{lifeDates}</p>}
        {rankName && <p className={styles.rank}>{rankName}</p>}
      </div>
    </article>
  )
}

export default HeroCard

