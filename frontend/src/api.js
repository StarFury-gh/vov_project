// Temporary mock API for heroes.
// Stores basic in-memory data to test the UI without a real server.

const MOCK_HEROES = [
  {
    id: 1,
    name: 'Алексей Маресьев',
    lifeDates: '1916–2001',
    rank: 'Герой Советского Союза, лётчик-истребитель',
    image: 'https://via.placeholder.com/400x300?text=AM',
  },
  {
    id: 2,
    name: 'Зоя Космодемьянская',
    lifeDates: '1923–1941',
    rank: 'Герой Советского Союза, партизанка',
    image: 'https://via.placeholder.com/400x300?text=ZK',
  },
  {
    id: 3,
    name: 'Александр Матросов',
    lifeDates: '1924–1943',
    rank: 'Герой Советского Союза, красноармеец',
    image: 'https://via.placeholder.com/400x300?text=AM',
  },
  {
    id: 4,
    name: 'Мария Октябрьская',
    lifeDates: '1905–1944',
    rank: 'Герой Советского Союза, танкистка',
    image: 'https://via.placeholder.com/400x300?text=MO',
  },
  {
    id: 5,
    name: 'Рихард Зорге',
    lifeDates: '1895–1944',
    rank: 'Разведчик, Герой Советского Союза',
    image: 'https://via.placeholder.com/400x300?text=RZ',
  },
  {
    id: 6,
    name: 'Николай Гастелло',
    lifeDates: '1907–1941',
    rank: 'Герой Советского Союза, лётчик',
    image: 'https://via.placeholder.com/400x300?text=NG',
  },
  {
    id: 7,
    name: 'Лидия Литвяк',
    lifeDates: '1921–1943',
    rank: 'Лётчица-истребитель, Герой Советского Союза',
    image: 'https://via.placeholder.com/400x300?text=LL',
  },
  {
    id: 8,
    name: 'Василий Зайцев',
    lifeDates: '1915–1991',
    rank: 'Снайпер, Герой Советского Союза',
    image: 'https://via.placeholder.com/400x300?text=VZ',
  },
  {
    id: 9,
    name: 'Кузьма Крючков',
    lifeDates: '1888–1919',
    rank: 'Кавалерист, Георгиевский кавалер',
    image: 'https://via.placeholder.com/400x300?text=KK',
  },
  {
    id: 10,
    name: 'Панфиловцы',
    lifeDates: '1941',
    rank: 'Бойцы 316-й стрелковой дивизии генерала Панфилова',
    image: 'https://via.placeholder.com/400x300?text=28',
  },
  {
    id: 11,
    name: 'Яков Павлов',
    lifeDates: '1917–1981',
    rank: 'Герой Советского Союза, сержант',
    image: 'https://via.placeholder.com/400x300?text=YP',
  },
  {
    id: 12,
    name: 'Молодая гвардия',
    lifeDates: '1942–1943',
    rank: 'Подпольная комсомольская организация',
    image: 'https://via.placeholder.com/400x300?text=MG',
  },
]

/**
 * Mocked heroes list for infinite scroll.
 * Simulates pagination over an in-memory array.
 * Returns object: { heroes: [...], hasMore: boolean }.
 */
export async function fetchHeroes(page = 1, limit = 10) {
  const start = (page - 1) * limit
  const end = start + limit
  const slice = MOCK_HEROES.slice(start, end)
  const hasMore = end < MOCK_HEROES.length

  // Small delay to imitate network latency
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    heroes: slice,
    hasMore,
  }
}

