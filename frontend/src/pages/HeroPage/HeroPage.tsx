import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import styles from './HeroPage.module.css'
// @ts-expect-error JS module without types
import { fetchHero } from '../../api'
// @ts-expect-error JS module without types
import { STATIC_URL } from '../../constants'

interface HeroPlace {
    name: string
    latitude: number
    longtitude: number
}

interface HeroFromApi {
    id: number
    full_name: string
    birth_date: string | null
    death_date: string | null
    photo_url: string
    biography: string | null
    awards: string[]
    rank: string | null
    place: HeroPlace | null
}

function resolvePhotoUrl(photoUrl?: string) {
    if (!photoUrl) return ''
    if (/^https?:\/\//i.test(photoUrl)) return photoUrl

    const trimmed = photoUrl.replace(/^\/+/, '')
    const relativeToImages = trimmed.startsWith('images/')
        ? trimmed.slice('images/'.length)
        : trimmed

    return `${STATIC_URL}/${relativeToImages}`
}

function buildMapUrl(latitude?: number, longitude?: number) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return ''
    }

    const delta = 0.02
    return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}&layer=mapnik&marker=${latitude},${longitude}`
}

const HeroPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [heroData, setHeroData] = useState<HeroFromApi>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('Не удалось определить идентификатор героя.')
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const data = await fetchHero(id)
                setHeroData(data)
            } catch (fetchError) {
                console.error(fetchError)
                setError('Не удалось загрузить профиль героя. Попробуйте обновить страницу.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [id])

    const lifeDates = useMemo(() => {
        if (!heroData) return ''
        return `${heroData.birth_date ?? '—'} — ${heroData.death_date ?? '—'}`
    }, [heroData])

    const biographyParagraphs = useMemo(() => {
        const biography = heroData?.biography ?? ''
        return biography
            .split(/\n+/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
    }, [heroData?.biography])

    const mapUrl = useMemo(
        () => buildMapUrl(heroData?.place?.latitude, heroData?.place?.longtitude),
        [heroData?.place?.latitude, heroData?.place?.longtitude]
    )

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <nav className={styles.breadcrumbs} aria-label="Навигация по странице героя">
                    <button
                        type="button"
                        className={styles.backLink}
                        onClick={() => navigate(-1)}
                    >
                        ← Вернуться к списку героев
                    </button>
                </nav>

                {isLoading ? (
                    <section className={styles.statusCard}>
                        <p className={styles.statusText}>Загрузка профиля героя...</p>
                    </section>
                ) : null}

                {!isLoading && (error || !heroData) ? (
                    <section className={styles.statusCard}>
                        <h1 className={styles.statusTitle}>Профиль временно недоступен</h1>
                        <p className={styles.statusText}>{error ?? 'Данные героя не найдены.'}</p>
                    </section>
                ) : null}

                {!isLoading && !error && heroData ? (
                    <>
                        <section className={styles.profileCard} aria-labelledby="hero-profile-title">
                            <div className={styles.profileGrid}>
                                <header className={styles.heroHeader}>
                                    <h1 id="hero-profile-title" className={styles.title}>
                                        {heroData.full_name}
                                    </h1>
                                    <p className={styles.lifeDates}>{lifeDates}</p>
                                </header>

                                <aside className={styles.mediaColumn}>
                                    <div className={styles.portraitWrap}>
                                        {heroData.photo_url ? (
                                            <img
                                                className={styles.portrait}
                                                src={resolvePhotoUrl(heroData.photo_url)}
                                                alt={heroData.full_name}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className={styles.portraitFallback} aria-hidden="true">
                                                {heroData.full_name.trim().charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <p className={styles.rankBadge}>
                                        Ранг: {heroData.rank ?? 'не указан'}
                                    </p>
                                </aside>

                                <div className={styles.contentColumn}>
                                    <section className={styles.section} aria-labelledby="hero-biography-title">
                                        <h2 id="hero-biography-title" className={styles.sectionTitle}>
                                            Биография
                                        </h2>
                                        <div className={styles.biography}>
                                            {biographyParagraphs.length > 0 ? (
                                                biographyParagraphs.map((paragraph, index) => (
                                                    <p key={index} className={styles.paragraph}>
                                                        {paragraph}
                                                    </p>
                                                ))
                                            ) : (
                                                <p className={styles.paragraph}>
                                                    Биографические сведения пока не добавлены.
                                                </p>
                                            )}
                                        </div>
                                    </section>

                                    {heroData.awards?.length ? (
                                        <section className={styles.section} aria-labelledby="hero-awards-title">
                                            <h3 id="hero-awards-title" className={styles.sectionTitle}>
                                                Награды
                                            </h3>
                                            <ul className={styles.awardsList}>
                                                {heroData.awards.map((award, index) => (
                                                    <li key={`${award}-${index}`} className={styles.awardItem}>
                                                        {award}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    ) : null}
                                </div>
                            </div>
                        </section>

                        <section className={styles.mapCard} aria-labelledby="hero-map-title">
                            <h2 id="hero-map-title" className={styles.mapTitle}>
                                Места, связанные с героем
                            </h2>
                            <p className={styles.mapAddress}>
                                {heroData.place?.name ?? 'Место, связанное с героем, не указано.'}
                            </p>

                            {mapUrl ? (
                                <iframe
                                    className={styles.mapFrame}
                                    title={`Карта: ${heroData.full_name}`}
                                    src={mapUrl}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            ) : (
                                <div className={styles.mapPlaceholder}>
                                    <span className={styles.mapPlaceholderIcon} aria-hidden="true">
                                        ⌖
                                    </span>
                                    <p className={styles.mapPlaceholderText}>
                                        Координаты не добавлены, карта недоступна.
                                    </p>
                                </div>
                            )}
                        </section>
                    </>
                ) : null}
            </div>
        </main>
    )
}

export default HeroPage
