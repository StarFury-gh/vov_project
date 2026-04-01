from dotenv import load_dotenv
from os import getenv

class Config:
    def __init__(self) -> None:
        load_dotenv()
        self.NAMES_FILE = "names.txt"
        self.JSON_FILE = "data.json"
        self.JSON_FILE_SVO = "data_svo.json"
        # self.JSON_FILE = "data_test.json"
        # self.JSON_FILE_SVO = "data_test.json"
        # self.API_URL = "http://127.0.0.1:8000"
        self.API_URL = "http://backend:8000"
        self.ADMIN_PASSWORD = getenv("ADMIN_PASSWORD")
        self.ADMIN_LOGIN = getenv("ADMIN_LOGIN")

config_obj = Config()