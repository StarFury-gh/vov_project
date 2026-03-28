import styles from './RequestCard.module.css'
// @ts-expect-error JS module without types
import { STATIC_URL, API_URL } from '../../../constants'
import axios from 'axios'
import { useState } from 'react'

interface RequestCardProps {
    id: number,
    full_name: string,
    birth_date: string,
    death_date: string,
    photo_url: string,
    biography: string,
    awards: string,
    rank: string,
    status: string,
    w_type: string
}

function resolvePhotoUrl(photoUrl: string) {
    if (/^https?:\/\//i.test(photoUrl)) return photoUrl

    const trimmed = photoUrl.replace(/^\/+/, '')

    const relativeToImages = trimmed.startsWith('images/')
        ? trimmed.slice('images/'.length)
        : trimmed

    return `${STATIC_URL}/${relativeToImages}`
}

function RequestCard(props: RequestCardProps) {
    const [status, setStatus] = useState(props.status)

    const awards = props.awards ? JSON.parse(props.awards) : []

    const handleAccept = async () => {
        const accessToken = sessionStorage.getItem('access_token')
        if (accessToken) {
            console.log(`Заявка ${props.id} подтверждена`)
            setStatus('approved')
            const params = new URLSearchParams({ status: "approved" })
            const url = API_URL + `/requests/${props.id}?${params.toString()}`

            await axios.patch(url, {}, {
                headers: {
                    Authorization: accessToken
                }
            })
        }
    }

    const handleReject = async () => {
        const accessToken = sessionStorage.getItem('access_token')
        if (accessToken) {
            console.log(`Заявка ${props.id} отклонена`)
            setStatus('rejected')
            const params = new URLSearchParams({ status: "rejected" })
            const url = API_URL + `/requests/${props.id}?${params.toString()}`

            await axios.patch(url, {}, {
                headers: {
                    Authorization: accessToken
                }
            })
        }
    }

    const lifeDates =
        props.birth_date || props.death_date
            ? `${props.birth_date || '—'} — ${props.death_date || '????-??-??'}`
            : undefined

    return (
        <div className={styles['request-card']}>
            <div className={styles['request-card__photo']}>
                {props.photo_url ? (
                    <img
                        src={resolvePhotoUrl(props.photo_url)}
                        alt={props.full_name}
                        className={styles['request-card__photo-image']}
                        loading="lazy"
                    />
                ) : (
                    <span>{props.full_name.trim().charAt(0).toUpperCase() || '?'}</span>
                )}
            </div>

            <div className={styles['request-card__content']}>
                <h3 className={styles['request-card__name']}>{props.full_name}</h3>

                {lifeDates && (
                    <p className={styles['request-card__dates']}>{lifeDates}</p>
                )}

                <p className={styles['request-card__w_type']}>{props.w_type}</p>

                <p className={styles['request-card__biography']}>{props.biography}</p>

                <p className={styles['request-card__rank']}>{props.rank}</p>

                <div className={`${styles['request-card__status']} ${styles[`request-card__status_${status}`] || styles['request-card__status_new']}`}>
                    {status === 'new' && 'Новая'}
                    {status === 'approved' && 'Подтверждена'}
                    {status === 'rejected' && 'Отклонена'}
                </div>

                <div className={styles['request-card__awards']}>
                    {Array.isArray(awards) && awards.length > 0 ? (
                        awards.map((award, index) => (
                            <span key={index} className={styles['request-card__award-item']}> {award} </span>
                        ))
                    ) : (
                        <span>Нет наград</span>
                    )}
                </div>

                {/* Кнопки отображаются только если статус 'new' */}
                {status === 'new' && (
                    <div className={styles['request-card__actions']}>
                        <button
                            className={`${styles['request-card__button']} ${styles['request-card__button_accept']}`}
                            onClick={handleAccept}
                        >
                            Подтвердить
                        </button>
                        <button
                            className={`${styles['request-card__button']} ${styles['request-card__button_reject']}`}
                            onClick={handleReject}
                        >
                            Отклонить
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RequestCard