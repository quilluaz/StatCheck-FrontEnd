import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const UserAPI = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        console.error("Authentication error: Please ensure you are logged in as an admin");
      }
      console.error("Error fetching users:", error.response?.data || error.message);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error.response?.data || error.message);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        role: userData.role
      });
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error.response?.data || error.message);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, {
        email: userData.email,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        role: userData.role
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      throw error;
    }
  },

  changeUserRole: async (userId, newRole) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, {
        role: newRole
      });
      return response.data;
    } catch (error) {
      console.error("Error changing user role:", error.response?.data || error.message);
      throw error;
    }
  }
};
