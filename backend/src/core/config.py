from os import getenv
from dotenv import load_dotenv

class Config:
    def __init__(self) -> None:
        load_dotenv()
        self.DB_HOST = getenv("DB_HOST")
        self.DB_PORT = getenv("DB_PORT")
        self.DB_USER = getenv("DB_USER")
        self.DB_PASSWORD = getenv("DB_PASSWORD")
        self.DB_NAME = getenv("DB_NAME")

        self.REDIS_HOST = getenv("REDIS_HOST")
        self.REDIS_PORT = getenv("REDIS_PORT")
        self.REDIS_USER = getenv("REDIS_USER")
        self.REDIS_PASSWORD = getenv("REDIS_PASSWORD")
        self.REDIS_URL = f"redis://{self.REDIS_USER}:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/0"

        self.JWT_SECRET_KEY = getenv("JWT_SECRET_KEY")

config_obj = Config()