import React, { useEffect, useState } from "react";
import { LibraryRoomAPI } from "../services/AdminAPI/LibraryRoomAPI";
import * as LibraryApi from "../services/AdminAPI/LibraryAPI";
import { useAuth } from "../contexts/AuthContext";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";

const Library = () => {
  const [libraries, setLibraries] = useState([]);
  const [libraryList, setLibraryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLibrary, setEditingLibrary] = useState(null);
  const [formData, setFormData] = useState({
    roomName: "",
    status: "",
    availableTimeSlots: "",
    libraryId: "",
  });
  const { user } = useAuth();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [isTimeSlotsModalOpen, setIsTimeSlotsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadLibraries();
      fetchLibraryList();
    } else {
      setError("Please login to access libraries");
    }
  }, [user]);

  const loadLibraries = async () => {
    setLoading(true);
    try {
      const data = await LibraryRoomAPI.getAllRooms();
      setLibraries(data);
    } catch (err) {
      toast.error(
        "Failed to load libraries: " + (err.response?.data || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchLibraryList = async () => {
    try {
      const libraries = await LibraryApi.getAllLibraries();
      setLibraryList(libraries);
    } catch (err) {
      console.error("Error fetching libraries:", err);
      toast.error("Failed to load libraries");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const timeSlots = formData.availableTimeSlots
        .split(",")
        .map((slot) => slot.trim());

      if (!formData.libraryId) {
        setError("Please select a library");
        setLoading(false);
        return;
      }

      const payload = {
        roomName: formData.roomName,
        status: formData.status || "AVAILABLE",
        availableTimeSlots: timeSlots,
        library: {
          libraryID: parseInt(formData.libraryId),
          libraryName: null,
        },
      };

      console.log("Sending payload:", JSON.stringify(payload));

      if (editingLibrary) {
        await LibraryRoomAPI.updateRoom(editingLibrary.libraryRoomID, payload);
      } else {
        await LibraryRoomAPI.createRoom(payload);
      }

      await loadLibraries();
      handleCloseModal();
    } catch (err) {
      console.error("Error details:", err);
      setError(err.response?.data || err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this library room?")) {
      try {
        setLoading(true);
        await LibraryRoomAPI.deleteLibraryRoom(id);
        toast.success("Library room deleted successfully");
        loadLibraries();
      } catch (error) {
        toast.error("Failed to delete library room");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (library) => {
    setEditingLibrary(library);
    setFormData({
      roomName: library.roomName,
      status: library.status,
      availableTimeSlots: library.availableTimeSlots.join(", "),
      libraryId: library.library?.libraryID || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLibrary(null);
    setFormData({
      roomName: "",
      status: "",
      availableTimeSlots: "",
      libraryId: "",
    });
  };

  const formatTimeSlots = (slots) => {
    if (!slots || slots.length === 0) return "";
    if (slots.length <= 3) return slots.join(", ");
    return `${slots.slice(0, 3).join(", ")} ... +${slots.length - 3} more`;
  };

  const handleViewTimeSlots = (slots) => {
    setSelectedTimeSlots(slots);
    setIsTimeSlotsModalOpen(true);
  };

  const handleCloseTimeSlotsModal = () => {
    setIsTimeSlotsModalOpen(false);
    setSelectedTimeSlots([]);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Library Rooms Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <Plus size={20} />
          Add Library Room
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
                  Room Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Library
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Slots
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {libraries.map((room, index) => (
                <tr
                  key={room.libraryRoomID}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.roomName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.libraryName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{room.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        handleViewTimeSlots(room.availableTimeSlots)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      View Time Slots
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="text-blue-600 hover:text-blue-800">
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(room.libraryRoomID)}
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
              {editingLibrary ? "Edit Library Room" : "Add New Library Room"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Name
                </label>
                <input
                  type="text"
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Library
                </label>
                <select
                  name="libraryId"
                  value={formData.libraryId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required>
                  <option value="">Select Library</option>
                  {libraryList.map((library) => (
                    <option key={library.libraryID} value={library.libraryID}>
                      {library.libraryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  required>
                  <option value="">Select Status</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="MAINTENANCE">Under Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Time Slots
                </label>
                <input
                  type="text"
                  name="availableTimeSlots"
                  value={formData.availableTimeSlots}
                  onChange={handleInputChange}
                  placeholder="09:00-10:00, 10:00-11:00"
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
      {isTimeSlotsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Available Time Slots</h2>
            <div className="max-h-96 overflow-y-auto">
              <ul className="space-y-2">
                {selectedTimeSlots.map((slot, index) => (
                  <li
                    key={index}
                    className={`px-3 py-2 rounded ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-gray-300"
                    }`}>
                    {slot}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseTimeSlotsModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
