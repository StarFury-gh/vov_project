class BaseRequestsException(Exception):
    def __init__(
            self, 
            message: str = "Ошибка при создании заявки на добавление", 
            code: int = 500
        ):
        self.code = code
        self.message = message
        super().__init__(self.message)


class RequestNotFound(BaseRequestsException):
    def __init__(self):
        self.code = 404
        self.message = "Заявка не найдена"
        super().__init__(self.message, self.code)


class RequestAlreadyExists(BaseRequestsException):
    def __init__(self):
        self.code = 409
        self.message = "Заявка уже существует"
        super().__init__(self.message, self.code)
