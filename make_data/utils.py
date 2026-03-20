from config import config_obj

from glob import glob
import json

def get_all_names():
    names = []
    with open(config_obj.NAMES_FILE, "r") as file:
        for line in file:
            if line.strip():
                names.append(line.strip())

    return names

def get_all_names_from_json():
    names = set()
    with open(config_obj.JSON_FILE, "r") as file:
        data = json.load(file)
        for element in data:
            names.add(element.get("full_name"))

    return list(names)

def get_number_of_heroes():
    all_heroes = get_all_names_from_json()
    return len(all_heroes)

def read_data_from_json_vov():
    with open(config_obj.JSON_FILE, "r") as file:
        data = json.load(file)
        return data

def read_data_from_json_svo():
    with open(config_obj.JSON_FILE_SVO, "r") as file:
        data = json.load(file)
        return data

def get_image_path(hero_name: str):
    try:
        return glob(f"./heroes_photos/{hero_name}.*")[0]
    except IndexError:
        return None