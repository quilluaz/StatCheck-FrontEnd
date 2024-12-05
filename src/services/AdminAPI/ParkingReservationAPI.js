import axios from "axios";

const API_BASE_URL = "/api/admin/parking-reservations";

export class ParkingReservationAPI {
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
}
