import styles from "./Map.module.css"

interface AppMapProps {
    longitude?: number
    lattitude?: number
    address?: string
}

function AppMap(props: AppMapProps) {
    const longitude = props.longitude ?? 37.64
    const latitude = props.longitude ?? 55.76
    const address = props.address ?? "Москва, Красная площадь"

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;

    return (
        <div className={styles["map-card"]}>
            <h3>Места связанные с героем</h3>
            <p>{address}</p>
            <iframe
                className={styles.map}
                title="map"
                src={mapUrl}
            />
            <div>Координаты: {latitude.toFixed(4)}, {longitude.toFixed(4)}</div>
        </div>
    );
};

export default AppMap;