const apiService = {
  get: async (url: string, headers: { Authorization?: string } = {}) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...headers },
    });
    return response;
  },

  post: async (url: string, body: object, headers: { Authorization?: string } = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
    return response;
  },

  put: async (url: string, body: object, headers: { Authorization?: string } = {}) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
    return response;
  },

  delete: async (url: string, headers: { Authorization?: string } = {}) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...headers },
    });
    return response;
  },
};

export default apiService;
