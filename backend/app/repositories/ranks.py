class RanksRepository:
    def __init__(self, db):
        self.db = db

    async def get_all(self):
        return await self.db.fetch("SELECT * FROM ranks")
    
    async def get_by_id(self, id):
        return await self.db.fetchrow("SELECT * FROM ranks WHERE id = $1", id)

    async def add(self, name: str, sort_order: int):
        return await self.db.fetchval("INSERT INTO ranks (name, sort_order) VALUES ($1, $2) RETURNING id", name, sort_order)

    async def check(self, id: int):
        if await self.db.fetchrow("SELECT id FROM ranks WHERE id = $1", id):
            return True
        return False

    async def delete(self, id: int):
        await self.db.execute("DELETE FROM ranks WHERE id = $1", id)

    