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

### 2. Настройка окружения

Для корректной работы backend необходимо создать файл `.env`.

Скопируйте пример:

```bash
cp backend/.env_example backend/.env
```

После этого откройте файл `backend/.env` и укажите необходимые значения переменных.

⚠️ Формат должен полностью соответствовать `backend/.env_example`.

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

