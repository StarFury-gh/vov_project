from repositories.ranks import RanksRepository

from asyncpg.exceptions import UniqueViolationError

from core.rank_exceptions import (
    BaseRankException,
    RankAlreadyExists,
    HeroAlreadyHasRank
)

class RanksService:
    def __init__(self, repo: RanksRepository):
        self.repo = repo

    async def get_ranks(self):
        try:
            result = await self.repo.get_all()
            return result
        except Exception as e:
            print(e)
            return None

    async def get_rank_by_id(self, rank_id: int):
        try:
            result = await self.repo.get(rank_id)
            return result
        except Exception as e:
            print(e)
            return None

    async def create_rank(self, rank):
        try:
            await self.repo.add(rank.name, rank.sort_order)
            return True
        
        except UniqueViolationError:
            raise RankAlreadyExists()

        except Exception as e:
            raise e

    async def delete_rank(self, rank_id: int):
        try:
            existance = self.repo.check(rank_id)
            if existance:
                await self.repo.delete(rank_id)
                return True
            return False
        except Exception as e:
            print(e)
            return None
        
    async def assgin_rank(self, hero_id: int, rank_id: int):
        try:
            await self.repo.assign_rank(hero_id, rank_id)
            return {
                "status": True
            }
        
        except UniqueViolationError as e:
            raise HeroAlreadyHasRank

        except Exception as e:
            print(e, f"Type: {type(e).__name__}")
            raise BaseRankException()