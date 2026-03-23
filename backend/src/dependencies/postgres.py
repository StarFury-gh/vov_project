from fastapi import Request

async def get_pg(request: Request):
    pool = getattr(request.app.state, "pg_pool", None)

    if pool is None:
        raise RuntimeError("Postgres pool is not initialized")

    async with pool.acquire() as connection:
        yield connection