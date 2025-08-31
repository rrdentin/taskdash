class Task {
    constructor() {
        this.tasks = this.getTasks(); // Fetch tasks for the logged-in user
    }

    // Get tasks for the logged-in user
    getTasks() {
        const username =
            sessionStorage.getItem("usernameLoggedIn") ||
            localStorage.getItem("usernameLoggedIn");

        if (!username) {
            console.error("User is not logged in.");
            return []; // No user logged in, return empty array
        }

        const userId = this.getUserIdByUsername(username);
        if (!userId) {
            console.error("User ID not found.");
            return []; // User ID missing
        }

        // Fetch tasks from localStorage
        const rawTasks = localStorage.getItem("tasks") || "[]";
        const tasks = JSON.parse(rawTasks);

        // Return only tasks belonging to this user
        return tasks.filter((task) => task.userId === userId);
    }

    // Save a new task
    saveTask(taskData) {
        const username =
            sessionStorage.getItem("usernameLoggedIn") ||
            localStorage.getItem("usernameLoggedIn");

        if (!username) {
            console.error("User is not logged in.");
            return { success: false, message: "User not logged in." };
        }

        const userId = this.getUserIdByUsername(username);
        if (!userId) {
            console.error("User ID not found.");
            return { success: false, message: "User ID not found." };
        }

        const newTaskData = {
            id: Date.now(),
            userId, // Store userId with the task
            isCompleted: false,
            ...taskData,
        };

        // Retrieve tasks from localStorage
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        // Append the new task to the tasks list
        tasks.push(newTaskData);

        // Save the updated tasks list back to localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));

        return {
            success: true,
        };
    }

    // Get userId by username
    getUserIdByUsername(username) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((u) => u.username === username);
        return user ? user.id : null;
    }

    // Mark a task as completed
    completeTask(taskId) {
        // Get tasks from localStorage
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        // Find the task by id
        const taskIndex = tasks.findIndex((task) => task.id === taskId);

        if (taskIndex !== -1) {
            tasks[taskIndex].isCompleted = true;
            // Save the updated tasks list back to localStorage
            localStorage.setItem("tasks", JSON.stringify(tasks));
            console.log("Task marked as completed:", tasks[taskIndex]);
        } else {
            console.error("Task not found for completion.");
        }
    }

    // Delete a task
    deleteTask(taskId) {
        // Get tasks from localStorage
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        // Find the task by id
        const taskIndex = tasks.findIndex((task) => task.id === taskId);

        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1); // Remove the task from the array
            // Save the updated tasks list back to localStorage
            localStorage.setItem("tasks", JSON.stringify(tasks));
            console.log("Task deleted:", tasks);
        } else {
            console.error("Task not found for deletion.");
        }
    }
}
