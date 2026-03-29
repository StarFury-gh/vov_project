from pydantic import BaseModel

class Pagination(BaseModel):
    limit: int = 1000
    offset: int = 0