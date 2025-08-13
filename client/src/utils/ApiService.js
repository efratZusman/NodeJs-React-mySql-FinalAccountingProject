
// לוקאלית
// baseUrl = '${http://{localhost:3000}/api';
// בשרת
// const baseUrl = 'https://accounting-backend-emgc.onrender.com/api'.trim();

import config from './config.json';

const ApiService = {
    baseUrl: `https://accounting-backend-emgc.onrender.com/api`,


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
        const base = config.API_BASE_PART1 + config.API_BASE_PART2 + `/api${url}`;
        console.log("➡️ GET:", config.API_BASE_PART1, config.API_BASE_PART2);
        console.log("GET:", base);

        const response = await fetch(base, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        return await this.checkResponseStatus(response);
    },

    async post(url, newData) {
        const base = config.API_BASE_PART1 + config.API_BASE_PART2 + `/api${url}`;

        const response = await fetch(base, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData),
        });
        return await this.checkResponseStatus(response);
    },

    async put(url, newData) {
        const base = config.API_BASE_PART1 + config.API_BASE_PART2 + `/api${url}`;

        const response = await fetch(base, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData),
        });
        return await this.checkResponseStatus(response);
    },

    async patch(url, partialData) {
        const base = config.API_BASE_PART1 + config.API_BASE_PART2 + `/api${url}`;

        const response = await fetch(base, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partialData),
        });
        return await this.checkResponseStatus(response);
    },

    async delete(url) {
        const base = config.API_BASE_PART1 + config.API_BASE_PART2 + `/api${url}`;

        const response = await fetch(base, {
            method: 'DELETE',
            credentials: 'include',
        });
        return await this.checkResponseStatus(response);
    },

    async uploadFile(url, formData) {
        const base = config.API_BASE_PART1 + config.API_BASE_PART2 + `/api${url}`;
        
        const response = await fetch(base, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });
        return await this.checkResponseStatus(response);
    }
};

export default ApiService;
