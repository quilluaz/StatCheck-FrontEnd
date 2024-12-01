import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/admin",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AnalyticsAPI = {
  getAllAnalytics: async () => {
    try {
      const response = await api.get('/analytics');
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        console.error("Authentication error: Please ensure you are logged in");
      }
      console.error("Error fetching analytics:", error.response?.data || error.message);
      throw error;
    }
  },

  getAnalyticsById: async (analyticsId) => {
    try {
      const response = await api.get(`/analytics/${analyticsId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics:", error.response?.data || error.message);
      throw error;
    }
  },

  createAnalytics: async (analyticsData) => {
    try {
      const response = await api.post('/analytics', analyticsData);
      return response.data;
    } catch (error) {
      console.error("Error creating analytics:", error.response?.data || error.message);
      throw error;
    }
  },

  updateAnalytics: async (analyticsId, analyticsData) => {
    try {
      const response = await api.put(`/analytics/${analyticsId}`, analyticsData);
      return response.data;
    } catch (error) {
      console.error(`Error updating analytics ${analyticsId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  deleteAnalytics: async (analyticsId) => {
    try {
      await api.delete(`/analytics/${analyticsId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting analytics ${analyticsId}:`, error.response?.data || error.message);
      throw error;
    }
  },
};