from aiohttp import ClientSession

from config import config_obj

import logging

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s:%(name)s:%(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

async def add_hero(hero: dict):
    async with ClientSession() as session:
        url = config_obj.API_URL + "/heroes"
        async with session.post(url, json=hero) as response:
            result = await response.json()
            logger.info(f"add_hero result: {result}")
            return result.get("id")
            
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
                logger.error(f"add_award result: {result}")
                return None
            logger.info(f"add_award result: {result}")
            return result.get("id")

async def get_award_id(award_name):
    async with ClientSession() as session:
        url = config_obj.API_URL + f"/awards/name/{award_name}"
        async with session.get(url) as response:
            
            result = await response.json()
            logger.info(f"get_award_id result: {result}")
            if result:
                return result.get("id")
            else:
                logger.error(f"get_award_id result: {result}")

async def assign_hero_award(hero_id: int, award_id: int):
    async with ClientSession() as session:
        url = config_obj.API_URL + "/awards/assign"
        payload = {
            "hero_id": hero_id,
            "award_id": award_id
        }
        async with session.post(url, json=payload) as response:
            result = await response.json()
            logger.info(f"assign_hero_award result: {result}")
            return result

async def get_rank_id(rank_name: str):
    async with ClientSession() as session:
        url = config_obj.API_URL + f"/ranks/name/{rank_name}"
        async with session.get(url) as response:
            result = await response.json()
            logger.info(f"get_rank_id result: {result}")
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
            logger.info(f"assign_rank result: {result}")
            return result

async def add_rank(rank_name: str, sort_order: int):
    async with ClientSession() as session:
        url = config_obj.API_URL + "/ranks"
        payload = {
            "name": rank_name,
            "sort_order": sort_order
        }
        async with session.post(url, json=payload) as response:
            result = await response.json()
            logger.info(f"assign_rank result: {result}")
            rank_id = result.get("id")
            return rank_id