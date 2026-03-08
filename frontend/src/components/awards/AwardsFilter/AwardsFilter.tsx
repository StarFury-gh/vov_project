import { useEffect, useState } from "react"
import axios from "axios"

import styles from "./AwardsFilter.module.css"

// @ts-expect-error JS module without types
import { API_URL } from "../../../constants"

interface AwardsFilterProps {
    onFilterChange: (filter: string) => void
}

interface AwardInfo {
    name: string
}

const AwardsFilter = ({ onFilterChange }: AwardsFilterProps) => {
    // Имитированные значения для радиокнопок
    const [options, setOptions] = useState<AwardInfo[]>()

    useEffect(() => {
        const getAwards = async () => {
            const url = API_URL + "/awards/"
            const { data } = await axios.get(url)
            setOptions(data)
        }
        getAwards()
    }, [])

    const [selectedFilter, setSelectedFilter] = useState<string>()
    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setSelectedFilter(value)
        onFilterChange(value)
    }

    const toggleAccordion = () => {
        setIsExpanded(prev => !prev); // Переключение состояния
    }

    return (
        <div className={styles.filterContainer}>
            <h4 className={styles.filterTitle} onClick={toggleAccordion} style={{ cursor: 'pointer' }}>
                Фильтр наград: {isExpanded ? '▲' : '▼'}
            </h4>
            <div className={`${styles.radioGroup} ${isExpanded ? styles.expanded : ''}`}>
                {options?.map((option) => (
                    <label key={option.name} className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="awardsFilter"
                            value={option.name}
                            checked={selectedFilter === option.name}
                            onChange={handleFilterChange}
                        />
                        {option.name}
                    </label>
                ))}
            </div>
            <button className={styles.button}>
                Очистить фильтр по награде
            </button>
        </div>
    )
}

export default AwardsFilter