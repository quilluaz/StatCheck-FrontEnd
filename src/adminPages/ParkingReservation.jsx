import React, { useEffect, useState } from "react";
import { ParkingReservationAPI } from "../services/AdminAPI/ParkingReservationAPI";
import { Pencil, Trash2, Plus } from "lucide-react";
import { UserAPI } from "../services/AdminAPI/UserAPI";
import { ParkingLotAPI } from "../services/AdminAPI/ParkingLotAPI";

const ParkingReservation = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState({
    parkingLot: { lotId: "" },
    parkingSpace: null,
    userEntity: null,
    reservationStartTime: "",
    reservationEndTime: "",
  });
  const [editingReservation, setEditingReservation] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableSpaces, setAvailableSpaces] = useState([]);
  const reservationStatuses = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
  ];

  useEffect(() => {
    const loadParkingLots = async () => {
      try {
        const response = await ParkingLotAPI.getAllParkingLots();
        setParkingLots(response);
      } catch (err) {
        setError("Failed to load parking lots.");
      }
    };

    const loadReservations = async () => {
      try {
        const response = await ParkingReservationAPI.getAllReservations();
        setReservations(response);
      } catch (err) {
        setError("Failed to load reservations.");
      }
    };

    loadParkingLots();
    loadReservations();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date().toISOString();
      try {
        const expiredReservations = reservations.filter(
          (res) => res.reservationEndTime < now
        );
        for (const expiredReservation of expiredReservations) {
          await ParkingReservationAPI.deleteReservation(
            expiredReservation.reservationId
          );
        }
        setReservations(
          reservations.filter((res) => res.reservationEndTime >= now)
        );
      } catch (err) {
        setError("Failed to delete expired reservations.");
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [reservations]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await UserAPI.getAllUsers();
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingReservation) {
      const parkingLot = editingReservation.parkingSpaceEntity?.parkingLot;
      setReservation({
        parkingLot: parkingLot || { lotId: "" },
        parkingSpace: editingReservation.parkingSpaceEntity,
        userEntity: editingReservation.userEntity,
        reservationStartTime: editingReservation.startTime,
        reservationEndTime: editingReservation.endTime,
      });

      if (parkingLot) {
        const lot = parkingLots.find(
          (l) => l.parkingLotID === parkingLot.parkingLotID
        );
        if (lot) {
          setAvailableSpaces(lot.parkingSpaces);
        }
      }
    }
  }, [editingReservation, parkingLots]);

  const handleCreateOrUpdateReservation = async () => {
    if (
      !reservation.parkingLot.lotId ||
      !reservation.parkingSpace?.parkingSpaceId ||
      !reservation.reservationStartTime ||
      !reservation.reservationEndTime
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    try {
      if (editingReservation) {
        const response = await ParkingReservationAPI.updateReservation(
          editingReservation.reservationId,
          {
            parkingSpaceEntity: {
              parkingSpaceId: reservation.parkingSpace.parkingSpaceId,
            },
            startTime: reservation.reservationStartTime,
            endTime: reservation.reservationEndTime,
            status: "ACTIVE",
          }
        );
        setReservations(
          reservations.map((res) =>
            res.reservationId === editingReservation.reservationId
              ? response
              : res
          )
        );
        setMessage("Reservation updated successfully!");
      } else {
        const response = await ParkingReservationAPI.createReservation({
          parkingSpaceEntity: {
            parkingSpaceId: reservation.parkingSpace.parkingSpaceId,
          },
          startTime: reservation.reservationStartTime,
          endTime: reservation.reservationEndTime,
          status: "ACTIVE",
        });
        setReservations([...reservations, response]);
        setMessage("Reservation created successfully!");
      }
      setReservation({
        parkingLot: { lotId: "" },
        parkingSpace: null,
        reservationStartTime: "",
        reservationEndTime: "",
      });
      setEditingReservation(null);
    } catch (err) {
      setError("Failed to save reservation.");
    }
  };

  const handleEditClick = (reservationData) => {
    console.log("Editing reservation:", reservationData);
    setEditingReservation(reservationData);
    setReservation({
      reservationStartTime: reservationData.startTime,
      reservationEndTime: reservationData.endTime,
      status: reservationData.status || "PENDING",
    });
    setSelectedSpace(reservationData.parkingSpaceEntity);
    setSelectedUser(reservationData.userEntity);
    setSelectedLot(reservationData.parkingLotEntity);
    setIsModalOpen(true);
  };

  const handleDeleteReservation = async (id) => {
    try {
      const success = await ParkingReservationAPI.deleteReservation(id);
      if (success) {
        setMessage("Reservation deleted successfully");
        // Refresh the reservations list
        const updatedReservations =
          await ParkingReservationAPI.getAllReservations();
        setReservations(updatedReservations);
      } else {
        setError("Failed to delete reservation");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      setError("Failed to delete reservation");
    }
  };

  const currentDateTime = new Date().toISOString().slice(0, 16);

  const handleLotChange = (e) => {
    const lotId = e.target.value;
    const lot = parkingLots.find((l) => l.parkingLotID.toString() === lotId);
    setSelectedLot(lot);

    if (lot) {
      const spaces = lot.parkingSpaces.filter(
        (space) => space.status === "AVAILABLE" || space.status === "available"
      );
      setAvailableSpaces(spaces);
    } else {
      setAvailableSpaces([]);
    }

    setSelectedSpace(null);
    setReservation((prev) => ({
      ...prev,
      parkingLot: lot || { lotId: "" },
      parkingSpace: null,
    }));
  };

  const handleSpaceChange = (e) => {
    const spaceId = e.target.value;
    const space = availableSpaces.find(
      (s) => s.parkingSpaceId.toString() === spaceId
    );
    setSelectedSpace(space);
    setReservation((prev) => ({
      ...prev,
      parkingSpace: space,
    }));
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    const user = users.find((u) => u.userID.toString() === userId);
    setSelectedUser(user);
    setReservation((prev) => ({
      ...prev,
      userEntity: user,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!selectedSpace) {
        setError("Please select a parking space");
        return;
      }
      if (!selectedUser) {
        setError("Please select a user");
        return;
      }
      if (
        !reservation.reservationStartTime ||
        !reservation.reservationEndTime
      ) {
        setError("Please select start and end times");
        return;
      }

      // Log the selected space details for debugging
      console.log("Selected Space:", selectedSpace);
      console.log("Selected User:", selectedUser);

      const reservationData = {
        parkingSpace: selectedSpace,
        userEntity: selectedUser,
        reservationStartTime: reservation.reservationStartTime,
        reservationEndTime: reservation.reservationEndTime,
        status: reservation.status || "PENDING",
      };

      console.log("Submitting reservation data:", reservationData);

      let result;
      if (editingReservation) {
        result = await ParkingReservationAPI.updateReservation(
          editingReservation.reservationID,
          reservationData
        );
      } else {
        result = await ParkingReservationAPI.createReservation(reservationData);
      }

      console.log("API Response:", result);

      setMessage(
        editingReservation
          ? "Reservation updated successfully!"
          : "Reservation created successfully!"
      );

      // Refresh reservations list
      const updatedReservations =
        await ParkingReservationAPI.getAllReservations();
      setReservations(updatedReservations);

      // Reset form
      setIsModalOpen(false);
      setReservation({
        parkingLot: { lotId: "" },
        parkingSpace: null,
        userEntity: null,
        reservationStartTime: "",
        reservationEndTime: "",
      });
      setSelectedLot(null);
      setSelectedSpace(null);
      setSelectedUser(null);
      setEditingReservation(null);
    } catch (error) {
      console.error("Error saving reservation:", error);
      setError(error.response?.data?.message || "Failed to save reservation");
    }
  };

  // Add this helper function for date formatting
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const formattedDate = date.toLocaleDateString("en-GB"); // DD/MM/YYYY
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return (
      <>
        {formattedDate}
        <br />
        {formattedTime}
      </>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parking Reservations</h1>
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

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingReservation ? "Edit Reservation" : "New Reservation"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User
                </label>
                <select
                  value={reservation.userEntity?.userID || ""}
                  onChange={handleUserChange}
                  className="w-full p-2 border rounded-md"
                  required>
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.userID} value={user.userID}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parking Lot
                </label>
                <select
                  value={reservation.parkingLot?.parkingLotID || ""}
                  onChange={handleLotChange}
                  className="w-full p-2 border rounded-md"
                  required>
                  <option value="">Select a parking lot</option>
                  {parkingLots.map((lot) => (
                    <option key={lot.parkingLotID} value={lot.parkingLotID}>
                      {lot.parkingLotName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parking Space
                </label>
                <select
                  value={reservation.parkingSpace?.parkingSpaceId || ""}
                  onChange={handleSpaceChange}
                  className="w-full p-2 border rounded-md"
                  disabled={!reservation.parkingLot}
                  required>
                  <option value="">Select a parking space</option>
                  {availableSpaces.map((space) => (
                    <option
                      key={space.parkingSpaceId}
                      value={space.parkingSpaceId}>
                      {space.parkingName} - {space.spaceType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={reservation.reservationStartTime}
                  onChange={(e) =>
                    setReservation((prev) => ({
                      ...prev,
                      reservationStartTime: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={reservation.reservationEndTime}
                  onChange={(e) =>
                    setReservation((prev) => ({
                      ...prev,
                      reservationEndTime: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={reservation.status || "PENDING"}
                  onChange={(e) =>
                    setReservation({ ...reservation, status: e.target.value })
                  }>
                  {reservationStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingReservation(null);
                    setReservation({
                      parkingLot: { lotId: "" },
                      parkingSpace: null,
                      userEntity: null,
                      reservationStartTime: "",
                      reservationEndTime: "",
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  {editingReservation ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parking Reservation ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parking Lot
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parking Space
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.reservationID}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {reservation.reservationID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {reservation.parkingLotEntity?.parkingLotName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {reservation.parkingSpaceEntity?.parkingName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {reservation.userEntity?.email || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDateTime(reservation.startTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditClick(reservation)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteReservation(reservation.reservationID)
                    }
                    className="text-red-600 hover:text-red-900">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParkingReservation;
