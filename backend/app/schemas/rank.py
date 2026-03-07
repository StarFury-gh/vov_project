from pydantic import BaseModel

class RankCreate(BaseModel):
    name: str
    sort_order: int