
const API_URL = '/api/tasks';

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');

// Загрузка списка заданий
async function loadTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Не удалось загрузить задания');
        }

        const tasks = await response.json();

        taskList.innerHTML = '';

        emptyMessage.style.display =
            tasks.length === 0 ? 'block' : 'none';

        tasks.forEach(task => {
            const li = document.createElement('li');

            const title = document.createElement('span');
            title.textContent = task.title;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.className = 'delete-btn';

            deleteButton.addEventListener('click', () => {
                deleteTask(task.id);
            });

            li.appendChild(title);
            li.appendChild(deleteButton);

            taskList.appendChild(li);
        });

    } catch (error) {
        alert(error.message);
    }
}

// Добавление задания
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) {
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error('Не удалось добавить задание');
        }

        taskInput.value = '';

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
});

// Удаление задания
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Не удалось удалить задание');
        }

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
}

// Загрузка заданий при открытии сайта
loadTasks();
