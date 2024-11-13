import axios from "axios";

const API_URL = "/api";

// Fetch all parking lots
export const fetchParkingLots = async () => {
  return await axios.get(`${API_URL}/parking-lots`);
};

// Create a new parking lot
export const createParkingLot = async (parkingLot) => {
  return await axios.post(`${API_URL}/parking-lots`, parkingLot);
};

// Update an existing parking lot
export const updateParkingLot = async (id, parkingLot) => {
  return await axios.put(`${API_URL}/parking-lots/${id}`, parkingLot);
};

// Delete a parking lot
export const deleteParkingLot = async (id) => {
  return await axios.delete(`${API_URL}/parking-lots/${id}`);
};
