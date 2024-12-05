import React, { useState, useEffect } from "react";
import Navbar from "../components/UserNavbar";
import { useAuth } from "../contexts/AuthContext";
import { getAllLibraries } from "../services/AdminAPI/LibraryAPI";
import { LibraryRoomAPI } from "../services/AdminAPI/LibraryRoomAPI";
import { LibraryReservationAPI } from "../services/AdminAPI/LibraryReservationAPI";

function LibraryRoom() {
  const { user } = useAuth();
  const [libraries, setLibraries] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reservation form state
  const [reservationFormData, setReservationFormData] = useState({
    libraryRoomID: "",
    startTime: "",
    endTime: "",
    reservationStatus: "PENDING",
  });

  // Fetch all libraries on component mount
  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true);
      setError("");
      try {
        const librariesData = await getAllLibraries();
        setLibraries(librariesData);
      } catch (error) {
        console.error("Error fetching libraries:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  // Fetch rooms based on the selected library
  useEffect(() => {
    if (selectedLibrary) {
      const fetchRooms = async () => {
        setLoading(true);
        setError("");
        try {
          const roomsData = await LibraryRoomAPI.getRoomsByLibrary(
            selectedLibrary.libraryID
          );
          setRooms(roomsData);
        } catch (error) {
          console.error("Error fetching rooms:", error);
          setError("Failed to load rooms. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchRooms();
    }
  }, [selectedLibrary]);

  // Handle reservation form input changes
  const handleReservationInputChange = (e) => {
    const { name, value } = e.target;
    setReservationFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit reservation
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user || !user.userId) {
        setError("User not authenticated");
        return;
      }

      const payload = {
        startTime: reservationFormData.startTime,
        endTime: reservationFormData.endTime,
        status: reservationFormData.reservationStatus,
        userEntity: {
          userID: user.userId,
        },
        libraryRoomEntity: {
          libraryRoomID: parseInt(reservationFormData.libraryRoomID),
        },
      };

      await LibraryReservationAPI.createReservation(payload);

      // Reset form and show success message
      setReservationFormData({
        libraryRoomID: "",
        startTime: "",
        endTime: "",
        reservationStatus: "PENDING",
      });

      alert("Reservation created successfully!");
    } catch (error) {
      console.error("Error creating reservation:", error);
      setError(error.response?.data || "Failed to create reservation");
    } finally {
      setLoading(false);
    }
  };

  // Add this new function to handle room selection
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
    setReservationFormData(prev => ({
      ...prev,
      libraryRoomID: room.libraryRoomID.toString()
    }));
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url("/images/wallpeps.png")' }}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-maroon text-center mb-8">
            Library Room Reservations
          </h1>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-xl text-maroon">Loading...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {!selectedLibrary ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {libraries.map((library) => (
                    <div
                      key={library.libraryID}
                      onClick={() => setSelectedLibrary(library)}
                      style={{
                        backgroundImage: `url('/images/${library.libraryName.toLowerCase()}.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      className="group relative bg-white/90 rounded-lg shadow-md overflow-hidden cursor-pointer
                                 h-[280px] transform transition-all duration-300 hover:scale-105
                                 hover:shadow-xl border border-maroon/20 hover:border-gold">
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 bg-gradient-to-r from-maroon/80 to-maroon/60 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {library.libraryName}
                        </h3>
                        <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="text-gold text-sm mb-3">
                            {library.libraryDescription}
                          </p>
                          <div className="flex items-center text-white text-sm">
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              Click to view rooms
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-maroon">
                      {selectedLibrary.libraryName}
                    </h2>
                    <button
                      onClick={() => setSelectedLibrary(null)}
                      className="px-4 py-2 bg-maroon/10 text-maroon rounded-md font-semibold
                               hover:bg-maroon hover:text-white transition-colors duration-300">
                      Back to Libraries
                    </button>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Reservation Form */}
                    <div className="lg:w-1/3">
                      <div className="bg-white/90 rounded-lg shadow-lg p-6 border border-maroon/20 sticky top-24">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-2 h-8 bg-maroon rounded-full"></div>
                          <h2 className="text-2xl font-bold text-maroon">
                            Reserve Room
                          </h2>
                        </div>

                        <form
                          onSubmit={handleReservationSubmit}
                          className="space-y-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-maroon">
                              Select Room
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                              name="libraryRoomID"
                              value={reservationFormData.libraryRoomID}
                              onChange={handleReservationInputChange}
                              className="w-full p-3 border border-maroon/30 rounded-lg
                                       focus:ring-2 focus:ring-gold/50 focus:border-gold
                                       bg-white/90 backdrop-blur-sm text-maroon
                                       transition-all duration-300"
                              required>
                              <option value="" className="text-gray-500">
                                Choose a room
                              </option>
                              {rooms.map((room) => (
                                <option
                                  key={room.libraryRoomID}
                                  value={room.libraryRoomID}
                                  disabled={room.status === "BOOKED"}
                                  className={
                                    room.status === "BOOKED"
                                      ? "text-gray-400"
                                      : "text-maroon"
                                  }>
                                  {room.roomName}{" "}
                                  {room.status === "BOOKED"
                                    ? "(Unavailable)"
                                    : ""}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-maroon">
                                Start Time
                                <span className="text-red-500 ml-1">*</span>
                              </label>
                              <input
                                type="datetime-local"
                                name="startTime"
                                value={reservationFormData.startTime}
                                onChange={handleReservationInputChange}
                                className="w-full p-3 border border-maroon/30 rounded-lg
                                         focus:ring-2 focus:ring-gold/50 focus:border-gold
                                         bg-white/90 backdrop-blur-sm text-maroon
                                         transition-all duration-300"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-maroon">
                                End Time
                                <span className="text-red-500 ml-1">*</span>
                              </label>
                              <input
                                type="datetime-local"
                                name="endTime"
                                value={reservationFormData.endTime}
                                onChange={handleReservationInputChange}
                                className="w-full p-3 border border-maroon/30 rounded-lg
                                         focus:ring-2 focus:ring-gold/50 focus:border-gold
                                         bg-white/90 backdrop-blur-sm text-maroon
                                         transition-all duration-300"
                                required
                              />
                            </div>
                          </div>

                          <div className="pt-4">
                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-maroon text-white py-3 rounded-lg font-semibold
                                       hover:bg-gold hover:text-maroon transition-all duration-300
                                       disabled:bg-gray-400 disabled:hover:bg-gray-400 
                                       disabled:text-gray-200 disabled:cursor-not-allowed
                                       transform hover:scale-[1.02] active:scale-[0.98]">
                              {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                  <svg
                                    className="animate-spin h-5 w-5"
                                    viewBox="0 0 24 24">
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                  <span>Processing...</span>
                                </span>
                              ) : (
                                "Confirm Reservation"
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Rooms Display */}
                    <div className="lg:w-2/3">
                      {rooms.length > 0 ? (
                        <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {rooms.map((room) => (
                              <div
                                key={room.libraryRoomID}
                                onClick={() => handleRoomClick(room)}
                                className={`relative rounded-lg overflow-hidden cursor-pointer
                                           border transition-all duration-300 h-[180px]
                                           bg-gradient-to-br from-maroon to-maroon/80 group
                                           ${reservationFormData.libraryRoomID === room.libraryRoomID.toString()
                                             ? 'border-gold shadow-md'
                                             : 'border-maroon/20 hover:border-gold/50'}`}>
                                <div className="relative h-full p-4 flex flex-col justify-between z-10">
                                  <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-white">
                                      {room.roomName}
                                    </h3>
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium
                                                    ${room.status === "BOOKED"
                                                      ? "bg-red-100 text-red-800"
                                                      : "bg-green-100 text-green-800"
                                                    }`}>
                                      {room.status}
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="text-sm text-white">
                                      <span className="font-medium">Capacity:</span>{" "}
                                      {room.capacity} persons
                                    </div>

                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                                                  flex items-center justify-center transition-opacity duration-300">
                                      <span className="text-white font-medium flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        View Timeslots
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-maroon/60">
                          No rooms available in this library at the moment.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Add the Modal component */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-maroon">{selectedRoom.roomName} Schedule</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-maroon hover:text-gold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-maroon/10 p-3 rounded-lg">
                  <span className="font-semibold text-maroon">Capacity:</span>
                  <span className="ml-2">{selectedRoom.capacity} persons</span>
                </div>
                <div className="bg-maroon/10 p-3 rounded-lg">
                  <span className="font-semibold text-maroon">Status:</span>
                  <span className={`ml-2 ${selectedRoom.status === "BOOKED" ? "text-red-600" : "text-green-600"}`}>
                    {selectedRoom.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-maroon mb-3">Available Time Slots:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedRoom.availableTimeSlots?.map((timeSlot, index) => (
                    <div key={index} className="bg-maroon/10 text-maroon p-2 rounded-lg text-center">
                      {timeSlot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LibraryRoom;
