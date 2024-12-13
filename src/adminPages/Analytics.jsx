import React, { useState, useEffect } from "react";
import { AnalyticsAPI } from "../services/AdminAPI/AnalyticsAPI";
import { RoomAPI } from "../services/AdminAPI/RoomAPI";
import { useAuth } from "../contexts/AuthContext";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";

const Analytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnalytics, setEditingAnalytics] = useState(null);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    room: null,
    usageRate: "",
    peakHours: "",
    dateGenerated: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadAnalytics();
    loadRooms();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await AnalyticsAPI.getAllAnalytics();
      setAnalytics(data);
    } catch (err) {
      toast.error("Failed to load analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      const data = await RoomAPI.getAllRooms();
      setRooms(data);
    } catch (err) {
      toast.error("Failed to load rooms");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomChange = (e) => {
    const selectedRoom = rooms.find(
      (room) => room.roomId.toString() === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      room: selectedRoom,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const analyticsData = {
        ...formData,
        usageRate: parseInt(formData.usageRate),
      };

      if (editingAnalytics) {
        await AnalyticsAPI.updateAnalytics(
          editingAnalytics.analyticsID,
          analyticsData
        );
      } else {
        await AnalyticsAPI.createAnalytics(analyticsData);
      }

      loadAnalytics();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (analytics) => {
    setEditingAnalytics(analytics);
    setFormData({
      room: analytics.room,
      usageRate: analytics.usageRate.toString(),
      peakHours: analytics.peakHours,
      dateGenerated: analytics.dateGenerated,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this analytics record?")
    ) {
      try {
        setLoading(true);
        await AnalyticsAPI.deleteAnalytics(id);
        loadAnalytics();
      } catch (err) {
        setError("Failed to delete analytics");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnalytics(null);
    setFormData({
      room: null,
      usageRate: "",
      peakHours: "",
      dateGenerated: new Date().toISOString().split("T")[0],
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          <Plus className="mr-2" size={16} />
          Add Analytics
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Peak Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analytics.map((item) => (
              <tr key={item.analyticsID}>
                <td className="px-6 py-4 whitespace-nowrap">
                  Room ID {item.room?.roomId}, Floor {item.room?.floorNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.usageRate}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.peakHours}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(item.dateGenerated)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.createdBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.analyticsID)}
                    className="text-red-600 hover:text-red-900">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingAnalytics ? "Edit Analytics" : "Add New Analytics"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room
                </label>
                <select
                  name="room"
                  value={formData.room?.roomId || ""}
                  onChange={handleRoomChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required>
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room.roomId} value={room.roomId}>
                      Room ID {room.roomId}, Floor {room.floorNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Usage Rate (%)
                </label>
                <input
                  type="number"
                  name="usageRate"
                  value={formData.usageRate}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Peak Hours
                </label>
                <input
                  type="time"
                  name="peakHours"
                  value={formData.peakHours}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="dateGenerated"
                  value={formData.dateGenerated}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
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
    </div>
  );
};

export default Analytics;
