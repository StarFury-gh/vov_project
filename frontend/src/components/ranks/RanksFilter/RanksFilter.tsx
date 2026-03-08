import { useEffect, useState } from "react"
import axios from "axios"

import styles from "./RanksFilter.module.css"

// @ts-expect-error JS module without types
import { API_URL } from "../../../constants"

interface RanksFilterProps {
    onFilterChange: (filter: string) => void
}

interface RankInfo {
    name: string
}

const RanksFilter = ({ onFilterChange }: RanksFilterProps) => {
    // Имитированные значения для радиокнопок
    const [options, setOptions] = useState<RankInfo[]>()

    useEffect(() => {
        const getAwards = async () => {
            const url = API_URL + "/ranks/"
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

    const handleRemoveFilter = () => {
        onFilterChange("")
        setSelectedFilter("")
    }

    return (
        <div className={styles.filterContainer}>
            <h4 className={styles.filterTitle} onClick={toggleAccordion} style={{ cursor: 'pointer' }}>
                Фильтр рангов:
                <img
                    src="/down.svg"
                    alt="Развернуть"
                    className={`${isExpanded ? styles.hidden : ''} ${styles.icon}`}
                    style={{ width: '24px', height: '24px' }}
                />
                <img
                    src="/up.svg"
                    alt="Свернуть"
                    className={`${!isExpanded ? styles.hidden : ''} ${styles.icon}`}
                    style={{ width: '24px', height: '24px' }}
                />
            </h4>
            <div className={`${styles.radioGroup} ${isExpanded ? styles.expanded : ''}`}>
                {options?.map((option) => (
                    <label key={option.name} className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="ranksFilter"
                            value={option.name}
                            checked={selectedFilter === option.name}
                            onChange={handleFilterChange}
                        />
                        {option.name}
                    </label>
                ))}
            </div>
            <button className={styles.button} onClick={handleRemoveFilter}>
                <img src="/delete.svg" alt="Удалить" />
                Очистить фиильтр по рангу
            </button>
        </div>
    )
}

export default RanksFilter