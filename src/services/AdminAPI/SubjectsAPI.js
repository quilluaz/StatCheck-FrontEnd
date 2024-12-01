import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

// Remove the token interceptor since we're using cookies
api.interceptors.request.use(
  (config) => {
    console.log('Making request with credentials');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const SubjectsAPI = {
  getAllSubjects: async () => {
    try {
      const response = await api.get('/admin/subjects');
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to access subjects");
      } else if (error.response?.status === 401) {
        throw new Error("Please log in to access this resource");
      }
      throw new Error("Error fetching subjects: " + (error.response?.data?.message || error.message));
    }
  },

  createSubject: async (subjectData) => {
    try {
      console.log('Request payload:', subjectData);
      const response = await api.post('/admin/subjects', subjectData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to create subjects");
      } else if (error.response?.status === 415) {
        throw new Error("Invalid content type. Please check your request format");
      }
      throw new Error("Error creating subject: " + (error.response?.data?.message || error.message));
    }
  },

  updateSubject: async (id, subjectData) => {
    try {
      const response = await api.put(`/admin/subjects/${id}`, subjectData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to update subjects");
      } else if (error.response?.status === 404) {
        throw new Error("Subject not found");
      } else if (error.response?.status === 415) {
        throw new Error("Invalid content type. Please check your request format");
      }
      throw new Error("Error updating subject: " + (error.response?.data?.message || error.message));
    }
  },

  deleteSubject: async (id) => {
    try {
      await api.delete(`/admin/subjects/${id}`);
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to delete subjects");
      } else if (error.response?.status === 404) {
        throw new Error("Subject not found");
      }
      throw new Error("Error deleting subject: " + (error.response?.data?.message || error.message));
    }
  },

  getSubjectById: async (id) => {
    try {
      const response = await api.get(`/admin/subjects/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to view this subject");
      } else if (error.response?.status === 404) {
        throw new Error("Subject not found");
      }
      throw new Error("Error fetching subject: " + (error.response?.data?.message || error.message));
    }
  },
};

export default SubjectsAPI;
