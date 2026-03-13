from __future__ import annotations

import functools
import hashlib
import json
import logging
from typing import Any, Callable, TypeVar

from redis.asyncio import Redis
from redis.exceptions import RedisError

logger = logging.getLogger(__name__)

F = TypeVar("F", bound=Callable[..., Any])


# ненерация ключей
def _stable_hash(value: Any) -> str:
    """Возвращает короткой SH-256 хеш"""
    raw = json.dumps(value, sort_keys=True, default=str)
    return hashlib.sha256(raw.encode()).hexdigest()[:16]

def make_cache_key(
    func: Callable[..., Any],
    args: tuple,
    kwargs: dict,
    skip_first_arg: bool = True,
) -> str:
    """
    Собирает детерминированный ключ кэша из полного имени функции и её аргументов.
    
    Формат ключа:  
    -------
    app:module:qualname:args_hash
    """
    hashable_args = args[1:] if skip_first_arg and args else args
    payload: dict[str, Any] = {"a": hashable_args, "k": kwargs}
    args_hash = _stable_hash(payload)
    return f"app:{func.__module__}.{func.__qualname__}:{args_hash}"


# функции для сериализации данных
def serialize(value: Any) -> str:
    """Сериализует значение в JSON строку"""
    return json.dumps(value, default=str)


def deserialize(raw: str | bytes) -> Any:
    """Десериализует JSON в объект"""
    return json.loads(raw)

# декоратор кеширования ответов
def redis_cache(
    ttl: int = 60,
    *,
    redis_client: Redis | None = None,
) -> Callable[[F], F]:
    """
    Асинхронный декоратор для кэширования результатов вызова функции.

    Параметры
    ----------
    ttl:
        Time-to-live в секундах
    redis_client:
        redis.asyncio.Redis клиент
    Usage
    -----
        @redis_cache(ttl=60)
        async def func(param: type) -> type:
            ...
    """
    def decorator(func: F) -> F:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            from cache.client import get_redis

            client: Redis = redis_client or get_redis()
            key = make_cache_key(func, args, kwargs)

            # чтение кеша
            try:
                cached = await client.get(key)
                if cached is not None:
                    return deserialize(cached)
                
            except RedisError as exc:
                # Redis недоступен
                return await func(*args, **kwargs)

            # выполнение функции
            result = await func(*args, **kwargs)

            # запись в кеш
            try:
                await client.set(key, serialize(result), ex=ttl)
            except RedisError as exc:
                logger.warning("Redis SET failed (key=%s): %s", key, exc)

            return result

        return wrapper  # type: ignore[return-value]

    return decorator