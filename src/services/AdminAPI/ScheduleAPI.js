import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export const ScheduleAPI = {
  getAllSchedules: async () => {
    try {
      const response = await api.get('/admin/schedules');
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        console.error("Authentication error: Please ensure you are logged in");
      }
      console.error("Error fetching schedules:", error.response?.data || error.message);
      throw error;
    }
  },

  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/admin/schedules', scheduleData);
      return response.data;
    } catch (error) {
      console.error("Error creating schedule:", error.response?.data || error.message);
      throw error;
    }
  },

  updateSchedule: async (scheduleId, scheduleData) => {
    try {
      const response = await api.put(`/admin/schedules/${scheduleId}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating schedule ${scheduleId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  deleteSchedule: async (scheduleId) => {
    try {
      await api.delete(`/admin/schedules/${scheduleId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting schedule ${scheduleId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getSchedulesByRoom: async (roomId) => {
    try {
      const response = await api.get(`/admin/schedules/room/${roomId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedules for room ${roomId}:`, error.response?.data || error.message);
      throw error;
    }
  }
};
