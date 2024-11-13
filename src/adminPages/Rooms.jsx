import React, { useState, useEffect } from "react";
import { roomsApi } from "../services/RoomAPI";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    roomType: "",
    capacity: 0,
    currentOccupancy: 0,
    availabilityStatus: "Available",
    building: { bldgID: "" },
  });
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    loadRooms();
    loadBuildings();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const roomsData = await roomsApi.getAllRooms();
      setRooms(roomsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBuildings = async () => {
    try {
      const buildingsData = await roomsApi.getAllBuildings();
      setBuildings(buildingsData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newRoom.building.bldgID) {
        setError("Please select a building");
        return;
      }

      setLoading(true);
      await roomsApi.createRoom(newRoom);

      setNewRoom({
        roomNumber: "",
        roomType: "",
        capacity: 0,
        currentOccupancy: 0,
        availabilityStatus: "Available",
        building: { bldgID: "" },
      });
      loadRooms();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (room) => {
    if (editingRoom?.roomID === room.roomID) {
      try {
        await roomsApi.updateRoom(room.roomID, editingRoom);
        loadRooms();
        setEditingRoom(null);
      } catch (err) {
        setError(err.message);
      }
    } else {
      setEditingRoom({
        ...room,
        building: {
          ...room.building,
          bldgID: room.building?.bldgID || "",
          bldgName: room.building?.bldgName || "",
        },
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await roomsApi.deleteRoom(id);
        loadRooms();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-4">Rooms Directory</h1>

        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex-1">
              <label
                htmlFor="roomNumber"
                className="block text-sm font-medium text-gray-700 mb-1">
                Room Number
              </label>
              <input
                type="text"
                id="roomNumber"
                value={newRoom.roomNumber}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, roomNumber: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter room number"
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="roomType"
                className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                id="roomType"
                value={newRoom.roomType}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, roomType: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required>
                <option value="">Select Room Type</option>
                <option value="Classroom">Classroom</option>
                <option value="Laboratory">Laboratory</option>
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                value={newRoom.capacity}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter capacity"
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="currentOccupancy"
                className="block text-sm font-medium text-gray-700 mb-1">
                Current Occupancy
              </label>
              <input
                type="number"
                id="currentOccupancy"
                value={newRoom.currentOccupancy}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    currentOccupancy: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter current occupancy"
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="availabilityStatus"
                className="block text-sm font-medium text-gray-700 mb-1">
                Availability Status
              </label>
              <select
                id="availabilityStatus"
                value={newRoom.availabilityStatus}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, availabilityStatus: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required>
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Full">Full</option>
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="buildingId"
                className="block text-sm font-medium text-gray-700 mb-1">
                Building
              </label>
              <select
                id="buildingId"
                value={newRoom.building.bldgID}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    building: { bldgID: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required>
                <option value="">Select Building</option>
                {buildings.map((building) => (
                  <option key={building.bldgID} value={building.bldgID}>
                    {building.bldgName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 w-full">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={loading}>
              Add Room
            </button>
          </div>
        </form>

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
                  Room Number
                </th>
                <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Occupancy
                </th>
                <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.roomID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {room.roomID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {editingRoom?.roomID === room.roomID ? (
                      <input
                        type="text"
                        value={editingRoom.roomNumber}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            roomNumber: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      room.roomNumber
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {editingRoom?.roomID === room.roomID ? (
                      <select
                        value={editingRoom.roomType}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            roomType: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded">
                        <option value="Classroom">Classroom</option>
                        <option value="Laboratory">Laboratory</option>
                      </select>
                    ) : (
                      room.roomType
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {editingRoom?.roomID === room.roomID ? (
                      <input
                        type="number"
                        value={editingRoom.capacity}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            capacity: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      room.capacity
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {editingRoom?.roomID === room.roomID ? (
                      <input
                        type="number"
                        value={editingRoom.currentOccupancy}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            currentOccupancy: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      room.currentOccupancy
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {editingRoom?.roomID === room.roomID ? (
                      <select
                        value={editingRoom.availabilityStatus}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            availabilityStatus: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded">
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    ) : (
                      room.availabilityStatus
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {editingRoom?.roomID === room.roomID ? (
                      <select
                        value={editingRoom.building.bldgID}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            building: {
                              ...editingRoom.building,
                              bldgID: e.target.value,
                            },
                          })
                        }
                        className="w-full px-2 py-1 border rounded">
                        {buildings.map((building) => (
                          <option key={building.bldgID} value={building.bldgID}>
                            {building.bldgName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      room.building?.bldgName || "No Building"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className={`px-3 py-1 rounded ${
                          editingRoom?.roomID === room.roomID
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        } text-white transition-colors`}>
                        {editingRoom?.roomID === room.roomID ? "Save" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDelete(room.roomID)}
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

export default Rooms;