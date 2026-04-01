import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './HeroesScroller.module.css'

import HeroCard from '../HeroCard'
import AwardsFilter from '../../awards/AwardsFilter'
import RanksFilter from '../../ranks/RanksFilter'
import { AppButton } from '../../common/buttons'

// @ts-expect-error JS module without types
import { fetchHeroes, searchHeroesByName } from '../../../api'

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

interface ScrollerProps {
    type: 'vov' | 'svo',
    is_admin?: boolean
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


function HeroesScroller(props: Readonly<ScrollerProps>) {
    const [heroes, setHeroes] = useState<HeroFromApi[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [requestsBlocked, setRequestsBlocked] = useState(false)

    const [awardFilter, setAwardFilter] = useState<string>("")
    const [rankFilter, setRankFilter] = useState<string>("")

    // Состояния для поиска
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchMode, setIsSearchMode] = useState(false)
    const [searchResults, setSearchResults] = useState<HeroFromApi[]>([])
    const [searchPage, setSearchPage] = useState(0)
    const [searchHasMore, setSearchHasMore] = useState(true)
    const [searchTotal, setSearchTotal] = useState(0)
    const [isSearching, setIsSearching] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [title, setTitle] = useState<string>("Великой Отечественной Войны")

    useEffect(() => {
        if (props.type === 'vov') {
            setTitle("Великой Отечественной Войны")
        } else {
            setTitle("Специальной Военной Операции")
        }
    }, [props.type])

    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    // Флаг для предотвращения множественных запросов
    const isLoadingRef = useRef(false)
    // Ref для отслеживания последней загруженной страницы в обычном режиме
    const lastLoadedPageRef = useRef<number>(0)
    // Ref для отслеживания последней загруженной страницы в режиме поиска
    const lastLoadedSearchPageRef = useRef<number>(0)

    const navigate = useNavigate()

    // Загрузка обычных героев
    const loadHeroes = useCallback(async () => {
        // Добавляем проверку на режим поиска
        if (isSearchMode) {
            return
        }

        if (requestsBlocked || isLoadingRef.current || !hasMore) {
            return
        }

        // Предотвращаем загрузку той же страницы дважды
        if (lastLoadedPageRef.current === page) {
            return
        }

        isLoadingRef.current = true
        setIsLoading(true)
        setError(null)

        try {
            // API ожидает страницу начиная с 1
            const apiPage = page

            const data = await fetchHeroes(
                apiPage,
                PAGE_LIMIT,
                awardFilter,
                rankFilter,
            ) as HeroesApiResponse

            let newHeroes: HeroFromApi[] = []
            let nextHasMore = true

            if (Array.isArray(data)) {
                newHeroes = data
                nextHasMore = data.length === PAGE_LIMIT
            } else if (data && Array.isArray(data.heroes)) {
                const { heroes: heroesList, total, skip } = data
                newHeroes = heroesList
                nextHasMore = skip + heroesList.length < total
            }

            if (newHeroes.length > 0) {
                setHeroes((prev) => {
                    const updated = [...prev, ...newHeroes]
                    return updated
                })
                // Запоминаем, что эта страница загружена
                lastLoadedPageRef.current = page
            } else {
                nextHasMore = false
            }

            setHasMore(nextHasMore)
        } catch {
            setError("Ошибка при загрузке героев")
            setRequestsBlocked(true)
            setHasMore(false)
        } finally {
            setIsLoading(false)
            isLoadingRef.current = false
        }
    }, [page, hasMore, requestsBlocked, isSearchMode, awardFilter, rankFilter])

    // Загрузка результатов поиска
    const loadSearchResults = useCallback(async () => {
        // Добавляем проверку, что мы в режиме поиска
        if (!isSearchMode) {
            return
        }

        if (isLoadingRef.current || !searchHasMore || !searchQuery.trim()) {
            return
        }

        // Предотвращаем загрузку той же страницы дважды
        if (lastLoadedSearchPageRef.current === searchPage) {
            return
        }

        isLoadingRef.current = true
        setIsLoading(true)
        setSearchError(null)

        try {
            // Для поиска используем следующую страницу (searchPage + 1, так как searchPage начинается с 0)
            const currentPage = searchPage + 1

            const response = await searchHeroesByName(searchQuery, currentPage, PAGE_LIMIT, props.type) as SearchResponse

            const newItems = response.items ?? []

            setSearchResults((prev) => [...prev, ...newItems])
            setSearchTotal(response.total)

            // Проверяем, есть ли еще элементы для загрузки
            const nextHasMore = response.skip + newItems.length < response.total
            setSearchHasMore(nextHasMore)

            // Запоминаем, что эта страница загружена
            lastLoadedSearchPageRef.current = searchPage

            // Если это первая страница и нет результатов, показываем сообщение
            if (currentPage === 1 && newItems.length === 0) {
                setSearchError('Герои с таким именем не найдены')
            }
        } catch {
            setSearchError('Ошибка при поиске героя')
        } finally {
            setIsLoading(false)
            isLoadingRef.current = false
        }
    }, [isSearchMode, searchPage, searchHasMore, searchQuery])

    // Эффект для загрузки обычных героев при изменении страницы
    useEffect(() => {

        if (page > 0 && !isSearchMode && hasMore && !isLoadingRef.current) {
            if (lastLoadedPageRef.current !== page) {
                loadHeroes()
            }
        }
    }, [page, loadHeroes, isSearchMode, hasMore])

    // Эффект для загрузки результатов поиска при изменении страницы поиска
    useEffect(() => {
        if (searchPage > 0 && isSearchMode && searchHasMore && !isLoadingRef.current) {
            if (lastLoadedSearchPageRef.current !== searchPage) {
                loadSearchResults()
            }
        }
    }, [searchPage, loadSearchResults, isSearchMode, searchHasMore])

    // Эффект для перезагрузки героев при изменении фильтров
    useEffect(() => {
        if (!isSearchMode) {
            // Сбрасываем состояние при изменении фильтров
            setHeroes([])
            setPage(0)
            setHasMore(true)
            setRequestsBlocked(false)
            setError(null)
            lastLoadedPageRef.current = 0

            // Загружаем первую страницу с новыми фильтрами
            const loadFirstPage = async () => {
                if (isLoadingRef.current) return

                isLoadingRef.current = true
                setIsLoading(true)

                try {
                    const data = await fetchHeroes(
                        1,
                        PAGE_LIMIT,
                        awardFilter,
                        rankFilter,
                        props.type
                    ) as HeroesApiResponse

                    let newHeroes: HeroFromApi[] = []
                    let nextHasMore = true

                    if (Array.isArray(data)) {
                        newHeroes = data
                        nextHasMore = data.length === PAGE_LIMIT
                    } else if (data && Array.isArray(data.heroes)) {
                        const { heroes: heroesList, total, skip } = data
                        newHeroes = heroesList
                        nextHasMore = skip + heroesList.length < total
                    }

                    setHeroes(newHeroes)
                    setHasMore(nextHasMore)
                    setPage(1) // Устанавливаем текущую страницу как 1
                    lastLoadedPageRef.current = 1 // Отмечаем, что страница 1 загружена
                } catch {
                    setError("Ошибка при загрузке героев")
                    setRequestsBlocked(true)
                    setHasMore(false)
                } finally {
                    setIsLoading(false)
                    isLoadingRef.current = false
                }
            }

            loadFirstPage()
        }
    }, [awardFilter, rankFilter, isSearchMode])

    // Intersection Observer
    useEffect(() => {
        if (requestsBlocked) return

        const node = sentinelRef.current
        if (!node) {
            return
        }

        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        observerRef.current = new IntersectionObserver((entries) => {
            const firstEntry = entries[0]
            console.log('Intersection Observer сработал:', {
                isIntersecting: firstEntry.isIntersecting,
                intersectionRatio: firstEntry.intersectionRatio,
                isLoading: isLoadingRef.current,
                hasMore,
                searchHasMore,
                isSearchMode
            })

            if (firstEntry.isIntersecting && firstEntry.intersectionRatio > 0) {
                if (isSearchMode) {
                    if (searchHasMore && !isLoadingRef.current) {
                        setSearchPage((prev) => {
                            const nextPage = prev + 1
                            return nextPage
                        })
                    }
                } else if (hasMore && !isLoadingRef.current) {
                    setPage((prev) => {
                        const nextPage = prev + 1
                        return nextPage
                    })
                }
            }
        }, {
            threshold: 0.1,
            rootMargin: '50px',
        })

        observerRef.current.observe(node)

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [hasMore, searchHasMore, requestsBlocked, isSearchMode])

    const handleReload = () => {
        globalThis.location.reload()
    }

    const handleHeroClick = (id: HeroFromApi['id']) => {
        navigate(`/heroes/${id}`)
    }

    const handleSearchSubmit = (event: { preventDefault: () => void }) => {
        event.preventDefault()

        const query = searchQuery.trim()
        if (!query) {
            resetSearch()
            return
        }

        void (async () => {
            try {
                setIsSearching(true)
                setSearchError(null)

                // Переключаемся в режим поиска и сбрасываем результаты
                setIsSearchMode(true)
                setSearchResults([])
                setSearchPage(0)
                setSearchHasMore(true)
                setSearchTotal(0)
                // Сбрасываем ref для поиска
                lastLoadedSearchPageRef.current = 0

                // Загружаем первую страницу поиска
                const response = await searchHeroesByName(
                    query,
                    1,
                    PAGE_LIMIT,
                    props.type
                ) as SearchResponse
                const items = response.items ?? []

                console.log('🔍 Результаты поиска:', {
                    itemsCount: items.length,
                    total: response.total,
                    skip: response.skip,
                    limit: response.limit
                })

                setSearchResults(items)
                setSearchTotal(response.total)

                const hasMoreResults = response.skip + items.length < response.total
                setSearchHasMore(hasMoreResults)

                // Отмечаем, что первая страница загружена
                if (items.length > 0) {
                    lastLoadedSearchPageRef.current = 0 // первая страница (searchPage=0)
                }

                if (items.length === 0) {
                    setSearchError('Герои с таким именем не найдены')
                }

                // Сбрасываем обычный список
                setHeroes([])
                setPage(0)
                setHasMore(true)

            } catch {
                setSearchError('Ошибка при поиске героя')
                setIsSearchMode(false)
            } finally {
                setIsSearching(false)
            }
        })()
    }

    const resetSearch = () => {
        setSearchQuery('')
        setIsSearchMode(false)
        setSearchResults([])
        setSearchPage(0)
        setSearchHasMore(true)
        setSearchTotal(0)
        setSearchError(null)
        lastLoadedSearchPageRef.current = 0
        // Сбрасываем основной список
        setPage(0)
        setHeroes([])
        setHasMore(true)
        setRequestsBlocked(false)
        lastLoadedPageRef.current = 0
    }

    const handleSearchReset = () => {
        resetSearch()
    }

    const handleAwardFilterChange = (value: string) => {
        setAwardFilter(value)
    }

    const handleRankFilterChange = (value: string) => {
        setRankFilter(value)
    }

    // Определяем, что отображать
    const heroesToRender = isSearchMode ? searchResults : heroes
    const currentHasMore = isSearchMode ? searchHasMore : hasMore
    const currentLoading = isLoading || isSearching
    const showEndMessage = !currentHasMore && !currentLoading && heroesToRender.length > 0

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h2 className={styles.title}>Герои {title}</h2>
                <p className={styles.subtitle}>
                    Памяти тех, кто защищал Родину. Пролистывайте список, чтобы увидеть
                    больше героев.
                </p>
                <div className={styles.searchBlock}>
                    <form className={styles.search} onSubmit={handleSearchSubmit}>
                        <div className={styles.searchInputWrap}>
                            <span className={styles.searchIcon} aria-hidden="true" />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Введите имя героя"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                            />
                        </div>
                        <AppButton
                            type="submit"
                            variant="primary"
                            disabled={isSearching}
                        >
                            {isSearching ? 'Поиск...' : 'Найти'}
                        </AppButton>
                        {isSearchMode && (
                            <AppButton
                                type="button"
                                variant="secondary"
                                onClick={handleSearchReset}
                            >
                                Сбросить
                            </AppButton>
                        )}
                    </form>
                    <div className={styles.filtersContainer}>
                        <AwardsFilter onFilterChange={handleAwardFilterChange} />
                        <RanksFilter onFilterChange={handleRankFilterChange} />
                    </div>
                </div>
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
                            is_admin={props.is_admin}
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

                <div
                    ref={sentinelRef}
                    className={styles.sentinel}
                    style={{
                        height: '20px',
                        margin: '10px 0',
                        textAlign: 'center',
                        fontSize: '12px'
                    }}
                ></div>

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

export default HeroesScroller