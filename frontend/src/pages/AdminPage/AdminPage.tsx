import axios from "axios"
// @ts-expect-error JS module without types
import { API_URL } from "../../constants"

import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import RequestCard from "../../components/admin/RequestCard"

import HeroesScroller from "../../components/heroes/HeroesScroller"

import styles from "./AdminPage.module.css"
import useAuthCheck from "../../hooks/useAuth"

type RequestStatus = "new" | "approved" | "rejected"

interface AdditionRequest {
    id: number,
    full_name: string,
    birth_date: string,
    death_date: string,
    photo_url: string,
    biography: string,
    awards: string,
    rank: string,
    status: RequestStatus,
    w_type: string
}

const LIMIT = 10

function AdminPage() {
    const [requests, setRequests] = useState<AdditionRequest[]>([])
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)

    const isAuthorized: boolean | null = useAuthCheck()
    const navigate = useNavigate()

    useEffect(() => {
        console.log("isAuthorized", isAuthorized)
        if (!isAuthorized) {
            navigate('/');
        }
    }, [isAuthorized]);

    const observer = useRef<IntersectionObserver | null>(null)

    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setOffset(prev => prev + LIMIT)
            }
        })

        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const fetchRequests = async (currentOffset: number) => {
        const accessToken = sessionStorage.getItem("access_token")
        if (!accessToken) {
            navigate('/')
            return
        }

        setLoading(true)

        try {
            const params = new URLSearchParams(
                { limit: String(LIMIT), offset: String(currentOffset) }
            )
            const url = API_URL + "/requests/?" + params.toString()
            console.log(url)
            const { data } = await axios.get(
                url,
                {
                    headers: {
                        Authorization: accessToken
                    }
                }
            )

            if (data.length < LIMIT) {
                setHasMore(false)
            }

            setRequests(prev => [...prev, ...data])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isAuthorized) return
        fetchRequests(offset)
    }, [offset, isAuthorized])

    return (
        <div className={styles.container}>
            <h3>Запросы на добавление</h3>

            <div className={styles["grid-container"]}>
                {requests.map((request, index) => {
                    if (index === requests.length - 1) {
                        return (
                            <div ref={lastElementRef} key={request.id}>
                                <RequestCard {...request} />
                            </div>
                        )
                    }

                    return <RequestCard key={request.id} {...request} />
                })}
            </div>

            {loading && <p>Загрузка...</p>}
            {!hasMore && <p>Больше данных нет</p>}

            <h3>Герои ВОВ</h3>
            <div className="hero-scroller-container">
                <HeroesScroller type="vov" is_admin={true} />
            </div>

            <h3>Герои СВО</h3>
            <div className="hero-scroller-container">
                <HeroesScroller type="svo" is_admin={true} />
            </div>
        </div>
    )
}

export default AdminPage