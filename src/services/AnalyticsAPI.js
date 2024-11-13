import axios from 'axios';

const ANALYTICS_API_URL = '/api/analytics';

export const fetchAnalytics = async () => {
    return await axios.get(`${ANALYTICS_API_URL}/getAll`);
};

export const createAnalytics = async (analytics) => {
    return await axios.post(`${ANALYTICS_API_URL}/create`, analytics);
};

export const updateAnalytics = async (id, analyticsData) => {
    return await axios.put(`${ANALYTICS_API_URL}/update/${id}`, analyticsData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const deleteAnalytics = async (id) => {
    return await axios.delete(`${ANALYTICS_API_URL}/delete/${id}`);
};