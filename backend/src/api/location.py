from fastapi import (
    APIRouter, 
    Depends,
    HTTPException
)

from schemas.locations import AddLocation
from core.location_exceptions import BaseLocationException
from services.locations_service import LocationService
from repositories.locations import LocationRepository

from dependencies.postgres import get_pg

from core.security.admin_dep import require_admin

l_router = APIRouter(
    prefix="/locations",
    tags=["Locations"]
)

@l_router.get("/")
async def get_locations(
    pg = Depends(get_pg)
):
    try:
        repository = LocationRepository(pg)
        service = LocationService(repository)

        result = await service.get_all_locations()

        return result
    
    except BaseLocationException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@l_router.get("/{hero_id}")
async def get_hero_location(
    hero_id: int,
    pg = Depends(get_pg)
):
    try:
        repository = LocationRepository(pg)
        service = LocationService(repository)

        result = await service.get_hero_location(hero_id)

        return result
    
    except BaseLocationException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@l_router.post("/")
async def create_location(
    body: AddLocation,
    _ = Depends(require_admin),
    pg = Depends(get_pg)
):
    try:
        repository = LocationRepository(pg)
        service = LocationService(repository)

        result = await service.create_location(body)

        return result
    
    except BaseLocationException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )