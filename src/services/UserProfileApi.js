import axios from "axios";

const USER_PROFILE_API_URL = "/api/auth/user-profiles";

// Create an axios instance with default config
const api = axios.create({
  baseURL: USER_PROFILE_API_URL,
  withCredentials: true, 
});

export const fetchCurrentUserProfile = async () => {
  try {
    const response = await api.get('/current');
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/update/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const deleteUserProfile = async (userId) => {
  try {
    const response = await api.delete(`/delete/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
};

// Add any other user profile related API calls here
