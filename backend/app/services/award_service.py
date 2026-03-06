from repositories.awards import AwardsRepository

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

class AwardService:
    def __init__(self, repo: AwardsRepository) -> None:
        self.repo = repo
    
    async def get_awards(self):
        result = await self.repo.get_all()
        if result is not None:
            return result
        raise AwardNotFound
    
    async def get_award(self, award_id):
        result = await self.repo.get(award_id)
        if result is not None:
            return result
        raise AwardNotFound
    
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
    
    async def assign_award(
            self, 
            hero_id: int, 
            award_id: int, 
            date_awarded: str
        ):

        award_existance = await self.repo.check(award_id)

        if award_existance:
            try:
                await self.repo.assign_award(hero_id, award_id, date_awarded)
                return {
                    "status": True
                }
            except ForeignKeyViolationError as e:
                raise HeroNotFound(404)

        raise AwardNotFound
    
    async def get_hero_awards(self, hero_id: int):
        try:
            awards = await self.repo.get_hero_awards(hero_id)
            return {
                "awards": awards
            }
        
        except ForeignKeyViolationError as e:
            raise HeroNotFound(404)
