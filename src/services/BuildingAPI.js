import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const buildingsApi = {
  getAllBuildings: async () => {
    try {
      const response = await api.get('/api/buildings');
      return {
        data: response.data,
        error: null,
      };
    } catch (err) {
      console.error('Error fetching buildings:', err);
      return {
        data: null,
        error: err.response?.data?.message || 'Failed to load buildings',
      };
    }
  },

  createBuilding: async (buildingData) => {
    try {
      const response = await api.post('/api/buildings', buildingData);
      return {
        data: response.data,
        error: null,
      };
    } catch (err) {
      console.error('Error creating building:', err);
      return {
        data: null,
        error: 'Failed to add building',
      };
    }
  },

  updateBuilding: async (buildingId, buildingData) => {
    try {
      const response = await api.put(`/api/buildings/${buildingId}`, buildingData);
      return {
        data: response.data,
        error: null,
      };
    } catch (err) {
      console.error('Error updating building:', err);
      return {
        data: null,
        error: 'Failed to update building',
      };
    }
  },

  deleteBuilding: async (buildingId) => {
    try {
      const response = await api.delete(`/api/buildings/${buildingId}`);
      return {
        data: response.data,
        error: null,
      };
    } catch (err) {
      console.error('Error deleting building:', err);
      return {
        data: null,
        error: 'Failed to delete building',
      };
    }
  },
};

export default buildingsApi;