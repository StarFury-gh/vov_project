import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import styles from './AddHeroForm.module.css'
import { AppButton } from '../../common/buttons'

// @ts-expect-error JS module without types
import { API_URL } from "../../../constants"
import axios from 'axios'

type wType = 'vov' | 'svo'

export interface HeroFormData {
    full_name: string
    birth_date: string
    death_date: string
    biography: string
    w_type: wType
    rank: string
    awards: string[]
}

const AddHeroForm = () => {
    const [fullName, setFullName] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [deathDate, setDeathDate] = useState('')
    const [biography, setBiography] = useState('')
    const [awards, setAwards] = useState<string[]>([])
    const [awardInput, setAwardInput] = useState('')
    const [wType, setWtype] = useState<wType>('vov')
    const [rank, setRank] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [file, setFile] = useState<File>()
    const fileInputRef = useRef<HTMLInputElement | null>(null)

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
            w_type: wType,
            rank: rank.trim(),
            awards: awards
        }
        console.log('AddHeroForm submitted:', form_data)

        const url = API_URL + "/heroes/"

        try {
            const { data } = await axios.post(url, form_data)

            const hero_id = data.id
            setSuccess(`Заявка #${hero_id} отправлена`)

            if (file) {
                const file_form_data = new FormData()
                file_form_data.append('image', file, file.name)

                const file_url = API_URL + `/heroes/req_image?hero_id=${hero_id}`
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
            <h2 className={styles.formTitle}>Добавление героя</h2>
            {(error || success) && (
                <div className={`${styles.status} ${error ? styles.statusError : styles.statusSuccess}`}>
                    {error || success}
                </div>
            )}

            <div className={styles.segmentedBlock}>
                <p className={styles.segmentedTitle}>Раздел</p>
                <div className={styles.segmentedControl} role="radiogroup" aria-label="Тип раздела">
                    <AppButton
                        type="button"
                        variant="secondary"
                        className={styles.segmentAppButton}
                        selected={wType === 'vov'}
                        onClick={() => setWtype('vov')}
                        role="radio"
                        aria-checked={wType === 'vov'}
                    >
                        ВОВ
                    </AppButton>
                    <AppButton
                        type="button"
                        variant="secondary"
                        className={styles.segmentAppButton}
                        selected={wType === 'svo'}
                        onClick={() => setWtype('svo')}
                        role="radio"
                        aria-checked={wType === 'svo'}
                    >
                        СВО
                    </AppButton>
                </div>
            </div>

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

            <label className={styles.label}>
                Фотография
                <input
                    ref={fileInputRef}
                    type="file"
                    className={styles.hiddenFileInput}
                    accept=".jpg, .png, .jpeg, .webp"
                    onChange={handleFileChange}
                />
                <div className={styles.filePickerRow}>
                    <AppButton
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Выбрать файл
                    </AppButton>
                    <span className={`${styles.fileName} ${file ? styles.fileNameSelected : styles.fileNameEmpty}`}>
                        {file ? `Выбран файл: ${file.name}` : 'Файл не выбран'}
                    </span>
                </div>
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
                    <AppButton
                        type="button"
                        variant="secondary"
                        onClick={handleAddAward}
                    >
                        Добавить
                    </AppButton>
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

            <AppButton type="submit" variant="primary">
                Добавить героя
            </AppButton>
        </form>
    )
}

export default AddHeroForm
