import axios from "axios";

const api = axios.create({
  baseURL: '/api/admin/library-rooms',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export const LibraryRoomAPI = {
  getAllRooms: async () => {
    try {
      const response = await api.get('');
      return response.data;
    } catch (error) {
      console.error("Error fetching library rooms:", error.response?.data || error.message);
      throw error;
    }
  },

  getRoomsByLibrary: async (libraryId) => {
    try {
      const response = await api.get(`/library/${libraryId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching library rooms:", error.response?.data || error.message);
      throw error;
    }
  },

  getRoomById: async (roomId) => {
    try {
      const response = await api.get(`/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching library room:", error.response?.data || error.message);
      throw error;
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await api.post('', roomData);
      return response.data;
    } catch (error) {
      console.error("Error creating library room:", error.response?.data || error.message);
      throw error;
    }
  },

  updateRoom: async (roomId, roomData) => {
    try {
      const response = await api.put(`/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      console.error("Error updating library room:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteRoom: async (roomId) => {
    try {
      await api.delete(`/${roomId}`);
      return true;
    } catch (error) {
      console.error("Error deleting library room:", error.response?.data || error.message);
      throw error;
    }
  }
};
