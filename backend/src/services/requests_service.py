from repositories.requests import RequestsRepository
from core.enums.requests_enum import RequestStatus

from core.exceptions.requests_exceptions import (
    BaseRequestsException,
    RequestNotFound,
)

class RequestsService:
    def __init__(self, repository: RequestsRepository) -> None:
        self.repo = repository

    async def get(self, id: int):
        try:
            result = await self.repo.get(id)
            if result is None:
                raise RequestNotFound
            return result
        except Exception as e:
            raise e

    async def get_all(self, limit: int = 10, offset: int = 0):
        try:
            result = await self.repo.get_all(limit, offset)
            if result is None:
                return []
            return result
        except Exception as e:
            raise e

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

    async def update(
            self, 
            id: int, 
            status: RequestStatus,
            user: dict
        ):
        try:
            if user.get("email") is None:
                raise BaseRequestsException(
                    "Токен не содержит email", 401
                )
            if await self.repo.update(id, status, user.get("email")): # type: ignore
                return {
                    "status": "success",
                    "id": id,
                    "new_status": status
                }
            raise RequestNotFound
        except Exception as e:
            raise e
