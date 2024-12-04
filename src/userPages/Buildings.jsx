import React, { useState, useEffect } from 'react';
import { getAllRooms, getRoomById } from '../services/UserAPI/RoomAPI';
import { getAllBuildings, getBuildingById, getTotalOccupants } from '../services/UserAPI/BuildingAPI';

const Buildings = () => {
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [totalOccupants, setTotalOccupants] = useState(null);

  // Fetch all rooms and buildings on component mount
  useEffect(() => {
    const fetchRoomsAndBuildings = async () => {
      try {
        const roomData = await getAllRooms();
        if (roomData) {
          setRooms(roomData);
        }

        const buildingData = await getAllBuildings();
        if (buildingData) {
          setBuildings(buildingData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchRoomsAndBuildings();
  }, []);

  // Fetch a room by ID (for displaying details)
  const handleFetchRoom = async (roomId) => {
    try {
      const room = await getRoomById(roomId);
      setSelectedRoom(room);
    } catch (error) {
      console.error(`Failed to fetch room with ID ${roomId}:`, error);
    }
  };

  // Fetch a building by ID (for displaying details)
  const handleFetchBuilding = async (buildingID) => {
    try {
      const building = await getBuildingById(buildingID);
      setSelectedBuilding(building);

      // Fetch the total occupants of the selected building
      const occupantsData = await getTotalOccupants(buildingID);
      if (occupantsData && occupantsData.totalOccupants !== undefined) {
        setTotalOccupants(occupantsData.totalOccupants);
      } else {
        setTotalOccupants('N/A'); // Handle case if no data is returned
      }
    } catch (error) {
      console.error(`Failed to fetch building with ID ${buildingID}:`, error);
    }
  };

  return (
    <div>
      <h1>Building and Room List</h1>

      {/* List of buildings */}
      <h2>Buildings</h2>
      <ul>
        {buildings.map((building) => (
          <li key={building.id}> {/* Adjust the key to the correct field */}
            <strong>Name:</strong> {building.buildingName} <br />
            <strong>Floors:</strong> {building.floors} <br />
            <button onClick={() => handleFetchBuilding(building.id)}>View Building Details</button> {/* Adjust property names */}
          </li>
        ))}
      </ul>

      {/* Selected building details */}
      {selectedBuilding && (
        <div>
          <h3>Building Details</h3>
          <p><strong>ID:</strong> {selectedBuilding.id}</p> {/* Adjust property names */}
          <p><strong>Name:</strong> {selectedBuilding.name}</p>
          <p><strong>Location:</strong> {selectedBuilding.location}</p>
          <p><strong>Total Occupants:</strong> {totalOccupants}</p> {/* Display total occupants */}
        </div>
      )}

      {/* List of rooms */}
      <h2>Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}> {/* Adjust the key to the correct field */}
            <strong>Name:</strong> {room.name} <br />
            <strong>Capacity:</strong> {room.capacity} <br />
            <strong>Current Capacity:</strong> {room.currentCapacity} <br />
            <strong>Location:</strong> {room.roomType} <br />
            <strong>Availability:</strong> {room.availabilityStatus} <br />
            <button onClick={() => handleFetchRoom(room.id)}>View Room Details</button> {/* Adjust property names */}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Buildings;