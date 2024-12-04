import React, { useState, useEffect } from 'react';
import { getBuildingById, getTotalOccupants } from '../services/UserAPI/BuildingAPI';
import { getAllRooms } from '../services/UserAPI/RoomAPI';

const BuildingsNGE = () => {
  const [buildingDetails, setBuildingDetails] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [totalOccupants, setTotalOccupants] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(1); // Default to Floor 1

  useEffect(() => {
    const fetchBuildingAndRooms = async () => {
      try {
        const building = await getBuildingById(3); // Fetch building details for NGE (Assume ID 4)
        setBuildingDetails(building);

        const occupants = await getTotalOccupants(3); // Fetch total occupants for NGE
        setTotalOccupants(occupants);

        const roomsData = await getAllRooms(); // Fetch all rooms
        const filteredRooms = roomsData.filter(
          (room) => room.building.buildingName === 'NGE' // Filter for NGE rooms
        );
        setRooms(filteredRooms);
      } catch (error) {
        console.error('Error fetching building or rooms for NGE:', error);
      }
    };

    fetchBuildingAndRooms();
  }, []);

  // Function to generate room name based on floor number and index
  const generateRoomName = (floorNumber, index) => {
    return `NGE${floorNumber}0${index}`; // Example: NGE100, NGE101, etc.
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
      <h1>New Gonzaga Environment Building (NGE)</h1>

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

      <h2>Rooms in NGE</h2>
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

export default BuildingsNGE;
