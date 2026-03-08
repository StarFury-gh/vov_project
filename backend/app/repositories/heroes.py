class HeroRepository:
    def __init__(self, db):
        self.db = db

    async def get(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str = None,
        birth_year_from: int = None,
        birth_year_to: int = None,
        death_year_from: int = None,
        death_year_to: int = None
    ):
        # Базовая часть запроса без фильтров, группировки и пагинации
        base_query = """
            SELECT
                h.id,
                h.full_name,
                h.birth_date,
                h.death_date,
                h.photo_url
            FROM heroes h
        """
        # COALESCE(h.biography, '') AS summary_info

        where_clauses = ["1=1"]
        parameters = []

        if search:
            idx = len(parameters) + 1
            where_clauses.append(f"h.full_name ILIKE ${idx}")
            parameters.append(f"%{search}%")

        if birth_year_from:
            idx = len(parameters) + 1
            where_clauses.append(f"EXTRACT(YEAR FROM h.birth_date) >= ${idx}")
            parameters.append(birth_year_from)

        if birth_year_to:
            idx = len(parameters) + 1
            where_clauses.append(f"EXTRACT(YEAR FROM h.birth_date) <= ${idx}")
            parameters.append(birth_year_to)

        if death_year_from:
            idx = len(parameters) + 1
            where_clauses.append(f"EXTRACT(YEAR FROM h.death_date) >= ${idx}")
            parameters.append(death_year_from)

        if death_year_to:
            idx = len(parameters) + 1
            where_clauses.append(f"EXTRACT(YEAR FROM h.death_date) <= ${idx}")
            parameters.append(death_year_to)

        where_sql = " WHERE " + " AND ".join(where_clauses)

        group_by_sql = " GROUP BY h.id"

        # Запрос для получения элементов с пагинацией
        limit_idx = len(parameters) + 1
        offset_idx = len(parameters) + 2
        items_query = (
            base_query
            + where_sql
            + group_by_sql
            + f" ORDER BY h.id LIMIT ${limit_idx} OFFSET ${offset_idx}"
        )
        items_params = parameters + [limit, skip]

        result = await self.db.fetch(items_query, *items_params)

        # Запрос для подсчёта общего количества без пагинации
        count_query = (
            "SELECT COUNT(*) FROM ("
            + base_query
            + where_sql
            + group_by_sql
            + ") AS count_subquery"
        )
        count_result = await self.db.fetchrow(count_query, *parameters)
        total = count_result["count"] if count_result else 0

        return {
            "items": result,
            "total": total,
            "skip": skip,
            "limit": limit,
        }

    async def get_by_id(self, id):
        result = await self.db.fetchrow("SELECT * FROM heroes WHERE id = $1", id)
        return result

    async def create(self, hero_data: dict):
        query = """
        INSERT INTO heroes (full_name, birth_date, death_date, biography, photo_url)
        VALUES ($1, $2::date, $3::date, $4, $5)
        RETURNING id, full_name, birth_date, death_date, biography, photo_url
        """
        
        # Преобразуем строковые даты в объекты date, если они строки
        birth_date = hero_data.get('birth_date')
        if birth_date:
            print(f"{bool(birth_date)}=")
            if birth_date and isinstance(birth_date, str):
                from datetime import datetime
                birth_date = datetime.strptime(birth_date, '%Y-%m-%d').date()
        else:
            birth_date = None

        death_date = hero_data.get('death_date')
        if death_date:
            print(f"{bool(death_date)}=")
            if death_date and isinstance(death_date, str):
                from datetime import datetime
                death_date = datetime.strptime(death_date, '%Y-%m-%d').date()
        else:
            death_date = None

        result = await self.db.fetchrow(
            query,
            hero_data['full_name'],
            birth_date,
            death_date,
            hero_data.get('biography'),
            # photo_url = default.webp - если картинка не будет загружена
            "default.webp"
        )
        
        return result
    
    async def set_hero_image(self, hero_id: int, image_url: str):
        existance = await self.check_hero_existance_by_id(hero_id)
        if existance:
            await self.db.execute("UPDATE heroes SET photo_url = $1 WHERE id = $2", image_url, hero_id)
            return True, "images/" + image_url
        else:
            return False, None

    async def check_hero_existance_by_id(self, hero_id: int):
        hero = await self.db.fetchrow("SELECT id FROM heroes WHERE id = $1", hero_id)
        if hero:
            return True
        return False