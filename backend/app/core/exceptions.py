class BaseHeroException(Exception):
    def __init__(self, message, code) -> None:
        self.message = message
        self.code = code
        super().__init__(message)


class HeroNotFound(BaseHeroException):
    def __init__(self, code) -> None:
        message = "Герой не найден."
        super().__init__(message, code)