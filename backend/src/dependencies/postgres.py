from asyncpg import connect

from core.config import config_obj

async def get_pg():
    connection = await connect(
        host=config_obj.DB_HOST,
        port=config_obj.DB_PORT,
        user=config_obj.DB_USER,
        password=config_obj.DB_PASSWORD,
        database=config_obj.DB_NAME
    )
    yield connection
    await connection.close()