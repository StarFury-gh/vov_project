class HeroRepository:
    def __init__(self, db):
        self.db = db

    async def get(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str = None,
        rank_id: int = None,
        birth_year_from: int = None,
        birth_year_to: int = None,
        death_year_from: int = None,
        death_year_to: int = None
    ):
        query = """SELECT h.id, h.full_name, h.birth_date, h.death_date, 
                      h.photo_url, r.name as rank_name,
                      COALESCE(h.biography, '') as summary_info
               FROM heroes h
               LEFT JOIN ranks r ON h.rank_id = r.id
               WHERE 1=1
               GROUP BY h.id, r.name"""
        
        parameters = []
        
        if search:
            query += " AND h.full_name ILIKE $1"
            parameters.append(f'%{search}%')
        
        if rank_id:
            rank_param_index = len(parameters) + 1
            query += f" AND h.rank_id = ${rank_param_index}"
            parameters.append(rank_id)
        
        if birth_year_from:
            birth_from_idx = len(parameters) + 1
            query += f" AND EXTRACT(YEAR FROM h.birth_date) >= ${birth_from_idx}"
            parameters.append(birth_year_from)
        
        if birth_year_to:
            birth_to_idx = len(parameters) + 1
            query += f" AND EXTRACT(YEAR FROM h.birth_date) <= ${birth_to_idx}"
            parameters.append(birth_year_to)
        
        if death_year_from:
            death_from_idx = len(parameters) + 1
            query += f" AND EXTRACT(YEAR FROM h.death_date) >= ${death_from_idx}"
            parameters.append(death_year_from)
        
        if death_year_to:
            death_to_idx = len(parameters) + 1
            query += f" AND EXTRACT(YEAR FROM h.death_date) <= ${death_to_idx}"
            parameters.append(death_year_to)
        
        # Добавляем пагинацию
        limit_idx = len(parameters) + 1
        offset_idx = len(parameters) + 2
        query += f" ORDER BY h.id LIMIT ${limit_idx} OFFSET ${offset_idx}"
        parameters.extend([limit, skip])
        
        result = await self.db.fetch(query, *parameters)
        
        # Получаем общее количество записей с теми же фильтрами, но без пагинации
        # Получаем общее количество записей с теми же фильтрами, но без пагинации
        count_query = f"SELECT COUNT(*) FROM ({query.split('ORDER BY')[0]}) as count_subquery"
        count_result = await self.db.fetchrow(count_query, *parameters[:-2])
        total = count_result['count'] if count_result else 0
        
        return {
            "items": result,
            "total": total,
            "skip": skip,
            "limit": limit
        }

    async def create(self, hero_data: dict):
        query = """
        INSERT INTO heroes (full_name, birth_date, death_date, rank_id, biography, photo_url)
        VALUES ($1, $2::date, $3::date, $4, $5, $6)
        RETURNING id, full_name, birth_date, death_date, rank_id, biography, photo_url
        """
        
        # Преобразуем строковые даты в объекты date, если они строки
        birth_date = hero_data.get('birth_date')
        if birth_date and isinstance(birth_date, str):
            from datetime import datetime
            birth_date = datetime.strptime(birth_date, '%Y-%m-%d').date()
        
        death_date = hero_data.get('death_date')
        if death_date and isinstance(death_date, str):
            from datetime import datetime
            death_date = datetime.strptime(death_date, '%Y-%m-%d').date()
        
        result = await self.db.fetchrow(
            query,
            hero_data['full_name'],
            birth_date,
            death_date,
            hero_data.get('rank_id') if hero_data.get('rank_id') not in [0, None] else None,
            hero_data.get('biography'),
            hero_data.get('photo_url')
        )
        
        return result