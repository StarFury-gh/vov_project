import { useEffect, useState } from "react"
import axios from "axios"

// @ts-expect-error JS module without types
import { API_URL } from "../../../constants"

interface AwardInfo {
    id: number,
    name: string,
    description: string
}

function AllAwardsList() {
    const [awards, setAwards] = useState<Array<AwardInfo>>()

    useEffect(() => {
        const fetchData = async () => {
            const url = API_URL + "/awards/"
            const { data } = await axios.get(url)

            if (data) {
                setAwards(data)
            }

        }

        fetchData()

    }, [])

    return (
        <div className="items">
            <h3>Добавленные награды:</h3>
            <ol>
                {awards?.map((award) => {
                    return (
                        <li key={award.id}>
                            <p>{award.name}</p>
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}

export default AllAwardsList 