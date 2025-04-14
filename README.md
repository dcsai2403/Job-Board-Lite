# Job Board Application

The **Job Board Application** is a full-stack web application designed to connect job seekers and recruiters. Job seekers can browse available jobs, apply for positions, and manage their applications, while recruiters can post job openings, view applicants, and manage job postings. The project is built using a **React** frontend and a **Flask** backend.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Docker Setup](#docker-setup)
5. [Setup and Installation](#setup-and-installation)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)

---

## Project Structure

The project is organized into two main directories:

![image](https://github.com/user-attachments/assets/80445ba6-a55d-41fa-8771-c38594a6bd41)

## Features

### Job Seekers
- Browse available job postings.
- Apply for jobs by submitting a cover letter and resume.
- View and manage submitted applications.

### Recruiters
- Post new job openings.
- View job postings they have created.
- View applicants for specific job postings.

---

## Technologies Used

### Backend
- **Flask**: Web framework for building the API.
- **Flask-CORS**: Cross-Origin Resource Sharing for frontend-backend communication.
- **Flask-JWT-Extended**: Authentication using JSON Web Tokens (JWT).
- **Flask-SQLAlchemy**: ORM for database interactions.
- **SQLite**: Database for storing application data.

### Frontend
- **React**: Frontend library for building the user interface.
- **React Router**: For routing and navigation.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: Build tool for fast development.

---

### Docker Setup

1. Build and start the containers:

```bash
docker-compose up --build
```

2. Access the frontend at:
 http://localhost:5173 and the backend at http://localhost:5000.

---

## Setup and Installation

### Prerequisites
- **Node.js** (v16 or higher) and **npm** installed for the frontend.
- **Python** (v3.10 or higher) installed for the backend.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd jobboard-backend
   ```

2. Install dependencies:

```bash
   pip install -r requirements.txt
```
3. Run the app:

```bash
python .\app.py
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd jobboard-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:

npm run dev

### Usage
1. Open the frontend in your browser at http://localhost:5173.

2. Register as a job seeker or recruiter.

3. Job seekers can browse jobs and apply, while recruiters can post jobs and view applicants

### API Endpoints
1. Authentication:

   - POST /api/auth/register: Register a new user.

   - POST /api/auth/login: Login and receive a JWT token.

2. Jobs

   - GET /api/jobs: Get all job postings.

   - POST /api/recruiter/jobs: Post a new job (Recruiter only).

   - GET /api/recruiter/jobs: Get jobs posted by the recruiter.

3. Applications

   - POST /api/jobs/<job_id>/apply: Apply for a job (Job Seeker only).

   - GET /api/applications: View applications submitted by the job seeker.