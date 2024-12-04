import React, { useState, useEffect } from 'react';
import { getBuildingById, getTotalOccupants } from '../services/UserAPI/BuildingAPI';
import { getAllRooms } from '../services/UserAPI/RoomAPI';

const BuildingsRTL = () => {
  const [buildingDetails, setBuildingDetails] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [totalOccupants, setTotalOccupants] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(1); // New state for selected floor

  useEffect(() => {
    const fetchBuildingAndRooms = async () => {
      try {
        const building = await getBuildingById(2); // Fetch building details for RTL
        setBuildingDetails(building);

        const occupants = await getTotalOccupants(2); // Fetch total occupants
        setTotalOccupants(occupants);

        const roomsData = await getAllRooms(); // Fetch all rooms
        const filteredRooms = roomsData.filter(
          (room) => room.building.buildingName === 'RTL' // Filter for RTL rooms
        );
        setRooms(filteredRooms);
      } catch (error) {
        console.error('Error fetching building or rooms for RTL:', error);
      }
    };

    fetchBuildingAndRooms();
  }, []);

  // Function to generate room name based on floor number and index
  const generateRoomName = (floorNumber, index) => {
    return `RTL${floorNumber}0${index}`; // Example: RTL100, RTL101, etc.
  };

  // Handle dropdown change
  const handleFloorChange = (event) => {
    setSelectedFloor(event.target.value);
  };

  // Filter rooms based on selected floor
  const filteredRooms = selectedFloor === 'All'
    ? rooms
    : rooms.filter((room) => room.floorNumber === parseInt(selectedFloor));

  return (
    <div>
      <h1>Don Rodulfo T. Lizarres Building (RTL)</h1>

      {buildingDetails && (
        <div>
          <h2>{buildingDetails.buildingName}</h2>
          <p>{buildingDetails.location}</p>
          <p>Total Occupants: {totalOccupants}</p>
        </div>
      )}

      {/* Dropdown to select floor */}
      <div>
        <label htmlFor="floorSelect">Select Floor: </label>
        <select id="floorSelect" value={selectedFloor} onChange={handleFloorChange}>
          <option value="All">All Floors</option>
          {[...new Set(rooms.map((room) => room.floorNumber))].map((floor) => (
            <option key={floor} value={floor}>
              Floor {floor}
            </option>
          ))}
        </select>
      </div>

      <h2>Rooms in RTL</h2>
      <ul>
        {filteredRooms.map((room, index) => (
          <li key={room.id}>
            <strong>{generateRoomName(room.floorNumber, index + 1)}</strong><br />
            Room Type: {room.roomType}<br />
            Capacity: {room.capacity}<br />
            Current Capacity: {room.currentCapacity}<br />
            Availability Status: {room.availabilityStatus}<br />
            Floor Number: {room.floorNumber}<br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuildingsRTL;



