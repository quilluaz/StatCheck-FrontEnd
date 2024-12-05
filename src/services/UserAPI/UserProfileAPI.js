import axios from "axios";
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export const fetchCurrentUserProfile = async () => {
  try {
    const response = await api.get("/user-profiles/current");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.post(`/user-profiles/update/${userId}`, {
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      socialMediaFacebook: userData.socialMediaFacebook,
      socialMediaInstagram: userData.socialMediaInstagram,
      socialMediaTwitter: userData.socialMediaTwitter,
    });
    
    if (response.data.requireRelogin) {
      toast.info('Email updated successfully. Please login again with your new email.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "light"
      });
      
      localStorage.removeItem('user');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      toast.success('Profile updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "light"
      });
    }
    
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to update profile', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      theme: "light"
    });
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await axios.post(
      "/api/auth/change-password",
      {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.newPassword,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error changing password:",
      error.response?.data || error.message
    );
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
