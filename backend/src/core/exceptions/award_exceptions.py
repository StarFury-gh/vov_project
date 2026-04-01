class BaseAwardExcpetion(BaseException):
    def __init__(self, message: str, code: int) -> None:
        self.message = message
        self.code = code
        super().__init__(message)

class AwardNotFound(BaseAwardExcpetion):
    def __init__(self, code: int = 404) -> None:
        self.message = "Награда не найдена."
        self.code = code
        super().__init__(self.message, code)

class AwardAlreadyExists(BaseAwardExcpetion):
    def __init__(self, code: int = 409) -> None:
        self.message = "Награда уже существует."
        self.code = code
        super().__init__(self.message, code)
