import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,  // Important for cookies
  headers: {
    "Content-Type": "application/json",
  }
});

export const BuildingAPI = {
  getAllBuildings: async () => {
    try {
      const response = await api.get('/buildings');
      return response.data;
    } catch (error) {
      console.error("Error fetching buildings:", error.response?.data || error.message);
      throw error;
    }
  },

  createBuilding: async (buildingData) => {
    try {
      const response = await api.post('/buildings', buildingData);
      return response.data;
    } catch (error) {
      console.error("Error creating building:", error.response?.data || error.message);
      throw error;
    }
  },

  updateBuilding: async (id, buildingData) => {
    try {
      const response = await api.put(`/buildings/${id}`, buildingData);
      return response.data;
    } catch (error) {
      console.error("Error updating building:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteBuilding: async (id) => {
    try {
      await api.delete(`/buildings/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting building:", error.response?.data || error.message);
      throw error;
    }
  },

  getFloorsByBuilding: async (buildingId) => {
    try {
      // Generate array of floor numbers from 1 to building.floors
      const building = await BuildingAPI.getBuildingById(buildingId);
      const floors = Array.from({ length: building.floors }, (_, i) => ({
        floorID: i + 1,
        floorNumber: i + 1
      }));
      return floors;
    } catch (error) {
      console.error("Error fetching floors:", error.response?.data || error.message);
      throw error;
    }
  },

  getBuildingById: async (id) => {
    try {
      const response = await api.get(`/buildings/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching building:", error.response?.data || error.message);
      throw error;
    }
  }
};
