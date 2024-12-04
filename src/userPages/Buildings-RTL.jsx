import React, { useState, useEffect } from 'react';
import { getBuildingById, getTotalOccupants } from '../services/UserAPI/BuildingAPI';
import { getAllRooms } from '../services/UserAPI/RoomAPI';

const BuildingsRTL = () => {
  const [buildingDetails, setBuildingDetails] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [totalOccupants, setTotalOccupants] = useState(null);

  useEffect(() => {
    const fetchBuildingAndRooms = async () => {
      try {
        // Fetch building details for RTL (e.g., Building ID is 3)
        const building = await getBuildingById(2); // Assume Building ID 3 for RTL
        setBuildingDetails(building);
        
        // Fetch total occupants for the building
        const occupants = await getTotalOccupants(2);
        setTotalOccupants(occupants);

        // Fetch rooms associated with the building
        const roomsData = await getAllRooms();
        setRooms(roomsData);  // If you need rooms specific to the building, adjust API accordingly
      } catch (error) {
        console.error('Error fetching building or rooms for RTL:', error);
      }
    };

    fetchBuildingAndRooms();
  }, []);

  return (
    <div>
      <h1>Building RTL Details</h1>

      {buildingDetails && (
        <div>
          <h2>{buildingDetails.buildingName}</h2>
          <p>{buildingDetails.location}</p>
          <p>Total Occupants: {totalOccupants}</p>
        </div>
      )}

      <h2>Rooms in RTL</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <strong>{room.roomType}</strong><br />
            Capacity: {room.capacity}<br />
            Current Capacity: {room.currentCapacity}<br />
            Availability Status: {room.availabilityStatus}<br />
            Floor Number: {room.floorNumber}<br />
            Building: {room.building.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuildingsRTL;
