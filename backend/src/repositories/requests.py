from core.enums.requests_enum import RequestStatus

class RequestsRepository:
    def __init__(self, db) -> None:
        self.db = db

    async def get_all(self, limit: int, offset: int) -> list | None:
        result = await self.db.fetch(
            "SELECT * from hero_requests ORDER BY CASE WHEN status='new' THEN 0 ELSE 1 END, created_at DESC LIMIT $1 OFFSET $2",
            limit, 
            offset
        )
        if result:
            return [dict(record) for record in result]

    async def get(self, id: int) -> dict | None:
        result = await self.db.fetchrow(
            "SELECT * from hero_requests WHERE id=$1", id
        )
        if result:
            return dict(result)

    async def delete(self, id: int) -> bool:
        deleted_id = await self.db.fetchrow(
            "DELETE FROM hero_requests WHERE id=$1 RETURNING id", id
        )
        print(f"{deleted_id=}")
        if deleted_id:
            if deleted_id['id'] == id:
                return True
        return False

    async def update(
            self, 
            id: int, 
            status: RequestStatus, 
            admin_email: str
        ) -> bool:
        updated = await self.db.fetch(
            "UPDATE hero_requests SET status=$1, changed_by=$2 WHERE id=$3 RETURNING id", status, admin_email, id
        )
        if updated:
            return True
        return False