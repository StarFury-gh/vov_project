from pydantic import BaseModel

class AwardCreate(BaseModel):
    name: str
    description: str

class AssignAward(BaseModel):
    hero_id: int
    award_id: int
    date_awarded: str
