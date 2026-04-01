from pydantic import BaseModel
from typing import List
from schemas.hero import HeroShort


class Pagination(BaseModel):
    limit: int
    offset: int

class HeroResponse(BaseModel):
    items: List[HeroShort]
    total: int
    skip: int
    limit: int
