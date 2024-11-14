import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, Users, Home, Building2 } from 'lucide-react';
import Navbar from '../components/UserNavbar';

const BuildingsRTL = () => {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [buildingData, setBuildingData] = useState({
    totalRooms: 0,
    totalFloors: 3,
    occupancyRate: 0,
    peopleCount: 0,
    maxCapacity: 90,
  });
  
  const roomsPerFloor = 6;

  // Simulating data fetch from a backend
  useEffect(() => {
    const fetchData = () => {
      setBuildingData({
        totalRooms: 18,
        totalFloors: 3,
        occupancyRate: 80,
        peopleCount: 72,
        maxCapacity: 90,
      });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const floorRooms = [...Array(roomsPerFloor)].map((_, i) => ({
    id: `RTL${selectedFloor}${(i + 1).toString().padStart(2, '0')}`,
    name: `Room ${i + 1}`,
    isOccupied: Math.random() > 0.5
  }));

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />
    
      <div className="bg-white text-black p-8 font-sans overflow-hidden">
        <div className="bg-[#662506] rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-white">Don Rodulfo T. Lizarres Building (RTL)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnalyticItem icon={<Home />} label="Total Rooms" value={buildingData.totalRooms} delay={0.1} />
            <AnalyticItem icon={<Building2 />} label="Total Floors" value={buildingData.totalFloors} delay={0.2} />
            <AnalyticItem icon={<Users />} label="Occupancy Rate" value={`${buildingData.occupancyRate}%`} delay={0.3} />
            <AnalyticItem icon={<Users />} label="People Count" value={buildingData.peopleCount} delay={0.4} />
          </div>
        </div>
        
        <div className="bg-[#662506] rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Floor {selectedFloor}</h2>
            <div className="relative">
              <select 
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(Number(e.target.value))}
                className="appearance-none bg-[#F9F9DC] text-black py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-[#F9F9DC] cursor-pointer"
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
            {floorRooms.map((room, index) => (
              <div key={room.id} className={`${room.isOccupied ? 'bg-[#7EA172]' : 'bg-[#F9F9DC]'} rounded-lg p-4 text-center text-black transition-colors duration-300 animate-fadeIn`}>
                <div className="text-lg font-semibold">{room.id}</div>
                <div className="mt-2 text-sm">{room.name}</div>
                <div className="mt-1 text-xs">{room.isOccupied ? 'Occupied' : 'Vacant'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation-name: fadeIn;
          animation-duration: 1s;
          animation-timing-function: ease-in-out;
          animation-fill-mode: forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

function AnalyticItem({ icon, label, value, delay }) {
  return (
    <div className={`flex items-center space-x-3 bg-[#F9F9DC] rounded-lg p-3 text-black animate-fadeIn`} style={{ animationDelay: `${delay}s` }}>
      <div className="text-black">{icon}</div>
      <div>
        <div className="text-sm text-black font-medium">{label}</div>
        <div className="text-xl font-bold text-black">{value}</div>
      </div>
    </div>
  );
}

export default BuildingsRTL;