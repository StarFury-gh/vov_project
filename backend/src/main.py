from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles 
from uvicorn import run

from contextlib import asynccontextmanager

from cache.client import init_redis, close_redis

from api.hero import h_router
from api.award import a_router
from api.rank import r_router
from api.location import l_router
from api.admin import ad_router
from api.request import req_router

from os import path, makedirs

from prometheus_fastapi_instrumentator import Instrumentator
from asyncpg import create_pool
from core.config import config_obj

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_redis()
        app.state.pg_pool = await create_pool(
            host=config_obj.DB_HOST,
            port=config_obj.DB_PORT,
            user=config_obj.DB_USER,
            password=config_obj.DB_PASSWORD,
            database=config_obj.DB_NAME,
            min_size=1,
            max_size=20,
        )
        yield
        await close_redis()
        await app.state.pool.close()
    except Exception as e:
        print("Application startup error:", e, "Type:")

app = FastAPI(
    lifespan=lifespan
)

app.include_router(h_router)
app.include_router(a_router)
app.include_router(r_router)
app.include_router(l_router)
app.include_router(ad_router)
app.include_router(req_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_headers=["*"],
    allow_methods=["*"]
)

Instrumentator().instrument(app).expose(app)

if not path.exists("images"):
    makedirs("images")

app.mount("/images", StaticFiles(directory="images"), name="images")

if __name__ == "__main__":
    run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        workers=5,
        loop="uvloop",
    )