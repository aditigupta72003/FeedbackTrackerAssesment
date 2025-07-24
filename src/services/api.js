const API_BASE_URL = 'http://localhost:3001';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

export const feedbackApi = {
  getAllFeedback: async () => {
    const response = await fetch(`${API_BASE_URL}/feedback`);
    return handleResponse(response);
  },

  createFeedback: async (data) => {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  voteFeedback: async (id, action) => {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}/vote`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });
    return handleResponse(response);
  },

  deleteFeedback: async (id) => {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};