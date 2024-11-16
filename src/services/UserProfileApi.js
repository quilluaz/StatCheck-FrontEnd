import axios from 'axios';

const USER_PROFILE_API_URL = '/api/user-profiles';

export const fetchUserProfile = async (userId) => {
  return await axios.get(`${USER_PROFILE_API_URL}/getById/${userId}`);
};

export const updateUserProfile = async (userId, userProfileData) => {
  return await axios.put(`${USER_PROFILE_API_URL}/update/${userId}`, userProfileData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteUserProfile = async (userId) => {
  return await axios.delete(`${USER_PROFILE_API_URL}/delete/${userId}`);
};
