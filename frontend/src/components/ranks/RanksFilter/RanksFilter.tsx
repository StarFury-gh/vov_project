import { useEffect, useState } from "react"
import axios from "axios"
import { AppButton } from "../../common/buttons"

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
            <AppButton
                type="button"
                variant="secondary"
                onClick={toggleAccordion}
                aria-expanded={isExpanded}
                aria-controls="ranks-filter-options"
                icon={
                    <img
                        src={isExpanded ? "/up.svg" : "/down.svg"}
                        alt=""
                        className={styles.icon}
                        aria-hidden="true"
                    />
                }
            >
                Фильтр рангов:
            </AppButton>

            <div id="ranks-filter-options" className={`${styles.radioGroup} ${isExpanded ? styles.expanded : ''}`}>
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

            <AppButton
                type="button"
                variant="secondary"
                className={styles.clearButton}
                onClick={handleRemoveFilter}
                disabled={!selectedFilter}
                icon={<img src="/delete.svg" alt="" className={styles.clearIcon} aria-hidden="true" />}
            >
                Очистить фильтр по рангу
            </AppButton>
        </div>
    )
}

export default RanksFilter
