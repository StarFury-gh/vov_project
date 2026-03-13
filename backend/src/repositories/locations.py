class LocationRepository:
    def __init__(self, db) -> None:
        self.db = db

    async def get_all(self):
        result = await self.db.fetch("SELECT * FROM hero_places")
        return [dict(record) for record in result]
    
    async def get_by_id(self, hero_id: int) -> dict:
        result = await self.db.fetchrow("SELECT name, latitude, longtitude FROM hero_places WHERE hero_id = $1", hero_id)
        return dict(result) if result else None
    
    async def create(
            self, 
            hero_id: int, 
            place_name: str, 
            lattitude: float, 
            longitude: float
        ) -> None:
        query = "INSERT INTO hero_places (hero_id, name, latitude, longtitude) VALUES ($1, $2, $3, $4)"
        await self.db.execute(
            query, 
            hero_id, 
            place_name, 
            lattitude, 
            longitude
        )