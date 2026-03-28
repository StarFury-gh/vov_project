from fastapi import Header, HTTPException, status, Depends
import jwt

from core.config import config_obj
from dependencies.postgres import get_pg
from services.admin_service import AdminsService
from repositories.admins import AdminsRepository


async def get_current_user(
    authorization: str | None = Header(None)
) -> dict:
    """
    Извлекает email пользователя из JWT.
    Если заголовок Authorization отсутствует или некорректен — выбрасывает HTTPException.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Необходима авторизация",
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный формат заголовка авторизации",
        )

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(
            token,
            config_obj.JWT_SECRET_KEY,
            algorithms=["HS256"],
        )
        email: str | None = payload.get("email")
        id: int | None = payload.get("id")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Токен не содержит email",
            )
        if not id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Токен не содержит id",
            )
        
        return {
            "email": email,
            "id": id
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")

    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


async def is_admin(
    payload: dict = Depends(get_current_user),
    db=Depends(get_pg),
) -> bool:
    admins_repo = AdminsRepository(db)
    admin_service = AdminsService(admins_repo)

    return await admin_service.is_admin(payload.get("email"))


async def require_admin(
    admin_status: bool = Depends(is_admin)
):
    """
    Проверяет, является ли текущий пользователь администратором.
    Если нет — выбрасывает 403.
    """
    if not admin_status:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен",
        )