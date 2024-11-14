import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, Users, Home, Building2 } from 'lucide-react';

const BuildingsGLE = () => {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [buildingData, setBuildingData] = useState({
    totalRooms: 0,
    totalFloors: 8,
    occupancyRate: 0,
    peopleCount: 0,
    maxCapacity: 200,
  });

  const roomsPerFloor = 6;

  // Simulating data fetch from a backend
  useEffect(() => {
    const fetchData = () => {
      // This would be an API call in a real application
      setBuildingData({
        totalRooms: 48,
        totalFloors: 8,
        occupancyRate: 75,
        peopleCount: 150,
        maxCapacity: 200,
      });
    };

    fetchData();
    // Set up an interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const floorRooms = [...Array(roomsPerFloor)].map((_, i) => ({
    id: `GLE${selectedFloor}${(i + 1).toString().padStart(2, '0')}`,
    name: `Room ${i + 1}`,
    isOccupied: Math.random() > 0.5
  }));

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-center">Building Analytics Dashboard</h1>
      
      <div className="bg-[#A04747] rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-white">Building Analytics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnalyticItem icon={<Home />} label="Total Rooms" value={buildingData.totalRooms} />
          <AnalyticItem icon={<Building2 />} label="Total Floors" value={buildingData.totalFloors} />
          <AnalyticItem icon={<Users />} label="Occupancy Rate" value={`${buildingData.occupancyRate}%`} />
          <AnalyticItem icon={<Users />} label="People Count" value={buildingData.peopleCount} />
        </div>
      </div>
      
      <div className="bg-[#A04747] rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Floor {selectedFloor}</h2>
          <div className="relative">
            <select 
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(Number(e.target.value))}
              className="appearance-none bg-[#D8A25E] text-black py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-[#EEDF7A] cursor-pointer"
            >
              {[...Array(buildingData.totalFloors)].map((_, i) => (
                <option key={i} value={i + 1}>Floor {i + 1}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {floorRooms.map((room) => (
            <div key={room.id} className={`${room.isOccupied ? 'bg-[#D8A25E]' : 'bg-[#EEDF7A]'} rounded-lg p-4 text-center text-black transition-colors duration-300`}>
              <div className="text-lg font-semibold">{room.id}</div>
              <div className="mt-2 text-sm">{room.name}</div>
              <div className="mt-1 text-xs">{room.isOccupied ? 'Occupied' : 'Vacant'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function AnalyticItem({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-3 bg-[#D8A25E] rounded-lg p-3">
      <div className="text-black">{icon}</div>
      <div>
        <div className="text-sm text-black font-medium">{label}</div>
        <div className="text-xl font-bold text-black">{value}</div>
      </div>
    </div>
  );
}

export default BuildingsGLE;

