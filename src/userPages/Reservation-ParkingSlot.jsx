import React, { useState } from 'react';
import Navbar from '../components/UserNavbar'; // Import Navbar component

// Dummy data for parking lots and spots
const parkingLots = [
  { id: 'gle', name: 'Near GLE', image: '/images/gle.jpg' },
  { id: 'nge', name: 'Near NGE', image: '/images/nge.jpg' },
  { id: 'rtl', name: 'Near RTL', image: '/images/rtl.png' },
  { id: 'sukadi', name: 'Near Sukadi', image: '/images/sukadi.jpg' },
];

// Function to generate parking spots
const generateParkingSpots = () => {
  const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
  return Array.from({ length: 6 }, (_, index) => {
    const now = new Date();
    const availableTime = new Date(now.getTime() + Math.random() * 60 * 60 * 1000);
    const reservedTime = new Date(availableTime.getTime() + Math.random() * 2 * 60 * 60 * 1000);
    return {
      id: `Spot ${index + 1}`,
      type: ['Compact', 'Standard', 'Large', 'Electric'][Math.floor(Math.random() * 4)],
      available: now < availableTime,
      availableTime,
      reservedTime,
      position: positions[index % positions.length],
    };
  });
};

// Define parking spots for each lot
const parkingSpots = {
  gle: generateParkingSpots(),
  nge: generateParkingSpots(),
  rtl: generateParkingSpots(),
  sukadi: generateParkingSpots(),
};

function ParkingLot() {
  const [selectedLot, setSelectedLot] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleReserve = () => {
    alert(`Reserved ${selectedSpot.id} from ${startTime} to ${endTime}`);
    setSelectedSpot(null);
    setStartTime('');
    setEndTime('');
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `url('/images/wallpeps.png')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Reservation Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-4xl font-bold mb-6 text-left text-black">
            {selectedLot ? `Reservations for ${parkingLots.find(lot => lot.id === selectedLot).name}` : 'Parking Lot Reservations'}
          </h2>
        </div>

        {/* Parking Lot Selection or Reservation Details */}
        {!selectedLot ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {parkingLots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedLot(lot.id)}
              >
                <div className="relative">
                  <img src={lot.image} alt={lot.name} className="w-full h-40 object-cover" />
                  <div className="absolute bottom-4 left-4 text-white font-bold text-xl bg-black bg-opacity-50 p-2">
                    {lot.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex">
            {/* Left side: Reservation form */}
            <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Create Reservation</h3>
              <div className="mb-4">
                <label htmlFor="start-time" className="block text-sm font-medium">
                  Start Time
                </label>
                <input
                  type="time"
                  id="start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="end-time" className="block text-sm font-medium">
                  End Time
                </label>
                <input
                  type="time"
                  id="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                onClick={handleReserve}
                disabled={!selectedSpot || !startTime || !endTime}
                className={`w-full py-2 rounded-md ${
                  selectedSpot && startTime && endTime
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
              >
                Book Now
              </button>
              <button
                onClick={() => setSelectedLot(null)}
                className="w-full mt-4 bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
              >
                Back to Parking Lots
              </button>
            </div>

            {/* Right side: Parking spots */}
            <div className="w-2/3 pl-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {parkingSpots[selectedLot].map((spot) => (
                  <div
                    key={spot.id}
                    className={`relative p-2 text-center cursor-pointer transition-transform transform hover:scale-110 rounded-md ${
                      spot.available ? 'bg-green-300' : 'bg-red-300'
                    } w-40 h-40`}
                    onClick={() => spot.available && setSelectedSpot(spot)}
                  >
                    <h3 className="text-xl font-semibold">{spot.id}</h3>
                    <p className="text-xs">{spot.type}</p>
                    <p className="text-xs mt-1">
                      {spot.available
                        ? `Available until ${spot.availableTime.toLocaleTimeString()}`
                        : `Reserved until ${spot.reservedTime.toLocaleTimeString()}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ParkingLot;
