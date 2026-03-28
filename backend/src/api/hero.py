from fastapi import (
    APIRouter,
    Depends,
    Query,
    HTTPException,
    UploadFile
)

from dependencies.postgres import get_pg
from schemas.hero import HeroCreate

from repositories.heroes import HeroRepository
from services.hero_service import HeroService

from core.files import save_file
from core.hero_exceptions import BaseHeroException

from core.security.admin_dep import require_admin

h_router = APIRouter(
    prefix="/heroes",
    tags=["Heroes"]
)

@h_router.get("/")
async def get_heroes(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    birth_year_from: int = Query(None, ge=1),
    birth_year_to: int = Query(None, ge=1),
    death_year_from: int = Query(None, ge=1),
    death_year_to: int = Query(None, ge=1),
    award_filter: str = Query(None),
    rank_filter: str = Query(None),
    w_type: str = Query("vov"),
    pg = Depends(get_pg)
):
    try:
        repository = HeroRepository(pg)
        service = HeroService(repository)
        return await service.get_heroes(
            skip=skip,
            limit=limit,
            search=search,
            birth_year_from=birth_year_from,
            birth_year_to=birth_year_to,        
            death_year_to=death_year_to,
            death_year_from=death_year_from,
            award_filter=award_filter,
            rank_filter=rank_filter,
            w_type=w_type
        )
    except Exception as e:
        print("Error:", e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@h_router.get("/{hero_id}")
async def get_hero_by_id(
    hero_id: int,

    pg = Depends(get_pg)
):
    try:

        from services.award_service import AwardService, AwardsRepository
        from services.rank_service import RanksService, RanksRepository
        from services.locations_service import LocationService, LocationRepository

        award_repo = AwardsRepository(pg)
        award_service = AwardService(award_repo)

        rank_repo = RanksRepository(pg)
        rank_service = RanksService(rank_repo)

        location_repo = LocationRepository(pg)
        location_service = LocationService(location_repo)

        repository = HeroRepository(pg)
        service = HeroService(repository)

        result = await service.get_full_hero_info(
            hero_id=hero_id,
            award_service=award_service,
            rank_service=rank_service,
            location_service=location_service
        )

        return result
    
    except BaseHeroException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    except Exception as e:
        print("Error:", e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@h_router.post("/")
async def add_hero(
    hero_data: HeroCreate,
    _ = Depends(require_admin),
    pg = Depends(get_pg),
):
    try:
        repository = HeroRepository(pg)
        service = HeroService(repository)
        result = await service.add_hero(hero_data)
        return result
    
    except BaseHeroException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    
    except Exception as e:
        print("Error:", e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
    
@h_router.post("/image")
async def add_hero_image(
    image: UploadFile,
    hero_id: int,
    _ = Depends(require_admin),
    pg = Depends(get_pg),
):
    try:
        status, filename = await save_file(image)
        if status:
            repository = HeroRepository(pg)
            service = HeroService(repository)
            res = await service.save_image(hero_id, filename)
            return res
        raise HTTPException(
            status_code=500,
            detail="Ошибка при загрузке изображения"
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Ошибка при загрузке изображения"
        )