// API для работы с героями.

import { API_URL } from "./constants"

/**
 * Заглушка для поиска героев по имени на бэкенде.
 * Работает только с локальным массивом _MOCK_HEROES и имитирует сетевой запрос.
 */
export async function searchHeroesByName(query) {
    const normalized = (query ?? '').trim().toLowerCase()

    if (!normalized) {
        return []
    }

    // Имитируем небольшую задержку сети
    await new Promise((resolve) => setTimeout(resolve, 300))

    return _MOCK_HEROES.filter((hero) =>
        hero.full_name.toLowerCase().includes(normalized)
    )
}

/**
 * Запрос списка героев с пагинацией.
 * GET-запрос к API_URL с query-параметрами limit и skip.
 * Возвращает: { heroes: [...], total, skip, limit }.
 */
export async function fetchHeroes(page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })
    const url = `${API_URL}/heroes/?${params.toString()}`

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Не удалось загрузить список героев')
    }

    const data = await response.json()
    console.log(data)
    // Бэкенд возвращает items, маппим в heroes для совместимости с фронтом
    const heroes = data.items ?? data.heroes ?? []
    return {
        heroes,
        total: data.total ?? heroes.length,
        skip: data.skip ?? skip,
        limit: data.limit ?? limit,
    }
}

export async function fetchHero(id) {
    const url = `${API_URL}/heroes/${id}`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Не удалось загрузить информацию о герое')
    }

    const data = await response.json()

    return data
}