# Job Board Application

The **Job Board Application** is a full-stack web application designed to connect job seekers and recruiters. Job seekers can browse available jobs, apply for positions, and manage their applications, while recruiters can post job openings, view applicants, and manage job postings. The project is built using a **React** frontend and a **Flask** backend.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Setup and Installation](#setup-and-installation)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
5. [Usage](#usage)
6. [API Endpoints](#api-endpoints)

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

## Setup and Installation

### Prerequisites
- **Node.js** (v16 or higher) and **npm** installed for the frontend.
- **Python** (v3.10 or higher) installed for the backend.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd jobboard-backend
