const API_URL = 'http://localhost:5001/api';

class API {
    static getHeaders() {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    static async request(endpoint, method = 'GET', body = null) {
        const options = {
            method,
            headers: this.getHeaders()
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    static async login(email, password) {
        return this.request('/auth/login', 'POST', { email, password });
    }

    static async register(username, email, password) {
        return this.request('/auth/register', 'POST', { username, email, password });
    }

    static async getIncomes() {
        return this.request('/income');
    }

    static async addIncome(incomeData) {
        return this.request('/income', 'POST', incomeData);
    }

    static async deleteIncome(id) {
        return this.request(`/income/${id}`, 'DELETE');
    }

    static async getExpenses() {
        return this.request('/expense');
    }

    static async addExpense(expenseData) {
        return this.request('/expense', 'POST', expenseData);
    }

    static async deleteExpense(id) {
        return this.request(`/expense/${id}`, 'DELETE');
    }

    static async getBudget() {
        return this.request('/budget');
    }

    static async setBudget(budgetData) {
        return this.request('/budget', 'POST', budgetData);
    }

    static async getEnvelopes() {
        return this.request('/envelopes');
    }

    static async addEnvelope(data) {
        return this.request('/envelopes', 'POST', data);
    }

    static async deleteEnvelope(id) {
        return this.request(`/envelopes/${id}`, 'DELETE');
    }

    static async spendEnvelope(id, amount) {
        return this.request(`/envelopes/${id}/spend`, 'POST', { amount });
    }
}

