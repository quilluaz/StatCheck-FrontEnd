import React, { useState, useEffect } from "react";
import SubjectsAPI from "../services/AdminAPI/SubjectsAPI";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

const SubjectComponent = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({
    subjectId: null,
    subjectName: "",
    section: "",
    instructor: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      console.log('Starting to fetch subjects...');
      const data = await SubjectsAPI.getAllSubjects();
      console.log('Fetched subjects data:', data);
      setSubjects(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error in fetchSubjects:', err);
      if (err.response?.status === 401) {
        setError("Unauthorized access. Please ensure you are logged in as an admin.");
      } else if (err.response?.status === 403) {
        setError("Forbidden access. You don't have permission to view subjects.");
      } else {
        setError("Failed to fetch subjects. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSubject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await SubjectsAPI.updateSubject(currentSubject.subjectId, currentSubject);
        toast.success("Subject updated successfully");
      } else {
        await SubjectsAPI.createSubject(currentSubject);
        toast.success("Subject created successfully");
      }
      await fetchSubjects();
      handleCloseModal();
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Unauthorized access. Please ensure you are logged in as an admin.");
      } else {
        toast.error(isEditing ? "Failed to update subject" : "Failed to create subject");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (subject) => {
    setCurrentSubject({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      section: subject.section,
      instructor: subject.instructor,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      setIsLoading(true);
      try {
        await SubjectsAPI.deleteSubject(id);
        await fetchSubjects();
        toast.success("Subject deleted successfully");
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Unauthorized access. Please ensure you are logged in as an admin.");
        } else {
          toast.error("Failed to delete subject");
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentSubject({
      subjectId: null,
      subjectName: "",
      section: "",
      instructor: "",
    });
    setError(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subjects Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Plus size={20} />
          Add Subject
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.subjectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{subject.subjectId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{subject.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{subject.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{subject.instructor}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(subject)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(subject.subjectId)}
                        className="text-red-600 hover:text-red-800"
                      >
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
              {isEditing ? "Edit Subject" : "Add New Subject"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject Name
                </label>
                <input
                  type="text"
                  name="subjectName"
                  value={currentSubject.subjectName}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Section
                </label>
                <input
                  type="text"
                  name="section"
                  value={currentSubject.section}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instructor
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={currentSubject.instructor}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectComponent;
