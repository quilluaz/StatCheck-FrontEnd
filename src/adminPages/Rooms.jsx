import React, { useState, useEffect } from "react";
import { BuildingAPI } from "../services/BuildingAPI";
import { RoomAPI } from "../services/RoomAPI";
import { Pencil, Trash, Plus, X } from "lucide-react";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({
    roomID: null,
    roomType: "",
    capacity: "",
    currentCapacity: 0,
    availabilityStatus: "",
    building: null,
    floorNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchBuildings();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const data = await RoomAPI.getAllRooms();
      setRooms(data);
    } catch (error) {
      alert("Error fetching rooms: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      const data = await BuildingAPI.getAllBuildings();
      setBuildings(data);
    } catch (error) {
      alert("Error fetching buildings: " + error.message);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === "building") {
      const selectedBuilding = buildings.find(
        (b) => b.buildingID === parseInt(value)
      );

      if (selectedBuilding) {
        try {
          const floors = await BuildingAPI.getFloorsByBuilding(
            selectedBuilding.buildingID
          );
          setFloors(floors);
          setCurrentRoom((prev) => ({
            ...prev,
            building: selectedBuilding,
            floorNumber: "",
          }));
        } catch (error) {
          console.error("Error fetching floors:", error);
          alert("Error fetching floors");
        }
      }
    } else if (name === "floorNumber") {
      if (
        currentRoom.building &&
        (parseInt(value) < 1 || parseInt(value) > currentRoom.building.floors)
      ) {
        alert(`Floor must be between 1 and ${currentRoom.building.floors}`);
        return;
      }
      setCurrentRoom((prev) => ({
        ...prev,
        floorNumber: parseInt(value),
      }));
    } else if (name === "capacity") {
      setCurrentRoom((prev) => ({
        ...prev,
        [name]: parseInt(value) || "",
      }));
    } else {
      setCurrentRoom((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!currentRoom.building) {
      throw new Error("Please select a building");
    }

    if (!currentRoom.floorNumber) {
      throw new Error("Please select a floor");
    }

    if (
      currentRoom.floorNumber < 1 ||
      currentRoom.floorNumber > currentRoom.building.floors
    ) {
      throw new Error(
        `Floor must be between 1 and ${currentRoom.building.floors}`
      );
    }

    if (!currentRoom.roomType) {
      throw new Error("Room type is required");
    }

    if (!currentRoom.capacity || currentRoom.capacity < 1) {
      throw new Error("Valid capacity is required");
    }

    if (!currentRoom.availabilityStatus) {
      throw new Error("Availability status is required");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      validateForm();

      const roomData = {
        roomType: currentRoom.roomType,
        capacity: parseInt(currentRoom.capacity),
        currentCapacity: currentRoom.currentCapacity || 0,
        availabilityStatus: currentRoom.availabilityStatus,
        building: {
          buildingID: currentRoom.building.buildingID,
        },
        floorNumber: parseInt(currentRoom.floorNumber),
      };

      setIsLoading(true);

      if (isEditing) {
        await RoomAPI.updateRoom(currentRoom.roomID, roomData);
      } else {
        await RoomAPI.createRoom(roomData);
      }

      await fetchRooms();
      handleCloseModal();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (room) => {
    setCurrentRoom({
      roomID: room.roomID,
      roomType: room.roomType,
      capacity: room.capacity,
      currentCapacity: room.currentCapacity,
      availabilityStatus: room.availabilityStatus,
      building: {
        buildingID: room.building.buildingID,
        buildingName: room.building.buildingName,
        floors: room.building.floors,
      },
      floorNumber: room.floorNumber,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        setIsLoading(true);
        await RoomAPI.deleteRoom(id);
        await fetchRooms();
      } catch (error) {
        alert("Error deleting room: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentRoom({
      roomID: null,
      roomType: "",
      capacity: "",
      currentCapacity: 0,
      availabilityStatus: "",
      building: null,
      floorNumber: "",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rooms Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          Add New Room
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Floor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.roomID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{room.roomID}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.roomName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.building?.buildingName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.floorNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.roomType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.currentCapacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.availabilityStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="text-blue-500 hover:text-blue-600">
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(room.roomID)}
                        className="text-red-500 hover:text-red-600">
                        <Trash size={18} />
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Room" : "Add Room"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Building
                </label>
                <select
                  name="building"
                  value={currentRoom.building?.buildingID || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required>
                  <option value="">Select a building</option>
                  {buildings.map((building) => (
                    <option
                      key={building.buildingID}
                      value={building.buildingID}>
                      {building.buildingName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Floor
                </label>
                <select
                  name="floorNumber"
                  value={currentRoom.floorNumber}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                  disabled={!currentRoom.building}>
                  <option value="">Select a floor</option>
                  {floors.map((floor) => (
                    <option key={floor.floorID} value={floor.floorNumber}>
                      Floor {floor.floorNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={currentRoom.roomType}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required>
                  <option value="">Select a type</option>
                  <option value="CLASSROOM">Classroom</option>
                  <option value="LABORATORY">Laboratory</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={currentRoom.capacity}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Availability Status
                </label>
                <select
                  name="availabilityStatus"
                  value={currentRoom.availabilityStatus}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required>
                  <option value="">Select availability</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md">
                  {isEditing ? "Update Room" : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
