from repositories.ranks import RanksRepository

from asyncpg.exceptions import UniqueViolationError

from core.rank_exceptions import (
    BaseRankException,
    RankAlreadyExists,
    HeroAlreadyHasRank,
    RankNotFound
)

from cache.decorator import redis_cache, invalidate_cache

CACHE_TTL = 300

class RanksService:
    def __init__(self, repo: RanksRepository):
        self.repo = repo

    @redis_cache(CACHE_TTL)
    async def get_ranks(self):
        try:
            result = await self.repo.get_all()
            return result
        except Exception as e:
            print(e)
            return None

    @redis_cache(CACHE_TTL)
    async def get_by_name(self, rank_name: str):
        result = await self.repo.get_by_name(rank_name)
        if result is None:
            raise RankNotFound
        return result

    @redis_cache(CACHE_TTL)
    async def get_rank_by_id(self, rank_id: int):
        result = await self.repo.get(rank_id)
        if result is None:
            raise RankNotFound
        return result

    @invalidate_cache()
    async def create_rank(self, rank):
        try:
            id = await self.repo.add(rank.name, rank.sort_order)
            return {
                "id": id
            }
        
        except UniqueViolationError:
            raise RankAlreadyExists()

        except Exception as e:
            raise e

    @invalidate_cache()
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
        
    @invalidate_cache()
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
    
    @invalidate_cache()
    async def assign_by_name(self, hero_id: int, rank_name: str):
        try:
            rank_id = await self.repo.get_by_name(rank_name)
            rank_id = rank_id["id"]
            await self.repo.assign_rank(hero_id, rank_id)
            return {
                "status": True
            }
        except Exception as e:
            print(e, f"Type: {type(e).__name__}")
            raise BaseRankException()
    
    @redis_cache(CACHE_TTL)
    async def get_hero_rank(self, hero_id: int):
        try:
            result = await self.repo.get_hero_rank(hero_id)
            return result
        
        except Exception as e:
            print(e, f"Type: {type(e).__name__}")
            raise BaseRankException()