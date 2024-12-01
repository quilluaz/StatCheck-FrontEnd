import React, { useEffect, useState } from "react";
import { LibraryReservationAPI } from "../services/AdminAPI/LibraryReservationAPI";
import { LibraryRoomAPI } from "../services/AdminAPI/LibraryRoomAPI";
import { UserAPI } from "../services/AdminAPI/UserAPI";
import { Pencil, Trash2, Plus } from "lucide-react";

const LibraryReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [libraryRooms, setLibraryRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({
    userID: "",
    libraryRoomID: "",
    startTime: "",
    endTime: "",
    reservationStatus: "",
  });

  useEffect(() => {
    loadReservations();
    loadUsers();
    loadLibraryRooms();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await LibraryReservationAPI.getAllReservations();
      setReservations(data);
      setError("");
    } catch (err) {
      setError("Failed to load reservations: " + (err.response?.data || err.message));
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      const data = await UserAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const loadLibraryRooms = async () => {
    try {
      const data = await LibraryRoomAPI.getAllRooms();
      setLibraryRooms(data);
    } catch (err) {
      console.error("Failed to load library rooms:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: formData.reservationStatus,
        userEntity: {
          userID: parseInt(formData.userID)
        },
        libraryRoomEntity: {
          libraryRoomID: parseInt(formData.libraryRoomID)
        }
      };

      if (editingReservation) {
        await LibraryReservationAPI.updateReservation(editingReservation.libraryRoomReservationID, payload);
      } else {
        await LibraryReservationAPI.createReservation(payload);
      }
      await loadReservations();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data || err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        setLoading(true);
        await LibraryReservationAPI.deleteReservation(id);
        await loadReservations();
      } catch (err) {
        setError("Failed to delete reservation: " + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (reservation) => {
    setFormData({
      userID: reservation.userEntity?.userID?.toString() || "",
      libraryRoomID: reservation.libraryRoomEntity?.libraryRoomID?.toString() || "",
      startTime: reservation.startTime || "",
      endTime: reservation.endTime || "",
      reservationStatus: reservation.status || "",
    });
    setEditingReservation(reservation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReservation(null);
    setFormData({
      userID: "",
      libraryRoomID: "",
      startTime: "",
      endTime: "",
      reservationStatus: "",
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    
    const date = new Date(dateTimeString);
    
    // Format the date part (Month DD, YYYY)
    const datePart = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Format the day and time part (Day - HH:mm)
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return (
      <>
        {datePart}<br />
        {dayOfWeek} - {time}
      </>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Library Room Reservations</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <Plus size={20} />
          Add Reservation
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Library Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.libraryRoomReservationID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.libraryRoomReservationID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {users.find(u => u.userID === reservation.userEntity?.userID)?.email || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {libraryRooms.find(r => r.libraryRoomID === reservation.libraryRoomEntity?.libraryRoomID)?.roomName || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-pre-line">
                    {formatDateTime(reservation.startTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-pre-line">
                    {formatDateTime(reservation.endTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reservation.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : reservation.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : reservation.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(reservation)}
                        className="text-blue-600 hover:text-blue-800">
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(reservation.libraryRoomReservationID)}
                        className="text-red-600 hover:text-red-800">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingReservation ? "Edit Reservation" : "Add New Reservation"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User</label>
                <select
                  name="userID"
                  value={formData.userID}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.userID} value={user.userID}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Library Room</label>
                <select
                  name="libraryRoomID"
                  value={formData.libraryRoomID}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
                >
                  <option value="">Select Library Room</option>
                  {libraryRooms.map((room) => (
                    <option key={room.libraryRoomID} value={room.libraryRoomID}>
                      {room.roomName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="reservationStatus"
                  value={formData.reservationStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required>
                  <option value="">Select Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryReservation;
