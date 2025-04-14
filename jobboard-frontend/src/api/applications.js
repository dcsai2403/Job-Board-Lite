import api from "./axios";

export const applyToJob = (jobId) => api.post(`/jobs/${jobId}/apply`);

export const getMyApplications = () => api.get("/applications");
