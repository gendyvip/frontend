const API_BASE_URL = "https://backend.dawaback.com/";

export const requestAdvertise = async (data) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}api/v1/advertisement-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    // Handle successful responses (201)
    if (response.status === 201) {
      return responseData;
    }

    // Handle all other responses as errors
    throw new Error(
      responseData.message ||
        "Failed to submit advertising request. Please try again."
    );
  } catch (error) {
    // Handle network errors (server offline)
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    }

    // Handle timeout errors
    if (error.name === "AbortError") {
      throw new Error(
        "Request timeout. Please check your connection and try again."
      );
    }

    // Handle JSON parsing errors
    if (error.name === "SyntaxError" && error.message.includes("JSON")) {
      throw new Error("Invalid response from server. Please try again.");
    }

    // Re-throw the error with the message
    throw error;
  }
};
