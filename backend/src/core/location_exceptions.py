class BaseLocationException(Exception):
    def __init__(self, message: str = "", code: int = 500):
        self.code = code
        self.message = message
        super().__init__(self.message)
