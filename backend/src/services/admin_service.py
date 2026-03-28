from repositories.admins import AdminsRepository
from core.admin_exceptions import (
    BaseAdminException,
    AdminAlreadyExists,
    AdminNotFound,
    AdminInvalidCredentials,
)

from asyncpg.exceptions import (
    UniqueViolationError
)

from core.security import (
    jwts,
    passwords
)

from datetime import timedelta

class AdminsService:
    def __init__(self, repo: AdminsRepository):
        self.repo = repo
    
    async def get_admins(self):
        try:
            result = await self.repo.get_all()
            return result
        except Exception as e:
            print(e)
            raise BaseAdminException(
                "Внутренняя ошибка сервера", 500
            )
    
    async def get_admin(self, admin_id):
        try:
            result = await self.repo.get(admin_id)
            if result is not None:
                return result
            raise AdminNotFound
        except BaseAdminException as e:
            raise e
        except Exception as e:
            print(e)
            raise BaseAdminException(
                "Внутренняя ошибка сервера", 500
            )
    
    async def create_admin(self, email: str, password: str):
        try:
            password = passwords.hash_password(password)
            result = await self.repo.create(
                email=email,
                password=password
            )
            if result is not None:
                return result
            raise AdminAlreadyExists
        
        except UniqueViolationError as e:
            raise AdminAlreadyExists
        
        except Exception as e:
            print("Error:", e, "Type:", type(e).__name__)
            raise BaseAdminException(
                "Внутренняя ошибка сервера", 500
            )

    async def delete_admin(self, admin_id):
        try:
            result = await self.repo.delete(admin_id)
            if result:
                return {
                    "status": True,
                    "deleted": result
                }
            raise AdminNotFound

        except BaseAdminException as e:
            raise e

        except Exception as e:
            print(e)
            raise BaseAdminException(
                "Внутренняя ошибка сервера", 500
            )

    async def login_admin(self, email: str, password: str):
        try:
            user = await self.repo.get_by_email(email)
            if user is not None:
                if passwords.verify_password(password, user.get("password", None)):
                    token = jwts.create_access_token(
                        {
                            "email": user.get("email"),
                        },
                        expires_delta=timedelta(hours=1)
                    )
                    return {
                        "token": "Bearer " + token,
                        "user": {
                            "id": user.get("id"),
                            "email": user.get("email")
                        }
                    }
                else:
                    raise AdminInvalidCredentials
            else:
                raise AdminNotFound
        except BaseAdminException as e:
            raise e
        except Exception as e:
            print(e)
            raise BaseAdminException(
                "Внутренняя ошибка сервера", 500
            )
        
    async def is_admin(self, email: str) -> bool:
        user = await self.repo.get_by_email(email)
        if user is not None:
            return True
        return False
        