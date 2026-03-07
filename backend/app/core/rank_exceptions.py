class BaseRankException(Exception):
    def __init__(self, message: str, code: int = 500):
        self.code = code
        super().__init__(message)

class RankNotFound(BaseRankException):
    def __init__(self):
        self.code = 404
        self.message = "Ранг не найден."
        super().__init__(self.message, self.code)

class RankAlreadyExists(BaseRankException):
    def __init__(self):
        self.code = 409
        self.message = "Ранг уже существует."
        super().__init__(self.message, self.code)
