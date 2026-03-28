from .models import FullInfo

from schemas.rank import RankCreate

from services.award_service import (
    AwardService,
    AwardsRepository,
    AwardCreate
)
from services.hero_service import (
    HeroService,
    HeroRepository
)
from services.rank_service import (
    RanksService,
    RanksRepository
)

async def transfer(
        data: FullInfo,
        pg
    ):    

    hero_data = data.hero.model_dump()

    awards_service = AwardService(AwardsRepository(pg))
    heroes_service = HeroService(HeroRepository(pg))
    ranks_service = RanksService(RanksRepository(pg))

    # добавляем героя
    status = await heroes_service.save(hero_data=hero_data)
    print(status)
    # если успешно сохранилось, то сохраняем награды
    if status.get("status"):
        import json
        awards_names = json.loads(data.awards)
        try:
            awards = [AwardCreate(name=name, description=name) for name in awards_names]
            print("Adding awards")
            for award in awards:
                try:
                    await awards_service.add_award(award)
                except:
                    print(f"{award} already exists")
        except:
            await awards_service.multiple_assign(
                status.get("id"), awards_names
            )

        try:
            addition = await ranks_service.create_rank(
                RankCreate(name=data.rank, sort_order=1)
            )
            if addition.get("id"):
                await ranks_service.assgin_rank(status.get("id"), addition.get("id"))
        except Exception as e:
            rank_id = await ranks_service.get_by_name(data.rank)
            if rank_id:
                await ranks_service.assgin_rank(status.get("id"), rank_id.get("id"))

        return True
    
    return False