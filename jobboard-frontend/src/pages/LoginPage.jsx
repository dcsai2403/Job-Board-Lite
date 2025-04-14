import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Importing icons from react-icons

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Login failed");
      }

      const userRole = data.role;

      if (!userRole) {
        setErrorMsg("Login failed: Role not found");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", userRole);

      if (userRole === "Recruiter") {
        navigate("/dashboard/recruiter");
      } else if (userRole === "Seeker") {
        navigate("/dashboard/seeker");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-indigo-100 to-indigo-300 px-6">
      <div className="bg-white bg-opacity-90 p-12 rounded-3xl shadow-xl w-full max-w-md transition transform hover:scale-105 ease-in-out duration-500">
        <h2 className="text-4xl font-semibold mb-6 text-center text-indigo-700 tracking-tight">Welcome!</h2>
        <p className="text-center text-gray-600 mb-8 text-lg">Login to your account</p>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-lg text-sm text-center shadow-md">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8 flex flex-col items-center">
          <div className="w-[320px]">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
              <FaEnvelope className="mr-3 text-indigo-600" /> Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="block w-full px-5 py-4 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-indigo-600 transition duration-300 ease-in-out shadow-md"
            />
          </div>

          <div className="w-[320px]">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
              <FaLock className="mr-3 text-indigo-600" /> Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="block w-full px-5 py-4 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-indigo-600 transition duration-300 ease-in-out shadow-md"
            />
          </div>

          <button
            type="submit"
            className="w-[320px] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 mt-6"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
