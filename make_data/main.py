import asyncio
import reqs
from utils import (
    read_data_from_json_vov, 
    read_data_from_json_svo
)
from config import config_obj

async def main():
    vov_data = read_data_from_json_vov()
    svo_data = read_data_from_json_svo()

    data = vov_data + svo_data

    jwt = await reqs.get_jwt()
    if not jwt:
        print("JWT is None")
        return

    for hero in data:
        hero_id = await reqs.add_hero(hero)
        if hero_id:

            await reqs.save_image(hero_name=hero["full_name"], hero_id=hero_id)

            if hero.get("awards"):
                for award in hero["awards"]:
                    award_id = await reqs.get_award_id(award)

                    if award_id is None:
                        id = await reqs.add_award(award)
                        await reqs.assign_hero_award(hero_id, id)
                    else:
                        await reqs.assign_hero_award(hero_id, award_id)

            if hero.get("rank"):
                rank_id = await reqs.get_rank_id(hero["rank"])
                if rank_id:
                    await reqs.assign_rank(hero_id, rank_id)
                else:
                    r_id = await reqs.add_rank(hero["rank"], 1)
                    await reqs.assign_rank(hero_id, r_id)

            if hero.get("place"):
                place_info = hero.get("place")
                name = place_info.get("name")
                latitude = place_info.get("latitude")
                longtitude = place_info.get("longtitude")
                await reqs.add_place(
                    hero_id=hero_id,
                    name=name,
                    longtitude=longtitude,
                    latitude=latitude
                )

async def new_main():
    vov_data = read_data_from_json_vov()
    svo_data = read_data_from_json_svo()

    await reqs.create_admin(
        config_obj.ADMIN_LOGIN,
        config_obj.ADMIN_PASSWORD
    )

    jwt = await reqs.get_jwt()
    if not jwt:
        print("JWT is None")
        return

    data = vov_data + svo_data
    print("TOTAL HEROES =", len(data))

    created_heroes = []

    # --- ШАГ 1: создаём героев ---
    for hero in data:
        hero_id = await reqs.add_hero(hero)

        if not hero_id:
            print(f"❌ Уже существует: {hero.get('full_name')}")
            continue

        print(f"✅ Создан герой: {hero.get('full_name')} (id={hero_id})")
        created_heroes.append((hero, hero_id))

    # --- ШАГ 2: загружаем картинки ---
    for hero, hero_id in created_heroes:
        try:
            await reqs.save_image(
                hero_name=hero["full_name"],
                hero_id=hero_id
            )
            print(f"🖼 Загружена картинка: {hero['full_name']}")
        except Exception as e:
            print(f"❌ Ошибка картинки {hero['full_name']}: {e}")

    # --- ШАГ 3: получаем requests ---
    requests_list = await reqs.get_requests(auth=jwt)
    print("TOTAL REQUESTS =", len(requests_list))

    # --- ШАГ 4: аппрув ---
    for req in requests_list:
        req_id = req.get("id")

        if not req_id:
            continue

        try:
            await reqs.approve_request(req_id, jwt)
            print(f"✔ Approved request {req_id}")
        except Exception as e:
            print(f"❌ Ошибка approve {req_id}: {e}")

if __name__ == "__main__":
    asyncio.run(new_main())