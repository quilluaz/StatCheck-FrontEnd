import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ParkingReservationAPI = {
  getAllReservations: async () => {
    try {
      const response = await api.get("/admin/parking-reservations");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching reservations:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createReservation: async (reservationData) => {
    try {
      console.log("Sending reservation data:", reservationData);
      // Construct the request payload
      const payload = {
        parkingSpaceEntity: {
          parkingSpaceId: reservationData.parkingSpace.parkingSpaceId,
        },
        userEntity: {
          userID: reservationData.userEntity.userID,
        },
        startTime: reservationData.reservationStartTime,
        endTime: reservationData.reservationEndTime,
        status: "PENDING",
      };

      console.log("Sending payload:", payload);
      const response = await api.post("/admin/parking-reservations", payload);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating reservation:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateReservation: async (id, reservationData) => {
    try {
      console.log("Updating reservation:", id, reservationData);
      const response = await api.put(`/admin/parking-reservations/${id}`, {
        parkingSpaceEntity: {
          parkingSpaceId: reservationData.parkingSpace.parkingSpaceId,
        },
        userEntity: {
          userID: reservationData.userEntity.userID,
        },
        startTime: reservationData.reservationStartTime,
        endTime: reservationData.reservationEndTime,
        status: reservationData.status,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error updating reservation ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteReservation: async (reservationId) => {
    try {
      await api.delete(`/admin/parking-reservations/${reservationId}`);
      return true;
    } catch (error) {
      console.error(
        `Error deleting reservation ${reservationId}:`,
        error.response?.data || error.message
      );
      return false;
    }
  },
};
