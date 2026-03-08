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

config_obj = Config()