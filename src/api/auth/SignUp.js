const API_BASE_URL = "https://backend.dawaback.com/";

export const signUp = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}api/v1/auth/signup`, {
            method: "POST",
            body: formData, // FormData for file uploads
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle different HTTP status codes
            if (response.status === 400) {
                // File upload errors
                if (data.message && data.message.includes("Front ID card image is required")) {
                    throw new Error("Front ID card image is required. Please upload the front side of your national ID.");
                } else if (data.message && data.message.includes("Back ID card image is required")) {
                    throw new Error("Back ID card image is required. Please upload the back side of your national ID.");
                } else if (data.message && data.message.includes("Work ID image is required")) {
                    throw new Error("Work ID image is required. Please upload your work ID card.");
                } else if (data.message && data.message.includes("Failed to create user")) {
                    throw new Error("Failed to create account. Please check your information and try again.");
                } else {
                    throw new Error(data.message || "Invalid request data. Please check your information.");
                }
            } else if (response.status === 409) {
                // Duplicate user errors
                if (data.message && data.message.includes("Email is already registered")) {
                    throw new Error("Email is already registered. Please use a different email address.");
                } else if (data.message && data.message.includes("Phone number is already registered")) {
                    throw new Error("Phone number is already registered. Please use a different phone number.");
                } else if (data.message && data.message.includes("National ID is already registered")) {
                    throw new Error("National ID is already registered. Please check your ID number.");
                } else if (data.message && data.message.includes("already exists")) {
                    throw new Error(data.message);
                } else {
                    throw new Error("Account already exists. Please check your information.");
                }
            } else if (response.status === 422) {
                throw new Error("Invalid data format. Please check your information and try again.");
            } else if (response.status >= 500) {
                throw new Error("Server error. Please try again later.");
            } else {
                throw new Error(data.message || "Signup failed. Please try again.");
            }
        }

        // Check if the response has the expected structure
        if (!data.success) {
            throw new Error(data.message || "Signup failed");
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
