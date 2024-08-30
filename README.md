# DueIt

DueIt is a web application designed to help users manage and track their bills efficiently. It provides a user-friendly interface for adding, viewing, and managing bills, along with features like due date reminders and payment status tracking.

## Features

- User Authentication: Secure signup and login functionality.
- Dashboard: Overview of total due amount, bills due this month, and overdue bills.
- Bill Management: Add, edit, delete, and mark bills as paid/unpaid.
- Reminder System: Automated reminders for upcoming bill due dates.
- Responsive Design: Works seamlessly on desktop and mobile devices.

## Tech Stack

- Frontend:
  - Next.js (React framework)
  - TypeScript
  - Tailwind CSS for styling
  - Axios for API requests

- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose ORM
  - JSON Web Tokens (JWT) for authentication

## Project Structure

- `/frontend`: Contains the Next.js frontend application
- `/backend`: Contains the Express.js backend application

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dueit.git
   cd dueit
   ```

2. Install dependencies for both frontend and backend:
   ```
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Set up environment variables:
   - In the `/backend` directory, create a `.env` file based on `.env.example`
   - Set your MongoDB URI and JWT secret

4. Start the development servers:
   - For backend: `cd backend && npm run dev`
   - For frontend: `cd frontend && npm run dev`

5. Open `http://localhost:3000` in your browser to view the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.