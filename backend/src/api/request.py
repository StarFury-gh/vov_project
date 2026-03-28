from fastapi import APIRouter

from dependencies.add_requests import (
    Pagination,
    
)

req_router = APIRouter(
    prefix="/request",
    tags=["request"]
)

@req_router.get("/")
async def get_all_requests():
    pass

@req_router.get("/{request_id}")
async def get_request(request_id: int):
    pass

@req_router.post("/")
async def create_request():
    pass

@req_router.put("/{request_id}")
async def update_request(request_id: int):
    # TODO: approve / reject
    pass

@req_router.delete("/{request_id}")
async def delete_request(request_id: int):
    pass

