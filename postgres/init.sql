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

-- Таблица пользователей (для административной панели)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_username ON users(username);

-- Основная таблица героев
CREATE TABLE heroes (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    birth_date DATE,
    death_date DATE,
    rank_id INTEGER REFERENCES ranks(id) ON DELETE SET NULL,
    biography TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_heroes_full_name ON heroes(full_name);
CREATE INDEX idx_heroes_birth_date ON heroes(birth_date);
CREATE INDEX idx_heroes_death_date ON heroes(death_date);
CREATE INDEX idx_heroes_rank_id ON heroes(rank_id);

-- Таблица связи героев и наград (многие ко многим)
CREATE TABLE hero_awards (
    hero_id INTEGER REFERENCES heroes(id) ON DELETE CASCADE,
    award_id INTEGER REFERENCES awards(id) ON DELETE CASCADE,
    date_awarded DATE,
    PRIMARY KEY (hero_id, award_id)
);

CREATE INDEX idx_hero_awards_hero_id ON hero_awards(hero_id);
CREATE INDEX idx_hero_awards_award_id ON hero_awards(award_id);

-- Таблица дополнительных фотографий
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL REFERENCES heroes(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_photos_hero_id ON photos(hero_id);
