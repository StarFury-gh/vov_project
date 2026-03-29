from pydantic import BaseModel
from typing import Optional, List

class HeroShort(BaseModel):
    id: int
    full_name: str
    rank_name: Optional[str]
    photo_url: Optional[str]
    birth_date: Optional[str]
    death_date: Optional[str]
    summary_info: Optional[str]


class HeroFull(BaseModel):
    id: int
    full_name: str
    birth_date: Optional[str]
    death_date: Optional[str]
    rank_id: Optional[int]
    rank_name: Optional[str]
    biography: Optional[str]
    photo_url: Optional[str]
    awards: List[dict] = []
    photos: List[dict] = []

class PlaceData(BaseModel):
    name: str
    latitude: float
    longtitude: float

class HeroCreate(BaseModel):
    full_name: str
    w_type: str
    birth_date: Optional[str] = None
    death_date: Optional[str] = None
    biography: Optional[str] = None
    awards: Optional[List[str]] = None
    rank: Optional[str] = None
    place: Optional[PlaceData] = None