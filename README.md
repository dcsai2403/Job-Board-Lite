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
7. [License](#license)

---

## Project Structure

The project is organized into two main directories:

jobboard/
├── jobboard-backend/       # Flask backend API
│   ├── app.py              # Main application entry point
│   ├── auth_utils.py       # Authentication helper functions
│   ├── config.py           # App configuration
│   ├── models.py           # Database models
│   ├── requirements.txt    # Backend dependencies
│   ├── instance/
│   │   └── app.db          # SQLite database file
│   └── uploads/            # Uploaded resume files
│
├── jobboard-frontend/      # React frontend application
│   ├── src/
│   │   ├── api/            # API service layer
│   │   ├── components/     # Shared UI components
│   │   ├── pages/          # Page-level components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Root component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies and scripts
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── vite.config.js      # Vite config
│
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation