import React, { useEffect, useState } from "react";
import {
  fetchAnalytics,
  createAnalytics,
  updateAnalytics,
  deleteAnalytics,
} from "../services/AnalyticsAPI";

const AnalyticsForm = () => {
  const [roomId, setRoomId] = useState("");
  const [usageRate, setUsageRate] = useState("");
  const [peakHours, setPeakHours] = useState("");
  const [analyticsRecords, setAnalyticsRecords] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentAnalyticsId, setCurrentAnalyticsId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSaveAnalytics = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const analyticsData = {
        roomId: roomId ? parseInt(roomId) : null,
        usageRate: parseFloat(usageRate),
        peakHours,
      };

      if (editMode) {
        await updateAnalytics(currentAnalyticsId, analyticsData);
        alert("Analytics record updated successfully!");
      } else {
        await createAnalytics(analyticsData);
        alert("Analytics record created successfully!");
      }

      await loadAnalyticsRecords();
      clearForm();
    } catch (error) {
      console.error("Error saving analytics record:", error);
      setError("Failed to save analytics record: " + error.message);
    }
    setLoading(false);
  };

  const loadAnalyticsRecords = async () => {
    setLoading(true);
    try {
      const response = await fetchAnalytics();
      setAnalyticsRecords(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching analytics records:", error);
      setError("Failed to load analytics records");
    }
    setLoading(false);
  };

  const handleEdit = (analytics) => {
    setRoomId(analytics.roomId);
    setUsageRate(analytics.usageRate);
    setPeakHours(analytics.peakHours);
    setCurrentAnalyticsId(analytics.analyticsId);
    setEditMode(true);
  };

  const handleDelete = async (analyticsId) => {
    if (window.confirm("Are you sure you want to delete this analytics record?")) {
      setLoading(true);
      try {
        await deleteAnalytics(analyticsId);
        alert("Analytics record deleted successfully!");
        await loadAnalyticsRecords();
      } catch (error) {
        console.error("Error deleting analytics record:", error);
        setError("Failed to delete analytics record: " + error.message);
      }
      setLoading(false);
    }
  };

  const clearForm = () => {
    setRoomId("");
    setUsageRate("");
    setPeakHours("");
    setCurrentAnalyticsId(null);
    setEditMode(false);
  };

  useEffect(() => {
    loadAnalyticsRecords();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="py-4">
        <h2 className="text-2xl font-bold mb-4">
          {editMode ? "Edit Analytics Record" : "Create Analytics Record"}
        </h2>

        <form
          onSubmit={handleSaveAnalytics}
          className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                Room ID
              </label>
              <input
                type="number"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="usageRate" className="block text-sm font-medium text-gray-700 mb-1">
                Usage Rate (%)
              </label>
              <input
                type="number"
                id="usageRate"
                step="0.01"
                value={usageRate}
                onChange={(e) => setUsageRate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="peakHours" className="block text-sm font-medium text-gray-700 mb-1">
                Peak Hours
              </label>
              <input
                type="text"
                id="peakHours"
                value={peakHours}
                onChange={(e) => setPeakHours(e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={loading}>
              {editMode ? "Update Analytics" : "Save Analytics"}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={clearForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors ml-2">
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
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

        <h2 className="text-2xl font-bold mt-8 mb-4">Analytics Records</h2>
        <div className="overflow-x-auto">
          <ul className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg divide-y divide-gray-200">
            {analyticsRecords.map((analytics) => (
              <li key={analytics.analyticsId} className="hover:bg-gray-50 p-4">
                <p><strong>ID:</strong> {analytics.analyticsId}</p>
                <p><strong>Room ID:</strong> {analytics.roomId}</p>
                <p><strong>Usage Rate:</strong> {analytics.usageRate}%</p>
                <p><strong>Peak Hours:</strong> {analytics.peakHours}</p>
                <p><strong>Date Generated:</strong> {new Date(analytics.dateGenerated).toLocaleString()}</p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(analytics)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(analytics.analyticsId)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsForm;
