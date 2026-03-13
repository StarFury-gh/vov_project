from repositories.awards import AwardsRepository
from typing import List

from asyncpg.exceptions import (
    UniqueViolationError,
    ForeignKeyViolationError
)

from schemas.award import (
    AwardCreate
)
from core.award_exceptions import (
    AwardNotFound,
    AwardAlreadyExists
)
from core.hero_exceptions import (
    HeroNotFound,
)

from cache.decorator import redis_cache

class AwardService:
    def __init__(self, repo: AwardsRepository) -> None:
        self.repo = repo
    
    @redis_cache(60)
    async def get_awards(self):
        result = await self.repo.get_all()
        if result is not None:
            return result
        raise AwardNotFound
    
    @redis_cache(60)
    async def get_award(self, award_id):
        result = await self.repo.get(award_id)
        if result is not None:
            return result
        raise AwardNotFound
    
    @redis_cache(60)
    async def get_by_name(self, name: str):
        return await self.repo.get_by_name(name)

    async def add_award(self, award: AwardCreate):
        try:
            result = await self.repo.add(
                award_name=award.name,
                desciption=award.description
            )
            return {
                "id": result,
            }
    
        except UniqueViolationError:
            raise AwardAlreadyExists
        
    async def delete_award(self, award_id):
        
        existance = await self.repo.check(award_id)
        if existance:
            await self.repo.delete(award_id)

            return {
                "deleted": True
            }

        raise AwardNotFound    
    
    async def multiple_assign(self, hero_id: int, awards_names: List[str]):
        for award in awards_names:
            award_id = await self.repo.get_by_name(award)
            award_id = award_id.get("id")
            if award_id:
                await self.assign_award(hero_id, award_id)
            else:
                raise AwardNotFound

    async def assign_award(
            self, 
            hero_id: int, 
            award_id: int, 
        ):

        award_existance = await self.repo.check(award_id)

        if award_existance:
            try:
                await self.repo.assign_award(hero_id, award_id)
                return {
                    "status": True
                }
            except ForeignKeyViolationError as e:
                raise HeroNotFound(404)

        raise AwardNotFound
    
    @redis_cache(60)
    async def get_hero_awards(self, hero_id: int):
        try:
            awards = await self.repo.get_hero_awards(hero_id)
            return {
                "awards": awards
            }
        
        except ForeignKeyViolationError as e:
            raise HeroNotFound(404)
