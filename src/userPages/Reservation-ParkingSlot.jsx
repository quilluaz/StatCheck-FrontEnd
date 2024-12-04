import React, { useState, useEffect } from 'react';
import Navbar from '../components/UserNavbar';
import { ParkingLotAPI } from '../services/AdminAPI/ParkingLotAPI';
import { ParkingReservationAPI } from '../services/AdminAPI/ParkingReservationAPI';

function ParkingLot() {
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [availableSpaces, setAvailableSpaces] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [reservationDate, setReservationDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Default to today's date
  });
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadParkingLots = async () => {
      try {
        const response = await ParkingLotAPI.getAllParkingLots();
        setParkingLots(response);
      } catch (err) {
        setError('Failed to load parking lots.');
      }
    };
    loadParkingLots();
  }, []);

  useEffect(() => {
    if (selectedLot) {
      const lot = parkingLots.find(lot => lot.parkingLotID === selectedLot);
      if (lot) {
        setAvailableSpaces(lot.parkingSpaces);
      }
    }
  }, [selectedLot, parkingLots]);

  const handleReserve = async () => {
    if (selectedSpot && reservationDate && startTime && endTime) {
      try {
        const startDateTime = new Date(`${reservationDate}T${startTime}:00`).toISOString();
        const endDateTime = new Date(`${reservationDate}T${endTime}:00`).toISOString();

        await ParkingReservationAPI.createReservation({
          parkingSpace: { parkingSpaceId: selectedSpot },
          userEntity: { userID: 1 },
          reservationStartTime: startDateTime,
          reservationEndTime: endDateTime,
        });

        setMessage(`Reserved spot ${selectedSpot} from ${startDateTime} to ${endDateTime}`);
        setSelectedSpot(null);
        setReservationDate(new Date().toISOString().split('T')[0]); // Reset to today's date
        setStartTime('');
        setEndTime('');
      } catch (err) {
        setError('Failed to reserve parking spot.');
      }
    } else {
      setError('Please select a date, time, and a spot.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundImage: `url('/images/wallpeps.png')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-4xl font-bold mb-6 text-left text-black">
            {selectedLot ? `Reservations for ${parkingLots.find(lot => lot.parkingLotID === selectedLot)?.parkingLotName}` : 'Parking Lot Reservations'}
          </h2>
        </div>

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
            <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Create Reservation</h3>
              <div className="mb-4">
                <label htmlFor="reservation-date" className="block text-sm font-medium">
                  Date
                </label>
                <input
                  type="date"
                  id="reservation-date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
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
                disabled={!selectedSpot || !reservationDate || !startTime || !endTime}
                className={`w-full py-2 rounded-md ${selectedSpot && reservationDate && startTime && endTime ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
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
            <div className="w-2/3 ml-8">
              <h3 className="text-2xl font-semibold mb-4">Available Spots</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableSpaces.map((space) => (
                  <button
                    key={space.parkingSpaceId}
                    onClick={() => setSelectedSpot(space.parkingSpaceId)}
                    className={`w-full p-4 border rounded-lg shadow-sm text-center hover:bg-blue-100 ${selectedSpot === space.parkingSpaceId ? 'bg-blue-500 text-white' : (space.status === 'RESERVED' ? 'bg-yellow-500' : 'bg-green-200')}`}
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
