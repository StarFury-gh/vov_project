from abc import ABC

class ABCRepository(ABC):
    def __init__(self, db):
        self.db = db

    async def get(self):
        pass

    async def create(self):
        pass