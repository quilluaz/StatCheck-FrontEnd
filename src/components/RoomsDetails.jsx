import React, { useState, useEffect } from "react";
import { updateRoomCapacity } from "../services/UserAPI/RoomAPI";

const RoomsDetails = ({ room, onClose, onCapacityUpdate }) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulesByDay, setSchedulesByDay] = useState({});

  useEffect(() => {
    if (room.schedules) {
      const days = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ];
      const grouped = days.reduce((acc, day) => {
        acc[day] =
          room.schedules.filter((schedule) => schedule.dayOfWeek === day) || [];
        return acc;
      }, {});
      setSchedulesByDay(grouped);
    }
  }, [room.schedules]);

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleIncreaseCapacity = async () => {
    try {
      const updatedCapacity = room.currentCapacity + 1;
      if (updatedCapacity <= room.capacity) {
        await updateRoomCapacity(room.roomId, updatedCapacity);
        if (onCapacityUpdate) {
          onCapacityUpdate();
        }
      }
    } catch (error) {
      console.error("Error updating capacity:", error);
    }
  };

  return (
    <>
      {/* Room Details Modal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg w-[800px] min-h-[400px] p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-maroon">Room Details</h2>
            <button
              onClick={onClose}
              className="text-maroon hover:text-gold transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 border-r border-maroon/20 pr-6">
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="w-full bg-maroon text-gold py-3 px-4 rounded-lg
                         hover:bg-gold hover:text-maroon transition-all duration-300
                         font-semibold">
                View Schedule
              </button>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-maroon">
                    Status
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                                ${
                                  room.availabilityStatus === "AVAILABLE"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                    {room.availabilityStatus}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-maroon">
                    Capacity
                  </h3>
                  <p className="text-gray-700">
                    Current: {room.currentCapacity} / Maximum: {room.capacity}
                  </p>
                </div>

                <button
                  onClick={handleIncreaseCapacity}
                  disabled={room.currentCapacity >= room.capacity}
                  className="w-full bg-maroon text-gold py-2 px-4 rounded-lg
                           hover:bg-gold hover:text-maroon transition-all duration-300
                           font-semibold disabled:bg-gray-400 disabled:text-gray-600 
                           disabled:cursor-not-allowed">
                  Increase Occupancy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsScheduleModalOpen(false);
            }
          }}>
          <div className="bg-white rounded-lg w-[90vw] max-h-[80vh] p-6 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Weekly Schedule</h2>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-gray-500 hover:text-gray-700">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-4">
              {Object.entries(schedulesByDay).map(([day, schedules]) => (
                <div key={day} className="border rounded-lg p-4">
                  <h3 className="font-bold text-center mb-3">{day}</h3>
                  <div className="space-y-2">
                    {schedules.length > 0 ? (
                      schedules.map((schedule, index) => (
                        <div
                          key={`${day}-${index}`}
                          className="bg-gray-50 p-2 rounded text-sm">
                          <p className="font-semibold">
                            {formatTime(schedule.startTime)} -{" "}
                            {formatTime(schedule.endTime)}
                          </p>
                          <p>{schedule.subjectEntity?.subjectName}</p>
                          <p className="text-gray-500">
                            Section: {schedule.subjectEntity?.section}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">No schedules</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomsDetails;
