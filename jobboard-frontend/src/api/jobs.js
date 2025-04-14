import api from "./axios";

export const getAllJobs = () => api.get("/jobs");

export const getMyJobs = () => api.get("/jobs/my");

export const postJob = (jobData) => api.post("/jobs", jobData);

export const updateJob = (id, jobData) => api.put(`/jobs/${id}`, jobData);

export const deleteJob = (id) => api.delete(`/jobs/${id}`);
