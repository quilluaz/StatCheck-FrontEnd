import React, { useEffect, useState } from "react";
import { ParkingLotAPI } from "../services/AdminAPI/ParkingLotAPI";
import { Pencil, Trash2, Plus, Eye, Save } from "lucide-react";
import { Modal } from "react-responsive-modal";

const ParkingLot = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [newLot, setNewLot] = useState({
    parkingLotName: "",
    spaces: 1,
    parkingSpaces: [],
  });
  const [editingLot, setEditingLot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpacesModalOpen, setIsSpacesModalOpen] = useState(false);
  const [selectedLotSpaces, setSelectedLotSpaces] = useState(null);
  const [editingSpace, setEditingSpace] = useState(null);
  const [isSpaceEditModalOpen, setIsSpaceEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedSpace, setEditedSpace] = useState(null);

  useEffect(() => {
    fetchParkingLots();
  }, []);

  const fetchParkingLots = async () => {
    try {
      setLoading(true);
      const data = await ParkingLotAPI.getAllParkingLots();
      setParkingLots(data);
      setError("");
    } catch (err) {
      setError("Failed to load parking lots.");
      console.error("Error fetching parking lots:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setEditingLot(null);
    setNewLot({
      parkingLotName: "",
      spaces: 1,
      parkingSpaces: [],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingLot(null);
    setNewLot({
      parkingLotName: "",
      spaces: 1,
      parkingSpaces: [],
    });
    setIsModalOpen(false);
    setError("");
  };

  const handleCreate = async () => {
    try {
      if (!newLot.parkingLotName || newLot.spaces < 1) {
        setError("Please provide a valid lot name and number of spaces.");
        return;
      }

      setLoading(true);
      const data = await ParkingLotAPI.createParkingLot({
        parkingLotName: newLot.parkingLotName,
        spaces: newLot.spaces,
      });
      setParkingLots([...parkingLots, data]);
      handleCloseModal();
      setError("");
    } catch (err) {
      setError("Failed to create parking lot.");
      console.error("Error creating parking lot:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (editingLot) {
      try {
        if (!newLot.parkingLotName || newLot.spaces < 1) {
          setError("Please provide a valid lot name and number of spaces.");
          return;
        }

        setLoading(true);
        const updatedLot = await ParkingLotAPI.updateParkingLot(
          editingLot.parkingLotID,
          {
            parkingLotName: newLot.parkingLotName,
            spaces: newLot.spaces,
          }
        );
        setParkingLots(
          parkingLots.map((lot) =>
            lot.parkingLotID === editingLot.parkingLotID ? updatedLot : lot
          )
        );
        handleCloseModal();
        setError("");
      } catch (err) {
        setError("Failed to update parking lot.");
        console.error("Error updating parking lot:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this parking lot?")) {
      try {
        setLoading(true);
        await ParkingLotAPI.deleteParkingLot(id);
        setParkingLots(parkingLots.filter((lot) => lot.parkingLotID !== id));
        setError("");
      } catch (err) {
        setError("Failed to delete parking lot.");
        console.error("Error deleting parking lot:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const startEditing = (lot) => {
    setEditingLot(lot);
    setNewLot({
      parkingLotName: lot.parkingLotName,
      spaces: lot.spaces,
      parkingSpaces: lot.parkingSpaces || [],
    });
    setIsModalOpen(true);
  };

  const getAvailableSpaces = (parkingSpaces) => {
    return (
      parkingSpaces?.filter((space) => space.status === "AVAILABLE").length || 0
    );
  };

  const getSpaceTypeDistribution = (parkingSpaces) => {
    if (!parkingSpaces?.length) return "N/A";
    const carSpaces = parkingSpaces.filter(
      (space) => space.spaceType === "CAR"
    ).length;
    const motorcycleSpaces = parkingSpaces.filter(
      (space) => space.spaceType === "MOTORCYCLE"
    ).length;
    return `Cars: ${carSpaces}, Motorcycles: ${motorcycleSpaces}`;
  };

  const handleViewSpaces = (lot) => {
    setSelectedLotSpaces(lot);
    setIsSpacesModalOpen(true);
  };

  const handleCloseSpacesModal = () => {
    setSelectedLotSpaces(null);
    setIsSpacesModalOpen(false);
  };

  const handleEditSpace = (space) => {
    setEditingSpace(space);
    setIsSpaceEditModalOpen(true);
  };

  const handleUpdateSpace = async (updatedSpace) => {
    try {
      setLoading(true);
      const response = await ParkingLotAPI.updateParkingSpace(
        updatedSpace.parkingSpaceId,
        updatedSpace
      );

      // Update the spaces list in the parent lot
      const updatedLot = {
        ...selectedLotSpaces,
        parkingSpaces: selectedLotSpaces.parkingSpaces.map((space) =>
          space.parkingSpaceId === response.parkingSpaceId ? response : space
        ),
      };
      setSelectedLotSpaces(updatedLot);

      // Update the main parking lots list
      setParkingLots(
        parkingLots.map((lot) =>
          lot.parkingLotID === selectedLotSpaces.parkingLotID ? updatedLot : lot
        )
      );

      setIsSpaceEditModalOpen(false);
      setEditingSpace(null);
      setError("");
    } catch (err) {
      setError("Failed to update parking space");
      console.error("Error updating parking space:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpace = async (spaceId) => {
    if (window.confirm("Are you sure you want to delete this parking space?")) {
      try {
        setLoading(true);
        await ParkingLotAPI.deleteParkingSpace(spaceId);
        const updatedLot = await ParkingLotAPI.getParkingLotById(
          selectedLotSpaces.parkingLotID
        );
        setSelectedLotSpaces(updatedLot);
        setParkingLots(
          parkingLots.map((lot) =>
            lot.parkingLotID === selectedLotSpaces.parkingLotID
              ? updatedLot
              : lot
          )
        );
        setError("");
      } catch (err) {
        setError("Failed to delete parking space.");
        console.error("Error deleting parking space:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (space) => {
    setEditingId(space.parkingSpaceId);
    setEditedSpace({ ...space });
  };

  const handleSaveClick = async (spaceId) => {
    try {
      const response = await ParkingLotAPI.updateParkingSpace(spaceId, editedSpace);
      
      // Update the spaces list
      const updatedSpaces = selectedLotSpaces.parkingSpaces.map(space =>
        space.parkingSpaceId === spaceId ? response : space
      );

      setSelectedLotSpaces({
        ...selectedLotSpaces,
        parkingSpaces: updatedSpaces
      });

      // Reset editing state
      setEditingId(null);
      setEditedSpace(null);
      setError("");
    } catch (err) {
      setError("Error updating parking space");
      console.error("Error updating parking space:", err);
    }
  };

  const renderParkingSpaceRow = (space) => {
    const isEditing = editingId === space.parkingSpaceId;
    const statusColor = space.status === "AVAILABLE" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";

    return (
      <tr key={space.parkingSpaceId}>
        <td className="px-6 py-4 whitespace-nowrap">{space.parkingSpaceId}</td>
        <td className="px-6 py-4 whitespace-nowrap">{space.parkingName}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          {isEditing ? (
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editedSpace.spaceType}
              onChange={(e) => setEditedSpace({
                ...editedSpace,
                spaceType: e.target.value
              })}
            >
              <option value="CAR">CAR</option>
              <option value="MOTORCYCLE">MOTORCYCLE</option>
            </select>
          ) : (
            space.spaceType
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {isEditing ? (
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editedSpace.status}
              onChange={(e) => setEditedSpace({
                ...editedSpace,
                status: e.target.value
              })}
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
            </select>
          ) : (
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
              {space.status}
            </span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <button
                onClick={() => handleSaveClick(space.parkingSpaceId)}
                className="text-green-600 hover:text-green-800"
              >
                <Save className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => handleEditClick(space)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Pencil className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => handleDeleteSpace(space.parkingSpaceId)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const SpaceEditModal = () => (
    <Modal
      isOpen={isSpaceEditModalOpen}
      onClose={() => {
        setIsSpaceEditModalOpen(false);
        setEditingSpace(null);
      }}
      title="Edit Parking Space">
      {editingSpace && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateSpace(editingSpace);
          }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Space Type
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingSpace.spaceType}
                onChange={(e) =>
                  setEditingSpace({
                    ...editingSpace,
                    spaceType: e.target.value,
                  })
                }>
                <option value="CAR">CAR</option>
                <option value="MOTORCYCLE">MOTORCYCLE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingSpace.status}
                onChange={(e) =>
                  setEditingSpace({
                    ...editingSpace,
                    status: e.target.value,
                  })
                }>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="OCCUPIED">OCCUPIED</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => {
                  setIsSpaceEditModalOpen(false);
                  setEditingSpace(null);
                }}>
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parking Lots Management</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}>
          <Plus size={20} />
          Add Parking Lot
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && <div className="text-center py-4">Loading...</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lot Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parking Spaces
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {parkingLots.map((lot) => (
              <tr key={lot.parkingLotID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {lot.parkingLotID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lot.parkingLotName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewSpaces(lot)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    disabled={loading}>
                    <Eye size={20} />
                    View Spaces ({lot.spaces})
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(lot)}
                      className="text-blue-600 hover:text-blue-800"
                      disabled={loading}>
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(lot.parkingLotID)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}>
                      <Trash2 size={20} />
                    </button>
                  </div>
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
              {editingLot ? "Edit Parking Lot" : "Add New Parking Lot"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editingLot ? handleEdit() : handleCreate();
              }}
              className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lot Name
                </label>
                <input
                  type="text"
                  value={newLot.parkingLotName}
                  onChange={(e) =>
                    setNewLot({ ...newLot, parkingLotName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Spaces
                </label>
                <input
                  type="number"
                  value={newLot.spaces}
                  onChange={(e) =>
                    setNewLot({ ...newLot, spaces: Number(e.target.value) })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
                  min="1"
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  disabled={loading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  disabled={loading}>
                  {loading ? "Saving..." : editingLot ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSpacesModalOpen && selectedLotSpaces && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleCloseSpacesModal}
        >
          <div 
            className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Parking Spaces - {selectedLotSpaces.parkingLotName}
              </h2>
              <button
                onClick={handleCloseSpacesModal}
                className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Space ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Space Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Space Type
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
                  {selectedLotSpaces.parkingSpaces.map(renderParkingSpaceRow)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <SpaceEditModal />
    </div>
  );
};

export default ParkingLot;
