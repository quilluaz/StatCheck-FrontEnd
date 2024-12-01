import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export const RoomAPI = {
  getAllRooms: async () => {
    try {
      const response = await api.get('/admin/rooms');
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        console.error("Authentication error: Please ensure you are logged in");
      }
      console.error("Error fetching all rooms:", error.response?.data || error.message);
      throw error;
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await api.post('/admin/rooms', roomData);
      return response.data;
    } catch (error) {
      console.error("Error creating room:", error.response?.data || error.message);
      throw error;
    }
  },

  updateRoom: async (roomId, roomData) => {
    try {
      const response = await api.put(`/admin/rooms/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      console.error(`Error updating room ${roomId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  deleteRoom: async (roomId) => {
    try {
      await api.delete(`/admin/rooms/${roomId}`);
    } catch (error) {
      console.error(`Error deleting room ${roomId}:`, error.response?.data || error.message);
      throw error;
    }
  },
};
