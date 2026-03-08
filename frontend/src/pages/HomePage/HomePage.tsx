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

// Тип ответа от API для поиска
interface SearchResponse {
    items: HeroFromApi[]
    total: number
    skip: number
    limit: number
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

    // Состояния для поиска
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchMode, setIsSearchMode] = useState(false)
    const [searchResults, setSearchResults] = useState<HeroFromApi[]>([])
    const [searchPage, setSearchPage] = useState(0)
    const [searchHasMore, setSearchHasMore] = useState(true)
    const [searchTotal, setSearchTotal] = useState(0)
    const [isSearching, setIsSearching] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)

    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    // Флаг для предотвращения множественных запросов
    const isLoadingRef = useRef(false)

    const navigate = useNavigate()

    // Загрузка обычных героев
    const loadHeroes = useCallback(async () => {
        if (requestsBlocked || isLoadingRef.current || !hasMore || isSearchMode) return

        isLoadingRef.current = true
        setIsLoading(true)
        setError(null)

        try {
            const data = (await fetchHeroes(page, PAGE_LIMIT)) as HeroesApiResponse

            let newHeroes: HeroFromApi[] = []
            let nextHasMore = true

            if (Array.isArray(data)) {
                newHeroes = data
                nextHasMore = data.length === PAGE_LIMIT
            } else if (data && Array.isArray(data.heroes)) {
                const { heroes: heroesList, total, skip, limit } = data
                newHeroes = heroesList

                if (
                    typeof total === 'number' &&
                    typeof skip === 'number' &&
                    typeof limit === 'number'
                ) {
                    nextHasMore = skip + heroesList.length < total
                } else {
                    nextHasMore = heroesList.length === PAGE_LIMIT
                }
            }

            setHeroes((prev) => [...prev, ...newHeroes])
            setHasMore(nextHasMore)
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Ошибка при загрузке героев'
            console.log(message)
            setError("Ошибка при загрузке героев")
            setRequestsBlocked(true)
            setHasMore(false)
        } finally {
            setIsLoading(false)
            isLoadingRef.current = false
        }
    }, [page, hasMore, requestsBlocked, isSearchMode])

    // Загрузка результатов поиска с пагинацией
    const loadSearchResults = useCallback(async () => {
        if (!isSearchMode || isLoadingRef.current || !searchHasMore || !searchQuery.trim()) return

        isLoadingRef.current = true
        setIsLoading(true)
        setSearchError(null)

        try {
            // Для поиска используем следующую страницу (searchPage + 1, так как searchPage начинается с 0)
            const currentPage = searchPage + 1
            const response = await searchHeroesByName(searchQuery, currentPage, PAGE_LIMIT) as SearchResponse

            const newItems = response.items ?? []

            setSearchResults((prev) => [...prev, ...newItems])
            setSearchTotal(response.total)

            // Проверяем, есть ли еще элементы для загрузки
            const nextHasMore = response.skip + newItems.length < response.total
            setSearchHasMore(nextHasMore)

            // Если это первая страница и нет результатов, показываем сообщение
            if (currentPage === 1 && newItems.length === 0) {
                setSearchError('Герои с таким именем не найдены')
            }
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Ошибка при поиске героя'
            console.log(message)
            setSearchError('Ошибка при поиске героя')
        } finally {
            setIsLoading(false)
            isLoadingRef.current = false
        }
    }, [isSearchMode, searchPage, searchHasMore, searchQuery])

    // Эффект для загрузки обычных героев
    useEffect(() => {
        if (page > 0 && !isSearchMode) {
            loadHeroes()
        }
    }, [page, loadHeroes, isSearchMode])

    // Эффект для загрузки результатов поиска
    useEffect(() => {
        if (searchPage > 0 && isSearchMode) {
            loadSearchResults()
        }
    }, [searchPage, loadSearchResults, isSearchMode])

    // Настройка Intersection Observer для бесконечной прокрутки
    useEffect(() => {
        if (requestsBlocked || isLoadingRef.current) return

        const node = sentinelRef.current
        if (!node) return

        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        observerRef.current = new IntersectionObserver((entries) => {
            const firstEntry = entries[0]
            if (firstEntry.isIntersecting) {
                if (isSearchMode) {
                    // В режиме поиска используем searchHasMore
                    if (searchHasMore && !isLoadingRef.current) {
                        setSearchPage((prev) => prev + 1)
                    }
                } else {
                    // В обычном режиме используем hasMore
                    if (hasMore && !isLoadingRef.current) {
                        setPage((prev) => prev + 1)
                    }
                }
            }
        }, {
            threshold: 0.1,
        })

        observerRef.current.observe(node)

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [hasMore, searchHasMore, requestsBlocked, isSearchMode])

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
            resetSearch()
            return
        }

        try {
            setIsSearching(true)
            setSearchError(null)

            // Переключаемся в режим поиска и сбрасываем результаты
            setIsSearchMode(true)
            setSearchResults([])
            setSearchPage(0)
            setSearchHasMore(true)

            // Загружаем первую страницу поиска
            const response = await searchHeroesByName(query, 1, PAGE_LIMIT) as SearchResponse
            const items = response.items ?? []

            setSearchResults(items)
            setSearchTotal(response.total)
            setSearchHasMore(response.skip + items.length < response.total)

            if (items.length === 0) {
                setSearchError('Герои с таким именем не найдены')
            }

            // Сбрасываем обычный список
            setHeroes([])
            setPage(0)
            setHasMore(true)

        } catch (e) {
            const message = e instanceof Error ? e.message : 'Ошибка при поиске героя'
            console.log(message)
            setSearchError('Ошибка при поиске героя')
            setIsSearchMode(false)
        } finally {
            setIsSearching(false)
        }
    }

    const resetSearch = () => {
        setSearchQuery('')
        setIsSearchMode(false)
        setSearchResults([])
        setSearchPage(0)
        setSearchHasMore(true)
        setSearchTotal(0)
        setSearchError(null)
        // Сбрасываем основной список
        setPage(0)
        setHeroes([])
        setHasMore(true)
        setRequestsBlocked(false)
    }

    const handleSearchReset = () => {
        resetSearch()
    }

    // Определяем, что отображать
    const heroesToRender = isSearchMode ? searchResults : heroes
    const currentHasMore = isSearchMode ? searchHasMore : hasMore
    const currentLoading = isLoading
    // const currentError = isSearchMode ? searchError : error
    const showEndMessage = !currentHasMore && !currentLoading && heroesToRender.length > 0

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
                    {isSearchMode && (
                        <button
                            type="button"
                            className={styles.resetButton}
                            onClick={handleSearchReset}
                        >
                            Сбросить
                        </button>
                    )}
                </form>
                {searchError && isSearchMode && (
                    <p className={styles.searchError}>{searchError}</p>
                )}
                {isSearchMode && searchTotal > 0 && (
                    <p className={styles.searchInfo}>
                        Найдено героев: {searchTotal}
                    </p>
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

                {currentLoading && (
                    <div className={styles.loader}>
                        <div className={styles.spinner} />
                        <span>Загрузка героев...</span>
                    </div>
                )}

                {error && !isSearchMode && (
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

                {showEndMessage && (
                    <p className={styles.endMessage}>
                        {isSearchMode ? 'Больше результатов поиска нет.' : 'Больше героев нет.'}
                    </p>
                )}
            </section>
        </main>
    )
}

export default HomePage