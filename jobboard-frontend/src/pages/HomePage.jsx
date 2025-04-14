import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth logic (if implemented)
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to the Job Board</h1>
        <p className="text-gray-600 mb-6">Start applying for jobs or post a new job if you're an employer.</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
