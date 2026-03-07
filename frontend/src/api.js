// API для работы с героями.
// Запросы отправляются на API_URL из constants.

import { API_URL } from "./constants"

// Заглушка для локальной разработки (не используется при реальных запросах)
const _MOCK_HEROES = [
    {
        id: 1,
        full_name: 'Алексей Маресьев',
        birth_date: '1916-05-20',
        death_date: '2001-05-18',
        photo_url: 'https://via.placeholder.com/400x300?text=AM',
        rank_name: 'Герой Советского Союза, лётчик-истребитель',
        summary_info:
            'Советский лётчик-истребитель, ставший символом силы духа и стойкости.',
    },
    {
        id: 2,
        full_name: 'Зоя Космодемьянская',
        birth_date: '1923-09-13',
        death_date: '1941-11-29',
        photo_url: 'https://via.placeholder.com/400x300?text=ZK',
        rank_name: 'Герой Советского Союза, партизанка',
        summary_info:
            'Одна из первых женщин, удостоенных звания Героя Советского Союза в годы войны.',
    },
    {
        id: 3,
        full_name: 'Александр Матросов',
        birth_date: '1924-02-05',
        death_date: '1943-02-27',
        photo_url: 'https://via.placeholder.com/400x300?text=AM',
        rank_name: 'Герой Советского Союза, красноармеец',
        summary_info:
            'Закрыл своим телом амбразуру вражеского дзота, обеспечив успех наступления.',
    },
    {
        id: 4,
        full_name: 'Мария Октябрьская',
        birth_date: '1905-08-16',
        death_date: '1944-03-15',
        photo_url: 'https://via.placeholder.com/400x300?text=MO',
        rank_name: 'Герой Советского Союза, танкистка',
        summary_info:
            'На личные средства купила танк «Боевая подруга» и воевавшая на нём на фронте.',
    },
    {
        id: 5,
        full_name: 'Рихард Зорге',
        birth_date: '1895-10-04',
        death_date: '1944-11-07',
        photo_url: 'https://via.placeholder.com/400x300?text=RZ',
        rank_name: 'Разведчик, Герой Советского Союза',
        summary_info:
            'Легендарный разведчик, сыгравший важную роль в обеспечении обороны СССР.',
    },
    {
        id: 6,
        full_name: 'Николай Гастелло',
        birth_date: '1907-05-26',
        death_date: '1941-06-26',
        photo_url: 'https://via.placeholder.com/400x300?text=NG',
        rank_name: 'Герой Советского Союза, лётчик',
        summary_info:
            'Направил горящий самолёт на скопление вражеской техники, совершив подвиг.',
    },
    {
        id: 7,
        full_name: 'Лидия Литвяк',
        birth_date: '1921-08-18',
        death_date: '1943-08-01',
        photo_url: 'https://via.placeholder.com/400x300?text=LL',
        rank_name: 'Лётчица-истребитель, Герой Советского Союза',
        summary_info:
            'Одна из самых результативных женщин-истребителей Второй мировой войны.',
    },
    {
        id: 8,
        full_name: 'Василий Зайцев',
        birth_date: '1915-03-23',
        death_date: '1991-12-15',
        photo_url: 'https://via.placeholder.com/400x300?text=VZ',
        rank_name: 'Снайпер, Герой Советского Союза',
        summary_info:
            'Знаменитый снайпер Сталинградской битвы, ставший символом меткости и выдержки.',
    },
    {
        id: 9,
        full_name: 'Кузьма Крючков',
        birth_date: '1888-10-21',
        death_date: '1919-08-13',
        photo_url: 'https://via.placeholder.com/400x300?text=KK',
        rank_name: 'Кавалерист, Георгиевский кавалер',
        summary_info:
            'Кавалерист, ставший одним из символов героизма русского солдата.',
    },
    {
        id: 10,
        full_name: 'Панфиловцы',
        birth_date: '1941-11-16',
        death_date: '1941-11-16',
        photo_url: 'https://via.placeholder.com/400x300?text=28',
        rank_name: 'Бойцы 316-й стрелковой дивизии генерала Панфилова',
        summary_info:
            'Группа бойцов, прославившихся в боях под Москвой и ставших символом стойкости.',
    },
    {
        id: 11,
        full_name: 'Яков Павлов',
        birth_date: '1917-10-17',
        death_date: '1981-09-28',
        photo_url: 'https://via.placeholder.com/400x300?text=YP',
        rank_name: 'Герой Советского Союза, сержант',
        summary_info:
            'Командир группы бойцов, оборонявших знаменитый дом Павлова в Сталинграде.',
    },
    {
        id: 12,
        full_name: 'Молодая гвардия',
        birth_date: '1942-09-01',
        death_date: '1943-02-01',
        photo_url: 'https://via.placeholder.com/400x300?text=MG',
        rank_name: 'Подпольная комсомольская организация',
        summary_info:
            'Подпольная организация, воевавшая с оккупантами в Краснодоне и окрестностях.',
    },
]

/**
 * Запрос списка героев с пагинацией.
 * GET-запрос к API_URL с query-параметрами limit и skip.
 * Возвращает: { heroes: [...], total, skip, limit }.
 */
export async function fetchHeroes(page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })
    const url = `${API_URL}/heroes?${params.toString()}`

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