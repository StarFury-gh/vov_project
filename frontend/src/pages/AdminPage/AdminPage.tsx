import axios from "axios"
// @ts-expect-error JS module without types
import { API_URL } from "../../constants"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RequestCard from "../../components/admin/RequestCard"

import HeroesScroller from "../../components/heroes/HeroesScroller"

import styles from "./AdminPage.module.css"

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

function AdminPage() {
    const [requests, setRequests] = useState<AdditionRequest[]>([])

    const navigate = useNavigate()

    useEffect(() => {
        const accessToken = sessionStorage.getItem("access_token")
        if (accessToken) {
            const fetchRequests = async () => {
                const { data } = await axios.get(API_URL + "/requests?limit=10&offset=0", {
                    headers: {
                        Authorization: accessToken
                    }
                })
                console.log(data)
                setRequests(data)
            }
            fetchRequests()
        } else {
            navigate('')
        }
    }, [])

    return (
        <div className={styles.container}>
            <h3>Запросы на добавление</h3>
            <div className={styles["grid-container"]}>
                {
                    requests?.map((request) => {
                        return <RequestCard
                            key={request.id}
                            id={request.id}
                            status={request.status}
                            full_name={request.full_name}
                            photo_url={request.photo_url}
                            biography={request.biography}
                            death_date={request.death_date}
                            birth_date={request.birth_date}
                            awards={request.awards}
                            rank={request.rank}
                            w_type={request.w_type}
                        />
                    })
                }
            </div>
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