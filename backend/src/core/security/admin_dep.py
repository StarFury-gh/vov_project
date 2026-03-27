from fastapi import (
    Header, 
    HTTPException, 
    status
)
import jwt

from core.config import config_obj

def get_current_user_email(authorization: str | None = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Это действие может выполнить только администратор.",
        )
    
    SECRET_KEY = config_obj.JWT_SECRET_KEY
    ALGORITHM = "HS256"

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный формат заголовка авторизации",
        )

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        email: str = payload.get("email") # type: ignore

        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Токен не содержит email",
            )

        return email

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")

    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    