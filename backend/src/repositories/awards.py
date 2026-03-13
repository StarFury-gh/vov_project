class AwardsRepository:
    def __init__(self, db):
        self.db = db

    async def get(self, award_id: int):
        res = await self.db.fetchrow("SELECT * FROM awards WHERE id = $1", award_id)
        return [dict(record) for record in res]
    
    async def get_all(self):
        res = await self.db.fetch("SELECT * FROM awards")
        return [dict(record) for record in res]

    async def get_by_name(self, name: str):
        res = await self.db.fetchrow("SELECT id FROM awards WHERE name = $1", name)
        print(f"get_by_name: {res=}")
        return dict(res).get("id")

    async def add(self, award_name: str, desciption: str):
        award_id = await self.db.fetchval(
            "INSERT INTO awards (name, description) VALUES ($1, $2) RETURNING id",
            award_name, desciption
        )
        return award_id

    async def delete(self, award_id: int):
        await self.db.execute("DELETE FROM awards WHERE id = $1", award_id)

    async def check(self, award_id: int):
        ex = await self.db.fetchrow("SELECT id FROM awards WHERE id = $1", award_id)
        if ex:
            return True
        return False
    
    async def assign_award(
        self, 
        hero_id: int, 
        award_id: int, 
    ):
        await self.db.execute(
            "INSERT INTO hero_awards (hero_id, award_id) VALUES ($1, $2)", 
            hero_id, 
            award_id, 
        )

    async def get_hero_awards(self, hero_id: int):
        awards_ids = await self.db.fetch("SELECT award_id FROM hero_awards WHERE hero_id = $1", hero_id)
        awards = await self.db.fetch("SELECT name FROM awards WHERE id=ANY($1)", awards_ids)
        result = [award["name"] for award in awards]
        return result