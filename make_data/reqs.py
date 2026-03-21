from aiohttp import ClientSession

from config import config_obj
import logging

from utils import get_image_path

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s:%(name)s:%(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

async def add_hero(hero: dict):
    logger.info(f"add_hero input: {hero}")
    async with ClientSession() as session:
        url = config_obj.API_URL + "/heroes"
        async with session.post(url, json=hero) as response:
            result = await response.json()
            if response.status == 200:
                logger.info(f"add_hero success: {result}")
                return result.get("id")
            else:
                logger.error(f"add_hero error: {result}")
                return None
            
async def add_award(award: str):
    logger.info(f"add_award input: {award}")
    async with ClientSession() as session:
        url = config_obj.API_URL + "/awards"
        payload = {
            "name": award,
            "description": "Значимая награда"
        }
        async with session.post(url, json=payload) as response:
            result = await response.json()
            if response.status == 200:
                logger.info(f"add_award success: {result}")
                return result.get("id")
            else:
                logger.error(f"add_award error: {result}")
                return None

async def get_award_id(award_name):
    logger.info(f"get_award_id input: {award_name}")
    async with ClientSession() as session:
        url = config_obj.API_URL + f"/awards/name/{award_name}"
        async with session.get(url) as response:
            result = await response.json()
            if result:
                logger.info(f"get_award_id success: {result}")
                return result.get("id")
            else:
                logger.error(f"get_award_id error: {result}")
                return None

async def assign_hero_award(hero_id: int, award_id: int):
    logger.info(f"assign_hero_award input: hero_id={hero_id}, award_id={award_id}")
    async with ClientSession() as session:
        url = config_obj.API_URL + "/awards/assign"
        payload = {
            "hero_id": hero_id,
            "award_id": award_id
        }
        async with session.post(url, json=payload) as response:
            result = await response.json()
            if response.status == 200:
                logger.info(f"assign_hero_award success: {result}")
                return result
            else:
                logger.error(f"assign_hero_award error: {result}")
                return None

async def get_rank_id(rank_name: str):
    logger.info(f"get_rank_id input: {rank_name}")
    async with ClientSession() as session:
        url = config_obj.API_URL + f"/ranks/name/{rank_name}"
        async with session.get(url) as response:
            result = await response.json()
            if response.status == 200:
                logger.info(f"get_rank_id success: {result}")
                return result.get("id")
            else:
                logger.error(f"get_rank_id error: {result}")
                return None

async def assign_rank(hero_id, rank_id):
    logger.info(f"assign_rank input: hero_id={hero_id}, rank_id={rank_id}")
    async with ClientSession() as session:
        url = config_obj.API_URL + "/ranks/assign"
        payload = {
            "hero_id": hero_id,
            "rank_id": rank_id
        }
        async with session.post(url, json=payload) as response:
            result = await response.json()
            if response.status == 200:
                logger.info(f"assign_rank success: {result}")
                return result
            else:
                logger.error(f"assign_rank error: {result}")
                return None

async def add_rank(rank_name: str, sort_order: int):
    logger.info(f"add_rank input: {rank_name}, {sort_order}")
    async with ClientSession() as session:
        url = config_obj.API_URL + "/ranks"
        payload = {
            "name": rank_name,
            "sort_order": sort_order
        }
        async with session.post(url, json=payload) as response:
            result = await response.json()
            if response.status == 200:
                logger.info(f"add_rank success: {result}")
                rank_id = result.get("id")
                return rank_id
            else:
                logger.error(f"add_rank error: {result}")
                return None
        

import aiohttp
from aiohttp import FormData

async def save_image(hero_name: str, hero_id: int):
    logger.info(f"save_image input: hero_name={hero_name}, hero_id={hero_id}")
    # Формируем полный URL
    url = config_obj.API_URL.rstrip('/') + '/heroes/image'
    
    # Создаем FormData для отправки файла
    data = FormData()
    
    image_path = get_image_path(hero_name)

    # Открываем файл и добавляем его в FormData
    if image_path:
        with open(image_path, 'rb') as f:
            data.add_field('image',
                        f.read(),
                        filename='image.jpg',
                        content_type='image/jpeg')
        
        # Отправляем запрос
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=data, params={"hero_id": hero_id}) as response:
                # Проверяем статус ответа
                if response.status == 200:
                    result = await response.json()
                    logger.info(f"save_image success: {result}")
                    return result
                else:
                    error_text = await response.text()
                    logger.error(f"save_image error: {error_text}")
                    return None
    else:
        logger.warning(f"{hero_name} не имеет фотографии в каталоге.")

async def add_place(hero_id: int, name: str, latitude:float, longtitude:float):
    logger.info(f"add_place input: {name}, {latitude}, {longtitude}")
    async with ClientSession() as session:
        payload = {
            "hero_id": hero_id,
            "name": name,
            "longitude": longtitude,
            "lattitude": latitude
        }
        url = config_obj.API_URL + "/locations"
        async with session.post(url, json=payload) as resp:
            if resp.status == 200:
                result = await resp.json()
                logger.info(f"add_place: {result}")
            else:
                result = await resp.json()
                logger.error(f"add_place error: {result}")
            