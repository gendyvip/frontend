import axios from "axios";

const baseURL = "https://backend.dawaback.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  }
  return config;
});

export const UpdateInfo = async (id,data) => {
  try {
    const response = await api.patch(`/user/${id}/update`,data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user deals"
    );
  }
};
