import styles from './HeroCard.module.css'
// @ts-expect-error JS module without types
import { STATIC_URL } from '../../../constants'

interface HeroCardProps {
    id: number | string
    fullName: string
    birthDate: string
    deathDate: string
    photoUrl: string
    onClick?: () => void
}

function resolvePhotoUrl(photoUrl: string) {
    // If backend returns absolute URL — use as is
    if (/^https?:\/\//i.test(photoUrl)) return photoUrl

    const trimmed = photoUrl.replace(/^\/+/, '')

    // Back may return "default.webp" or "images/<file>".
    const relativeToImages = trimmed.startsWith('images/')
        ? trimmed.slice('images/'.length)
        : trimmed

    return `${STATIC_URL}/${relativeToImages}`
}

// Карточка героя: крупная фотография, ФИО и даты жизни.
const HeroCard = ({
    fullName,
    birthDate,
    deathDate,
    photoUrl,
    onClick,
}: HeroCardProps) => {
    const firstLetter = fullName.trim().charAt(0).toUpperCase()

    const lifeDates =
        birthDate || deathDate
            ? `${birthDate || '—'} — ${deathDate || '????-??-??'}`
            : undefined

    return (
        <article className={styles.card} onClick={onClick}>
            <div className={styles.photo}>
                {photoUrl ? (
                    <img
                        src={resolvePhotoUrl(photoUrl)}
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
            </div>
        </article>
    )
}

export default HeroCard

