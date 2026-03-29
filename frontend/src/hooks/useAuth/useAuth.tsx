import { useEffect, useState } from "react"

// @ts-expect-error JS module without types
import { API_URL } from "../../constants"

import axios from "axios"

type ServerResponse = {
    status: boolean
}

export default function useAuthCheck(): boolean | null {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem("access_token")

            if (!token) {
                setIsAuthorized(false)
                return
            }

            try {
                const url = API_URL + "/admin/check"
                const response = await axios.get(url, {
                    headers: {
                        Authorization: token
                    }
                }
                )

                const data = response.data as ServerResponse
                setIsAuthorized(data.status)
            } catch (error) {
                console.error("Auth check failed:", error)
                setIsAuthorized(false)
            }
        }

        checkAuth()
    }, [])

    return isAuthorized
}