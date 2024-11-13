import React, { useState } from "react";
import { api } from "../services/LibraryReservationAPI";

function LibraryReservationForms({ onReservationAdded }) {
  const [userID, setUserID] = useState("");
  const [libraryRoomID, setLibraryRoomID] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reservations", {
        user: { userID },
        libraryRoom: { libraryRoomID },
        startTime,
        endTime,
        reservationStatus,
      });
      onReservationAdded();
      setUserID("");
      setLibraryRoomID("");
      setStartTime("");
      setEndTime("");
      setReservationStatus("");
      setError(null);
    } catch (error) {
      console.error("Error adding reservation:", error);
      setError("Failed to add reservation. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="number"
        placeholder="User ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
        required
        style={{ margin: "5px", padding: "8px", width: "150px" }}
      />
      <input
        type="number"
        placeholder="Library Room ID"
        value={libraryRoomID}
        onChange={(e) => setLibraryRoomID(e.target.value)}
        required
        style={{ margin: "5px", padding: "8px", width: "150px" }}
      />
      <input
        type="text"
        placeholder="Start Time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
        style={{ margin: "5px", padding: "8px", width: "150px" }}
      />
      <input
        type="text"
        placeholder="End Time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
        style={{ margin: "5px", padding: "8px", width: "150px" }}
      />
      <input
        type="text"
        placeholder="Reservation Status"
        value={reservationStatus}
        onChange={(e) => setReservationStatus(e.target.value)}
        required
        style={{ margin: "5px", padding: "8px", width: "150px" }}
      />
      <button type="submit" style={{ padding: "8px 12px", marginTop: "10px" }}>
        Add Reservation
      </button>
    </form>
  );
}

export default LibraryReservationForms;
