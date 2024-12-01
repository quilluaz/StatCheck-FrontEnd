import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const ParkingLotAPI = {
  getAllParkingLots: async () => {
    try {
      const response = await api.get("/admin/parking-lots");
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        console.error("Authentication error: Please ensure you are logged in");
      }
      console.error(
        "Error fetching parking lots:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createParkingLot: async (parkingLotData) => {
    try {
      const response = await api.post("/admin/parking-lots", parkingLotData);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating parking lot:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateParkingLot: async (parkingLotId, parkingLotData) => {
    try {
      const response = await api.put(
        `/admin/parking-lots/${parkingLotId}`,
        parkingLotData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating parking lot ${parkingLotId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteParkingLot: async (parkingLotId) => {
    try {
      await api.delete(`/admin/parking-lots/${parkingLotId}`);
    } catch (error) {
      console.error(
        `Error deleting parking lot ${parkingLotId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getParkingLotById: async (parkingLotId) => {
    try {
      const response = await api.get(`/admin/parking-lots/${parkingLotId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching parking lot ${parkingLotId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getParkingSpaces: async (parkingLotId) => {
    try {
      const response = await api.get(
        `/admin/parking-lots/${parkingLotId}/spaces`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching parking spaces for lot ${parkingLotId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteParkingSpace: async (spaceId) => {
    try {
      await api.delete(`/admin/parking-spaces/${spaceId}`);
    } catch (error) {
      console.error(
        `Error deleting parking space ${spaceId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateParkingSpace: async (spaceId, spaceData) => {
    try {
      const response = await api.put(`/admin/parking-spaces/${spaceId}`, {
        spaceType: spaceData.spaceType,
        status: spaceData.status,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error updating parking space ${spaceId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
