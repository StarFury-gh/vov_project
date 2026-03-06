from repositories.heroes import HeroRepository
from schemas.hero import HeroCreate

from fastapi import HTTPException

class HeroService:
    def __init__(
            self, 
            repository: HeroRepository
        ) -> None:
        self.name = "HeroService"
        self.repo = repository

    async def get_heroes(
            self,
            skip: int,
            limit: int,
            search: str,
            rank_id: int,
            birth_year_from: int,
            birth_year_to: int,
            death_year_from: int,
            death_year_to: int,
        ):
        result = await self.repo.get(
            skip=skip,
            limit=limit,
            search=search,
            rank_id=rank_id,
            birth_year_from=birth_year_from,
            birth_year_to=birth_year_to,        
            death_year_to=death_year_to,
            death_year_from=death_year_from
        )
        return result

    async def get_hero(self, hero_id):
        hero = await self.repo.get_by_id(hero_id)
        return hero

    async def add_hero(self, hero_data: HeroCreate):
        hero_dict = hero_data.model_dump(exclude_unset=True)
        # Преобразуем строковые даты в формат, подходящий для PostgreSQL
        if 'birth_date' in hero_dict and hero_dict['birth_date']:
            hero_dict['birth_date'] = hero_dict['birth_date']  # FastAPI уже валидирует формат даты
        if 'death_date' in hero_dict and hero_dict['death_date']:
            hero_dict['death_date'] = hero_dict['death_date']  # FastAPI уже валидирует формат даты
        result = await self.repo.create(hero_dict)
        return result
    
    async def save_image(self, hero_id: int, filename: str):
        status, file = await self.repo.set_hero_image(hero_id, filename)
        if status:
            return {
                "image_url": file
            }
        return HTTPException(
            status_code=404,
            detail="Герой не найден."
        )