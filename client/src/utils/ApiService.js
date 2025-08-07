
// לוקאלית
    // baseUrl = '${http://{localhost:3000}/api';
// בשרת
// const baseUrl = 'https://accounting-backend-emgc.onrender.com/api'.trim();

const ApiService = {
  baseUrl: 'https://accounting-backend-emgc.onrender.com/api'.trim(),

  async checkResponseStatus(response) {
    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    if (!response.ok) {
      const error = new Error(data.error || `HTTP Error! Status: ${response.status}`);
      error.data = data;
      throw error;
    }
    return data;
  },

  async get(url) {
    console.log("➡️ GET:", "accounting-backend-emgc.onrender.com/api" + url);
    const response = await fetch("http://"+'accounting-backend-emgc.onrender.com/api' + url, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return await this.checkResponseStatus(response);
  },

  async post(url, newData) {
    const response = await fetch(this.baseUrl + url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });
    return await this.checkResponseStatus(response);
  },

  async put(url, newData) {
    const response = await fetch(this.baseUrl + url, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });
    return await this.checkResponseStatus(response);
  },

  async patch(url, partialData) {
    const response = await fetch(this.baseUrl + url, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partialData),
    });
    return await this.checkResponseStatus(response);
  },

  async delete(url) {
    const response = await fetch(this.baseUrl + url, {
      method: 'DELETE',
      credentials: 'include',
    });
    return await this.checkResponseStatus(response);
  },

  async uploadFile(url, formData) {
    const response = await fetch(this.baseUrl + url, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    return await this.checkResponseStatus(response);
  }
};

export default ApiService;
