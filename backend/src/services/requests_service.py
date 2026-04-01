from repositories.requests import RequestsRepository
from core.enums.requests_enum import RequestStatus

from core.exceptions.requests_exceptions import (
    BaseRequestsException,
    RequestNotFound,
)

from cache.decorator import invalidate_cache, redis_cache

from core.transfer import (
    transfer,
    FullHeroInfo,
    FullInfo
)

CACHE_TTL = 120

class RequestsService:
    def __init__(self, repository: RequestsRepository) -> None:
        self.repo = repository

    @redis_cache(CACHE_TTL)
    async def get(self, id: int):
        try:
            result = await self.repo.get(id)
            if result is None:
                raise RequestNotFound
            return result
        except Exception as e:
            raise e

    @redis_cache(CACHE_TTL)
    async def get_all(self, limit: int = 10, offset: int = 0):
        try:
            result = await self.repo.get_all(limit, offset)
            if result is None:
                return []
            return result
        except Exception as e:
            raise e

    @invalidate_cache()
    async def delete(self, id: int):
        try:
            if await self.repo.delete(id):
                return {
                    "status": "success",
                    "deleted_id": id
                }
            raise RequestNotFound
        except Exception as e:
            raise e

    @invalidate_cache()
    async def update(
            self, 
            id: int, 
            status: RequestStatus,
            user: dict,
        ):
        try:
            if user.get("email") is None:
                raise BaseRequestsException(
                    "Токен не содержит email", 401
                )
            if await self.repo.update(id, status.value, user.get("id")): # type: ignore
                if status == RequestStatus.APPROVED:
                    current_info = await self.get(id) # type: ignore
                    if current_info is not None:
                        hero_info = FullHeroInfo(
                            full_name=current_info["full_name"],
                            biography=current_info["biography"],
                            birth_date=str(current_info["birth_date"]),
                            death_date=str(current_info["death_date"]),
                            w_type=current_info["w_type"],
                            photo_url=current_info["photo_url"]
                        )
                        import json
                        if current_info.get("place") is not None:
                            hero_place = json.loads(current_info.get("place", ""))
                        else:
                            hero_place = None
                        full_info = FullInfo(
                            hero=hero_info,
                            awards=current_info.get("awards", []),
                            rank=current_info.get("rank", ""),
                            location=hero_place,
                        )
                        result = await transfer(full_info, self.repo.db)
                        if result:
                            return {
                                "status": "success",
                            }
                        else:
                            return {
                                "status": "failed",
                                "reason": "transfer failed: hero already exists"
                            }
                return {
                    "status": "success",
                    "id": id,
                    "new_status": status
                }
            raise RequestNotFound
        except Exception as e:
            raise e
