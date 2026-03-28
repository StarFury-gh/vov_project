from fastapi import APIRouter, HTTPException, Depends

from services.award_service import AwardService
from repositories.awards import AwardsRepository
from dependencies.postgres import get_pg
from core.award_exceptions import BaseAwardExcpetion
from core.hero_exceptions import HeroNotFound
from schemas.award import (
    AwardCreate, 
    AssignAward, 
    MultipleAssignAward
)

from core.security.admin_dep import require_admin

a_router = APIRouter(
    prefix="/awards",
    tags=["Awards"],
)

@a_router.get("/")
async def get_awards(
    pg = Depends(get_pg),
):
    try:
        repository = AwardsRepository(pg)
        service = AwardService(repository)

        result = await service.get_awards()

        return result

    except BaseAwardExcpetion as e:
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

@a_router.get("/name/{name}")
async def get_by_name(
    name: str,
    pg = Depends(get_pg)
):
    try:
        repository = AwardsRepository(pg)
        service = AwardService(repository)

        result = await service.get_by_name(name)

        return result

    except BaseAwardExcpetion as e:
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


@a_router.get("/{award_id}")
async def get_award_by_id(
    award_id: int,
    pg = Depends(get_pg)
):
    try:
        repository = AwardsRepository(pg)
        service = AwardService(repository)

        result = await service.get_award(award_id)

        return result

    except BaseAwardExcpetion as e:
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

@a_router.post("/")
async def add_award(
    award: AwardCreate,
    pg = Depends(get_pg),
    _ = Depends(require_admin)
):
    try:
        repository = AwardsRepository(pg)
        service = AwardService(repository)

        result = await service.add_award(award)

        return result

    except BaseAwardExcpetion as e:
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

@a_router.delete("/")
async def delete_award(
    award_id: int,
    _ = Depends(require_admin),
    pg = Depends(get_pg)
):
    try:
        repository = AwardsRepository(pg)
        service = AwardService(repository)

        result = await service.delete_award(award_id)

        return result

    except BaseAwardExcpetion as e:
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

@a_router.post("/assign")
async def assign_award(
    body: AssignAward,
    _ = Depends(require_admin),
    pg = Depends(get_pg)
):
    try:
        repository = AwardsRepository(pg)
        service = AwardService(repository)

        result = await service.assign_award(
            body.hero_id,
            body.award_id,
        )

        return result
    
    except BaseAwardExcpetion as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )

    except HeroNotFound as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )

    except Exception as e:
        print(e, f"Type: {type(e).__name__}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@a_router.post("/m_assign")
async def multiple_assign(
    body: MultipleAssignAward,
    _ = Depends(require_admin),
    pg = Depends(get_pg)
):
    try:
        repository = AwardsRepository(pg)
        service = AwardService(repository)

        result = await service.multiple_assign(
            hero_id=body.hero_id, 
            awards_names=body.awards
        )

        return result
    
    except BaseAwardExcpetion as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )

    except Exception as e:
        print(e, f"Type: {type(e).__name__}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
    

@a_router.get("/hero/{hero_id}")
async def get_hero_awards(
    hero_id: int,
    pg = Depends(get_pg)
):
    try:
        repository = AwardsRepository(pg)
        service = AwardService(repository)

        result = await service.get_hero_awards(hero_id)

        return result
    
    except BaseAwardExcpetion as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )

    except HeroNotFound as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )

    except Exception as e:
        print(e, f"Type: {type(e).__name__}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
