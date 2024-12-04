import React, { useState, useEffect } from 'react';
import { getAllRooms, getRoomById } from '../services/UserAPI/RoomAPI';
import { getAllBuildings, getBuildingById, getTotalOccupants } from '../services/UserAPI/BuildingAPI';

const Buildings = () => {
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);;

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
          </li>
        ))}
      </ul>

  

    </div>
  );
};

export default Buildings;