from config import config_obj

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

def read_data_from_json():
    with open(config_obj.JSON_FILE, "r") as file:
        data = json.load(file)
        return data