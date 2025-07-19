const API_BASE_URL = "https://backend.dawaback.com";
export async function subscribeToPlan({ userId, planName, planType }) {
  const response = await fetch(`${API_BASE_URL}/api/v1/paymob/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      planName,
      planType,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Subscription failed");
  }

  return await response.json();
}
