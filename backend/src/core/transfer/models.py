from pydantic import BaseModel

class FullHeroInfo(BaseModel):
    full_name: str
    birth_date: str
    death_date: str
    biography: str
    photo_url: str
    w_type: str

class FullInfo(BaseModel):
    hero: FullHeroInfo
    awards: str
    rank: str
    location: dict | None