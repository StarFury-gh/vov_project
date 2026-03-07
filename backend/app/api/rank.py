from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from schemas.rank import (
    RankCreate,
    RankAssign
)
from repositories.ranks import RanksRepository
from services.rank_service import RanksService
from dependencies.postgres import get_pg

from core.rank_exceptions import BaseRankException

r_router = APIRouter(
    prefix="/ranks",
    tags=["Ranks"]
)

@r_router.get("/")
async def get_ranks(
    pg = Depends(get_pg)
):
    try:
        repository = RanksRepository(pg)
        service = RanksService(repository)
        result = await service.get_ranks()
        return result
    
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@r_router.get("/{rank_id}")
async def get_rank_by_id(
    rank_id: int,
    pg = Depends(get_pg)
):
    try:
        repository = RanksRepository(pg)
        service = RanksService(repository)
        result = await service.get_rank_by_id(rank_id)
        return result
    
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@r_router.get("/name/{rank_name}")
async def get_rank_by_name(
    rank_name: str,
    pg = Depends(get_pg)
):
    try:
        repository = RanksRepository(pg)
        service = RanksService(repository)
        result = await service.get_by_name(rank_name)
        return result
    
    except BaseRankException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )

    except Exception as e:
        print(f"{e} Type: {type(e).__name__}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@r_router.post("/")
async def create_rank(
    rank: RankCreate,
    pg = Depends(get_pg)
):
    try:
        repository = RanksRepository(pg)
        service = RanksService(repository)

        result = await service.create_rank(rank)

        return result
    
    except BaseRankException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )

    except Exception as e:
        print(e, f"Type: {type(e).__name__}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@r_router.patch("/")
async def change_rank():
    return {"message": "Rank changed"}

@r_router.delete("/")
async def delete_rank():
    return {"message": "Rank deleted"}

@r_router.post("/assign")
async def assign_rank(
    body: RankAssign,
    pg = Depends(get_pg)
):
    try:
        repository = RanksRepository(pg)
        service = RanksService(repository)

        result = await service.assgin_rank(
            rank_id=body.rank_id,
            hero_id=body.hero_id
        )

        return result
    
    except BaseRankException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    
    except Exception as e:
        print(e, f"Type: {type(e).__name__}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )