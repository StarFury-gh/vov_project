class BaseAdminException(Exception):
    """
    Базовый класс для всех исключений, связанных с административной функциональностью.

    Атрибуты:
        message (str): Сообщение об ошибке.
        code (int): HTTP-код ошибки.
    """
    def __init__(self, message, code: int = 500):
        self.message = message
        self.code = code
        super().__init__(self.message)


class AdminAlreadyExists(BaseAdminException):
    """
    Исключение, возникающее при попытке создать администратора, который уже существует.

    Атрибуты:
        message (str): Сообщение об ошибке.
        code (int): HTTP-код ошибки (409 Conflict).
    """
    def __init__(self):
        self.code = 409
        self.message = "Администратор уже существует"
        super().__init__(self.message, self.code)


class AdminNotFound(BaseAdminException):
    """
    Исключение, возникающее, когда запрашиваемый администратор не найден.

    Атрибуты:
        message (str): Сообщение об ошибке.
        code (int): HTTP-код ошибки (404 Not Found).
    """
    def __init__(self):
        self.code = 404
        self.message = "Администратор не найден"
        super().__init__(self.message, self.code)


class AdminInvalidCredentials(BaseAdminException):
    """
    Исключение, возникающее при неверных учетных данных администратора.

    Атрибуты:
        message (str): Сообщение об ошибке.
        code (int): HTTP-код ошибки (401 Unauthorized).
    """
    def __init__(self):
        self.code = 401
        self.message = "Неверный логин или пароль"
        super().__init__(self.message, self.code)
