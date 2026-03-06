class AwardsRepository:
    def __init__(self, db):
        self.db = db

    async def get(self, award_id: int):
        res = await self.db.fetchrow("SELECT * FROM awards WHERE id = $1", award_id)
        return res
    
    async def get_all(self):
        res = await self.db.fetch("SELECT * FROM awards")
        return res

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
        date_awarded: str
    ):
        from datetime import datetime
        awarded_on = datetime.strptime(date_awarded, r'%Y-%m-%d').date()

        await self.db.execute(
            "INSERT INTO hero_awards (hero_id, award_id, date_awarded) VALUES ($1, $2, $3::date)", 
            hero_id, 
            award_id, 
            awarded_on
        )

    async def get_hero_awards(self, hero_id: int):
        awards_ids = await self.db.fetch("SELECT award_id FROM hero_awards WHERE hero_id = $1", hero_id)
        awards = await self.db.fetch("SELECT name FROM awards WHERE id=ANY($1)", awards_ids)
        result = [award["name"] for award in awards]

        return result