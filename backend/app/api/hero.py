from fastapi import (
    APIRouter,
    Depends,
    Query,
    HTTPException
)

from dependencies.postgres import get_pg
from dependencies.heroes import (
    HeroResponse, 
    Pagination
)
from schemas.hero import HeroShort, HeroCreate

from repositories.heroes import HeroRepository
from services.hero_service import HeroService

h_router = APIRouter(
    prefix="/heroes",
    tags=["Heroes"]
)

@h_router.get("/", response_model=HeroResponse)
async def get_heroes(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    rank_id: int = Query(None),
    birth_year_from: int = Query(None, ge=1),
    birth_year_to: int = Query(None, ge=1),
    death_year_from: int = Query(None, ge=1),
    death_year_to: int = Query(None, ge=1),
    pg = Depends(get_pg)
):
    try:
        repository = HeroRepository(pg)
        service = HeroService(repository)
        return await service.get_heroes(
            skip=skip,
            limit=limit,
            search=search,
            rank_id=rank_id,
            birth_year_from=birth_year_from,
            birth_year_to=birth_year_to,        
            death_year_to=death_year_to,
            death_year_from=death_year_from
        )
    except Exception as e:
        print("Error:", e)
        return HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@h_router.get("/{hero_id}")
async def get_hero_by_id(
    hero_id: int,
    pg = Depends(get_pg)
):
    pass

@h_router.post("/")
async def add_hero(
    hero_data: HeroCreate,
    pg = Depends(get_pg),
):
    try:
        repository = HeroRepository(pg)
        service = HeroService(repository)
        result = await service.add_hero(hero_data)
        # if result and hasattr(result, 'id'):
        #     return result
        return result
    except Exception as e:
        print("Error:", e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )