
const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

// Создаём приложение
const app = express();
const PORT = 3000;

// Подключаем базу данных
const db = new Database('tasks.db');

// Создаём таблицу
db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL
    )
`).run();

// Настройки сервера
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET — получение всех заданий
app.get('/api/tasks', (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();
    res.json(tasks);
});

// POST — добавление задания
app.post('/api/tasks', (req, res) => {
    const { title } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Введите название задания' });
    }

    const result = db.prepare(
        'INSERT INTO tasks (title) VALUES (?)'
    ).run(title.trim());

    const task = db.prepare(
        'SELECT * FROM tasks WHERE id = ?'
    ).get(result.lastInsertRowid);

    res.status(201).json(task);
});

// DELETE — удаление задания
app.delete('/api/tasks/:id', (req, res) => {
    const result = db.prepare(
        'DELETE FROM tasks WHERE id = ?'
    ).run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Задание не найдено' });
    }

    res.json({ message: 'Задание удалено' });
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
