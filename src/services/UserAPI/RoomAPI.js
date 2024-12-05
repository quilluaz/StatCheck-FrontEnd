import axios from "axios";

const BASE_URL = "/api/user/rooms"; // Base URL for UserRoomController

// Fetch all rooms
export const getAllRooms = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; // Returns the list of rooms
  } catch (error) {
    console.error("Error fetching all rooms:", error);
    throw error;
  }
};

// Fetch room by ID
export const getRoomById = async (roomId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${roomId}`);
    return response.data; // Returns the room details
  } catch (error) {
    console.error(`Error fetching room with ID ${roomId}:`, error);
    throw error;
  }
};

// Update room capacity
export const updateRoomCapacity = async (roomId, newCapacity) => {
  try {
    const response = await axios.put(`${BASE_URL}/${roomId}/capacity`, {
      currentCapacity: newCapacity,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating room capacity:", error);
    throw error;
  }
};
