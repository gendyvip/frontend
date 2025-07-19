// API utility to fetch all ads
import axios from "axios";

export async function getAllAds() {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${JSON.parse(token)}`;
  }
  const res = await axios.get(
    "https://backend.dawaback.com/api/v1/advertisement",
    {
      headers,
    }
  );
  if (
    res.data &&
    res.data.success &&
    res.data.data &&
    Array.isArray(res.data.data.ads)
  ) {
    return res.data.data.ads;
  }
  throw new Error(res.data?.message || "Failed to fetch ads");
}
