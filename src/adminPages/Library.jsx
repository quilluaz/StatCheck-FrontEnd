import React, { useEffect, useState } from "react";
import { api } from "../services/LibraryAPI";
import LibraryRoomForm from "./LibraryForms";

const Library = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get("/rooms");
      setRooms(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching library rooms:", err);
      setError("Failed to load library rooms. Please try again later.");
    }
    setLoading(false);
  };

  const handleDelete = async (roomID) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setLoading(true);
      try {
        await api.delete(`/rooms/${roomID}`);
        loadRooms();
      } catch (err) {
        console.error("Error deleting library room:", err);
        setError("Failed to delete library room. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
  };

  const handleRoomUpdated = async (updatedRoom) => {
    setLoading(true);
    try {
      await api.put(`/rooms/${updatedRoom.libraryRoomID}`, updatedRoom);
      loadRooms();
      setEditingRoom(null);
    } catch (err) {
      console.error("Error updating library room:", err);
      setError("Failed to update library room. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-4">Library Rooms Directory</h1>

        <LibraryRoomForm
          onRoomAdded={loadRooms}
          onRoomEdited={handleRoomUpdated}
          editingRoom={editingRoom}
        />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 text-red-700">{error}</div>
            </div>
          </div>
        )}

        {loading && <div className="text-center py-4">Loading...</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room ID
                </th>
                <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Name
                </th>
                <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Status
                </th>
                <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Time Slots
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.libraryRoomID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {room.libraryRoomID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {room.roomName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {room.bookingStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {Array.isArray(room.availableTimeSlots)
                      ? room.availableTimeSlots.join(", ")
                      : "No time slots available"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className={`px-3 py-1 rounded ${
                          editingRoom?.libraryRoomID === room.libraryRoomID
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        } text-white transition-colors`}>
                        {editingRoom?.libraryRoomID === room.libraryRoomID
                          ? "Save"
                          : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDelete(room.libraryRoomID)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Library;
