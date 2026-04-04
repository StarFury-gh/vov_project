import { useEffect, useState } from "react"
import axios from "axios"
import { AppButton } from "../../common/buttons"

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
                selected={isExpanded}
                aria-expanded={isExpanded}
                aria-controls="awards-filter-options"
                icon={
                    <img
                        src={isExpanded ? "/up.svg" : "/down.svg"}
                        alt=""
                        className={styles.icon}
                        aria-hidden="true"
                    />
                }
            >
                Фильтр наград:
            </AppButton>

            <div id="awards-filter-options" className={`${styles.radioGroup} ${isExpanded ? styles.expanded : ''}`}>
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

            <AppButton
                type="button"
                variant="secondary"
                className={styles.clearButton}
                onClick={handleRemoveFilter}
                icon={<img src="/delete.svg" alt="" className={styles.clearIcon} aria-hidden="true" />}
            >
                Очистить фильтр по награде
            </AppButton>
        </div>
    )
}

export default AwardsFilter
