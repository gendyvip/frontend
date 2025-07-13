import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";

export const changePassword = async (data, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/auth/change-password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'Change password failed');
  }
};
