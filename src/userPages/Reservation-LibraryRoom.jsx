import React, { useState, useEffect } from "react";
import Navbar from "../components/UserNavbar";
import { getAllLibraries } from "../services/AdminAPI/LibraryAPI"; // Adjusted import for libraries
import { LibraryRoomAPI } from "../services/AdminAPI/LibraryRoomAPI"; // Import LibraryRoomAPI

function LibraryRoom() {
  const [libraries, setLibraries] = useState([]); // To store libraries
  const [rooms, setRooms] = useState([]); // To store rooms for the selected library
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState(null); // To track selected library

  // Fetch all libraries on component mount
  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true);
      setError(""); // Clear any previous error
      try {
        const librariesData = await getAllLibraries(); // Fetch libraries
        setLibraries(librariesData);
      } catch (error) {
        console.error("Error fetching libraries:", error);
        setError("Failed to load libraries. Please try again later.");
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
        setError(""); // Clear any previous error
        try {
          const roomsData = await LibraryRoomAPI.getRoomsByLibrary(selectedLibrary.libraryID); // Fetch rooms based on libraryID
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
  }, [selectedLibrary]); // Trigger fetching rooms when selectedLibrary changes

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

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">Library Rooms</h1>

          {/* Show loading state */}
          {loading && (
            <div className="flex justify-center items-center min-h-screen text-xl">
              Loading...
            </div>
          )}

          {/* Show error if any */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Show libraries list if not loading */}
          {!loading && !error && libraries.length > 0 && !selectedLibrary && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Available Libraries</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {libraries.map((library) => (
                  <div
                    key={library.libraryID}
                    className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
                    onClick={() => setSelectedLibrary(library)} // Set selected library on click
                  >
                    {/* Library Image */}
                    <img
                      src={library.image || '/images/default-library.jpg'} // Fallback image if no image exists
                      alt={library.libraryName}
                      className="w-full h-32 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-semibold">{library.libraryName}</h3>
                    <p className="text-gray-600">{library.libraryDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show rooms for the selected library */}
          {!loading && !error && selectedLibrary && rooms.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Rooms in {selectedLibrary.libraryName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {rooms.map((room) => (
                  <div
                    key={room.libraryRoomID}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <h3 className="text-lg font-semibold">{room.roomName}</h3>
                    <p className="text-gray-600">
                      Available Slots: {room.availableTimeSlots.join(", ")}
                    </p>
                    <p className="text-gray-600">
                      Booking Status: {room.status ? "Booked" : "Available"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No rooms available in the selected library */}
          {!loading && !error && selectedLibrary && rooms.length === 0 && (
            <div className="text-center py-4">No rooms available in this library at the moment.</div>
          )}

          {/* No libraries available */}
          {!loading && !error && libraries.length === 0 && !selectedLibrary && (
            <div className="text-center py-4">No libraries available at the moment.</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default LibraryRoom;
