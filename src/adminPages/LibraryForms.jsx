import React, { useState, useEffect } from "react";
import { api } from "../services/LibraryAPI";

function LibraryForms({ onRoomAdded, onRoomEdited, editingRoom }) {
  const [roomName, setRoomName] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    if (editingRoom) {
      setRoomName(editingRoom.roomName);
      setAvailableTimeSlots(editingRoom.availableTimeSlots.join(", "));
      setBookingStatus(editingRoom.bookingStatus);
    } else {
      setRoomName("");
      setAvailableTimeSlots("");
      setBookingStatus("");
    }
  }, [editingRoom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.libraryRoomID}`, {
          roomName,
          availableTimeSlots: availableTimeSlots
            .split(",")
            .map((slot) => slot.trim()),
          bookingStatus,
        });
        onRoomEdited(); // Notify parent that room has been edited
      } else {
        await api.post("/rooms", {
          roomName,
          availableTimeSlots: availableTimeSlots
            .split(",")
            .map((slot) => slot.trim()),
          bookingStatus,
        });
        onRoomAdded(); // Refresh room list
      }

      // Reset form fields
      setRoomName("");
      setAvailableTimeSlots("");
      setBookingStatus("");
    } catch (error) {
      console.error("Error adding or updating library room:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-6 border rounded-lg bg-white shadow-sm"
    >
      <h2 className="text-2xl font-bold mb-4">
        {editingRoom ? "Edit Room" : "Add New Room"}
      </h2>

      <div className="flex flex-col gap-6">
        <div>
          <label
            htmlFor="roomName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Room Name
          </label>
          <input
            type="text"
            id="roomName"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="availableTimeSlots"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Available Time Slots (comma-separated)
          </label>
          <input
            type="text"
            id="availableTimeSlots"
            placeholder="09:00 - 10:00, 10:00 - 11:00"
            value={availableTimeSlots}
            onChange={(e) => setAvailableTimeSlots(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="bookingStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Booking Status
          </label>
          <select
            id="bookingStatus"
            value={bookingStatus}
            onChange={(e) => setBookingStatus(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Status</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Under Maintenance</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {editingRoom ? "Update Room" : "Add Room"}
        </button>
      </div>
    </form>
  );
}

export default LibraryForms;
