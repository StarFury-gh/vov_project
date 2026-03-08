import asyncio
import reqs
from utils import read_data_from_json

async def main():
    data = read_data_from_json()
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

if __name__ == "__main__":
    asyncio.run(main())