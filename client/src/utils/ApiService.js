
// לוקאלית
// baseUrl = '${http://{localhost:3000}/api';
// בשרת
// const baseUrl = 'https://accounting-backend-emgc.onrender.com/api'.trim();

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
    const base = 'https://accounting-backend-emgc.onrender.com';
    const cleanPath = url.startsWith('/') ? url : '/' + url;
    const finalPath = `/api${cleanPath.replace(/^\/api/, '')}`;
    const fullUrl = new URL(finalPath, base).toString();

    console.log("➡️ GET:", fullUrl);

    // בדיקה מקדימה אם הנתיב קיים (HEAD מהיר)
    try {
        const headCheck = await fetch(fullUrl, { method: 'HEAD', credentials: 'include' });
        if (!headCheck.ok) {
            console.warn(`⚠️ הנתיב ${finalPath} לא נמצא בשרת (סטטוס ${headCheck.status})`);
            return { error: `Path not found: ${finalPath}`, status: headCheck.status };
        }
    } catch (err) {
        console.error(`🚨 שגיאה בבדיקת הנתיב ${finalPath}:`, err);
        return { error: err.message };
    }

    // הבקשה האמיתית
    try {
        const response = await fetch(fullUrl, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        return await this.checkResponseStatus(response);
    } catch (err) {
        console.error(`🚨 שגיאה בבקשה GET ל-${finalPath}:`, err);
        return { error: err.message };
    }},



    async post(url, newData) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData),
        });
        return await this.checkResponseStatus(response);
    },

    async put(url, newData) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData),
        });
        return await this.checkResponseStatus(response);
    },

    async patch(url, partialData) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partialData),
        });
        return await this.checkResponseStatus(response);
    },

    async delete(url) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        return await this.checkResponseStatus(response);
    },

    async uploadFile(url, formData) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });
        return await this.checkResponseStatus(response);
    }
};

export default ApiService;
