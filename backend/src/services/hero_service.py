from repositories.heroes import HeroRepository
from schemas.hero import HeroCreate

from fastapi import HTTPException
from core.hero_exceptions import HeroNotFound

from services.award_service import AwardService
from services.rank_service import RanksService

class HeroService:
    def __init__(
            self, 
            repository: HeroRepository
        ) -> None:
        self.name = "HeroService"
        self.repo = repository

    async def get_full_hero_info(
            self, 
            hero_id: int, 
            award_service: AwardService, 
            rank_service: RanksService
        ):
        try:
            awards = await award_service.get_hero_awards(hero_id)
            rank = await rank_service.get_hero_rank(hero_id)

            hero = await self.get_hero(hero_id)

            hero = dict(hero)

            if isinstance(awards, dict):
                hero["awards"] = awards.get("awards", [])
            else:
                hero["awards"] = []

            hero["rank"] = rank

            return hero

        except Exception as e:
            print(f"{e}\tType: {type(e).__name__}")

    async def get_heroes(
            self,
            skip: int,
            limit: int,
            search: str,
            birth_year_from: int,
            birth_year_to: int,
            death_year_from: int,
            death_year_to: int,
            award_filter: str,
            rank_filter: str
        ):
        result = await self.repo.get(
            skip=skip,
            limit=limit,
            search=search,
            birth_year_from=birth_year_from,
            birth_year_to=birth_year_to,        
            death_year_to=death_year_to,
            death_year_from=death_year_from,
            award_filter=award_filter,
            rank_filter=rank_filter
        )
        return result

    async def get_hero(self, hero_id):
        existance = await self.repo.check_hero_existance_by_id(hero_id)
        if existance:
            hero = await self.repo.get_by_id(hero_id)
            return hero
        else:
            raise HeroNotFound(404)

    async def add_hero(self, hero_data: HeroCreate):
        hero_dict = hero_data.model_dump(exclude_unset=True)
        # Преобразуем строковые даты в формат, подходящий для PostgreSQL
        if 'birth_date' in hero_dict and hero_dict['birth_date']:
            hero_dict['birth_date'] = hero_dict['birth_date']
        if 'death_date' in hero_dict and hero_dict['death_date']:
            hero_dict['death_date'] = hero_dict['death_date']
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