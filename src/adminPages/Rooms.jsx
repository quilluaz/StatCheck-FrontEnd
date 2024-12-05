import React, { useState, useEffect } from "react";
import { BuildingAPI } from "../services/AdminAPI/BuildingAPI";
import { RoomAPI } from "../services/AdminAPI/RoomAPI";
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
    schedules: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedRoomSchedules, setSelectedRoomSchedules] = useState([]);

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
    } else if (name === "capacity" || name === "currentCapacity") {
      setCurrentRoom((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
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

    if (currentRoom.currentCapacity < 0) {
      throw new Error("Current capacity cannot be negative");
    }

    if (currentRoom.currentCapacity > currentRoom.capacity) {
      throw new Error("Current capacity cannot exceed maximum capacity");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      validateForm();

      const roomData = {
        roomId: currentRoom.roomID,
        roomType: currentRoom.roomType,
        capacity: parseInt(currentRoom.capacity),
        currentCapacity: currentRoom.currentCapacity || 0,
        availabilityStatus: currentRoom.availabilityStatus,
        building: currentRoom.building,
        floorNumber: parseInt(currentRoom.floorNumber),
        schedules: currentRoom.schedules || [],
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
      roomID: room.roomId,
      roomType: room.roomType,
      capacity: room.capacity,
      currentCapacity: room.currentCapacity,
      availabilityStatus: room.availabilityStatus,
      building: room.building,
      floorNumber: room.floorNumber,
      schedules: room.schedules || [],
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
      schedules: [],
    });
  };

  const handleShowSchedules = (schedules) => {
    setSelectedRoomSchedules(schedules);
    setIsScheduleModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rooms Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <Plus size={20} />
          Add Room
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room ID
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
                  Schedules
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.roomID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{room.roomId}</td>
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
                    {room.schedules && room.schedules.length > 0 ? (
                      <button
                        onClick={() => handleShowSchedules(room.schedules)}
                        className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors">
                        Show Schedule
                      </button>
                    ) : (
                      "No schedules"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="text-blue-600 hover:text-blue-800">
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(room.roomID)}
                        className="text-red-600 hover:text-red-800">
                        <Trash size={20} />
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
              {isEditing ? "Edit Room" : "Add New Room"}
            </h2>
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
                  Current Capacity
                </label>
                <input
                  type="number"
                  name="currentCapacity"
                  value={currentRoom.currentCapacity}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                  min="0"
                  max={currentRoom.capacity || 0}
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
                  disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Room Schedules</h2>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Subject
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedRoomSchedules.map((schedule, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {schedule.dayOfWeek}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(schedule.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" - "}
                        {new Date(schedule.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {schedule.subjectEntity?.subjectName} (
                        {schedule.subjectEntity?.section})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
