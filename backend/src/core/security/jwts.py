import jwt
from datetime import datetime, timedelta, timezone

from core.config import config_obj


def create_access_token(data: dict, expires_delta: timedelta):
    ALGORITHM = "HS256"
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode, 
        config_obj.JWT_SECRET_KEY, 
        algorithm=ALGORITHM
    )


def decode_token(token: str) -> dict:
    ALGORITHM = "HS256"
    
    return jwt.decode(
        token, 
        config_obj.JWT_SECRET_KEY, 
        algorithms=[ALGORITHM]
    )