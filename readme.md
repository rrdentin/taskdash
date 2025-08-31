# TaskDash

  ![image](https://media.discordapp.net/attachments/597637032780627971/1411710977115684924/logo-1.png?ex=68b5a5cd&is=68b4544d&hm=2a46af5d49e015e445ba721ed00d1845443e9329b8a98a1ff72363c07abb2705&=&format=webp&quality=lossless&width=288&height=63)


## Description
TaskDash is a simple to-do app built using **vanilla JavaScript**, **Tailwind CSS**, and **SweetAlert**. The app allows users to sign up, sign in, manage their tasks, and add new tasks. Tasks are stored using **localStorage** for persistence and **sessionStorage** for session-based logins. Task management features include CRUD (Create, Read, Update, Delete) operations, allowing users to interact with their tasks easily.

## Technologies Used
- **JavaScript** (Vanilla)
- **Tailwind CSS** (For styling)
- **SweetAlert** (For beautiful pop-up alerts)
- **localStorage** (For persistent user data)
- **sessionStorage** (For session-based user login)
- **IBM Granite** (AI support to help with code fixes and documentation)

## Features
- **User Authentication:**
  - Sign up with a username and password
  - Sign in to access tasks
  - Remember user login with localStorage or sessionStorage
- **Task Management:**
  - Add new tasks
  - View existing tasks
  - Mark tasks as completed
  - Delete tasks
- **Responsive UI:**
  - Built with Tailwind CSS to ensure responsiveness across devices
- **Beautiful Alerts:**
  - Uses SweetAlert for user-friendly notifications and confirmations

## Setup Instructions
1. Clone this repository:
   ```bash
   git clone https://github.com/rrdenti/taskdash.git
2. Open the index.html file in your browser.

3. No server setup is required as this project uses localStorage and sessionStorage for saving data.

4. Start adding tasks, signing in, and managing your tasks!

## AI Support Explanation

IBM Granite played a key role in assisting with various aspects of the TaskDash development, making the process more efficient and effective. Here's how it contributed:
![](https://media.discordapp.net/attachments/597637032780627971/1411712754506666175/image.png?ex=68b5a775&is=68b455f5&hm=e4d74406ced08cfbbb17226260330700e2b754716524037d9c2778c4c91de5ed&=&format=webp&quality=lossless&width=1823&height=800)

### Code Debugging and Optimization:

IBM Granite helped identify bugs and inefficiencies in the code.

It provided real-time suggestions for improving the logic, ensuring that tasks were managed correctly and consistently, especially when handling localStorage and sessionStorage for user data.

It optimized the code by recommending better practices for task filtering and user identification.

- Code Fixes:
  It suggested minor fixes to ensure the app worked seamlessly across multiple browsers and devices.
  For instance, it provided advice on managing asynchronous operations for fetching and storing tasks, preventing issues like race conditions.

- Documentation Generation:
  IBM Granite automatically generated portions of the project's documentation, including:

- Code Comments: Clear, concise, and useful comments were added to the codebase.

- Functionality Testing:
  AI helped simulate the user experience and check the task management process, ensuring the app would behave as expected during user sign-up, task creation, and task deletion.

- Error Handling:
  It helped implement robust error handling, particularly for the localStorage and sessionStorage interactions, to gracefully handle scenarios where data might be missing or corrupted.

By integrating IBM Granite into the development process, TaskDash was able to be more polished, reliable, and better documented, all while enhancing the development workflow.