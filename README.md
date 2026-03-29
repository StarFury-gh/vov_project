# Справочник по героям СВО и ВОВ

---

## 📦 Стек технологий

* Backend: Python + FastAPI
* Frontend: React + TypeScript
* Cache: Redis
* Database: PostgreSQL
* Monitoring: Grafana + Prometheus
* Docker & Docker Compose

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/StarFury-gh/vov_project.git
cd vov_project
```

### 2. Настройка окружения для Backend

Для корректной работы backend необходимо создать файл `.env`.

Скопируйте пример:

```bash
cp backend/.env_example backend/.env
```

После этого откройте файл `backend/.env` и укажите необходимые значения переменных.

⚠️ Формат должен полностью соответствовать `backend/.env_example`.

⚠️ ВНИМАНИЕ ⚠️
После добавления панели администратора, шаблон .env_exmaple был дополнен новым необходимым полем: JWT_SECRET_KEY

---

### 3. Настройка окружения для make_data

Для заполнения таблицы с героями через заготовленный скрипт, необходимо создать файл .env в каталоге make_data
В нём нужно указать логин (email) и пароль администратора сайта

Скопируйте пример:
```bash
cp make_data/.env_example make_data/.env
```

После, смените значения

⚠️ Формат должен полностью соответствовать `make_data/.env_example`.
---

## 🐳 Запуск через Docker

Запуск проекта осуществляется с помощью Docker Compose:

```bash
docker compose up -d
```

После этого все сервисы будут запущены в фоновом режиме.

---

## 🛑 Остановка проекта

```bash
docker compose down
```

---

## 🔄 Пересборка контейнеров

Если вы внесли изменения в код:

```bash
docker compose up -d --build

---

## ⚙️ Важно

* Backend не запустится без корректного `.env`
* Убедитесь, что все необходимые переменные заполнены
* Не добавляйте `.env` в репозиторий (используйте `.gitignore`)

