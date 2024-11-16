  import axios from "axios";

  const API_URL = "/api";

  // Fetch all parking lots
  export const fetchParkingLots = async () => {
    return await axios.get(`${API_URL}/parking-lots`);
  };

  // Fetch all reservations
  export const fetchReservations = async () => {
    return await axios.get(`${API_URL}/reservations`);
  };

  // Create a new reservation
  export const createReservation = async (reservation) => {
    return await axios.post(`${API_URL}/reservations`, reservation);
  };

  // Update an existing reservation
  export const updateReservation = async (id, reservation) => {
    return await axios.put(`${API_URL}/reservations/${id}`, reservation);
  };

  // Delete a reservation
  export const deleteReservation = async (id) => {
    return await axios.delete(`${API_URL}/reservations/${id}`);
  };
