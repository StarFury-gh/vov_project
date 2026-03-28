CREATE USER monitoring WITH PASSWORD '01766';

-- доступ к базе
GRANT CONNECT ON DATABASE vov_project TO monitoring;

-- доступ к схемам
GRANT USAGE ON SCHEMA public TO monitoring;

-- доступ к таблицам (чтение)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO monitoring;

-- автоматически для будущих таблиц
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO monitoring;

-- Enum типы
CREATE TYPE wType AS ENUM ('vov', 'svo');
CREATE TYPE reqStatus AS ENUM ('new', 'approved', 'rejected');

-- Таблица званий (справочник)
CREATE TABLE ranks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    sort_order INTEGER
);

CREATE INDEX idx_ranks_name ON ranks(name);
CREATE INDEX idx_ranks_sort_order ON ranks(sort_order);

-- Таблица наград (справочник)
CREATE TABLE awards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT
);

CREATE INDEX idx_awards_name ON awards(name);

-- Основная таблица героев
CREATE TABLE heroes (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL UNIQUE,
    birth_date DATE,
    death_date DATE,
    biography TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    w_type wType
);

CREATE INDEX idx_heroes_full_name ON heroes(full_name);
CREATE INDEX idx_heroes_birth_date ON heroes(birth_date);
CREATE INDEX idx_heroes_death_date ON heroes(death_date);

-- Таблица связи героев и наград (многие ко многим)
CREATE TABLE hero_awards (
    hero_id INTEGER REFERENCES heroes(id) ON DELETE CASCADE,
    award_id INTEGER REFERENCES awards(id) ON DELETE CASCADE,
    PRIMARY KEY (hero_id, award_id)
);

CREATE INDEX idx_hero_awards_hero_id ON hero_awards(hero_id);
CREATE INDEX idx_hero_awards_award_id ON hero_awards(award_id);

-- Таблица связи героев и званий (многие ко многим)
CREATE TABLE hero_ranks (
    hero_id INTEGER REFERENCES heroes(id) ON DELETE CASCADE,
    rank_id INTEGER REFERENCES ranks(id) ON DELETE CASCADE,
    PRIMARY KEY (hero_id, rank_id)
);

CREATE INDEX idx_hero_ranks_hero_id ON hero_ranks(hero_id);
CREATE INDEX idx_hero_ranks_award_id ON hero_ranks(rank_id);

-- Таблица связанных мест
CREATE TABLE hero_places (
    hero_id INTEGER REFERENCES heroes(id) ON DELETE CASCADE,
    longtitude FLOAT,
    latitude FLOAT,
    name VARCHAR(200)
);

CREATE INDEX idx_hero_places_hero_id ON hero_places(hero_id);

-- Таблица администраторов
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admins_email ON admins(email);

-- Таблица запросов на добавление
CREATE TABLE hero_requests (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL UNIQUE,
    birth_date DATE,
    death_date DATE,
    biography TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    w_type wType,
    rank VARCHAR(100),
    awards JSONB,
    status reqStatus,
    approved_by INTEGER REFERENCES admins(id)
);