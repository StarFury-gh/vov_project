from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles 
from uvicorn import run

from api.hero import h_router
from api.award import a_router
from api.rank import r_router

app = FastAPI()

app.include_router(h_router)
app.include_router(a_router)
app.include_router(r_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_headers=["*"],
    allow_methods=["*"]
)

app.mount("/images", StaticFiles(directory="images"), name="images")

if __name__ == "__main__":
    run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )