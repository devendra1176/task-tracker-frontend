const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TASK_BASE_URL = `${API_BASE_URL}/tasks`;

function getToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders(includeJson = false) {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in. Please sign in again.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

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

function buildUrl(baseUrl, paramsObj = {}) {
  const params = new URLSearchParams();

  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export async function getAllTasks({
                                    page = 0,
                                    size = 5,
                                    sortBy = "id",
                                    direction = "asc",
                                  } = {}) {
  const url = buildUrl(TASK_BASE_URL, {
    page,
    size,
    sortBy,
    direction,
  });

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response, `Failed to fetch tasks (${response.status})`);
}

export async function getFilteredTasks({
                                         page = 0,
                                         size = 5,
                                         sortBy = "id",
                                         direction = "asc",
                                         status,
                                         priority,
                                       } = {}) {
  const url = buildUrl(`${TASK_BASE_URL}/filter`, {
    page,
    size,
    sortBy,
    direction,
    status,
    priority,
  });

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response, `Failed to filter tasks (${response.status})`);
}

export async function searchTasks({
                                    keyword,
                                    page = 0,
                                    size = 5,
                                    sortBy = "id",
                                    direction = "asc",
                                  } = {}) {
  const url = buildUrl(`${TASK_BASE_URL}/search`, {
    keyword,
    page,
    size,
    sortBy,
    direction,
  });

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response, `Failed to search tasks (${response.status})`);
}

export async function createTask(taskData) {
  const response = await fetch(TASK_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(taskData),
  });

  return handleResponse(response, `Failed to create task (${response.status})`);
}

export async function updateTask(id, taskData) {
  const response = await fetch(`${TASK_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(taskData),
  });

  return handleResponse(response, `Failed to update task (${response.status})`);
}

export async function deleteTask(id) {
  const response = await fetch(`${TASK_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response, `Failed to delete task (${response.status})`);
}

export async function updateTaskStatus(id, status) {
  const url = buildUrl(`${TASK_BASE_URL}/${id}/status`, {
    value: status,
  });

  const response = await fetch(url, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  return handleResponse(response, `Failed to update task status (${response.status})`);
}