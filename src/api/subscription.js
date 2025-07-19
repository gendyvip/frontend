import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
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
