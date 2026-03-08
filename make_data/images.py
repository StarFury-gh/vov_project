#!/usr/bin/env python3
"""
Скрипт для загрузки фотографий героев Великой Отечественной войны
Требует установки: pip install requests beautifulsoup4 pillow
"""

import os
import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import quote_plus
import logging

from utils import get_all_names_from_json, get_number_of_heroes

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class HeroPhotosDownloader:
    def __init__(self, output_dir="heroes_photos"):
        """
        Инициализация загрузчика
        
        Args:
            output_dir (str): Директория для сохранения фотографий
        """
        self.output_dir = output_dir
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
        })
        
        # Создаем директорию для сохранения
        os.makedirs(output_dir, exist_ok=True)
        
        # Список героев
        # self.heroes = ['Алексеев Иван Иванович', 'Алиев Саид Давыдович', 'Антонов Алексей Иннокентьевич', 'Белов Павел Алексеевич', 'Богданов Семён Ильич', 'Будённый Семён Михайлович', 'Василевский Александр Михайлович', 'Ватутин Николай Фёдорович', 'Воронов Николай Николаевич', 'Гастелло Николай Францевич', 'Говоров Леонид Александрович', 'Головачёв Павел Яковлевич', 'Голубев Виктор Максимович', 'Горовец Александр Константинович', 'Гречко Андрей Антонович', 'Гризодубова Валентина Степановна', 'Громова Ульяна Матвеевна', 'Доватор Лев Михайлович', 'Драгунский Давид Абрамович', 'Егоров Михаил Алексеевич', 'Ерёменко Андрей Иванович', 'Жаворонков Семён Фёдорович', 'Жуков Георгий Константинович', 'Зайцев Василий Григорьевич', 'Захаров Георгий Фёдорович', 'Зинин Павел Андреевич', 'Иванов Иван Иванович', 'Исаев Алексей Михайлович', 'Казаков Василий Иванович', 'Кантария Мелитон Варламович', 'Карбышев Дмитрий Михайлович', 'Катуков Михаил Ефимович', 'Ковпак Сидор Артемьевич', 'Кожедуб Иван Никитович', 'Колесова Елена Фёдоровна', 'Колобанов Зиновий Григорьевич', 'Конев Иван Степанович', 'Кошевой Олег Васильевич', 'Кравченко Андрей Григорьевич', 'Краснов Пётр Николаевич', 'Крейзер Яков Григорьевич', 'Крылов Николай Иванович', 'Кузнецов Николай Герасимович', 'Кузнецов Василий Иванович', 'Кулаков Николай Михайлович', 'Лавриненков Владимир Дмитриевич', 'Лебедев Александр Игнатьевич', 'Лизюков Александр Ильич', 'Луканин Василий Степанович', 'Лунин Николай Александрович', 'Людников Иван Ильич', 'Малиновский Родион Яковлевич', 'Мамонов Пётр Иванович', 'Маресьев Алексей Петрович', 'Маринеско Александр Иванович', 'Масалов Николай Иванович', 'Матросов Александр Матвеевич', 'Мерецков Кирилл Афанасьевич', 'Покрышкин Александр Иванович', 'Талалихин Виктор Васильевич', 'Павличенко Людмила Михайловна', 'Молдагулова Алия Нурмухамбетовна', 'Космодемьянская Зоя Анатольевна', 'Чкалов Валерий Павлович', 'Расков Матвей Кузьмич', 'Смирнов Алексей Макарович', 'Недбайло Анатолий Константинович', 'Воробьёв Иван Алексеевич', 'Мыльников Григорий Михайлович', 'Осипов Василий Николаевич', 'Скоморохов Николай Михайлович', 'Ефимов Александр Николаевич', 'Асланов Ази Ахад оглы', 'Бойко Иван Никифорович', 'Головачёв Александр Алексеевич', 'Кулешов Павел Николаевич', 'Петров Василий Степанович', 'Плиев Исса Александрович', 'Семиохин Максим Григорьевич', 'Фёдоров Алексей Фёдорович', 'Фомичёв Михаил Георгиевич', 'Чуйков Василий Иванович', 'Шурухин Павел Иванович', 'Якубовский Иван Игнатьевич', 'Кратов Иван Григорьевич', 'Орлов Михаил Яковлевич', 'Сорокин Захар Артёмович', 'Бринько Пётр Антонович', 'Гулаев Николай Дмитриевич', 'Решетников Василий Васильевич', 'Папанин Иван Дмитриевич', 'Фёдоров Евгений Петрович', 'Дегтярёв Василий Алексеевич', 'Шпагин Георгий Семёнович', 'Судец Владимир Александрович', 'Руденко Сергей Игнатьевич', 'Наумов Михаил Иванович', 'Вершигора Пётр Петрович', 'Медведев Дмитрий Николаевич', 'Михеенко Лариса Дорофеевна', 'Казей Марат Иванович', 'Котик Валентин Александрович', 'Портнова Зинаида Мартыновна', 'Голиков Леонид Александрович', 'Дубинин Володя (Владимир Никифорович)', 'Бондаренко Михаил Захарович', 'Морозов Саша (Александр Иванович)', 'Задорожный Кузьма Игнатьевич']
        self.heroes = get_all_names_from_json()
    
    def search_yandex_images(self, query, num_images=3):
        """
        Поиск изображений через Яндекс
        
        Args:
            query (str): Поисковый запрос
            num_images (int): Количество изображений для поиска
            
        Returns:
            list: Список URL изображений
        """
        try:
            search_url = f"https://yandex.ru/images/search?text={quote_plus(query)}&from=tabbar"
            
            response = self.session.get(search_url, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            image_urls = []
            # Ищем изображения в результате поиска
            for img in soup.find_all('img', {'class': 'serp-item__thumb'})[:num_images]:
                src = img.get('src')
                if src and src.startswith('http'):
                    image_urls.append(src)
                elif src and src.startswith('//'):
                    image_urls.append('https:' + src)
            
            # Альтернативный поиск по data-атрибутам
            if not image_urls:
                for div in soup.find_all('div', {'class': 'serp-item'}):
                    data_bem = div.get('data-bem')
                    if data_bem and 'orig' in data_bem:
                        import json
                        try:
                            data = json.loads(data_bem)
                            if 'serp-item' in data:
                                image_url = data['serp-item'].get('img_href')
                                if image_url:
                                    image_urls.append(image_url)
                        except:
                            continue
            
            return image_urls[:num_images]
            
        except Exception as e:
            logger.error(f"Ошибка при поиске в Яндекс: {e}")
            return []
    
    def search_wikipedia(self, query):
        """
        Поиск изображения в Википедии
        
        Args:
            query (str): Имя для поиска
            
        Returns:
            list: Список URL изображений
        """
        try:
            # Пробуем найти статью в Википедии
            search_url = f"https://ru.wikipedia.org/w/index.php?search={quote_plus(query)}"
            response = self.session.get(search_url, timeout=10)
            
            if "search" in response.url:
                # Если мы на странице поиска, берем первую ссылку
                soup = BeautifulSoup(response.text, 'html.parser')
                first_result = soup.find('div', {'class': 'mw-search-result-heading'})
                if first_result and first_result.find('a'):
                    article_url = "https://ru.wikipedia.org" + first_result.find('a')['href']
                    response = self.session.get(article_url, timeout=10)
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Ищем основное изображение в инфобоксе
            image_urls = []
            infobox = soup.find('table', {'class': 'infobox'})
            if infobox:
                img = infobox.find('img')
                if img and img.get('src'):
                    image_url = "https:" + img['src']
                    image_urls.append(image_url)
            
            # Ищем другие изображения в статье
            gallery = soup.find('ul', {'class': 'gallery'})
            if gallery:
                for img in gallery.find_all('img')[:2]:
                    if img.get('src'):
                        image_urls.append("https:" + img['src'])
            
            return image_urls
            
        except Exception as e:
            logger.error(f"Ошибка при поиске в Википедии: {e}")
            return []
    
    def search_warheroes(self, query):
        """
        Поиск на сайте warheroes.ru (специализированный сайт о героях ВОВ)
        
        Args:
            query (str): Имя для поиска
            
        Returns:
            list: Список URL изображений
        """
        try:
            search_url = f"http://www.warheroes.ru/search.asp?q={quote_plus(query)}"
            response = self.session.get(search_url, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            image_urls = []
            # Ищем ссылки на страницы героев
            for link in soup.find_all('a', href=True)[:5]:
                href = link['href']
                if 'hero' in href and 'asp' in href:
                    hero_url = f"http://www.warheroes.ru{href}"
                    hero_response = self.session.get(hero_url, timeout=10)
                    hero_soup = BeautifulSoup(hero_response.text, 'html.parser')
                    
                    # Ищем изображение на странице героя
                    for img in hero_soup.find_all('img'):
                        src = img.get('src')
                        if src and ('photo' in src.lower() or 'portret' in src.lower()):
                            if not src.startswith('http'):
                                src = f"http://www.warheroes.ru{src}"
                            image_urls.append(src)
                            break
                    
                    if image_urls:
                        break
            
            return image_urls
            
        except Exception as e:
            logger.error(f"Ошибка при поиске на warheroes.ru: {e}")
            return []
    
    def download_image(self, url, filename):
        """
        Загрузка изображения по URL
        
        Args:
            url (str): URL изображения
            filename (str): Имя файла для сохранения
            
        Returns:
            bool: Успешно ли загружено
        """
        try:
            response = self.session.get(url, timeout=15)
            
            if response.status_code == 200:
                # Определяем расширение файла
                content_type = response.headers.get('content-type', '')
                if 'jpeg' in content_type or 'jpg' in content_type:
                    ext = '.jpg'
                elif 'png' in content_type:
                    ext = '.png'
                elif 'gif' in content_type:
                    ext = '.gif'
                else:
                    # Пробуем определить по URL
                    if '.jpg' in url.lower():
                        ext = '.jpg'
                    elif '.jpeg' in url.lower():
                        ext = '.jpeg'
                    elif '.png' in url.lower():
                        ext = '.png'
                    elif '.gif' in url.lower():
                        ext = '.gif'
                    else:
                        ext = '.jpg'
                
                # Очищаем имя файла от недопустимых символов
                clean_filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
                filepath = os.path.join(self.output_dir, clean_filename + ext)
                
                if os.path.exists(filepath):
                    logger.info(f"{filepath} уже существует")
                    return True

                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                logger.info(f"Сохранено: {filepath}")
                return True
                
        except Exception as e:
            logger.error(f"Ошибка при загрузке {url}: {e}")
        
        return False
    
    def download_hero_photos(self, hero_name, max_attempts=2):
        """
        Загрузка фотографий для конкретного героя
        
        Args:
            hero_name (str): Имя героя
            max_attempts (int): Максимальное количество попыток из разных источников
            
        Returns:
            bool: Найдена ли хотя бы одна фотография
        """
        logger.info(f"Поиск фотографий для: {hero_name}")
        
        all_image_urls = []
        
        # Пробуем разные источники
        sources = [
            ("WarHeroes", self.search_warheroes),
            ("Яндекс", lambda name: self.search_yandex_images(name + " Великая Отечественная война")),
            ("Википедия", self.search_wikipedia),
        ]
        
        for source_name, search_func in sources:
            try:
                urls = search_func(hero_name)
                if urls:
                    logger.info(f"Найдено {len(urls)} изображений в {source_name}")
                    all_image_urls.extend(urls)
                    
                    if len(all_image_urls) >= max_attempts:
                        break
                        
            except Exception as e:
                logger.error(f"Ошибка в источнике {source_name}: {e}")
        
        # Убираем дубликаты
        unique_urls = []
        seen_urls = set()
        for url in all_image_urls:
            if url not in seen_urls:
                seen_urls.add(url)
                unique_urls.append(url)
        
        # Загружаем изображения
        success = False
        for i, url in enumerate(unique_urls[:max_attempts]):
            filename = f"{hero_name}"
            if self.download_image(url, filename):
                success = True
                time.sleep(1)  # Пауза между загрузками
        
        return success
    
    def run(self):
        """Основной метод запуска загрузки"""
        logger.info(f"Начинаем загрузку фотографий для {len(self.heroes)} героев")
        logger.info(f"Фотографии будут сохранены в: {os.path.abspath(self.output_dir)}")
        
        stats = {
            'total': len(self.heroes),
            'success': 0,
            'failed': 0
        }
        
        for i, hero in enumerate(self.heroes, 1):
            logger.info(f"[{i}/{len(self.heroes)}] Обработка: {hero}")
            
            if self.download_hero_photos(hero):
                stats['success'] += 1
            else:
                stats['failed'] += 1
                logger.warning(f"Не удалось найти фотографии для: {hero}")
            
            # Пауза между запросами для избежания блокировки
            time.sleep(0.5)
        
        # Создаем HTML-файл для просмотра результатов
        
        logger.info("=" * 50)
        logger.info("ЗАВЕРШЕНО!")
        logger.info(f"Успешно: {stats['success']}/{stats['total']}")
        logger.info(f"Не удалось: {stats['failed']}")
        logger.info(f"Папка с результатами: {os.path.abspath(self.output_dir)}")

def main():
    """Точка входа в программу"""
    print("=" * 60)
    print("СКРИПТ ДЛЯ ЗАГРУЗКИ ФОТОГРАФИЙ ГЕРОЕВ ВЕЛИКОЙ ОТЕЧЕСТВЕННОЙ ВОЙНЫ")
    print("=" * 60)
    print(f"\nЭтот скрипт загрузит фотографии {get_number_of_heroes()} героев ВОВ.")
    print("Фотографии будут искаться в различных источниках:")
    print("1. warheroes.ru (специализированный сайт)")
    print("2. Яндекс.Картинки")
    print("3. Википедия")
    print("\nВНИМАНИЕ: Для работы скрипта требуется подключение к интернету.")
    print("Загрузка может занять некоторое время.")
    print("\n" + "=" * 60)
    
    # Запрос подтверждения
    response = input("\nПродолжить? (y/n): ").lower()
    if response not in ['y', 'yes', 'да', 'д']:
        print("Завершение работы.")
        return
    
    # Запуск загрузки
    downloader = HeroPhotosDownloader()
    downloader.run()


if __name__ == "__main__":
    # Проверка зависимостей
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError:
        print("Необходимо установить зависимости:")
        print("pip install requests beautifulsoup4")
        exit(1)
    
    main()