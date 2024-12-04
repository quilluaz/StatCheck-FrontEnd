import React, { useState, useEffect } from "react";
import Navbar from "../components/UserNavbar";
import { getAllLibraries } from "../services/AdminAPI/LibraryAPI";
import { LibraryRoomAPI } from "../services/AdminAPI/LibraryRoomAPI";
import { LibraryReservationAPI } from "../services/AdminAPI/LibraryReservationAPI";

function LibraryRoom() {
  const [libraries, setLibraries] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState(null);

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
          const roomsData = await LibraryRoomAPI.getRoomsByLibrary(selectedLibrary.libraryID);
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
      const payload = {
        startTime: reservationFormData.startTime,
        endTime: reservationFormData.endTime,
        status: reservationFormData.reservationStatus,
        userEntity: {
          userID: 1, // Hardcoded userID
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

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `url('/images/wallpeps.png')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      <main
        className="flex-grow container mx-auto px-4 py-8"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="bg-white rounded-lg shadow-lg p-6"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            maxWidth: "1200px",
            width: "100%",
          }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Library Room Reservations
          </h1>

          {loading && (
            <div className="flex justify-center items-center min-h-screen text-xl">
              Loading...
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="flex">
              <div className="w-1/3 pr-4">
                <h2 className="text-2xl font-semibold mb-4">Make a Reservation</h2>

                {selectedLibrary ? (
                  <form onSubmit={handleReservationSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Library Room</label>
                      <select
                        name="libraryRoomID"
                        value={reservationFormData.libraryRoomID}
                        onChange={handleReservationInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                        required
                      >
                        <option value="">Select Room</option>
                        {rooms.map((room) => (
                          <option key={room.libraryRoomID} value={room.libraryRoomID}>
                            {room.roomName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Time</label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={reservationFormData.startTime}
                        onChange={handleReservationInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Time</label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        value={reservationFormData.endTime}
                        onChange={handleReservationInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                      disabled={loading}
                    >
                      {loading ? "Creating Reservation..." : "Create Reservation"}
                    </button>
                  </form>
                ) : (
                  <p className="text-gray-500">Select a library to make a reservation</p>
                )}
              </div>

              <div className="w-2/3 pl-4">
                {!selectedLibrary && libraries.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-center">Select a Library</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {libraries.map((library) => (
                        <div
                          key={library.libraryID}
                          className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
                          onClick={() => setSelectedLibrary(library)}
                        >
                          <img
                            src={library.image || "/images/default-library.jpg"}
                            alt={library.libraryName}
                            className="w-full h-32 object-cover rounded-md mb-4"
                          />
                          <h3 className="text-lg font-semibold text-center">
                            {library.libraryName}
                          </h3>
                          <p className="text-gray-600 text-center">
                            {library.libraryDescription}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLibrary && rooms.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                      Rooms in {selectedLibrary.libraryName}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {rooms.map((room) => (
                        <div
                          key={room.libraryRoomID}
                          className="bg-white rounded-lg shadow-md p-4"
                        >
                          <h3 className="text-lg font-semibold text-center">{room.roomName}</h3>
                          <p className="text-gray-600 text-center">
                            Available Slots: {room.availableTimeSlots.join(", ")}
                          </p>
                          <p className="text-gray-600 text-center">
                            Booking Status: {room.status ? "Booked" : "Available"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLibrary && rooms.length === 0 && (
                  <div className="text-center py-4">
                    No rooms available in this library at the moment.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default LibraryRoom;
