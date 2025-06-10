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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData),
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

    async delete(url) {
        const response = await fetch(this.baseUrl + url, {
            method: 'DELETE',
        });
        await this.checkResponseStatus(response);
    }


}
export default ApiService;
