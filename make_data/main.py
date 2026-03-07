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
                    # получить id награды
                    # назначить награду
                    award_id = await requests.reqs.get_award_id(award)
                    if award_id:
                        await requests.reqs.add_hero_award(hero_id, award_id)

            if hero.get("rank"):
                rank_id = await requests.reqs.get_award_id(hero["rank"])
                if rank_id:
                    await requests.reqs.assign_rank(hero_id, rank_id)
                else:
                    await requests.reqs.add_rank(hero["rank"], 10)

if __name__ == "__main__":
    asyncio.run(main())