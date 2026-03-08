from pydantic import BaseModel
from typing import List

class AwardCreate(BaseModel):
    name: str
    description: str

class AssignAward(BaseModel):
    hero_id: int
    award_id: int

class MultipleAssignAward(BaseModel):
    hero_id: int
    awards: List[str]