const API_BASE_URL = 'https://backend.dawaback.com/api/v1';

export const getPharmacistDetails = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch pharmacist details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
