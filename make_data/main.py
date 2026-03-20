import asyncio
import reqs
from utils import (
    read_data_from_json_vov, 
    read_data_from_json_svo
)

async def main():
    vov_data = read_data_from_json_vov()
    svo_data = read_data_from_json_svo()

    data = vov_data + svo_data

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


if __name__ == "__main__":
    asyncio.run(main())