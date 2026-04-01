from repositories.locations import LocationRepository
from schemas.locations import (
    AddLocation
)

from asyncpg.exceptions import ForeignKeyViolationError

from core.exceptions.location_exceptions import BaseLocationException, HeroNotFound

from cache.decorator import redis_cache, invalidate_cache

CACHE_TTL = 600

class LocationService:
    def __init__(self, repo: LocationRepository) -> None:
        self.repo = repo

    @invalidate_cache()
    async def create_location(self, location: AddLocation):
        try:
            await self.repo.create(
                place_name=location.name,
                hero_id=location.hero_id,
                longtitude=location.longtitude,
                lattitude=location.lattitude
            )
            return {
                "status": True
            }
        
        except ForeignKeyViolationError:
            raise HeroNotFound

        except Exception as e:
            print(e, f"Type: {type(e).__name__}")
            raise BaseLocationException
    
    @redis_cache(CACHE_TTL)
    async def get_hero_location(self, hero_id: int):
        try:
            result = await self.repo.get_by_id(hero_id)
            if result:
                result = dict(result)
                return {
                    "status": True,
                    "location": result
                }
            
            return {
                "status": False
            }
        
        except KeyError as e:
            print("KeyError:", e)
            raise BaseLocationException

        except Exception as e:
            print(e, f"Type: {type(e).__name__}")
            raise BaseLocationException
        
    @redis_cache(CACHE_TTL)
    async def get_all_locations(self):
        try:
            result = await self.repo.get_all()
            return result
        
        except Exception as e:
            print(e, f"Type: {type(e).__name__}")
            raise BaseLocationException