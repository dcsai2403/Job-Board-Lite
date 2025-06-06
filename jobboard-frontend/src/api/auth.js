import api from "./axios";

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const register = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};
