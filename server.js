const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Разрешаем кросс-доменные запросы
app.use(cors());

// Папка с изображениями
const IMAGE_FOLDER = path.join(__dirname, 'images');

// Эндпоинт для получения списка изображений
app.get('/images', (req, res) => {
    fs.readdir(IMAGE_FOLDER, (err, files) => {
        if (err) {
            console.error("Ошибка чтения папки:", err);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }

        // Фильтруем только файлы, а не директории
        const images = files.filter(file => fs.statSync(path.join(IMAGE_FOLDER, file)).isFile());
        
        if (images.length === 0) {
            return res.status(404).json({ error: 'Нет доступных изображений' });
        }

        res.json(images); // Возвращаем список изображений в формате JSON
    });
});

// Эндпоинт для отдачи конкретного изображения
app.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(IMAGE_FOLDER, filename);

    fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
            console.error(`Файл ${filename} не найден.`);
            return res.status(404).json({ error: 'Файл не найден' });
        }

        // Отправляем изображение
        res.sendFile(filePath);
    });
});

// Запуск сервера на порту 3000
app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
