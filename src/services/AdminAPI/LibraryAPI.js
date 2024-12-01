import axios from "axios";

const api = axios.create({
  baseURL: '/api/admin/libraries',
  withCredentials: true,
});

export const getAllLibraries = async () => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error("Error fetching libraries:", error.response?.data || error.message);
    throw error;
  }
};

export const createLibrary = async (libraryData) => {
  try {
    const response = await api.post('', libraryData);
    return response.data;
  } catch (error) {
    console.error("Error creating library:", error.response?.data || error.message);
    throw error;
  }
};

export const updateLibrary = async (id, libraryData) => {
  try {
    const response = await api.put(`/${id}`, libraryData);
    return response.data;
  } catch (error) {
    console.error("Error updating library:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteLibrary = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting library:", error.response?.data || error.message);
    throw error;
  }
};