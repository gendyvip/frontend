const API_BASE_URL = "https://backend.dawaback.com/";

export const requestContact = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/contact-us`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Invalid request data. Please check your information and try again.");
      } else if (response.status === 409) {
        throw new Error("A contact request already exists for this information.");
      } else if (response.status === 422) {
        throw new Error("Invalid data format. Please check your information and try again.");
      } else if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(responseData.message || "Failed to send message. Please try again.");
      }
    }

    if (!responseData.success) {
      throw new Error(responseData.message || "Failed to send message");
    }

    return responseData;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your internet connection and try again.");
    }
    throw error;
  }
};
