import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Seeker",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-indigo-100 to-indigo-300 px-6">
      <div className="bg-white bg-opacity-90 p-12 rounded-3xl shadow-xl w-full max-w-md transition transform hover:scale-105 ease-in-out duration-500">
        <h2 className="text-4xl font-semibold mb-6 text-center text-indigo-700 tracking-tight">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Register to get started
        </p>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-lg text-sm text-center shadow-md">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8 flex flex-col items-center">
          <div className="w-[320px]">
            <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
              <FaUser className="mr-3 text-indigo-600" /> Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="block w-full px-5 py-4 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 transition duration-300 shadow-md"
            />
          </div>

          <div className="w-[320px]">
            <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
              <FaEnvelope className="mr-3 text-indigo-600" /> Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="block w-full px-5 py-4 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 transition duration-300 shadow-md"
            />
          </div>

          <div className="w-[320px]">
            <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
              <FaLock className="mr-3 text-indigo-600" /> Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="block w-full px-5 py-4 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 transition duration-300 shadow-md"
            />
          </div>

          <div className="w-[320px]">
            <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
              <FaUserTag className="mr-3 text-indigo-600" /> Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="block w-full px-5 py-4 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 transition duration-300 shadow-md"
            >
              <option value="Seeker">Job Seeker</option>
              <option value="Recruiter">Recruiter</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-[320px] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 mt-6"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-600 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
