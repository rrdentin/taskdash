class User {

    constructor() {
        this.users = this.getUsers() || [];
    }

    saveUser(userData) {
        // Check if the username already exists
        const usernameExists = this.users.some(user => user.username.toLowerCase() === userData.username.toLowerCase());

        if (usernameExists) {
            // If username exists, return failure
            return {
                success: false,
                message: "Username already taken. Please choose another one."
            };
        }

        // If username doesn't exist, save the new user with the password
        const newUser = {
            id: Date.now(),
            username: userData.username,
            password: userData.password, // Save the password
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        return {
            success: true,
        };
    }

    signInUser(usernameByInput, passwordByInput) {
    const userExists = this.users.some(user => user.username.toLowerCase() === usernameByInput.toLowerCase());

    if (userExists) {
        const user = this.users.find(user => user.username.toLowerCase() === usernameByInput.toLowerCase());
        
        // Check if password matches
        if (user.password === passwordByInput) {
            return {
                success: true,
                username: usernameByInput,
            };
        } else {
            return {
                success: false,
                message: "Incorrect password.",
            };
        }
    } else {
        return {
            success: false,
            message: 'User not found.',
        };
    }
}


    getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    
}
