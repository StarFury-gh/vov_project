import { useState } from 'react'
import type { FormEvent } from 'react'
import styles from './AddAwardForm.module.css'

// @ts-expect-error JS module without types
import { API_URL } from "../../../constants"
import axios from 'axios'

export interface AwardFormData {
    name: string
    description: string
}

const AddAwardForm = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const clearForm = () => {
        setName("")
        setDescription("")
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!name.trim()) {
            setError('Пожалуйста, укажите название награды.')
            return
        }

        const form_data: AwardFormData = { name, description }

        console.log(form_data)

        const url = API_URL + "/awards/"
        try {
            const { data } = await axios.post(url, form_data)

            console.log(data)

            const title = (data && typeof data.name === 'string' && data.name.trim()) || name.trim()
            setSuccess(`${title || 'Награда'} успешно добавлен(о)`)

            if (data && data.id) {
                clearForm()
            }
        } catch (err) {
            console.error(err)
            setError('Ошибка при добавлении награды. Попробуйте ещё раз.')
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.formTitle}>Добавление награды</h3>
            {(error || success) && (
                <div className={`${styles.status} ${error ? styles.statusError : styles.statusSuccess}`}>
                    {error || success}
                </div>
            )}

            <label className={styles.label}>
                Название награды
                <input
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>

            <label className={styles.label}>
                Описание
                <textarea
                    className={styles.textarea}
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            <button type="submit" className={styles.submitButton}>
                Добавить награду
            </button>
        </form>
    )
}

export default AddAwardForm
