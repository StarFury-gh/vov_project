import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './HomePage.module.css'
import HeroCard from '../../components/heroes/HeroCard'
// @ts-expect-error JS module without types
import { fetchHeroes } from '../../api'

// Тип героя, который ожидаем от API
export interface Hero {
  id: number | string
  name: string
  lifeDates?: string
  rank?: string
  image?: string | null
}

type HeroesApiResponse =
  | {
      heroes: Hero[]
      hasMore?: boolean
    }
  | Hero[]

const PAGE_LIMIT = 10

const HomePage = () => {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const navigate = useNavigate()

  const loadHeroes = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)

    try {
      const data = (await fetchHeroes(page, PAGE_LIMIT)) as HeroesApiResponse

      let newHeroes: Hero[] = []
      let nextHasMore = true

      if (Array.isArray(data)) {
        // API вернул просто массив героев
        newHeroes = data
        nextHasMore = data.length === PAGE_LIMIT
      } else if (data && Array.isArray(data.heroes)) {
        // API вернул объект с полем heroes
        newHeroes = data.heroes
        nextHasMore =
          typeof data.hasMore === 'boolean'
            ? data.hasMore
            : data.heroes.length === PAGE_LIMIT
      }

      setHeroes((prev) => [...prev, ...newHeroes])
      setHasMore(nextHasMore)
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Ошибка при загрузке героев'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [hasMore, isLoading, page])

  // Первичная загрузка и загрузка при смене страницы
  useEffect(() => {
    void loadHeroes()
  }, [loadHeroes])

  // Настройка Intersection Observer для бесконечной прокрутки
  useEffect(() => {
    if (!hasMore || isLoading) return

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
  }, [hasMore, isLoading])

  const handleRetry = () => {
    void loadHeroes()
  }

  const handleHeroClick = (id: Hero['id']) => {
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
              name={hero.name}
              lifeDates={hero.lifeDates}
              rank={hero.rank}
              image={hero.image ?? undefined}
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
            <p className={styles.errorText}>{error}</p>
            <button type="button" className={styles.retryButton} onClick={handleRetry}>
              Повторить попытку
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

