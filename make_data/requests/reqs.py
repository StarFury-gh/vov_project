from aiohttp import ClientSession

from config import config_obj

async def add_hero(hero: dict):
    async with ClientSession() as session:
        url = config_obj.API_URL + "/heroes"
        async with session.post(url, json=hero) as response:
            if response.status:
                result = await response.json()
                print(result)
                return result.get("id")
            return None

async def add_award(award: str):
    async with ClientSession() as session:
        url = config_obj.API_URL + "/awards"
        payload = {
            "name": award,
            "description": "Значимая награда"
        }
        async with session.post(url, json=payload) as response:
            result = await response.json()
            if result.get("detail", False):
                return None
            print(result)
            return result.get("id")

async def get_award_id(award_name):
    async with ClientSession() as session:
        url = config_obj.API_URL + f"/awards/name/{award_name}"
        async with session.get(url) as response:
            if response.ok:
                result = await response.json()
                print(f"get_award_id {result=}")
                if result:
                    return result.get("id")
            else:
                print(f"{response=}")
async def add_hero_award(hero_id: int, award_id: int):
    async with ClientSession() as session:
        url = config_obj.API_URL + "/awards/assign"
        payload = {
            "hero_id": hero_id,
            "award_id": award_id
        }
        async with session.post(url, json=payload) as response:
            result = await response.json()
            print(result)

async def get_rank_id(rank_name: str):
    async with ClientSession() as session:
        url = config_obj.API_URL + f"/ranks/name/{rank_name}"
        async with session.get(url) as response:
            result = await response.json()
            print(f"get_rank_id {result=}")
            return result.get("id")

async def assign_rank(hero_id, rank_id):
    async with ClientSession() as session:
        url = config_obj.API_URL + "/ranks/assign"
        payload = {
            "hero_id": hero_id,
            "rank_id": rank_id
        }
        async with session.post(url, json=payload) as response:
            result = await response.json()
            print(result)

async def add_rank(rank_name: str, sort_order: int):
    async with ClientSession() as session:
        url = config_obj.API_URL + "/ranks"
        payload = {
            "name": rank_name,
            "sort_order": sort_order
        }
        async with session.post(url, json=payload) as response:
            result = await response.json()
            print(result)