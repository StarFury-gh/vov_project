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
from services.locations_service import (
    LocationService,
    LocationRepository,
    AddLocation
)

async def transfer(
        data: FullInfo,
        pg
    ):    

    hero_data = data.hero.model_dump()

    awards_service = AwardService(AwardsRepository(pg))
    heroes_service = HeroService(HeroRepository(pg))
    ranks_service = RanksService(RanksRepository(pg))
    location_service = LocationService(LocationRepository(pg))

    # добавляем героя
    status = await heroes_service.save(hero_data=hero_data)
    # если успешно сохранилось, то сохраняем награды
    if status.get("status"):
        import json
        awards_names = json.loads(data.awards)
        try:
            awards = [AwardCreate(name=name, description=name) for name in awards_names]
            for award in awards:
                try:
                    await awards_service.add_award(award)
                except:
                    print(f"{award} already exists")
            await awards_service.multiple_assign(
                status.get("id"), awards_names
            )
        except Exception as e:
            print(f"Transfer error:", e)
            return False

        # добавляем и связываем награды
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

        # добавляем локацию
        try:
            if data.location:
                new_location = AddLocation(
                    name=data.location.get("name"), # type: ignore
                    hero_id=status.get("id"), # type: ignore
                    lattitude=data.location.get("latitude"), # type: ignore
                    longtitude=data.location.get("longtitude") # type: ignore
                )
                await location_service.create_location(new_location)
        except Exception as e:
            print("Ошибка при добвалении локации:", e)

        try:
            if data.hero.photo_url:
                await heroes_service.save_image(status.get("id"), data.hero.photo_url)

        except Exception as e:
            print("Ошибка при добавлении фотографии героя:", e)

        return True
    
    return False