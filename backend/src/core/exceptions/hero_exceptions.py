class BaseHeroException(Exception):
    def __init__(self, message, code=500) -> None:
        self.message = message
        self.code = code
        super().__init__(message)


class HeroNotFound(BaseHeroException):
    def __init__(self, code=404) -> None:
        message = "Герой не найден."
        super().__init__(message, code)


class HeroAlreadyExists(BaseHeroException):
    def __init__(self, code=409) -> None:
        message = "Герой уже существует."
        super().__init__(message, code)


class InvalidDate(BaseHeroException):
    def __init__(self, code=400) -> None:
        message = "Неверный формат даты. Нужен формат: гггг-мм-дд"
        super().__init__(message, code)


class InvalidWarType(BaseHeroException):
    def __init__(self, code=400) -> None:
        message = "Неизвестный тип войны"
        super().__init__(message, code)