import axios from "axios";

const API_BASE_URL = "https://backend.dawaback.com";

// Get user pharmacies
export const getPharmacies = async (token,user) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pharmacies/user/${user}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pharmacies');
  }
};

// Create new pharmacy
export const createPharmacy = async (pharmacyData, token) => {
  try {
    const isFormData = pharmacyData instanceof FormData;
    const response = await axios.post(
      `${API_BASE_URL}/pharmacies`,
      pharmacyData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create pharmacy');
  }
};

// Update pharmacy
export const updatePharmacy = async (pharmacyId, pharmacyData, token) => {
  try {
    const isFormData = pharmacyData instanceof FormData;
    const response = await axios.patch(
      `${API_BASE_URL}/pharmacies/${pharmacyId}`,
      pharmacyData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update pharmacy');
  }
};

// Delete pharmacy
export const deletePharmacy = async (pharmacyId, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/pharmacies/${pharmacyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete pharmacy');
  }
};