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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
