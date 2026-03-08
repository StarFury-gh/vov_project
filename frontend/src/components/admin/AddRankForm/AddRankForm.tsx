import { useState } from 'react'
import type { FormEvent } from 'react'
import styles from './AddRankForm.module.css'

import axios from 'axios'

// @ts-expect-error JS module without types
import { API_URL } from "../../../constants"

export interface RankFormData {
    name: string
    sort_order: number
}

const AddRankForm = () => {
    const [name, setName] = useState('')
    const [sortOrder, setSortOrder] = useState<number | ''>(0)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const clearForm = () => {
        setName("")
        setSortOrder(0)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!name.trim()) {
            setError('Пожалуйста, укажите название звания.')
            return
        }

        const form_data: RankFormData = {
            name,
            sort_order: typeof sortOrder === 'number' ? sortOrder : Number(sortOrder) || 0,
        }

        const url = API_URL + "/ranks/"
        try {
            const { data } = await axios.post(url, form_data)
            const title = (data && typeof data.name === 'string' && data.name.trim()) || name.trim()
            setSuccess(`${title || 'Звание'} успешно добавлен(о)`)
            if (data && data.id) {
                clearForm()
            }
        } catch (err) {
            console.error(err)
            setError('Ошибка при добавлении звания. Попробуйте ещё раз.')
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.formTitle}>Добавление звания</h3>
            {(error || success) && (
                <div className={`${styles.status} ${error ? styles.statusError : styles.statusSuccess}`}>
                    {error || success}
                </div>
            )}

            <label className={styles.label}>
                Название
                <input
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>

            <label className={styles.label}>
                Очередность сортировки
                <input
                    type="number"
                    className={styles.input}
                    value={sortOrder}
                    onChange={(e) => {
                        const val = e.target.value
                        setSortOrder(val === '' ? '' : Number(val))
                    }}
                />
            </label>

            <button type="submit" className={styles.submitButton}>
                Добавить звание
            </button>
        </form>
    )
}

export default AddRankForm
