const API_BASE_URL = "http://localhost:8080/api/rooms";

export const RoomAPI = {
  getAllRooms: async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching all rooms:", error);
      throw error;
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) {
        throw new Error(`Error creating room! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  updateRoom: async (roomID, roomData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${roomID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) {
        throw new Error(`Error updating room! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating room ${roomID}:`, error);
      throw error;
    }
  },

  deleteRoom: async (roomID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${roomID}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error deleting room! Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting room ${roomID}:`, error);
      throw error;
    }
  },
};
