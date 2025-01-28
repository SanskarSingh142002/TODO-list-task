document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const searchInput = document.getElementById("searchInput");

  // Load tasks from localStorage on page load
  loadTasks();

  // Add task
  addTaskBtn.addEventListener("click", () => {
    addTask();
  });

  taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  });

  // Search tasks
  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    const tasks = document.querySelectorAll("#taskList li");
    tasks.forEach((task) => {
      const text = task.querySelector(".task-text").textContent.toLowerCase();
      task.style.display = text.includes(filter) ? "flex" : "none";
    });
  });

  function addTask() {
    const taskText = taskInput.value.trim(); // Get the input value
    if (taskText) {
      const taskObj = { text: taskText, completed: false }; // Create a new task object
      addTaskToList(taskObj); // Add to UI
      saveTaskToLocalStorage(taskObj); // Save to localStorage
      taskInput.value = ""; // Clear the input field
    }
  }

  // Add task to the list
  function addTaskToList(taskObj) {
    const li = document.createElement("li");

    // Create the radio button for marking tasks as completed
    const radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.className = "task-radio";

    // Set radio button state based on the task's completion status
    radioButton.checked = taskObj.completed;

    // Create the task text
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = taskObj.text;

    // Apply strikethrough if the task is completed
    if (taskObj.completed) {
      taskText.innerHTML = `<s>${taskObj.text}</s>`;
    }

    // Add event listener to toggle strikethrough on task
    radioButton.addEventListener("click", () => {
      taskObj.completed = radioButton.checked;
      updateTaskInLocalStorage(taskObj.text, taskObj);

      if (taskObj.completed) {
        taskText.innerHTML = `<s>${taskObj.text}</s>`;
      } else {
        taskText.textContent = taskObj.text;
      }
    });

    // Create the menu for edit and delete actions
    const menu = document.createElement("div");
    menu.className = "menu";

    const menuBtn = document.createElement("button");
    menuBtn.className = "menu-btn";
    menuBtn.textContent = ":";

    const menuOptions = document.createElement("div");
    menuOptions.className = "menu-options";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () =>
      enableEditing(taskText, li, menuOptions)
    );

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      removeTaskFromLocalStorage(taskObj.text);
      li.remove();
    });

    menuOptions.append(editBtn, deleteBtn);
    menu.append(menuBtn, menuOptions);

    menuBtn.addEventListener("click", () => {
      menuOptions.style.display =
        menuOptions.style.display === "block" ? "none" : "block";
    });

    // Append the radio button, task text, and menu to the list item
    li.append(radioButton, taskText, menu);

    // Append the list item to the task list
    taskList.appendChild(li);
  }

  // Enable inline editing
  function enableEditing(taskText, li, menuOptions) {
    menuOptions.style.display = "none"; // Hide menu options

    const input = document.createElement("input");
    input.type = "text";
    input.value = taskText.textContent;
    input.className = "edit-input";

    input.addEventListener("blur", () => saveTask(input, taskText, li)); // Save on losing focus
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveTask(input, taskText, li); // Save on pressing Enter
      }
    });

    li.replaceChild(input, taskText);
    input.focus(); // Focus on the input field
  }

  // Save edited task
  function saveTask(input, taskText, li) {
    const oldTask = taskText.textContent;
    const newTask = input.value.trim() || oldTask;

    updateTaskInLocalStorage(oldTask, { text: newTask, completed: false });
    taskText.textContent = newTask;
    li.replaceChild(taskText, input); // Replace input with updated task
  }

  // Save task to localStorage
  function saveTaskToLocalStorage(taskObj) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Load tasks from localStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      addTaskToList(task);
    });
  }

  // Remove task from localStorage
  function removeTaskFromLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.filter((task) => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  // Update task in localStorage
  function updateTaskInLocalStorage(oldTaskText, newTaskObj) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex((task) => task.text === oldTaskText);
    if (taskIndex !== -1) {
      tasks[taskIndex] = newTaskObj;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }
});
