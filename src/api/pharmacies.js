const baseURL = "https://backend.dawaback.com/api/v1";

function getAuthHeaders() {
  let token = localStorage.getItem("token");
  if (token) token = JSON.parse(token);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPharmaciesForSale(params = {}) {
  const url = new URL(`${baseURL}/pharmacies/for-sale`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      url.searchParams.append(key, value);
  });
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch pharmacies for sale");
  return res.json();
}

export async function getPharmacyById(id) {
  const url = `${baseURL}/pharmacies/${id}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch pharmacy details");
  return res.json();
}

export async function listPharmaciesForSale(id, saleData) {
  const url = `${baseURL}/pharmacies/${id}/list-for-sale`;

  const formData = new FormData();
  formData.append("pharmacyPrice", saleData.pharmacyPrice);
  formData.append("monthlySales", saleData.monthlySales);
  formData.append("saleType", saleData.saleType);

  if (saleData.medicinesList) {
    formData.append("medicinesList", saleData.medicinesList);
  }

  const res = await fetch(url, {
    headers: {
      ...getAuthHeaders(),
    },
    method: "PATCH",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to list pharmacy for sale");
  }

  return res.json();
}

export async function unlistPharmacyFromSale(id) {
  const url = `${baseURL}/pharmacies/${id}/unlist-from-sale`;
  const res = await fetch(url, {
    headers: {
      ...getAuthHeaders(),
    },
    method: "PATCH",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to unlist pharmacy from sale");
  }
  return res.json();
}

export async function unlistPharmacyFromSaleJson(id) {
  const url = `${baseURL}/pharmacies/${id}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    method: "PATCH",
    body: JSON.stringify({ isForSale: false }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to unlist pharmacy from sale");
  }
  return res.json();
}

export async function getRelatedPharmacies(id, params = {}) {
  const url = new URL(`${baseURL}/pharmacies/${id}/related`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      url.searchParams.append(key, value);
  });
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch related pharmacies");
  return res.json();
}
