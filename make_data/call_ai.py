import asyncio
from gigachat import GigaChat
from os import getenv

from dotenv import load_dotenv
from string import Template

load_dotenv()
# Ваш API ключ
API_KEY = getenv("GIGA_API_KEY")

PROMPT = Template("""
Системное сообщение: Ты — исторический ассистент, специализирующийся на ВОВ. Твоя задача — выдавать информацию только в формате JSON, без markdown-разметки и пояснений.

Запрос пользователя: Найди данные о герое ВОВ по имени $name и верни JSON.

Поля JSON:

    full_name: строка (полное ФИО)

    birth_date: строка (ГГГГ-ММ-ДД) или null

    death_date: строка (ГГГГ-ММ-ДД) или null

    biography: строка (текст биографии и описания подвига, укажи связь с Владимирской областью, если есть)

    rank: строка или null

    awards: массив строк (уникальные названия наград)

    place: объект или null, содержащий:

        latitude: число (десятичные градусы)

        longtitude: число (десятичные градусы)

        name: строка (название локации)

Если не удаётся найти инфомарцию, верни null.

Валидация: Убедись, что JSON корректен и не содержит комментариев. Не используй markdown-разметку.
""")

def get_info_from_ai(fio: str):
    try:
        # Инициализация клиента GigaChat
        # Убедитесь, что у вас установлен сертификат или используйте verify_ssl_certs=False для тестирования
        with GigaChat(credentials=API_KEY, verify_ssl_certs=False) as giga:
            # Отправка запроса
            response = giga.chat(PROMPT.substitute(name=fio))
            
            # Сохранение ответа в файл
            with open("output.txt", "a", encoding="utf-8") as file:
                file.write(response.choices[0].message.content[7:-3] + ",")
            
            print("Ответ успешно сохранен в файл output.txt")
            print(f"Ответ: {response.choices[0].message.content}")
            
    except Exception as e:
        print(f"Произошла ошибка: {e}")

