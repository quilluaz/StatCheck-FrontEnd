import React, { useState, useEffect } from "react";
import {
  getBuildingById,
  getTotalOccupants,
} from "../services/UserAPI/BuildingAPI";
import { getAllRooms } from "../services/UserAPI/RoomAPI";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import RoomsDetails from "../components/RoomsDetails";
import { ChevronDown } from "lucide-react";

const BuildingDetails = () => {
  const { buildingName } = useParams();
  const [buildingDetails, setBuildingDetails] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [buildingStats, setBuildingStats] = useState({
    totalRooms: 0,
    totalCapacity: 0,
    totalCurrentOccupants: 0,
    occupancyRate: 0,
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isFloorDropdownOpen, setIsFloorDropdownOpen] = useState(false);

  const buildingIds = {
    gle: 1,
    rtl: 2,
    nge: 3,
  };

  const fetchBuildingAndRooms = async () => {
    try {
      const buildingId = buildingIds[buildingName.toLowerCase()];
      const building = await getBuildingById(buildingId);
      setBuildingDetails(building);

      const roomsData = await getAllRooms();
      const filteredRooms = roomsData.filter(
        (room) =>
          room.building.buildingName.toLowerCase() ===
          buildingName.toLowerCase()
      );
      setRooms(filteredRooms);

      // Calculate building statistics
      const stats = filteredRooms.reduce(
        (acc, room) => {
          acc.totalCapacity += room.capacity;
          acc.totalCurrentOccupants += room.currentCapacity;
          return acc;
        },
        {
          totalRooms: filteredRooms.length,
          totalCapacity: 0,
          totalCurrentOccupants: 0,
        }
      );

      stats.occupancyRate =
        (stats.totalCurrentOccupants / stats.totalCapacity) * 100;
      setBuildingStats(stats);
    } catch (error) {
      console.error(
        `Error fetching building or rooms for ${buildingName}:`,
        error
      );
    }
  };

  useEffect(() => {
    fetchBuildingAndRooms();
  }, [buildingName]);

  const handleFloorChange = (floor) => {
    setSelectedFloor(floor);
    setIsFloorDropdownOpen(false);
  };

  const filteredRooms = selectedFloor === 'All' 
    ? rooms 
    : rooms.filter((room) => room.floorNumber === selectedFloor);

  const generateRoomName = (floorNumber, index) => {
    return `${buildingName.toUpperCase()}${floorNumber}0${index + 1}`;
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleCapacityUpdate = async () => {
    await fetchBuildingAndRooms();

    // Find and update the selected room data
    if (selectedRoom) {
      const updatedRooms = await getAllRooms();
      const updatedRoom = updatedRooms.find(
        (room) => room.roomId === selectedRoom.roomId
      );
      if (updatedRoom) {
        setSelectedRoom(updatedRoom);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url("/images/wallpeps.png")' }}>
      <UserNavbar />

      <main className="flex-grow px-4 py-8">
        <div className="container mx-auto">
          {/* Building Title */}
          <h1 className="text-3xl font-bold mb-8 text-white text-center drop-shadow-lg">
            {buildingDetails?.buildingName} Building
          </h1>

          {/* Building Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-maroon mb-2">
                Total Rooms
              </h3>
              <p className="text-2xl font-bold text-gold">
                {buildingStats.totalRooms}
              </p>
            </div>
            <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-maroon mb-2">
                Total Floors
              </h3>
              <p className="text-2xl font-bold text-gold">
                {buildingDetails?.floors}
              </p>
            </div>
            <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-maroon mb-2">
                Student Count
              </h3>
              <p className="text-2xl font-bold text-gold">
                {buildingStats.totalCurrentOccupants}
              </p>
            </div>
            <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-maroon mb-2">
                Occupancy Rate
              </h3>
              <p className="text-2xl font-bold text-gold">
                {buildingStats.occupancyRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Floor Selection and Rooms Display */}
          <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow p-6">
            <div className="mb-6 flex justify-end">
              <div className="relative">
                <button
                  onClick={() => setIsFloorDropdownOpen(!isFloorDropdownOpen)}
                  className="flex items-center px-4 py-2 text-maroon font-bold border border-maroon rounded-md
                           hover:text-gold hover:border-gold transition-colors">
                  Select Floor: {selectedFloor === 'All' ? 'All Floors' : `Floor ${selectedFloor}`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                
                {isFloorDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-10">
                    <div className="py-1 max-h-[40vh] overflow-y-auto">
                      <button
                        onClick={() => handleFloorChange('All')}
                        className="block w-full px-4 py-2 text-sm text-maroon hover:bg-maroon hover:text-white transition-colors duration-300 text-left">
                        All Floors
                      </button>
                      {[...Array(buildingDetails?.floors || 0)].map((_, index) => (
                        <button
                          key={`floor-${index + 1}`}
                          onClick={() => handleFloorChange(index + 1)}
                          className="block w-full px-4 py-2 text-sm text-maroon hover:bg-maroon hover:text-white transition-colors duration-300 text-left">
                          Floor {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.roomId}
                  className="bg-white/80 rounded-lg p-4 cursor-pointer 
                           hover:bg-primary-50/90 transition-all duration-300 
                           border border-gray-200 hover:border-primary-300
                           hover:shadow-lg hover:scale-105"
                  onClick={() => handleRoomClick(room)}>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Room {generateRoomName(room.floorNumber, room.roomId)}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Type: {room.roomType}</p>
                    <p>
                      Occupancy: {room.currentCapacity}/{room.capacity}
                    </p>
                    <p
                      className={`font-medium ${
                        room.availabilityStatus === "AVAILABLE"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                      {room.availabilityStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {selectedRoom && (
        <RoomsDetails
          room={selectedRoom}
          onClose={handleCloseModal}
          onCapacityUpdate={handleCapacityUpdate}
        />
      )}
    </div>
  );
};

export default BuildingDetails;
