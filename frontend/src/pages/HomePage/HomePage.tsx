import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './HomePage.module.css'
import HeroCard from '../../components/heroes/HeroCard'
// @ts-expect-error JS module without types
import { fetchHeroes } from '../../api'

// Тип героя, который возвращает API
export interface HeroFromApi {
    id: number
    full_name: string
    birth_date: string
    death_date: string
    photo_url: string
}

type HeroesApiResponse =
    | HeroFromApi[]
    | {
        heroes: HeroFromApi[]
        total: number
        skip: number
        limit: number
    }

const PAGE_LIMIT = 10

const HomePage = () => {
    const [heroes, setHeroes] = useState<HeroFromApi[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [requestsBlocked, setRequestsBlocked] = useState(false)

    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    const navigate = useNavigate()

    const loadHeroes = useCallback(async () => {
        if (requestsBlocked || isLoading || !hasMore) return

        setIsLoading(true)
        setError(null)

        try {
            const data = (await fetchHeroes(page, PAGE_LIMIT)) as HeroesApiResponse

            let newHeroes: HeroFromApi[] = []
            let nextHasMore = true

            if (Array.isArray(data)) {
                // API вернул просто массив героев
                newHeroes = data
                nextHasMore = data.length === PAGE_LIMIT
            } else if (data && Array.isArray(data.heroes)) {
                // API вернул объект с полем heroes и метаданными пагинации
                const { heroes: heroesList, total, skip, limit } = data
                newHeroes = heroesList

                if (
                    typeof total === 'number' &&
                    typeof skip === 'number' &&
                    typeof limit === 'number'
                ) {
                    // hasMore на основе total/skip/limit
                    nextHasMore = skip + heroesList.length < total
                } else {
                    nextHasMore = heroesList.length === PAGE_LIMIT
                }
            }

            setHeroes((prev) => [...prev, ...newHeroes])
            setHasMore(nextHasMore)
        } catch (e) {
            const message =
                e instanceof Error ? e.message : 'Ошибка при загрузке героев'
            console.log(message)
            setError("Ошибка при загрузке героев")
            // Если сервер недоступен/ошибка запроса — блокируем дальнейшие запросы.
            setRequestsBlocked(true)
            setHasMore(false)
        } finally {
            setIsLoading(false)
        }
    }, [hasMore, isLoading, page, requestsBlocked])

    useEffect(() => {
        loadHeroes()
    }, [loadHeroes])

    // Настройка Intersection Observer для бесконечной прокрутки
    useEffect(() => {
        if (requestsBlocked || !hasMore || isLoading) return

        const node = sentinelRef.current
        if (!node) return

        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        observerRef.current = new IntersectionObserver((entries) => {
            const firstEntry = entries[0]
            if (firstEntry.isIntersecting && hasMore && !isLoading) {
                setPage((prev) => prev + 1)
            }
        })

        observerRef.current.observe(node)

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [hasMore, isLoading, requestsBlocked])

    const handleReload = () => {
        window.location.reload()
    }

    const handleHeroClick = (id: HeroFromApi['id']) => {
        navigate(`/heroes/${id}`)
    }

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Герои Великой Отечественной войны</h1>
                <p className={styles.subtitle}>
                    Памяти тех, кто защищал Родину. Пролистывайте список, чтобы увидеть
                    больше героев.
                </p>
            </header>

            <section className={styles.listContainer}>
                <div className={styles.heroList}>
                    {heroes.map((hero) => (
                        <HeroCard
                            key={hero.id}
                            id={hero.id}
                            fullName={hero.full_name}
                            birthDate={hero.birth_date}
                            deathDate={hero.death_date}
                            photoUrl={hero.photo_url}
                            onClick={() => handleHeroClick(hero.id)}
                        />
                    ))}
                </div>

                <div ref={sentinelRef} className={styles.sentinel} />

                {isLoading && (
                    <div className={styles.loader}>
                        <div className={styles.spinner} />
                        <span>Загрузка героев...</span>
                    </div>
                )}

                {error && (
                    <div className={styles.errorBox}>
                        <p className={styles.errorText}>
                            {error}
                            {requestsBlocked ? ' (сервер недоступен)' : null}
                        </p>
                        <button type="button" className={styles.retryButton} onClick={handleReload}>
                            Перезагрузить страницу
                        </button>
                    </div>
                )}

                {!hasMore && !isLoading && heroes.length > 0 && (
                    <p className={styles.endMessage}>Больше героев нет.</p>
                )}
            </section>
        </main>
    )
}

export default HomePage

