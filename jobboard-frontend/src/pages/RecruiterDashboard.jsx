import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: "", description: "", location: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedJobApplicants, setSelectedJobApplicants] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const fetchJobs = () => {
    if (!token) {
      console.error("Token is missing");
      return;
    }

    fetch("http://localhost:5000/api/recruiter/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  };

  const fetchApplicants = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/recruiter/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch applicants");
      }

      const data = await res.json();
      setSelectedJobApplicants(Array.isArray(data) ? data : []);
      setSelectedJobId(jobId);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setSuccessMessage("Logged out successfully!");
    navigate("/login");
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handlePostJob = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    fetch("http://localhost:5000/api/recruiter/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newJob),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.msg || "Failed to post job");
          });
        }
        return res.json();
      })
      .then(() => {
        setSuccessMessage("Job posted successfully!");
        setNewJob({ title: "", description: "", location: "" });
        fetchJobs();
      })
      .catch((err) => {
        console.error("Error posting job:", err);
        setErrorMessage(err.message);
      });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Job Posts</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md"
        >
          Logout
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 shadow-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 shadow-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePostJob} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Job Title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          placeholder="Job Description"
          value={newJob.description}
          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        ></textarea>
        <input
          type="text"
          placeholder="Location (optional)"
          value={newJob.location}
          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md"
        >
          Post Job
        </button>
      </form>

       {/* Job Cards */}
       {jobs.length === 0 ? (
        <p className="text-gray-600 italic">You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border rounded-xl shadow-md hover:shadow-lg transition duration-300 p-5"
            >
              <h3 className="text-lg font-semibold text-blue-700">{job.title}</h3>
              <p className="text-gray-700 mt-2">{job.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                📍 Location: {job.location || "Not specified"}
              </p>
              <p className="text-sm text-gray-500">
                🕒 Posted on: {new Date(job.date_posted).toLocaleDateString()}
              </p>
              <button
                onClick={() => fetchApplicants(job.id)}
                className="mt-4 w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg"
              >
                View Applicants
              </button>
            </div>
          ))}
        </div>
      )}


    {/* Applicants Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
    <div
      className="bg-white rounded-l-2xl shadow-2xl p-6 max-h-full overflow-y-auto transition-all border-l-4 border-blue-600"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        width: "30%",
      }}
    >
      <h3 className="text-2xl font-bold mb-6 text-gray-800" style={{ marginLeft: "1rem" }}>
        Applicants for Job: {jobs.find((job) => job.id === selectedJobId)?.title || "Unknown Job"}
      </h3>

      {selectedJobApplicants.length > 0 ? (
        <ul className="space-y-6">
          {selectedJobApplicants.map((applicant, index) => (
            <li
              key={`${applicant.id}-${index}`}
              className="p-4 rounded-xl bg-gray-50 shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
            >
              <p className="mb-2 text-lg font-semibold text-gray-800">
                <strong>Name:</strong> {applicant.name}
              </p>
              <p className="mb-2 text-gray-700">
                <strong>DOB:</strong> {applicant.dob}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {applicant.email}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 italic">No applicants found for this job.</p>
      )}

      <button
        onClick={() => setShowModal(false)}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md w-full"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default RecruiterDashboard;
