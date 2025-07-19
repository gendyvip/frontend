const API_BASE_URL = "https://backend.dawaback.com/";

export const resetPassword = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Email not found. Please check your email address.");
      } else if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(responseData.message || "Failed to send reset instructions");
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

export const confirmOtp = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/auth/confirm-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Invalid or expired OTP. Please try again.");
      } else if (response.status === 404) {
        throw new Error("User not found. Please check your email address.");
      } else if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(responseData.message || "OTP verification failed");
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

export const confirmPassword = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/auth/confirm-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("OTP not verified or expired. Please verify your OTP first.");
      } else if (response.status === 404) {
        throw new Error("User not found. Please check your email address.");
      } else if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(responseData.message || "Password reset failed");
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
