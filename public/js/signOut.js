document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logoutButton').addEventListener('click', () => {
        // Clear username from both localStorage and sessionStorage
        localStorage.removeItem('usernameLoggedIn');
        sessionStorage.removeItem('usernameLoggedIn');
        
        // Redirect to the sign-in page
        window.location.href = 'index.html';
    });
});
