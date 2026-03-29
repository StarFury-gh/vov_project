import styles from './HeroCard.module.css'
// @ts-expect-error JS module without types
import { STATIC_URL, API_URL } from '../../../constants'
import useAuthCheck from '../../../hooks/useAuth'
import axios from 'axios'

interface HeroCardProps {
    is_admin?: boolean
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
    is_admin,
    fullName,
    birthDate,
    deathDate,
    photoUrl,
    id,
    onClick,
}: HeroCardProps) => {
    const firstLetter = fullName.trim().charAt(0).toUpperCase()

    const auth = useAuthCheck()

    const lifeDates =
        birthDate || deathDate
            ? `${birthDate || '—'} — ${deathDate || '????-??-??'}`
            : undefined

    const deleteHero = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        console.log("auth:", auth)
        if (auth) {
            const url = API_URL + `/heroes/${id}`
            const token = sessionStorage.getItem('access_token')
            try {
                await axios.delete(url, {
                    headers: {
                        Authorization: token
                    }
                })
                alert("Герой удалён")
            } catch (error) {
                console.error(error)
                alert("Герой уже удалён")
            }
        }
    }

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
            {
                is_admin &&
                <div className={styles["admin-btns"]}>
                    <button onClick={e => deleteHero(e)} className={styles["delete-btn"]}>Удалить</button>
                </div>
            }
        </article>
    )
}

export default HeroCard

