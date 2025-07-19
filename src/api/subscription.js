import axios from "axios";
const API_BASE_URL = "https://backend.dawaback.com";

export async function subscribeToPlan({ planName, planType, token }) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/paymob/subscribe`,
      {
        planName,
        planType,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error subscribing to plan:", error);
    throw new Error(error.response?.data?.message || "Subscription failed");
  }
}

export async function checkSubscriptionStatus(token) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/users/profile`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    throw new Error(error.response?.data?.message || "Failed to check subscription status");
  }
}
