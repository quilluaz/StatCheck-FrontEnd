import React, { useState, useEffect } from "react";
import { getAllRooms } from "../services/UserAPI/RoomAPI";
import { getAllBuildings } from "../services/UserAPI/BuildingAPI";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

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
        console.error("Failed to fetch data:", error);
      }
    };

    fetchRoomsAndBuildings();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url("/images/wallpeps.png")' }}>
      <UserNavbar />

      <main className="flex-grow px-4 py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white text-center drop-shadow-lg">
            Campus Buildings
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
              <Link
                key={building.id}
                to={`/building/${building.buildingName.toLowerCase()}`}
                className="block group cursor-pointer">
                <div
                  className="relative bg-white/90 backdrop-blur-sm rounded-xl 
                           overflow-hidden transform transition-all duration-300 
                           hover:scale-105 hover:shadow-2xl hover:shadow-primary-300/50
                           border border-primary-200 h-[300px]"
                  style={{
                    backgroundImage: `url('/images/${building.buildingName.toLowerCase()}.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}>
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-primary-500/80 
                                to-primary-300/80 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300"
                  />

                  <div className="absolute inset-0 bg-black/40" />

                  <div className="relative p-6 h-full flex flex-col justify-between z-10">
                    <div>
                      <BuildingOfficeIcon className="w-12 h-12 text-white mb-4" />
                      <h2
                        className="text-2xl font-semibold mb-4 text-white
                                   group-hover:text-primary-100 transition-colors">
                        {building.buildingName}
                      </h2>
                    </div>

                    <div className="space-y-3">
                      <p className="flex justify-between items-center">
                        <span className="text-white">Floors</span>
                        <span
                          className="font-medium text-lg bg-primary-100/90 
                                     px-3 py-1 rounded-full">
                          {building.floors}
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="text-white">Total Rooms</span>
                        <span
                          className="font-medium text-lg bg-primary-100/90 
                                     px-3 py-1 rounded-full">
                          {roomCountByBuilding[building.buildingName] || 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Buildings;
