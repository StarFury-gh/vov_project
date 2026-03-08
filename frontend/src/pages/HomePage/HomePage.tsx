import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './HomePage.module.css'
import HeroCard from '../../components/heroes/HeroCard'
// @ts-expect-error JS module without types
import { fetchHeroes, searchHeroesByName } from '../../api'

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
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [requestsBlocked, setRequestsBlocked] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<HeroFromApi[] | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)

    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    // Флаг для предотвращения множественных запросов при изменении page
    const isLoadingRef = useRef(false)

    const navigate = useNavigate()

    const loadHeroes = useCallback(async () => {
        // Проверяем requestsBlocked и hasMore через ref для актуальности
        if (requestsBlocked || isLoadingRef.current || !hasMore) return

        isLoadingRef.current = true
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
            isLoadingRef.current = false
        }
    }, [page, hasMore, requestsBlocked]) // Убраны лишние зависимости

    // Загрузка при изменении page
    useEffect(() => {
        if (page > 0) { // Не загружаем при первом рендере (page=1)
            loadHeroes()
        }
    }, [page, loadHeroes])

    // Настройка Intersection Observer для бесконечной прокрутки
    useEffect(() => {
        if (requestsBlocked || !hasMore || isLoadingRef.current || searchResults !== null) return

        const node = sentinelRef.current
        if (!node) return

        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        observerRef.current = new IntersectionObserver((entries) => {
            const firstEntry = entries[0]
            // Добавляем дополнительные проверки перед увеличением page
            if (firstEntry.isIntersecting &&
                hasMore &&
                !isLoadingRef.current &&
                !requestsBlocked) {
                setPage((prev) => prev + 1)
            }
        }, {
            threshold: 0.1, // Добавляем порог видимости
        })

        observerRef.current.observe(node)

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [hasMore, requestsBlocked, searchResults]) // Убираем isLoading из зависимостей, используем ref

    const handleReload = () => {
        window.location.reload()
    }

    const handleHeroClick = (id: HeroFromApi['id']) => {
        navigate(`/heroes/${id}`)
    }

    const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const query = searchQuery.trim()
        if (!query) {
            setSearchResults(null)
            setSearchError(null)
            return
        }

        const normalized = query.toLowerCase()

        // Сначала ищем среди уже загруженных героев (в стейте)
        const localMatches = heroes.filter((hero) =>
            hero.full_name.toLowerCase().includes(normalized)
        )

        if (localMatches.length > 0) {
            setSearchResults(localMatches)
            setSearchError(null)
            return
        }

        // Если в стейте не нашли — обращаемся к заглушке на "бэкенде"
        try {
            setIsSearching(true)
            setSearchError(null)

            const remoteMatches = (await searchHeroesByName(query)) as HeroFromApi[]
            setSearchResults(remoteMatches)

            if (remoteMatches.length === 0) {
                setSearchError('Герои с таким именем не найдены')
            }
        } catch (e) {
            const message =
                e instanceof Error ? e.message : 'Ошибка при поиске героя'
            console.log(message)
            setSearchError('Ошибка при поиске героя')
        } finally {
            setIsSearching(false)
        }
    }

    const handleSearchReset = () => {
        setSearchQuery('')
        setSearchResults(null)
        setSearchError(null)
    }

    const heroesToRender = searchResults ?? heroes

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Герои Великой Отечественной войны</h1>
                <p className={styles.subtitle}>
                    Памяти тех, кто защищал Родину. Пролистывайте список, чтобы увидеть
                    больше героев.
                </p>
                <form className={styles.search} onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Найдите героя по имени"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                    />
                    <button
                        type="submit"
                        className={styles.searchButton}
                        disabled={isSearching}
                    >
                        {isSearching ? 'Поиск...' : 'Найти'}
                    </button>
                    {searchResults !== null && (
                        <button
                            type="button"
                            className={styles.resetButton}
                            onClick={handleSearchReset}
                        >
                            Сбросить
                        </button>
                    )}
                </form>
                {searchError && (
                    <p className={styles.searchError}>{searchError}</p>
                )}
            </header>

            <section className={styles.listContainer}>
                <div className={styles.heroList}>
                    {heroesToRender.map((hero) => (
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