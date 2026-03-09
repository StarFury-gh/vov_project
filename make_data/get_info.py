from utils import get_all_names, get_all_names_from_json

from call_ai import get_info_from_ai

def main():
    names = set(get_all_names())
    used_names = set(get_all_names_from_json())

    for name in names:
        if name not in used_names:
            get_info_from_ai(name)
        else:
            print(f"{name} уже добавлен.")

if __name__ == "__main__":
    main()