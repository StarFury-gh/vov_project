from pydantic import BaseModel
from typing import List
from .hero import HeroCreate


class AddRequest(BaseModel):
    hero: HeroCreate
    rank: str
    awards: List[str]