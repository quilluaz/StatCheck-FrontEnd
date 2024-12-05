import axios from "axios";

const API_BASE_URL = "/api/admin/parking-reservations";

export class ParkingReservationAPI {
  static async getAllReservations() {
    try {
      const response = await axios.get(API_BASE_URL, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching reservations:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch reservations");
    }
  }

  static async createReservation(reservationData) {
    try {
      console.log("Sending reservation data:", reservationData);

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

      console.log("Transformed payload:", payload);

      const response = await axios.post(API_BASE_URL, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error creating reservation:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to create reservation"
      );
    }
  }

  static async updateReservation(id, reservationData) {
    try {
      const payload = {
        parkingSpaceEntity: {
          parkingSpaceId: reservationData.parkingSpace.parkingSpaceId,
        },
        userEntity: {
          userID: reservationData.userEntity.userID,
        },
        startTime: reservationData.reservationStartTime,
        endTime: reservationData.reservationEndTime,
        status: reservationData.status || "PENDING",
      };

      console.log("Sending update payload:", payload);

      const response = await axios.put(`${API_BASE_URL}/${id}`, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating reservation:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update reservation");
    }
  }

  static async deleteReservation(id) {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return true;
    } catch (error) {
      console.error("Error deleting reservation:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to delete reservation");
    }
  }
}
