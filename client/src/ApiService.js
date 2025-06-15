class ApiService {
    baseUrl = 'http://localhost:3000/api';
    
    async checkResponseStatus(response) {
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return await response.json();
    }

    async get(url) {
        console.log(`Fetching from: ${this.baseUrl + url}`);
        
        const response = await fetch(this.baseUrl + url, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        return await this.checkResponseStatus(response);
    }

    async put(url, newData) {
        const response = await fetch(this.baseUrl + url, {
            method: 'PUT',
              credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData),
        });
        return await this.checkResponseStatus(response);
    }

    async patch(url, partialData) {
        const response = await fetch(this.baseUrl + url, {
  credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partialData),
        });
        return await this.checkResponseStatus(response);
    }

    async post(url, newData) {
        const response = await fetch(this.baseUrl + url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData),
        });
        return await this.checkResponseStatus(response);
    }

    async uploadFile(url, formData) {
        const response = await fetch(this.baseUrl + url, {
            method: 'POST',
            credentials: 'include',
            // Don't set Content-Type header, let the browser set it with the correct boundary
            body: formData,
        });
        return await this.checkResponseStatus(response);
    }

    async delete(url) {
        const response = await fetch(this.baseUrl + url, {
            method: 'DELETE',
        });
        return await this.checkResponseStatus(response);
    }
}

export default ApiService;
