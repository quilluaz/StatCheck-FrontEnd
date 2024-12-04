import React, { useState, useEffect } from 'react';
import Navbar from '../components/UserNavbar';
import { ParkingLotAPI } from '../services/AdminAPI/ParkingLotAPI'; // Importing the API functions
import { ParkingReservationAPI } from '../services/AdminAPI/ParkingReservationAPI';
const API_URL = "/api";

function ParkingLot() {
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [availableSpaces, setAvailableSpaces] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch parking lots when the component mounts
  useEffect(() => {
    const loadParkingLots = async () => {
      try {
        const response = await ParkingLotAPI.getAllParkingLots(); // Fetch all parking lots
        setParkingLots(response);
      } catch (err) {
        setError('Failed to load parking lots.');
      }
    };
    loadParkingLots();
  }, []);

  // Update available spaces when a parking lot is selected
  useEffect(() => {
    if (selectedLot) {
      const lot = parkingLots.find(lot => lot.parkingLotID === selectedLot);
      if (lot) {
        setAvailableSpaces(lot.parkingSpaces); // Setting the available spaces for the selected lot
      }
    }
  }, [selectedLot, parkingLots]);

  // Handle parking spot reservation
  const handleReserve = async () => {
    if (selectedSpot && startTime && endTime) {
      try {
        const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format
        const startDateTime = new Date(`${today}T${startTime}:00`).toISOString(); // Full start datetime
        const endDateTime = new Date(`${today}T${endTime}:00`).toISOString(); // Full end datetime

        // Send reservation request via ParkingReservationAPI
        await ParkingReservationAPI.createReservation({
          parkingSpace: { parkingSpaceId: selectedSpot },
          userEntity: { userID: 1 }, // You might want to dynamically get the user's ID
          reservationStartTime: startDateTime,
          reservationEndTime: endDateTime,
        });

        setMessage(`Reserved spot ${selectedSpot} from ${startDateTime} to ${endDateTime}`);
        setSelectedSpot(null);
        setStartTime('');
        setEndTime('');
      } catch (err) {
        setError('Failed to reserve parking spot.');
      }
    } else {
      setError('Please select a spot and set valid start and end times.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundImage: `url('/images/wallpeps.png')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Reservation Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-4xl font-bold mb-6 text-left text-black">
            {selectedLot ? `Reservations for ${parkingLots.find(lot => lot.parkingLotID === selectedLot)?.parkingLotName}` : 'Parking Lot Reservations'}
          </h2>
        </div>

        {/* Parking Lot Selection or Reservation Details */}
        {!selectedLot ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {parkingLots.map((lot) => (
              <div key={lot.parkingLotID} className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105" onClick={() => setSelectedLot(lot.parkingLotID)}>
                <div className="relative">
                  <img src={`/images/${lot.parkingLotName.toLowerCase()}.jpg`} alt={lot.parkingLotName} className="w-full h-40 object-cover" />
                  <div className="absolute bottom-4 left-4 text-white font-bold text-xl bg-black bg-opacity-50 p-2">
                    {lot.parkingLotName}
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
                className={`w-full py-2 rounded-md ${selectedSpot && startTime && endTime ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
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

            {/* Right side: Available spots */}
            <div className="w-2/3 ml-8">
              <h3 className="text-2xl font-semibold mb-4">Available Spots</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableSpaces.map((space) => (
                  <button
                    key={space.parkingSpaceId}
                    onClick={() => setSelectedSpot(space.parkingSpaceId)}
                    className={`w-full p-4 bg-white border rounded-lg shadow-sm text-center hover:bg-blue-100 ${selectedSpot === space.parkingSpaceId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    <div>{space.parkingName}</div>
                    <div className="text-sm">{space.status}</div>
                    <div className="text-sm">{space.spaceType}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Error or Success message */}
      {message && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

export default ParkingLot;
