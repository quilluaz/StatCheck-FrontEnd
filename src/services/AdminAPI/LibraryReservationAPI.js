import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export const LibraryReservationAPI = {
  getAllReservations: async () => {
    try {
      const response = await api.get('/admin/library-reservations');
      return response.data;
    } catch (error) {
      console.error("Error fetching reservations:", error.response?.data || error.message);
      throw error;
    }
  },

  createReservation: async (reservationData) => {
    try {
      const response = await api.post('/admin/library-reservations', reservationData);
      return response.data;
    } catch (error) {
      console.error("Error creating reservation:", error.response?.data || error.message);
      throw error;
    }
  },

  updateReservation: async (id, reservationData) => {
    try {
      const response = await api.put(`/admin/library-reservations/${id}`, reservationData);
      return response.data;
    } catch (error) {
      console.error("Error updating reservation:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteReservation: async (id) => {
    try {
      await api.delete(`/admin/library-reservations/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting reservation:", error.response?.data || error.message);
      throw error;
    }
  }
};
