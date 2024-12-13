import React, { useState, useEffect } from "react";
import Navbar from "../components/UserNavbar";
import { useAuth } from "../contexts/AuthContext";
import { getAllLibraries } from "../services/AdminAPI/LibraryAPI";
import { LibraryRoomAPI } from "../services/AdminAPI/LibraryRoomAPI";
import { LibraryReservationAPI } from "../services/AdminAPI/LibraryReservationAPI";
import { toast } from "react-toastify";

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
        toast.error("Failed to load data. Please try again later.");
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
          toast.error("Failed to load rooms. Please try again later.");
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

  const handleRoomSelection = (room) => {
    setSelectedRoom(room);
    setReservationFormData(prev => ({
      ...prev,
      libraryRoomID: room.libraryRoomID
    }));
  };

  // Submit reservation
  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const reservationPayload = {
        libraryRoomEntity: {
          libraryRoomID: selectedRoom.libraryRoomID
        },
        userEntity: {
          userID: user.userId
        },
        startTime: reservationFormData.startTime,
        endTime: reservationFormData.endTime,
        status: reservationFormData.reservationStatus
      };

      console.log("Sending reservation payload:", reservationPayload);

      await LibraryReservationAPI.createReservation(reservationPayload);
      
      toast.success("Reservation created successfully!");
      setIsModalOpen(false);
      setReservationFormData({
        libraryRoomID: "",
        startTime: "",
        endTime: "",
        reservationStatus: "PENDING",
      });
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error(error.message || "Failed to create reservation");
    } finally {
      setLoading(false);
    }
  };

  // Add this function right after handleReservation
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
                          onSubmit={handleReservation}
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

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-maroon text-white rounded-lg font-semibold
                                     hover:bg-maroon/90 focus:ring-2 focus:ring-gold/50
                                     transition-all duration-300 disabled:opacity-50
                                     disabled:cursor-not-allowed">
                            {loading ? "Processing..." : "Reserve Room"}
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Room Grid */}
                    <div className="lg:w-2/3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {rooms.map((room) => (
                          <div
                            key={room.libraryRoomID}
                            onClick={() => handleRoomClick(room)}
                            className={`bg-white/90 rounded-lg shadow-md p-6 cursor-pointer
                                      transform transition-all duration-300 hover:scale-[1.02]
                                      border ${
                                        selectedRoom?.libraryRoomID ===
                                        room.libraryRoomID
                                          ? "border-gold"
                                          : "border-maroon/20"
                                      }`}>
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-bold text-maroon">
                                {room.roomName}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium
                                          ${
                                            room.status === "AVAILABLE"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-red-100 text-red-800"
                                          }`}>
                                {room.status}
                              </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <p className="flex items-center">
                                <svg
                                  className="w-4 h-4 mr-2 text-maroon"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Available Time Slots: {room.availableTimeSlots?.length || 0}
                              </p>
                            </div>

                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRoomSelection(room);
                                }}
                                className="text-maroon hover:text-gold transition-colors duration-300">
                                Select Room →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-maroon">
                {selectedRoom.roomName} Details
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-maroon">
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

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-maroon">Status:</span>{" "}
                  <span
                    className={
                      selectedRoom.status === "AVAILABLE"
                        ? "text-green-600"
                        : "text-red-600"
                    }>
                    {selectedRoom.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-maroon mb-2">
                  Available Time Slots:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedRoom.availableTimeSlots?.map((slot, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-2 rounded text-sm text-center">
                      {slot}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-maroon bg-gray-100 rounded-lg
                           hover:bg-gray-200 transition-colors duration-300">
                  Close
                </button>
                <button
                  onClick={() => {
                    handleRoomSelection(selectedRoom);
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-maroon text-white rounded-lg
                           hover:bg-maroon/90 transition-colors duration-300">
                  Select Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LibraryRoom;
