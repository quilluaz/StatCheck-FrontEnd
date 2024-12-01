import React, { useState, useEffect } from "react";
import * as LibraryApi from '../services/AdminAPI/LibraryAPI';
import { Pencil, Trash2, Plus } from "lucide-react";

const Library = () => {
  const [libraries, setLibraries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLibrary, setEditingLibrary] = useState(null);
  const [formData, setFormData] = useState({
    libraryName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      setLoading(true);
      const data = await LibraryApi.getAllLibraries();
      setLibraries(data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized access. Please ensure you are logged in as an admin.");
      } else {
        setError("Failed to fetch libraries. Please try again later.");
      }
    } finally {
      setLoading(false);
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
    try {
      setLoading(true);
      if (editingLibrary) {
        await LibraryApi.updateLibrary(editingLibrary.libraryID, formData);
      } else {
        await LibraryApi.createLibrary(formData);
      }
      await fetchLibraries();
      handleCloseModal();
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized access. Please ensure you are logged in as an admin.");
      } else {
        setError(editingLibrary ? "Failed to update library" : "Failed to create library");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this library?")) {
      try {
        setLoading(true);
        await LibraryApi.deleteLibrary(id);
        await fetchLibraries();
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Unauthorized access. Please ensure you are logged in as an admin.");
        } else {
          setError("Failed to delete library");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (library) => {
    setEditingLibrary(library);
    setFormData({
      libraryName: library.libraryName,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLibrary(null);
    setFormData({ libraryName: "" });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Libraries</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <Plus size={20} />
          Add Library
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
                  Library ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Library Name
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
              {libraries.map((library) => (
                <tr key={library.libraryID}>
                  <td className="px-6 py-4 whitespace-nowrap">{library.libraryID}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{library.libraryName}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {library.libraryRooms.map((room, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {room.roomName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(library)}
                        className="text-blue-600 hover:text-blue-800">
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(library.libraryID)}
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
              {editingLibrary ? "Edit Library" : "Add New Library"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Library Name
                </label>
                <input
                  type="text"
                  name="libraryName"
                  value={formData.libraryName}
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

export default Library;
