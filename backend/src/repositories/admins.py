class AdminsRepository:
    def __init__(self, db) -> None:
        self.db = db

    async def get(self, id: int) -> dict | None:
        result = await self.db.fetchrow("SELECT id, email, created_at FROM admins WHERE id=$1", id)
        if result:
            return dict(result)
        return None

    async def get_all(self) -> list:
        result = await self.db.fetch("SELECT id, email, created_at FROM admins")

        if result:
            return [dict(record) for record in result]
        return []

    async def get_by_email(self, email: str) -> dict | None:
        result = await self.db.fetchrow(
            "SELECT id, email, password FROM admins WHERE email=$1", 
            email
        )
        if result:
            return dict(result)
        return None

    async def create(
            self, 
            email: str, 
            password: str
        ):
        result = await self.db.fetchrow(
            "INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING id", 
            email, 
            password
        )
        if result:
            return dict(result)
        return None

    async def delete(self, id: int) -> str | None:
        result = await self.db.fetchrow(
            "DELETE FROM admins WHERE id=$1 RETURNING email", 
            id
        )
        if result:
            return dict(result).get("email")
        return None

    async def login(self, email: str, password: str) -> dict | None:
        result = await self.db.fetchrow(
                "SELECT id, email, password FROM admins WHERE email=$1 AND password=$2", 
                email, 
                password
            )
        if result:
            return dict(result)
        return None