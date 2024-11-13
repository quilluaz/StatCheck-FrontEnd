import React, { useEffect, useState } from "react";
import {
  fetchParkingLots,
  createReservation,
  fetchReservations,
  updateReservation,
  deleteReservation,
} from "../services/ParkingReservationAPI";

const ParkingReservation = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState({
    parkingLot: { lotId: "" },
    reservationStartTime: "",
    reservationEndTime: "",
  });
  const [editingReservation, setEditingReservation] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadParkingLots = async () => {
      try {
        const response = await fetchParkingLots();
        setParkingLots(response.data);
      } catch (err) {
        setError("Failed to load parking lots.");
      }
    };

    const loadReservations = async () => {
      try {
        const response = await fetchReservations();
        setReservations(response.data);
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
          await deleteReservation(expiredReservation.reservationId);
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

  const handleCreateOrUpdateReservation = async () => {
    if (
      !reservation.parkingLot.lotId ||
      !reservation.reservationStartTime ||
      !reservation.reservationEndTime
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    try {
      if (editingReservation) {
        const response = await updateReservation(
          editingReservation.reservationId,
          reservation
        );
        setReservations(
          reservations.map((res) =>
            res.reservationId === editingReservation.reservationId
              ? response.data
              : res
          )
        );
        setMessage("Reservation updated successfully!");
      } else {
        const response = await createReservation(reservation);
        setReservations([...reservations, response.data]);
        setMessage("Reservation created successfully!");
      }
      setReservation({
        parkingLot: { lotId: "" },
        reservationStartTime: "",
        reservationEndTime: "",
      });
      setEditingReservation(null);
    } catch (err) {
      setError("Failed to save reservation.");
    }
  };

  const handleEditClick = (res) => {
    setEditingReservation(res);
    setReservation({
      parkingLot: { lotId: res.parkingLot.lotId },
      reservationStartTime: res.reservationStartTime,
      reservationEndTime: res.reservationEndTime,
    });
  };

  const handleDeleteReservation = async (id) => {
    try {
      await deleteReservation(id);
      setReservations(reservations.filter((res) => res.reservationId !== id));
    } catch (err) {
      setError("Failed to delete reservation.");
    }
  };

  const currentDateTime = new Date().toISOString().slice(0, 16);

  return (
    <div className="container mx-auto px-4">
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {editingReservation ? "Edit Reservation" : "Create Reservation"}
        </h1>

        <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <form className="space-y-4">
            <div>
              <label
                htmlFor="parkingLot"
                className="block text-sm font-medium text-gray-700 mb-1">
                Parking Lot
              </label>
              <select
                id="parkingLot"
                value={reservation.parkingLot.lotId}
                onChange={(e) =>
                  setReservation({
                    ...reservation,
                    parkingLot: { lotId: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Parking Lot</option>
                {parkingLots.map((lot) => (
                  <option key={lot.lotId} value={lot.lotId}>
                    {lot.lotNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="reservationStartTime"
                className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                id="reservationStartTime"
                value={reservation.reservationStartTime}
                onChange={(e) =>
                  setReservation({
                    ...reservation,
                    reservationStartTime: e.target.value,
                  })
                }
                min={currentDateTime}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="reservationEndTime"
                className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                id="reservationEndTime"
                value={reservation.reservationEndTime}
                onChange={(e) =>
                  setReservation({
                    ...reservation,
                    reservationEndTime: e.target.value,
                  })
                }
                min={reservation.reservationStartTime || currentDateTime}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleCreateOrUpdateReservation}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              {editingReservation ? "Update Reservation" : "Create Reservation"}
            </button>
          </form>
        </div>

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 text-green-700">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            {error}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Existing Reservations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lot Number
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.map((res) => (
                <tr key={res.reservationId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {res.parkingLot.lotNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(res.reservationStartTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(res.reservationEndTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(res)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReservation(res.reservationId)}
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

export default ParkingReservation;
