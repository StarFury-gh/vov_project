from pydantic import BaseModel

class AddLocation(BaseModel):
    name: str
    hero_id: int
    lattitude: float
    longtitude: float
    