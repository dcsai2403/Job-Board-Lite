import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
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
    if (token) {
      try {
        const base64Payload = token.split(".")[1]; // Extract the payload part of the JWT
        const decodedPayload = JSON.parse(atob(base64Payload)); // Decode the base64 payload
        if (decodedPayload && decodedPayload.sub && decodedPayload.sub.name) {
          setApplicantName(decodedPayload.sub.name); // Correctly access the name inside the sub object
        } else {
          console.warn("Name field is missing in the token payload");
          setApplicantName("Unknown"); // Fallback if name is not present
        }
      } catch (e) {
        console.error("Failed to decode token", e);
        setApplicantName("Unknown"); // Fallback in case of an error
      }
    } else {
      console.warn("No token found in localStorage");
      setApplicantName("Unknown"); // Fallback if no token is found
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
    setLoading(true); // Start spinner
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
    } catch (err) {
      console.error("Error submitting application:", err);
      setErrorMessage(err.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setSuccessMessage("Logged out successfully!");
    navigate("/login");
  };

  const handleRefresh = () => {
    setLoading(true); // Show loading spinner during refresh
    fetch("http://localhost:5000/api/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then((data) => {
        if (JSON.stringify(data) !== JSON.stringify(jobs)) {
          setJobs(data);
          setSuccessMessage("Jobs updated successfully!");
          setTimeout(() => setSuccessMessage(""), 1500);
        } else {
          setJobs(data);
          setSuccessMessage("No update from the Recruiters.");
          setTimeout(() => setSuccessMessage(""), 1500);
        }
      })
      .catch((err) => {
        console.error("Error refreshing jobs:", err);
        setErrorMessage("Failed to refresh jobs. Please try again.");
        setTimeout(() => setErrorMessage(""), 1500);
      })
      .finally(() => setLoading(false)); // Stop loading spinner
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {selectedJob ? `Apply for ${selectedJob.title} position` : (jobs.length > 0 ? "Available Jobs" : "")}
        </h2>
      </div>
  
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
  
      {/* Main Content Area */}
      {jobs.length === 0 && !selectedJob ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold">No Jobs Available</h3>
          <p className="mt-2 text-gray-600">There are currently no job listings. Please check back later.</p>
        </div>
      ) : selectedJob ? (
        <form onSubmit={handleSubmitApplication} className="space-y-4">
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={applicantName}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
  
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="you@example.com"
          />
  
          <label className="block font-medium">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="123-456-7890"
          />
  
          <label className="block font-medium">Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
            rows="5"
            className="w-full px-3 py-2 border rounded"
            placeholder="Write your cover letter here..."
          />
  
          <label className="block font-medium">Upload Resume (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full"
          />
  
          <div className="flex gap-4 items-center">
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded ${
                loading || !email || !phone || !coverLetter || !resumeFile
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={loading || !email || !phone || !coverLetter || !resumeFile}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
            {loading && <ClipLoader color="#ffffff" size={20} />}
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition-shadow p-4"
            >
              <h3 className="text-lg font-semibold text-blue-600">{job.title}</h3>
              <p className="text-gray-700 mt-2">{job.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                📍 Location: {job.location || "Not specified"}
              </p>
              <p className="text-sm text-gray-500">
                🕒 Posted on: {new Date(job.date_posted).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleApply(job)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
  
      {/* Conditionally show these buttons */}
      {!selectedJob && (
        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default JobSeekerDashboard;