import { useState } from 'react';
import styles from './LoginForm.module.css';
import { AppButton } from '../../common/buttons'

// @ts-expect-error JS module without types
import { API_URL } from "../../../constants"
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            console.log()
            const { data } = await axios.post(API_URL + "/admin/login", { email, password })
            console.log(data)
            if (data.token) {
                sessionStorage.setItem('access_token', data.token)
                setSuccess('Вы успешно вошли в систему!');
                setTimeout(() => {
                    navigate('/requests')
                }, 1500)
            }
        } catch (err) {
            console.log(err)
            setError('Ошибка входа. Пожалуйста, попробуйте еще раз.')
        }

        console.log('Mock login attempt with:', { email, password });

        // Simulate success
        setIsLoading(false);

    };

    return (
        <div className={styles.loginFormContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2 className={styles.title}>Вход в админ-панель</h2>

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Электронная почта</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="Введите email"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Пароль</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="Введите пароль"
                    />
                </div>

                <AppButton
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className={styles.loginButton}
                >
                    {isLoading ? 'Вход...' : 'Войти'}
                </AppButton>

            </form>
        </div>
    );
}

export default LoginForm;
