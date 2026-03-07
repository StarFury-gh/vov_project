import asyncio
import requests.reqs
from utils import read_data_from_json

async def main():
    data = read_data_from_json()
    for hero in data:
        hero_id = await requests.reqs.add_hero(hero)
        print(f"{hero_id=}")
        if hero_id:
            if hero.get("awards"):
                for award in hero["awards"]:
                    award_id = await requests.reqs.get_award_id(award)
                    print(f"{award_id=}")

                    if award_id is None:
                        id = await requests.reqs.add_award(award)

                        await requests.reqs.assign_hero_award(hero_id, id)

                    else:
                        await requests.reqs.assign_hero_award(hero_id, award_id)

            if hero.get("rank"):
                rank_id = await requests.reqs.get_rank_id(hero["rank"])
                if rank_id:
                    await requests.reqs.assign_rank(hero_id, rank_id)
                else:
                    r_id = await requests.reqs.add_rank(hero["rank"], 1)
                    await requests.reqs.assign_rank(hero_id, r_id)

if __name__ == "__main__":
    asyncio.run(main())