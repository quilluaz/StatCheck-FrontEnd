import React, { useState, useEffect } from "react";
import { BuildingAPI } from "../services/AdminAPI/BuildingAPI";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const Building = () => {
  const [buildings, setBuildings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [formData, setFormData] = useState({
    buildingName: "",
    floors: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRoomsModalOpen, setIsRoomsModalOpen] = useState(false);
  const [selectedBuildingRooms, setSelectedBuildingRooms] = useState([]);

  const fetchBuildings = async () => {
    try {
      console.log('Starting to fetch buildings...');
      setLoading(true);
      const data = await BuildingAPI.getAllBuildings();
      console.log('Fetched buildings data:', data);
      setBuildings(data);
      setError(null);
    } catch (err) {
      console.error('Error in fetchData:', err);
      if (err.response?.status === 401) {
        setError("Unauthorized access. Please ensure you are logged in as an admin.");
      } else if (err.response?.status === 403) {
        setError("Forbidden access. You don't have permission to view buildings.");
      } else {
        setError("Failed to fetch buildings. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingBuilding) {
        await BuildingAPI.updateBuilding(editingBuilding.buildingID, formData);
      } else {
        await BuildingAPI.createBuilding(formData);
      }
      await fetchBuildings();
      handleCloseModal();
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError(
          "Unauthorized access. Please ensure you are logged in as an admin."
        );
      } else {
        setError(
          editingBuilding
            ? "Failed to update building"
            : "Failed to create building"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      try {
        setLoading(true);
        await BuildingAPI.deleteBuilding(id);
        await fetchBuildings();
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          setError(
            "Unauthorized access. Please ensure you are logged in as an admin."
          );
        } else {
          setError("Failed to delete building");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (building) => {
    setEditingBuilding(building);
    setFormData({
      buildingName: building.buildingName,
      floors: building.floors,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBuilding(null);
    setFormData({ buildingName: "", floors: "" });
  };

  const handleShowRooms = (rooms) => {
    console.log('Detailed rooms data:', JSON.stringify(rooms, null, 2));
    setSelectedBuildingRooms(rooms);
    setIsRoomsModalOpen(true);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Buildings Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <Plus size={20} />
            Add Building
          </button>
        </div>

        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>

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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rooms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {buildings.map((building, index) => (
                  <tr key={`building-${building.buildingID || index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {building.buildingID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {building.buildingName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {building.floors}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {building.rooms && building.rooms.length > 0 ? (
                        <button
                          onClick={() => handleShowRooms(building.rooms)}
                          className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                        >
                          Show Rooms ({building.rooms.length})
                        </button>
                      ) : (
                        "No rooms"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(building)}
                          className="text-blue-600 hover:text-blue-800">
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(building.buildingID)}
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
                {editingBuilding ? "Edit Building" : "Add New Building"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Building Name
                  </label>
                  <input
                    type="text"
                    name="buildingName"
                    value={formData.buildingName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Floors
                  </label>
                  <input
                    type="number"
                    name="floors"
                    value={formData.floors}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    required
                    min="1"
                    step="1"
                  />
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

        {isRoomsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Building Rooms</h2>
                <button
                  onClick={() => setIsRoomsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedBuildingRooms.map((room, index) => (
                      <tr key={`room-${room.roomId || room.roomID || index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">{room.roomId || room.roomID}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{room.roomType}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{room.floorNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {room.currentCapacity} / {room.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            room.availabilityStatus === 'AVAILABLE' 
                              ? 'bg-green-100 text-green-800'
                              : room.availabilityStatus === 'OCCUPIED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {room.availabilityStatus}
                          </span>
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
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Buildings Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <Plus size={20} />
          Add Building
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Floors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rooms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {buildings.map((building, index) => (
                <tr key={`building-${building.buildingID || index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {building.buildingID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {building.buildingName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {building.floors}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {building.rooms && building.rooms.length > 0 ? (
                      <button
                        onClick={() => handleShowRooms(building.rooms)}
                        className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                      >
                        Show Rooms ({building.rooms.length})
                      </button>
                    ) : (
                      "No rooms"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(building)}
                        className="text-blue-600 hover:text-blue-800">
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(building.buildingID)}
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
              {editingBuilding ? "Edit Building" : "Add New Building"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Building Name
                </label>
                <input
                  type="text"
                  name="buildingName"
                  value={formData.buildingName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Floors
                </label>
                <input
                  type="number"
                  name="floors"
                  value={formData.floors}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
                  min="1"
                  step="1"
                />
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

      {isRoomsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Building Rooms</h2>
              <button
                onClick={() => setIsRoomsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedBuildingRooms.map((room, index) => (
                    <tr key={`room-${room.roomId || room.roomID || index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">{room.roomId || room.roomID}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{room.roomType}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{room.floorNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {room.currentCapacity} / {room.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          room.availabilityStatus === 'AVAILABLE' 
                            ? 'bg-green-100 text-green-800'
                            : room.availabilityStatus === 'OCCUPIED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {room.availabilityStatus}
                        </span>
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

export default Building;
