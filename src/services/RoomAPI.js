import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const roomsApi = {
  // Get all rooms
  getAllRooms: async () => {
    try {
      const response = await api.get('/rooms');
      return response.data.map((room) => ({
        roomID: room?.roomID || '',
        roomNumber: room?.roomNumber || '',
        roomType: room?.roomType || '',
        capacity: room?.capacity || 0,
        currentOccupancy: room?.currentOccupancy || 0,
        availabilityStatus: room?.availabilityStatus || 'Available',
        building: room?.building || { bldgID: '', bldgName: '' },
      }));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load rooms');
    }
  },

  // Get all buildings
  getAllBuildings: async () => {
    try {
      const response = await api.get('/buildings');
      return response.data || [];
    } catch (error) {
      throw new Error('Failed to load buildings');
    }
  },

  // Create a new room
  createRoom: async (roomData) => {
    try {
      const response = await api.post('/rooms', {
        ...roomData,
        building: {
          bldgID: parseInt(roomData.building.bldgID),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add room');
    }
  },

  // Update an existing room
  updateRoom: async (roomID, roomData) => {
    try {
      const response = await api.put(`/rooms/${roomID}`, {
        ...roomData,
        building: {
          bldgID: parseInt(roomData.building.bldgID),
          bldgName: roomData.building.bldgName,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update room');
    }
  },

  // Delete a room
  deleteRoom: async (roomID) => {
    try {
      await api.delete(`/rooms/${roomID}`);
    } catch (error) {
      throw new Error('Failed to delete room');
    }
  },
};