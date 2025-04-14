import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PublicJobBoard from "./pages/PublicJobBoard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect the root path to /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/jobs" element={<PublicJobBoard />} />
        <Route path="/dashboard/seeker" element={<JobSeekerDashboard />} />
        <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;