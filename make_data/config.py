class Config:
    def __init__(self) -> None:
        self.NAMES_FILE = "names.txt"
        self.JSON_FILE = "data.json"
        self.JSON_FILE_SVO = "data_svo.json"
        # self.JSON_FILE = "data_test.json"
        # self.JSON_FILE_SVO = "data_test.json"
        self.API_URL = "http://127.0.0.1:8000"

config_obj = Config()