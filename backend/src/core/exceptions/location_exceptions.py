class BaseLocationException(Exception):
    def __init__(self, message: str = "", code: int = 500):
        self.code = code
        self.message = message
        super().__init__(self.message)

class HeroHasNoLocation(BaseLocationException):
    def __init__(self):
        self.code = 404
        self.message = "У героя нет связанного места"
        super().__init__(self.message, self.code)

class HeroNotFound(BaseLocationException):
    def __init__(self) -> None:
        self.code = 404
        self.message = "Герой не найден"
        super().__init__(self.message, self.code)