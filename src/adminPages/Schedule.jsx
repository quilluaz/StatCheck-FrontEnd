import React, { useState, useEffect } from "react";
import { ScheduleAPI } from "../services/AdminAPI/ScheduleAPI";
import { Pencil, Trash, Plus } from "lucide-react";
import { RoomAPI } from "../services/AdminAPI/RoomAPI";
import SubjectsAPI from "../services/AdminAPI/SubjectsAPI";
import { toast } from "react-toastify";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState({
    scheduleId: null,
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    roomEntity: "",
    subjectEntity: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetchSubjects();
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await ScheduleAPI.getAllSchedules();
      setSchedules(data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await RoomAPI.getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await SubjectsAPI.getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentSchedule({
      scheduleId: null,
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      roomEntity: "",
      subjectEntity: ""
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const scheduleData = {
        dayOfWeek: currentSchedule.dayOfWeek,
        startTime: `${today}T${currentSchedule.startTime}:00`,
        endTime: `${today}T${currentSchedule.endTime}:00`,
        roomEntity: { roomId: currentSchedule.roomEntity },
        subjectEntity: { subjectId: currentSchedule.subjectEntity }
      };

      if (isEditing) {
        await ScheduleAPI.updateSchedule(currentSchedule.scheduleId, scheduleData);
        toast.success("Schedule updated successfully");
      } else {
        await ScheduleAPI.createSchedule(scheduleData);
        toast.success("Schedule created successfully");
      }
      
      await loadSchedules();
      handleCloseModal();
      
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    setCurrentSchedule({
      scheduleId: schedule.scheduleId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      endTime: new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      roomEntity: schedule.roomEntity?.roomId,
      subjectEntity: schedule.subjectEntity?.subjectId
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await ScheduleAPI.deleteSchedule(id);
        toast.success("Schedule deleted successfully");
        loadSchedules();
      } catch (error) {
        toast.error("Failed to delete schedule");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <Plus size={20} />
          Add Schedule
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.scheduleId}>
                  <td className="px-6 py-4 whitespace-nowrap">{schedule.scheduleId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{schedule.dayOfWeek}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {`${schedule.roomEntity?.building?.buildingName || ''} - Room ${schedule.roomEntity?.roomId || ''}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {`${schedule.subjectEntity?.subjectName || ''} (${schedule.subjectEntity?.section || ''})`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="text-blue-600 hover:text-blue-800">
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.scheduleId)}
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
              {isEditing ? "Edit Schedule" : "Add New Schedule"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Day of Week
                </label>
                <select
                  name="dayOfWeek"
                  value={currentSchedule.dayOfWeek}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required>
                  <option value="">Select a day</option>
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                  <option value="SATURDAY">Saturday</option>
                  <option value="SUNDAY">Sunday</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={currentSchedule.startTime || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={currentSchedule.endTime || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room
                </label>
                <select
                  name="roomEntity"
                  value={currentSchedule.roomEntity || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required>
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room.roomId} value={room.roomId}>
                      {`${room.building?.buildingName || ''} - Room ${room.roomId} (${room.roomType})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  name="subjectEntity"
                  value={currentSchedule.subjectEntity || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required>
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.subjectId} value={subject.subjectId}>
                      {`${subject.subjectName} (${subject.section}) - ${subject.instructor}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
    </div>
  );
};

export default Schedule;
