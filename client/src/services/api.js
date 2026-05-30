const BASE_URL = 'http://localhost:5000/api';

const fetchHeaders = () => {
    const savedTokenValue = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(savedTokenValue && { 'Authorization': `Bearer ${savedTokenValue}` })
    };
};

export const apiGateway = {
    register: async (payload) => {
        const r = await fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || 'Registration failed');
        return data;
    },
    login: async (payload) => {
        const r = await fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || 'Login failed');
        return data;
    },
    fetchTxns: async () => {
        const r = await fetch(`${BASE_URL}/transactions`, { method: 'GET', headers: fetchHeaders() });
        return await r.json();
    },
    logTxn: async (payload) => {
        const r = await fetch(`${BASE_URL}/transactions`, { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(payload) });
        return await r.json();
    },
    deleteTxn: async (id) => {
        const r = await fetch(`${BASE_URL}/transactions/${id}`, { method: 'DELETE', headers: fetchHeaders() });
        return await r.json();
    },
    modifyBudget: async (payload) => {
        const r = await fetch(`${BASE_URL}/budgets`, { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(payload) });
        return await r.json();
    },
    fetchDashboardSummaryData: async () => {
        const r = await fetch(`${BASE_URL}/dashboard/summary`, { method: 'GET', headers: fetchHeaders() });
        return await r.json();
    }
};