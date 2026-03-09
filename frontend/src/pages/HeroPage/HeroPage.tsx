import { useParams, Link } from 'react-router-dom'
import styles from './HeroPage.module.css'
import { useEffect, useState } from 'react'
// @ts-expect-error JS module without types
import { fetchHero } from "../../api"
// @ts-expect-error JS module without types
import { STATIC_URL } from "../../constants"
import AppMap from '../../components/common/Map'

interface HeroFromApi {
    id: number,
    full_name: string,
    birth_date: string,
    death_date: string,
    photo_url: string,
    biography: string,
    awards: string[],
    rank: string,
}

const isArrayEmpty = (arr: string[] | undefined) => arr?.length === 0

const HeroPage = () => {
    const { id } = useParams<{ id: string }>()

    const [heroData, setHeroData] = useState<HeroFromApi>()

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchHero(id)
            setHeroData(data)
            console.log(data)
        }
        fetchData()
    }, [id])

    return (
        <main className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>{heroData?.full_name}</h1>
                <img className={styles.portrait} src={`${STATIC_URL}/${heroData?.photo_url}`} alt="" />
                <div className={styles.info}>

                    <p className={styles.text}>
                        {heroData?.biography}
                    </p>

                    {
                        !isArrayEmpty(heroData?.awards) ?
                            <>
                                <p>Награды:</p>
                                <ul>
                                    {
                                        heroData?.awards.map((award) => {
                                            return (
                                                <li>
                                                    <p className={styles.text}>
                                                        {award}
                                                    </p>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </>
                            : null
                    }

                    <p className={styles.text}>Ранг: {heroData?.rank}</p>

                    <AppMap />

                    <Link to="/" className={styles.backLink}>
                        ← Вернуться к списку героев
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default HeroPage

