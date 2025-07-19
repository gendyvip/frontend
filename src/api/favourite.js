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

// Get user favorites
export const getUserFavorites = async () => {
  try {
    const response = await api.get("/favorite");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch favorites"
    );
  }
};

// Add deal to favorites
export const addDealToFavorites = async (dealId) => {
  try {
    const response = await api.post(`/favorite/deal/${dealId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add deal to favorites"
    );
  }
};

// Add pharmacy to favorites
export const addPharmacyToFavorites = async (pharmacyId) => {
  try {
    const response = await api.post(`/favorite/pharmacy/${pharmacyId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add pharmacy to favorites"
    );
  }
};

// Remove pharmacy from favorites
export const removePharmacyFromFavorites = async (pharmacyId) => {
  try {
    const response = await api.delete(`/favorite/pharmacy/${pharmacyId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to remove pharmacy from favorites"
    );
  }
};

// Remove deal from favorites
export const removeDealFromFavorites = async (dealId) => {
  try {
    const response = await api.delete(`/favorite/deal/${dealId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to remove deal from favorites"
    );
  }
};
