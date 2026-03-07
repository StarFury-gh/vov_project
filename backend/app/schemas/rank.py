from pydantic import BaseModel

class RankCreate(BaseModel):
    name: str
    sort_order: int

class RankAssign(BaseModel):
    hero_id: int
    rank_id: int