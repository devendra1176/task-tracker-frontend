const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

async function parseJsonSafely(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server returned an invalid response.");
  }
}

async function handleResponse(response, fallbackMessage) {
  const result = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(result.message || fallbackMessage || `Request failed (${response.status})`);
  }

  return result;
}

export async function signupUser(signupData) {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });

    return await handleResponse(response, `Signup failed (${response.status})`);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to connect to server during signup.");
  }
}

export async function loginUser(loginData) {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    return await handleResponse(response, `Login failed (${response.status})`);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to connect to server during login.");
  }
}