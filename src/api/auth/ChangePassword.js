const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";

export const changePassword = async (data, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/auth/change-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      } else if (response.status === 400) {
        if (responseData.message && responseData.message.includes("incorrect")) {
          throw new Error("Current password is incorrect.");
        } else if (responseData.message && responseData.message.includes("match")) {
          throw new Error("New passwords do not match.");
        } else {
          throw new Error(responseData.message || "Invalid request data");
        }
      } else if (response.status === 404) {
        throw new Error("User not found. Please log in again.");
      } else if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(responseData.message || "Failed to change password");
      }
    }

    return responseData;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your internet connection and try again.");
    }
    throw error;
  }
};
