from fastapi import UploadFile
from pathlib import Path
from uuid import uuid4
from PIL import Image
import asyncio
import io

async def save_file(file: UploadFile) -> tuple:
    """
    Сохраняет загруженное изображение в формате WebP.
    
    Args:
        file: Загруженный файл (FastAPI UploadFile)
        
    Returns:
        tuple:
        bool: Статус сохранения\n
        ?str: Имя сохранённого файла (например, "550e8400-e29b-41d4-a716-446655440000.webp")
    """
    UPLOAD_DIR = Path("images")
    UPLOAD_DIR.mkdir(exist_ok=True)
    
    # Генерируем уникальное имя файла
    filename = f"{uuid4()}.webp"
    file_path = UPLOAD_DIR / filename
    
    try:
        # Читаем содержимое файла
        contents = await file.read()
        
        # Открываем изображение с помощью Pillow в отдельном потоке,
        # чтобы не блокировать цикл событий asyncio
        image = await asyncio.to_thread(Image.open, io.BytesIO(contents))
        
        # Конвертируем в RGB, если изображение в палитровом режиме (например, GIF)
        if image.mode in ("P", "L"):  # палитра или градации серого
            image = image.convert("RGB")
        
        # Сохраняем изображение в формате WebP
        await asyncio.to_thread(image.save, file_path, format="WEBP", quality=85)
        
    except Exception as e:
        return (False, None)
    finally:
        # Закрываем файл (хорошая практика)
        await file.close()
    
    return (True, filename)