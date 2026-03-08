import { useEffect, useState } from "react"
import axios from "axios"

// @ts-expect-error JS module without types
import { API_URL } from "../../../constants"

interface Rank {
    id: number,
    name: string,
    sort_order: number
}

function AllRanksList() {
    const [ranks, setRanks] = useState<Array<Rank>>()

    useEffect(() => {
        const fetchData = async () => {
            const url = API_URL + "/ranks/"
            const { data } = await axios.get(url)
            if (data) {
                setRanks(data)
            }
        }

        fetchData()

    }, [])

    return (
        <div className="items">
            <h3>Добавленные звания:</h3>
            <ol>
                {ranks?.map((rank) => {
                    return (
                        <li key={rank.id}>
                            {rank.name}
                        </li>
                    )
                })}
            </ol>
        </div>
    )

}

export default AllRanksList