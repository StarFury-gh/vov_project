import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import styles from './AddHeroForm.module.css'

// @ts-expect-error JS module without types
import { API_URL } from "../../../constants"
import axios from 'axios'

export interface HeroFormData {
    full_name: string
    birth_date: string
    death_date: string
    biography: string
}

const AddHeroForm = () => {
    const [fullName, setFullName] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [deathDate, setDeathDate] = useState('')
    const [biography, setBiography] = useState('')
    const [awards, setAwards] = useState<string[]>([])
    const [awardInput, setAwardInput] = useState('')
    const [rank, setRank] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [file, setFile] = useState<File>()

    const handleAddAward = () => {
        const trimmed = awardInput.trim()
        if (trimmed && !awards.includes(trimmed)) {
            setAwards((prev) => [...prev, trimmed])
            setAwardInput('')
        }
    }

    const handleRemoveAward = (index: number) => {
        setAwards((prev) => prev.filter((_, i) => i !== index))
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!fullName.trim()) {
            setError('Пожалуйста, укажите ФИО героя.')
            return
        }

        const form_data: HeroFormData = {
            full_name: fullName,
            birth_date: birthDate,
            death_date: deathDate,
            biography,
        }
        console.log('AddHeroForm submitted:', form_data)

        const url = API_URL + "/heroes/"

        try {
            const { data } = await axios.post(url, form_data)

            const hero_id = data.id
            const title = (data && typeof data.full_name === 'string' && data.full_name.trim()) || fullName.trim()
            setSuccess(`${title || 'Герой'} успешно добавлен(о)`)

            if (rank.trim()) {
                const assign_rank_body = {
                    hero_id,
                    rank_name: rank
                }

                const assign_rank_url = API_URL + "/ranks/assign_by_name"
                await axios.post(assign_rank_url, assign_rank_body)
            }

            if (awards.length !== 0) {
                const assign_awards_body = {
                    hero_id,
                    awards: awards
                }

                const assign_awards_url = API_URL + "/awards/m_assign"
                await axios.post(assign_awards_url, assign_awards_body)
            }

            if (file) {
                const file_form_data = new FormData()
                file_form_data.append('image', file, file.name)

                const file_url = API_URL + `/heroes/image?hero_id=${hero_id}`
                await axios.post(file_url, file_form_data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
            }

        } catch (err) {
            console.error(err)
            setError('Ошибка при добавлении героя. Попробуйте ещё раз.')
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.formTitle}>Добавление героя</h3>
            {(error || success) && (
                <div className={`${styles.status} ${error ? styles.statusError : styles.statusSuccess}`}>
                    {error || success}
                </div>
            )}

            <label className={styles.label}>
                ФИО
                <input
                    type="text"
                    className={styles.input}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </label>

            <label className={styles.label}>
                Дата рождения
                <input
                    type="date"
                    className={styles.input}
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                />
            </label>

            <label className={styles.label}>
                Дата смерти
                <input
                    type="date"
                    className={styles.input}
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                />
            </label>

            <label className={styles.label}>
                Биография
                <textarea
                    className={styles.textarea}
                    rows={4}
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                />
            </label>

            <label>
                Фотография
                <input
                    type="file"
                    className={styles.file_input}
                    alt=""
                    accept='.jpg, .png, .jpeg, .webp'
                    onChange={handleFileChange}
                />
                {file && <p>Выбран файл: {file.name}</p>}
            </label>

            <div className={styles.label}>
                Награды
                <div className={styles.awardsRow}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Введите награду и нажмите «Добавить»"
                        value={awardInput}
                        onChange={(e) => setAwardInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAward())}
                    />
                    <button
                        type="button"
                        className={styles.addButton}
                        onClick={handleAddAward}
                    >
                        Добавить
                    </button>
                </div>
                {awards.length > 0 && (
                    <ul className={styles.awardsList}>
                        {awards.map((award, i) => (
                            <li key={i} className={styles.awardItem}>
                                {award}
                                <button
                                    type="button"
                                    className={styles.removeButton}
                                    onClick={() => handleRemoveAward(i)}
                                    aria-label="Удалить"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <label className={styles.label}>
                Звание героя
                <input
                    type="text"
                    className={styles.input}
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                />
            </label>

            <button type="submit" className={styles.submitButton}>
                Добавить героя
            </button>
        </form>
    )
}

export default AddHeroForm
