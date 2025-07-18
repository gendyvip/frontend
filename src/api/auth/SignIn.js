const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";

export const signIn = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle different HTTP status codes
      if (response.status === 401) {
        throw new Error("Email or password is incorrect");
      } else if (response.status === 403) {
        // Check the specific error message from backend
        if (data.message && data.message.includes("blocked")) {
          throw new Error("Your account has been blocked. Please contact support for assistance.");
        } else if (data.message && data.message.includes("rejected")) {
          throw new Error("Your documents were rejected. Please contact support for assistance.");
        } else if (data.message && data.message.includes("under review")) {
          throw new Error("Your documents are still under review. Please wait for admin approval.");
        } else if (data.message && data.message.includes("admin verification")) {
          throw new Error("Your profile is pending admin verification. Please wait for approval.");
        } else {
          throw new Error(data.message || "Access denied");
        }
      } else if (response.status === 404) {
        throw new Error("Email or password is incorrect");
      } else if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(data.message || "Login failed");
      }
    }

    // Check if the response has the expected structure
    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your internet connection and try again.");
    }

    // Re-throw the error with the message
    throw error;
  }
};
