document.addEventListener('DOMContentLoaded', () => {

    const userForm = document.getElementById('userForm');
    const userManager = new User();

    userForm.addEventListener('submit', (e) => {

        e.preventDefault();

        const userData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,  // Get the password value
        };

        const result = userManager.saveUser(userData);

        if (result.success) {
            // Show Toastify-like SweetAlert for success
            Swal.fire({
                toast: true,
                icon: 'success',
                title: 'User successfully registered!',
                color: '#4CAF50',
                background: '#fff', // Green for success
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000, // 3 seconds
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
            }).then(() => {
                // Redirect after the toast disappears
                window.location.href = '../index.html';
            });
        } else {
            // Show Toastify-like SweetAlert for error
            Swal.fire({
                toast: true,
                icon: 'error',
                title: result.message, // Display the error message
                color: '#FF5733',
                background: '#fff', // Red for error
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
            });
        }
    });
});
