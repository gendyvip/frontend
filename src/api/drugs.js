import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Fetch drug names from the backend with search functionality
 * @param {string} token - JWT token for authentication
 * @param {Object} options - Search options
 * @param {string} options.search - Search term for drug name
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.size - Number of items per page (default: 10)
 * @returns {Promise<Object>} - Response with drug data
 */
export const fetchDrugs = async (token, options = {}) => {
  try {
    const { search = "", page = 1, size = 10 } = options;

    const params = {
      page: page.toString(),
      size: size.toString(),
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    const response = await axios.get(`${BASE_URL}/api/v1/drug-details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    throw error;
  }
};

/**
 * Create drug alert for specified drug names
 * @param {string} token - JWT token for authentication
 * @param {Object} alertData - Drug alert data
 * @param {Array<string>} alertData.drugNames - Array of drug names to create alerts for
 * @returns {Promise<Object>} - Response from the API
 */
export const createDrugAlert = async (token, alertData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/drug-alert`,
      alertData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating drug alert:", error);
    throw error;
  }
};

/**
 * Fetch all drug names (for dropdown/select options)
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Array>} - Array of drug names
 */
export const fetchAllDrugNames = async (token) => {
  try {
    const response = await fetchDrugs(token, { size: 1000 }); // Get a large number to fetch all
    return response.data?.drugs || [];
  } catch (error) {
    console.error("Error fetching all drug names:", error);
    return [];
  }
};
