import axios from 'axios';

const BASE_URL = '/api/buildings/user'; // Adjust this base URL to your backend

// API to get all buildings
export const getAllBuildings = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data; // Returns list of buildings
  } catch (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }
};

// API to get building by ID
export const getBuildingById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data; // Returns the building details
  } catch (error) {
    console.error(`Error fetching building with ID ${id}:`, error);
    throw error;
  }
};

// API to get total occupants in a building
export const getTotalOccupants = async (buildingID) => {
  try {
    const response = await axios.get(`${BASE_URL}/${buildingID}/total-occupants`);
    return response.data; // Returns total occupants count
  } catch (error) {
    console.error(`Error fetching total occupants for building ${buildingID}:`, error);
    throw error;
  }
};
