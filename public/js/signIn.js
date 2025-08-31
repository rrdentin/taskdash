document.addEventListener('DOMContentLoaded', () => {
    // Step 1: Check if the user is already logged in with "Remember Me"
    const storedUsername = localStorage.getItem('usernameLoggedIn');
    const sessionUsername = sessionStorage.getItem('usernameLoggedIn'); // Session storage for non-"Remember Me" users

    // If username exists in localStorage or sessionStorage, auto-redirect to tasks page
    if (storedUsername || sessionUsername) {
        window.location.href = '../tasks.html'; // Redirect to the tasks page
        return; // No need to continue with the form submission
    }

    const userForm = document.getElementById('userForm');
    const userManager = new User();

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usernameByInput = document.getElementById('username').value;
        const passwordByInput = document.getElementById('password').value;
        const rememberMeChecked = document.getElementById('remember').checked;

        const result = userManager.signInUser(usernameByInput, passwordByInput);

        if (result.success) {
            if (rememberMeChecked) {
                // Store the username in localStorage if "Remember Me" is checked (persists beyond browser sessions)
                localStorage.setItem('usernameLoggedIn', usernameByInput);
            } else {
                // Store the username in sessionStorage for current session only
                sessionStorage.setItem('usernameLoggedIn', usernameByInput);

                // Set timeout for session expiry (e.g., 3 hours, adjust as needed)
                setTimeout(() => {
                    sessionStorage.removeItem('usernameLoggedIn');
                    Swal.fire({
                        toast: true,
                        icon: 'warning',
                        title: 'Session Expired!',
                        text: 'Your session has expired. Please log in again.',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        position: 'top-right',
                    }).then(() => {
                        window.location.href = 'index.html'; // Redirect to the sign-in page
                    });
                }, 3 * 60 * 60 * 1000); // 3 hours timeout (in milliseconds)
            }

            // Show SweetAlert2 for success as a toast
            Swal.fire({
                toast: true,
                icon: 'success',
                title: 'Login Successful!',
                text: 'You have successfully logged in.',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                position: 'top-right',
            }).then(() => {
                // Redirect to the tasks page after successful login
                window.location.href = '../tasks.html';
            });
        } else {
            // Show SweetAlert2 for error as a toast
            Swal.fire({
                toast: true,
                icon: 'error',
                title: 'Login Failed!',
                text: result.message || 'Login failed. Please try again.',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                position: 'top-right',
            });
        }
    });
});
