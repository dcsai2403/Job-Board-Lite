import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));

    if (token) {
      fetch("http://localhost:5000/api/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch applied jobs");
          return res.json();
        })
        .then((data) => setAppliedJobs(data.map((app) => app.job_id)))
        .catch((err) => console.error("Error fetching applied jobs:", err));
    }
  }, []);

  const handleApply = (job) => {
    setSelectedJob(job);
    setCoverLetter("");
    setResumeFile(null);
    setSuccessMessage("");
    setErrorMessage("");
    setEmail("");
    setPhone("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setErrorMessage("Only PDF files are allowed.");
      setResumeFile(null);
    } else {
      setErrorMessage("");
      setResumeFile(file);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("cover_letter", coverLetter);
    formData.append("email", email);
    formData.append("phone", phone);
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${selectedJob.id}/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to submit application");
      }

      setSuccessMessage("Application submitted successfully!");
      setSelectedJob(null);
      setAppliedJobs((prev) => [...prev, selectedJob.id]);
    } catch (err) {
      console.error("Error submitting application:", err);
      setErrorMessage(err.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setSuccessMessage("Logged out successfully!");
    navigate("/login");
  };

  return (
    <>
      <style>
        {`
          .applied-message {
            color: #16a34a;
            font-weight: bold;
            background-color: #e6f4ea;
            padding: 8px;
            border-radius: 4px;
            text-align: center;
          }
        `}
      </style>
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
            Available Jobs
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Job Application Form */}
        {selectedJob ? (
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            {/* form content here */}
          </form>
        ) : jobs.length === 0 ? (
          // No Jobs Available
          <div className="flex flex-col items-center justify-center h-[40vh] text-center text-gray-600">
            <h3 className="text-xl font-semibold mb-2">
              No jobs available right now
            </h3>
            <p className="mb-4">
              We're currently out of listings. Please check back later or refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Refresh
            </button>
          </div>
        ) : (
          // Jobs Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow p-4"
              >
                <h3 className="text-lg font-semibold text-blue-600">{job.title}</h3>
                <p className="text-gray-700 mt-2">{job.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Location: {job.location || "Not specified"}
                </p>
                <p className="text-sm text-gray-500">
                  Posted on: {new Date(job.date_posted).toLocaleDateString()}
                </p>
                {appliedJobs.includes(job.id) ? (
                  <div className="applied-message mt-4">
                    You have already applied for this job.
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(job)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default JobSeekerDashboard;
