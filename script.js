document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressText = document.querySelector('.progress-text');
    const progressFill = document.querySelector('.progress-fill');

    // Load tasks from local storage when page loads
    const loadTasks = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(task => {
            addTask(task.text, task.completed, false);
        });
        toggleEmptyState();
        updateProgress();
    };

    // Save tasks to local storage
    const saveTasks = () => {
        const tasks = [];
        document.querySelectorAll('#task-list li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.querySelector('.checkbox').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    const addTask = (text, completed = false, shouldSave = true) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) {
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" 
            ${completed ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="task-button">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editButton = li.querySelector('.edit-btn');

        if (completed) {
            li.classList.add('completed');
            editButton.disabled = true;
            editButton.style.opacity = '0.5';
            editButton.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editButton.disabled = isChecked;
            editButton.style.opacity = isChecked ? '0.5' : '1';
            editButton.style.pointerEvents = isChecked ? 'none' : 'auto';
            updateProgress();
            saveTasks();
        });

        editButton.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress();
                saveTasks();
            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTasks();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress();
        if (shouldSave) saveTasks();
    };

    function triggerConfetti() {
        const count = 300;
        const defaults = {
            origin: { y: 0.6 },
            spread: 100,
            ticks: 200,
            gravity: 0.5,
            colors: [
                '#9b59b6', '#6a0dad', '#e2b4ff',
                '#ff6b9e', '#ffffff', '#c9a0ff'
            ],
            shapes: ['circle', 'square', 'star']
        };

        confetti({
            ...defaults,
            particleCount: count,
            startVelocity: 30
        });

        setTimeout(() => {
            confetti({
                ...defaults,
                particleCount: count / 2,
                angle: 60,
                startVelocity: 25
            });
            confetti({
                ...defaults,
                particleCount: count / 2,
                angle: 120,
                startVelocity: 25
            });
        }, 150);
    }

    function updateProgress() {
        const totalTasks = taskList.children.length;
        const completedTasks = document.querySelectorAll('#task-list li.completed').length;

        progressText.querySelector('.progress-count').textContent = `${completedTasks}/${totalTasks}`;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressFill.style.width = `${progressPercentage}%`;

        if (totalTasks > 0 && completedTasks === totalTasks) {
            if (!progressFill.dataset.wasComplete) {
                triggerConfetti();
            }
            progressFill.dataset.wasComplete = "true";
        } else {
            delete progressFill.dataset.wasComplete;
        }
    }

    addTaskButton.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    // Initialize the app
    loadTasks();
});