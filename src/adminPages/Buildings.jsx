import React, { useState, useEffect } from "react";
import buildingsApi from "../services/BuildingAPI";

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newBuilding, setNewBuilding] = useState({ bldgName: "" });
  const [editingBuilding, setEditingBuilding] = useState(null);

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    setLoading(true);
    const { data, error } = await buildingsApi.getAllBuildings();
    if (error) {
      setError(error);
    } else {
      setBuildings(data);
      setError("");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await buildingsApi.createBuilding(newBuilding);
    if (error) {
      setError(error);
    } else {
      setNewBuilding({ bldgName: "" });
      loadBuildings();
    }
    setLoading(false);
  };

  const handleEdit = async (building) => {
    if (editingBuilding?.bldgID === building.bldgID) {
      const updateData = {
        bldgID: editingBuilding.bldgID,
        bldgName: editingBuilding.bldgName,
        roomEntities: building.roomEntities,
      };

      const { error } = await buildingsApi.updateBuilding(
        building.bldgID,
        updateData
      );
      if (error) {
        setError(error);
      } else {
        loadBuildings();
        setEditingBuilding(null);
      }
    } else {
      setEditingBuilding({
        ...building,
        roomEntities: [...(building.roomEntities || [])],
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      const { error } = await buildingsApi.deleteBuilding(id);
      if (error) {
        setError(error);
      } else {
        loadBuildings();
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-4">Buildings Directory</h1>

        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label
                htmlFor="bldgName"
                className="block text-sm font-medium text-gray-700 mb-1">
                Building Name
              </label>
              <input
                type="text"
                id="bldgName"
                value={newBuilding.bldgName}
                onChange={(e) => setNewBuilding({ bldgName: e.target.value })}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter building name"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={loading}>
              Add Building
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
                  Building ID
                </th>
                <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Building Name
                </th>
                <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rooms
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {buildings.map((building) => (
                <tr key={building.bldgID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {building.bldgID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {editingBuilding?.bldgID === building.bldgID ? (
                      <input
                        type="text"
                        value={editingBuilding.bldgName}
                        onChange={(e) =>
                          setEditingBuilding({
                            ...editingBuilding,
                            bldgName: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      building.bldgName
                    )}
                  </td>
                  <td className="px-6 py-4 border-r">
                    <ul className="list-disc list-inside">
                      {building.roomEntities?.map((room) => (
                        <li key={room.id} className="text-sm">
                          Room {room.roomNumber}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(building)}
                        className={`px-3 py-1 rounded ${
                          editingBuilding?.bldgID === building.bldgID
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        } text-white transition-colors`}>
                        {editingBuilding?.bldgID === building.bldgID
                          ? "Save"
                          : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDelete(building.bldgID)}
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

export default Buildings;
