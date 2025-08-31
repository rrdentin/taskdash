document.addEventListener('DOMContentLoaded', () => {
    const storedUsername = localStorage.getItem('usernameLoggedIn');
    const sessionUsername = sessionStorage.getItem('usernameLoggedIn'); // Use sessionStorage as fallback

    // Use storedUsername from localStorage, otherwise use sessionUsername, or default to "Guest"
    const usernameLoggedIn = storedUsername || sessionUsername || "Guest";

    // Set usernameLoggedIn value into the HTML element
    const usernameElement = document.getElementById("usernameLoggedIn");
    if (usernameElement) usernameElement.textContent = usernameLoggedIn; // Update the username in HTML
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const taskForm = document.getElementById('taskForm');
    const taskManager = new Task();

    taskForm.addEventListener('submit', (e) => {

        e.preventDefault();

        const taskData = {
            taskName: document.getElementById('taskName').value,
            taskPriority: document.getElementById('taskPriority').value,
            createdAt: `${year}-${month}-${day}`,
        };

        const result = taskManager.saveTask(taskData);

        if (result.success) {
            Swal.fire({
                toast: true,
                icon: 'success',
                title: 'Task Saved!',
                text: 'Your task has been successfully saved.',
                showConfirmButton: false,
                timer: 1500, // Toast time in ms
                timerProgressBar: true,
                position: 'top-right',
                background: '#4CAF50', // Green background for success
                color: '#fff',
            }).then(() => {
                window.location.href = '../tasks.html';
            });
        } else {
            Swal.fire({
                toast: true,
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save the task. Please try again.',
                showConfirmButton: false,
                timer: 3000, // Toast time in ms
                timerProgressBar: true,
                position: 'top-right',
                background: '#FF5733', // Red background for error
                color: '#fff',
            });
        }
    });
});
