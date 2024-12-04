import React, { useState, useEffect } from 'react';
import { getAllRooms } from '../services/UserAPI/RoomAPI';
import { getAllBuildings } from '../services/UserAPI/BuildingAPI';

const Buildings = () => {
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [roomCountByBuilding, setRoomCountByBuilding] = useState({}); // State for room counts per building

  // Fetch all rooms and buildings on component mount
  useEffect(() => {
    const fetchRoomsAndBuildings = async () => {
      try {
        const roomData = await getAllRooms();
        const buildingData = await getAllBuildings();

        if (roomData) {
          setRooms(roomData);

          // Calculate room count per building
          const countByBuilding = roomData.reduce((acc, room) => {
            const buildingName = room.building.buildingName; // Assumes room object has building reference
            acc[buildingName] = (acc[buildingName] || 0) + 1;
            return acc;
          }, {});

          setRoomCountByBuilding(countByBuilding);
        }

        if (buildingData) {
          setBuildings(buildingData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchRoomsAndBuildings();
  }, []);

  return (
    <div>
      <h1>Building and Room List</h1>

      {/* List of buildings with room count */}
      <h2>Buildings</h2>
      <ul>
        {buildings.map((building) => (
          <li key={building.id}>
            <strong>Name:</strong> {building.buildingName} <br />
            <strong>Floors:</strong> {building.floors} <br />
            <strong>Total Rooms:</strong>{' '}
            {roomCountByBuilding[building.buildingName] || 0} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Buildings;

