const API_BASE_URL = "http://localhost:8080/api";

export const BuildingAPI = {
  getAllBuildings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/buildings`);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Error fetching buildings:", error);
      throw error;
    }
  },

  getBuildingById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/buildings/${id}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Error fetching building:", error);
      throw error;
    }
  },

  createBuilding: async (buildingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/buildings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildingData),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Error creating building:", error);
      throw error;
    }
  },

  updateBuilding: async (id, buildingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/buildings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildingData),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Error updating building:", error);
      throw error;
    }
  },

  deleteBuilding: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/buildings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return true;
    } catch (error) {
      console.error("Error deleting building:", error);
      throw error;
    }
  },

  getFloorsByBuilding: async (buildingId) => {
    try {
      const building = await BuildingAPI.getBuildingById(buildingId);
      // Generate an array of floor numbers from 1 to building.floors
      const floors = Array.from({ length: building.floors }, (_, i) => ({
        floorID: i + 1,
        floorNumber: i + 1,
        buildingId: buildingId,
      }));
      return floors;
    } catch (error) {
      console.error("Error generating floors:", error);
      throw error;
    }
  },
};
