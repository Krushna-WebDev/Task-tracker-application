# Task Tracker Application

A full-stack task management application built with React, Express, and MongoDB.

## Features

- User Authentication (JWT)
  - Signup
  - Login
  - User Profile
- Project Management (up to 4 projects per user)
  - Create Project
  - List Projects
  - View Project Details
  - Delete Project
- Task Management
  - Create Task
  - Read/View Tasks
  - Update Task Status
  - Delete Task
- Data tracking
  - Task creation date
  - Task completion date
  - Task status (pending, in-progress, completed)

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- TailwindCSS

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run start
```

The server will run on http://localhost:5000

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm run dev
```

The application will run on http://localhost:5173

## API Endpoints

### Authentication
- POST /api/auth/signup - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user details

### Projects
- GET /api/projects - Get all projects for current user
- GET /api/projects/:id - Get a specific project
- POST /api/projects - Create a new project
- PUT /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project

### Tasks
- GET /api/tasks?projectId=:projectId - Get all tasks for a project
- GET /api/tasks/:id - Get a specific task
- POST /api/tasks - Create a new task
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task

## Data Models

### User
- email (String, required, unique)
- password (String, required)
- name (String, required)
- country (String, required)
- projects (Array of Project IDs, limited to 4)

### Project
- title (String, required)
- description (String)
- userId (ObjectId, reference to User)
- createdAt (Date)
- updatedAt (Date)

### Task
- title (String, required)
- description (String)
- status (String, enum: ['pending', 'in-progress', 'completed'])
- projectId (ObjectId, reference to Project)
- createdAt (Date)
- completedAt (Date)
- updatedAt (Date) 