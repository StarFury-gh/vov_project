// API для работы с героями.

import { API_URL } from "./constants"

export async function searchHeroesByName(query, page = 1, limit = 10) {
    const normalized = (query ?? '').trim().toLowerCase()
    const skip = (page - 1) * limit

    if (!normalized) {
        return { items: [], total: 0, skip: 0, limit: limit }
    }

    const params = new URLSearchParams({ limit: String(limit), skip: String(skip), search: normalized })
    const url = API_URL + "/heroes/" + `?${params.toString()}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Не удалось выполнить поиск героев')
    }

    const result = await response.json()
    return result
}

/**
 * Запрос списка героев с пагинацией.
 * GET-запрос к API_URL с query-параметрами limit и skip.
 * Возвращает: { heroes: [...], total, skip, limit }.
 */
export async function fetchHeroes(page, limit = 10, award_filter = null, rank_filter = null, w_type = "vov") {
    const skip = (page - 1) * limit
    const params = new URLSearchParams({ limit: String(limit), skip: String(skip), w_type })

    if (award_filter && award_filter !== "" && award_filter !== null) {
        params.append('award_filter', award_filter)
    }
    if (rank_filter && rank_filter !== "" && rank_filter !== null) {
        params.append('rank_filter', rank_filter)
    }

    const url = `${API_URL}/heroes/?${params.toString()}`
    console.log("url:", url)

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Не удалось загрузить список героев')
    }

    const data = await response.json()
    console.log("fectched_data:", data)
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