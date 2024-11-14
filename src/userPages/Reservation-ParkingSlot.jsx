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

// Component for parking lot card
function ParkingLotCard({ lot, onSelect }) {
  return (
    <div
      key={lot.id}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
      onClick={() => onSelect(lot.id)}
    >
      <div className="relative">
        <img src={lot.image} alt={lot.name} className="w-full h-40 object-cover" />
        <div className="absolute bottom-4 left-4 text-white font-bold text-xl bg-black bg-opacity-50 p-2">
          {lot.name}
        </div>
      </div>
    </div>
  );
}

// Component for parking lot map
function ParkingLotMap({ spots, onBack, onReserve }) {
  return (
    <div className="relative">
      <button
        onClick={onBack}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back to parking lots
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Parking Spot Map</h2>
        {/* Parking spot grid */}
        <div className="grid grid-cols-3 gap-4">
          {spots.map((spot) => (
            <div
              key={spot.id}
              className={`relative p-2 text-center cursor-pointer transition-transform transform hover:scale-110 rounded-md ${spot.available ? 'bg-green-300' : 'bg-red-300'} w-40 h-40`} 
              onClick={() => spot.available && onReserve(spot)}
            >
              <h3 className="text-xl font-semibold">{spot.id}</h3>
              <p className="text-xs">{spot.type}</p>
              <p className="text-xs mt-1">
                {spot.available
                  ? `Available until ${spot.availableTime.toLocaleTimeString()}`
                  : `Reserved until ${spot.reservedTime.toLocaleTimeString()}`}
              </p>
              <div
                className="absolute top-0 right-0 bg-black text-white text-xs p-1 rounded-l-lg"
                style={{ transform: 'translate(50%, -50%)' }}
              >
                {spot.position}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg text-gray-700">
        🚪 Entrance
      </div>
    </div>
  );
}

// Main Parking Lot Component
function ParkingLot() {
  const [selectedLot, setSelectedLot] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);  // To control reservation form visibility
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleReserve = (spot) => {
    setSelectedSpot(spot);
    setShowReservationForm(true);  // Show reservation form when a spot is clicked
  };

  const confirmReservation = () => {
    setShowReservationForm(false);  // Hide reservation form after confirming
    alert(`Reserved ${selectedSpot.id} from ${startTime} to ${endTime}`);
    setSelectedSpot(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-6 text-center">Parking Lot Reservations</h2>

        {!selectedLot ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {parkingLots.map((lot) => (
              <ParkingLotCard key={lot.id} lot={lot} onSelect={setSelectedLot} />
            ))}
          </div>
        ) : selectedLot === 'sukadi' ? (
          <div className="flex justify-center items-center h-screen">
            <h1 className="text-6xl font-extrabold text-red-600">AYAW DRIA KAY NAY SITOM</h1>
          </div>
        ) : (
          <ParkingLotMap
            spots={parkingSpots[selectedLot]}
            onBack={() => setSelectedLot(null)}
            onReserve={handleReserve}
          />
        )}
      </main>

      {showReservationForm && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-6 py-3 max-w-md w-full">
          <h3 className="text-xl font-semibold mb-2">Choose Reservation Time</h3>
          <div className="mb-4">
            <label htmlFor="start-time" className="block text-sm font-medium">Start Time</label>
            <input
              type="time"
              id="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="end-time" className="block text-sm font-medium">End Time</label>
            <input
              type="time"
              id="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={confirmReservation}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Confirm Reservation
          </button>
        </div>
      )}
    </div>
  );
}

export default ParkingLot;
