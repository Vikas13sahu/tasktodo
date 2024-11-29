window.onload = function () {
    loadTasks();
    document.getElementById('inputbox').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    requestNotificationPermission();
};

// Request permission for browser notifications
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                alert("Enable notifications to receive reminders.");
            }
        });
    }
}

function loadTasks() {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed, task.reminderTime);
        if (task.reminderTime) {
            scheduleReminder(task.text, task.reminderTime);
        }
    });
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
    const reminderTime = document.getElementById('reminderTime').value;

    if (taskText !== "") {
        addTaskToDOM(taskText, false, reminderTime);
        saveNewTask(taskText, reminderTime);
        if (reminderTime) {
            scheduleReminder(taskText, reminderTime);
        }
        document.getElementById('inputbox').value = '';
        document.getElementById('reminderTime').value = '';
    }
}

function addTaskToDOM(taskText, completed, reminderTime) {
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

    checkbox.addEventListener('change', function () {
        span.classList.toggle('completed');
        toggleTaskCompletion(taskText);
    });

    deleteBtn.addEventListener('click', function () {
        taskList.removeChild(li);
        deleteTaskFromStorage(taskText);
    });

    taskContent.appendChild(checkbox);
    taskContent.appendChild(span);
    li.appendChild(taskContent);

    // Add reminder time display
    if (reminderTime) {
        const reminderSpan = document.createElement('span');
        reminderSpan.classList.add('reminder-time');
        reminderSpan.innerText = `Reminder: ${new Date(reminderTime).toLocaleString()}`;
        li.appendChild(reminderSpan);
    }

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function saveNewTask(taskText, reminderTime) {
    let tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskText, completed: false, reminderTime: reminderTime || null });
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

function scheduleReminder(taskText, reminderTime) {
    const now = new Date().getTime();
    const reminderTimestamp = new Date(reminderTime).getTime();
    const delay = reminderTimestamp - now;

    if (delay > 0) {
        setTimeout(() => {
            showNotification(taskText);
        }, delay);
    }
}

function showNotification(taskText) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Task Reminder", {
            body: `It's time to: ${taskText}`,
            icon: "https://www.iconsdb.com/icons/preview/blue/bell-xxl.png"
        });
    }

    // Play sound notification
    const notificationSound = document.getElementById("notificationSound");
    notificationSound.play();

    // Show Toastr notification
    toastr.info(`Reminder: ${taskText}`);
}
