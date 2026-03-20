import { useParams, useNavigate } from 'react-router-dom'
import styles from './HeroPage.module.css'
import { useEffect, useState } from 'react'
// @ts-expect-error JS module without types
import { fetchHero } from "../../api"
// @ts-expect-error JS module without types
import { STATIC_URL } from "../../constants"
import AppMap from '../../components/common/Map'

interface HeroPlace {
    name: string,
    latitude: number,
    longtitude: number
}

interface HeroFromApi {
    id: number,
    full_name: string,
    birth_date: string,
    death_date: string,
    photo_url: string,
    biography: string,
    awards: string[],
    rank: string,
    place: HeroPlace
}

const isArrayEmpty = (arr: string[] | undefined) => arr?.length === 0

const HeroPage = () => {
    const { id } = useParams<{ id: string }>()

    const [heroData, setHeroData] = useState<HeroFromApi>()

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchHero(id)
            console.log("heroData", data)
            setHeroData(data)
        }
        fetchData()
    }, [id])

    const navigate = useNavigate()

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

                    {
                        heroData?.place ?
                            <AppMap
                                address={heroData?.place.name}
                                latitude={heroData?.place.latitude}
                                longitude={heroData?.place.longtitude}
                            /> : null
                    }

                    <button className={styles.backBtn} onClick={() => navigate(-1)}>
                        ← Вернуться к списку героев
                    </button>
                </div>
            </div>
        </main>
    )
}

export default HeroPage

