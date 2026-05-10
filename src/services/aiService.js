const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function getAuthHeaders(includeJson = false) {
    const token = localStorage.getItem("token");

    return {
        ...(includeJson ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function parseResponse(response) {
    const text = await response.text();
    let result = {};

    if (text) {
        try {
            result = JSON.parse(text);
        } catch {
            throw new Error(`Invalid server response (${response.status})`);
        }
    }

    if (!response.ok) {
        throw new Error(result.message || `Request failed (${response.status})`);
    }

    return result;
}

export async function getTaskSummary() {
    const response = await fetch(`${API_BASE_URL}/ai/tasks/summary`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return parseResponse(response);
}

export async function askAiAboutTasks(prompt) {
    const response = await fetch(`${API_BASE_URL}/ai/tasks/ask`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ prompt }),
    });

    return parseResponse(response);
}