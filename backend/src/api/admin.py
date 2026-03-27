from fastapi import (
    APIRouter, 
    Depends,
    HTTPException
)

# работа с админами
from schemas.admin import (
    AdminCreate,
    AdminLogin
)
from core.admin_exceptions import BaseAdminException
from repositories.admins import AdminsRepository
from services.admin_service import AdminsService
from dependencies.postgres import get_pg 

ad_router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

@ad_router.get("/{id}")
async def get_admin(
    id: int,
    pg = Depends(get_pg)
):
    try:
        repository = AdminsRepository(pg)
        service = AdminsService(repository)
        result = await service.get_admin(admin_id=id)
        return result
    except BaseAdminException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Внутренняя ошибка сервера"
        )

@ad_router.get("/")
async def get_admins(
    pg = Depends(get_pg)
):
    try:
        repository = AdminsRepository(pg)
        service = AdminsService(repository)
        result = await service.get_admins()
        return result
    except BaseAdminException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Внутренняя ошибка сервера"
        )

@ad_router.post("/login")
async def login_admin(
    body: AdminLogin,
    pg = Depends(get_pg)
):
    try:
        repository = AdminsRepository(pg)
        service = AdminsService(repository)
        result = await service.login_admin(
            email=body.email,
            password=body.password
        )
        return result
    except BaseAdminException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Внутренняя ошибка сервера"
        )

@ad_router.post("/create")
async def create_admin(
    body: AdminCreate,
    pg = Depends(get_pg)
):
    try:
        repository = AdminsRepository(pg)
        service = AdminsService(repository)
        result = await service.create_admin(
            email=body.email,
            password=body.password
        )
        return result
    except BaseAdminException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Внутренняя ошибка сервера"
        )

@ad_router.delete("/delete/{id}")
async def delete_admin(
    id: int,
    pg = Depends(get_pg)
):
    try:
        repository = AdminsRepository(pg)
        service = AdminsService(repository)
        result = await service.delete_admin(admin_id=id)
        return result
    except BaseAdminException as e:
        raise HTTPException(
            status_code=e.code,
            detail=e.message
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Внутренняя ошибка сервера"
        )
