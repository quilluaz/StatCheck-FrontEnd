import React, { useEffect, useState } from "react";
import {
  fetchParkingLots,
  createParkingLot,
  updateParkingLot,
  deleteParkingLot,
} from "../services/ParkingLotAPI";

const ParkingLot = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [newLot, setNewLot] = useState({ lotNumber: "", totalSpaces: 1 });
  const [editingLot, setEditingLot] = useState(null);
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
    loadParkingLots();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await createParkingLot(newLot);
      setParkingLots([...parkingLots, response.data]);
      setNewLot({ lotNumber: "", totalSpaces: 1 });
    } catch (err) {
      setError("Failed to create parking lot.");
    }
  };

  const handleEdit = async () => {
    if (editingLot) {
      try {
        const updatedLot = await updateParkingLot(editingLot.lotId, newLot);
        setParkingLots(
          parkingLots.map((lot) =>
            lot.lotId === editingLot.lotId ? updatedLot.data : lot
          )
        );
        setEditingLot(null);
        setNewLot({ lotNumber: "", totalSpaces: 1 });
      } catch (err) {
        setError("Failed to update parking lot.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteParkingLot(id);
      setParkingLots(parkingLots.filter((lot) => lot.lotId !== id));
    } catch (err) {
      setError("Failed to delete parking lot.");
    }
  };

  const startEditing = (lot) => {
    setEditingLot(lot);
    setNewLot({ lotNumber: lot.lotNumber, totalSpaces: lot.totalSpaces });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Parking Lots</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          editingLot ? handleEdit() : handleCreate();
        }}
        className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label
              htmlFor="lotNumber"
              className="block text-sm font-medium text-gray-700 mb-1">
              Lot Number
            </label>
            <input
              type="text"
              id="lotNumber"
              value={newLot.lotNumber}
              onChange={(e) =>
                setNewLot({ ...newLot, lotNumber: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter lot number"
              required
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="totalSpaces"
              className="block text-sm font-medium text-gray-700 mb-1">
              Total Spaces
            </label>
            <input
              type="number"
              id="totalSpaces"
              value={newLot.totalSpaces}
              onChange={(e) =>
                setNewLot({ ...newLot, totalSpaces: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            {editingLot ? "Update Parking Lot" : "Create Parking Lot"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lot ID
              </th>
              <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lot Number
              </th>
              <th className="px-6 py-3 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spaces
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {parkingLots.map((lot) => (
              <tr key={lot.lotId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {lot.lotId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {editingLot?.lotId === lot.lotId ? (
                    <input
                      type="text"
                      value={newLot.lotNumber}
                      onChange={(e) =>
                        setNewLot({ ...newLot, lotNumber: e.target.value })
                      }
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    lot.lotNumber
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {editingLot?.lotId === lot.lotId ? (
                    <input
                      type="number"
                      value={newLot.totalSpaces}
                      onChange={(e) =>
                        setNewLot({
                          ...newLot,
                          totalSpaces: Number(e.target.value),
                        })
                      }
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    lot.totalSpaces
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(lot)}
                      className={`px-3 py-1 rounded ${
                        editingLot?.lotId === lot.lotId
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white transition-colors`}>
                      {editingLot?.lotId === lot.lotId ? "Save" : "Edit"}
                    </button>
                    <button
                      onClick={() => handleDelete(lot.lotId)}
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
  );
};

export default ParkingLot;
