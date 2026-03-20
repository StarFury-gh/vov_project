import { useEffect } from "react"

import styles from "./Map.module.css"

interface AppMapProps {
    longitude?: number
    latitude?: number
    address?: string
}

function AppMap(props: AppMapProps) {

    useEffect(() => {
        console.log(props)
    }, [props])

    const longitude = props.longitude ?? 37.3315
    const latitude = props.latitude ?? 55.4329
    const address = props.address ?? "Новодевечье Кладбище (Москва)"

    const delta = 0.01

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta
        },${latitude - delta
        },${longitude + delta
        },${latitude + delta
        }&layer=mapnik&marker=${latitude},${longitude}`

    return (
        <div className={styles["map-card"]}>
            <h3>Места связанные с героем</h3>
            <p>{address}</p>
            <iframe
                className={styles.map}
                title="map"
                src={mapUrl}
            />
        </div>
    );
};

export default AppMap;