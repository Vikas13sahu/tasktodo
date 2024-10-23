window.onload = function() {
    loadTasks();
    document.getElementById('inputbox').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
};

function loadTasks() {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

function getTasksFromLocalStorage() {
    let tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskText = document.getElementById('inputbox').value.trim();
    
    if (taskText !== "") {
        addTaskToDOM(taskText, false);
        saveNewTask(taskText);
        document.getElementById('inputbox').value = ''; 
    }
}

function addTaskToDOM(taskText, completed) {
    const taskList = document.getElementById('List');

    const li = document.createElement('li');
    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;

    const span = document.createElement('span');
    span.innerText = taskText;

    if (completed) {
        span.classList.add('completed');
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.classList.add('deleteBtn');
    
    checkbox.addEventListener('change', function() {
        span.classList.toggle('completed');
        toggleTaskCompletion(taskText);
    });

    deleteBtn.addEventListener('click', function() {
        taskList.removeChild(li);
        deleteTaskFromStorage(taskText);
    });

    taskContent.appendChild(checkbox);
    taskContent.appendChild(span);
    li.appendChild(taskContent);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function saveNewTask(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskText, completed: false });
    saveTasksToLocalStorage(tasks);
}

function toggleTaskCompletion(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        if (task.text === taskText) {
            task.completed = !task.completed;
        }
    });
    saveTasksToLocalStorage(tasks);
}

function deleteTaskFromStorage(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.text !== taskText);
    saveTasksToLocalStorage(tasks);
}
