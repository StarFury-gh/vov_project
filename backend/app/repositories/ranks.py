class RanksRepository:
    def __init__(self, db):
        self.db = db

    async def get_all(self):
        return await self.db.fetch("SELECT * FROM ranks")
    
    async def get(self, id):
        return await self.db.fetchrow("SELECT * FROM ranks WHERE id = $1", id)

    async def get_by_name(self, rank_name: str):
        return await self.db.fetchrow("SELECT id FROM ranks WHERE name ILIKE $1", rank_name)

    async def get_hero_rank(self, hero_id):
        rank_id = await self.db.fetchrow("SELECT rank_id FROM hero_ranks WHERE hero_id = $1", hero_id)
        if not rank_id:
            return "Мы не нашли информацию о звании этого героя..."
        rank_id = dict(rank_id).get("rank_id")
        rank = await self.db.fetchrow("SELECT name FROM ranks WHERE id=$1", rank_id)
        rank_name = dict(rank).get("name")
        return rank_name

    async def add(self, name: str, sort_order: int):
        return await self.db.fetchval("INSERT INTO ranks (name, sort_order) VALUES ($1, $2) RETURNING id", name, sort_order)

    async def check(self, id: int):
        if await self.db.fetchrow("SELECT id FROM ranks WHERE id = $1", id):
            return True
        return False

    async def delete(self, id: int):
        await self.db.execute("DELETE FROM ranks WHERE id = $1", id)

    async def assign_rank(self, hero_id: int, rank_id: int):
        await self.db.execute("INSERT INTO hero_ranks (hero_id, rank_id) VALUES ($1, $2)", hero_id, rank_id)