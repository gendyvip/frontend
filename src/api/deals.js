import api from "./axios.js";

// Create a new deal
export const createDeal = async (dealData) => {
  try {
    const response = await api.post("/deals", dealData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create deal");
  }
};

// Get all deals with optional query parameters
export const getDeals = async (queryParams = {}) => {
  try {
    const response = await api.get("/deals", { params: queryParams });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch deals");
  }
};

// Get a single deal by ID
export const getDeal = async (dealId) => {
  try {
    const response = await api.get(`/deals/${dealId}`);
    return response.data.data.deal;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch deal");
  }
};

// Update a deal
export const updateDeal = async (dealId, dealData) => {
  try {
    const response = await api.patch(`/deals/${dealId}`, dealData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update deal");
  }
};

// Delete a deal
export const deleteDeal = async (dealId) => {
  try {
    const response = await api.delete(`/deals/${dealId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete deal");
  }
};

// Update deal status (open/close)
export const updateDealStatus = async (dealId, isClosed) => {
  try {
    const response = await api.patch(`/deals/${dealId}/status`, { isClosed });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update deal status"
    );
  }
};

// Get remaining deals for the current user
export const getRemainingDeals = async () => {
  try {
    const response = await api.get("/deals/remaining-deals");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch remaining deals"
    );
  }
};

// Keep the existing function for backward compatibility
export const requestAdvertise = (data) =>
  api.post("/advertisement-request", data);
