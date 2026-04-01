from fastapi import (
    APIRouter, 
    Depends, 
    HTTPException
)

from core.security.admin_dep import (
    require_admin, 
    get_current_user
)

from dependencies.postgres import get_pg

from repositories.requests import RequestsRepository
from services.requests_service import RequestsService
from core.exceptions.requests_exceptions import BaseRequestsException

# Для переноса данных из таблицы запросов в итоговую таблицу
# Награды
from repositories.awards import AwardsRepository
from services.award_service import AwardService
# Ранги
from repositories.ranks import RanksRepository
from services.rank_service import RanksService
# Герои
from repositories.heroes import HeroRepository
from services.hero_service import HeroService

from core.enums.requests_enum import RequestStatus

from dependencies.add_requests import (
    Pagination,
)

req_router = APIRouter(
    prefix="/requests",
    tags=["requests"]
)

@req_router.get("/")
async def get_all_requests(
    pagination = Depends(Pagination),
    _ = Depends(require_admin),
    pg = Depends(get_pg),
):
    try:
        req_repo = RequestsRepository(pg)
        service = RequestsService(req_repo)
        result = await service.get_all(
            limit=pagination.limit,
            offset=pagination.offset
        )
        return result
    except BaseRequestsException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@req_router.get("/{request_id}")
async def get_request(
    request_id: int,
    _ = Depends(require_admin),
    pg = Depends(get_pg),
    ):
    try:
        req_repo = RequestsRepository(pg)
        service = RequestsService(req_repo)
        result = await service.get(id=request_id)
        return result
    except BaseRequestsException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@req_router.patch("/{request_id}")
async def update_request(
    request_id: int,
    status: RequestStatus,
    _=Depends(require_admin),
    user = Depends(get_current_user),
    pg=Depends(get_pg),
):
    try:
        req_repo = RequestsRepository(pg)
        service = RequestsService(req_repo)
        result = await service.update(
            id=request_id,
            status=status,
            user=user,
        )
        return result
    except BaseRequestsException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@req_router.delete("/{request_id}")
async def delete_request(
    request_id: int,
    _=Depends(require_admin),
    pg=Depends(get_pg),
):
    try:
        req_repo = RequestsRepository(pg)
        service = RequestsService(req_repo)
        result = await service.delete(id=request_id)
        return result
    except BaseRequestsException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

