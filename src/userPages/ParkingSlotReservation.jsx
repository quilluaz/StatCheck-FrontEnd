import React, { useState, useEffect } from "react";
import Navbar from "../components/UserNavbar";
import { ParkingLotAPI } from "../services/AdminAPI/ParkingLotAPI";
import { ParkingReservationAPI } from "../services/AdminAPI/ParkingReservationAPI";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

function ParkingLot() {
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [availableSpaces, setAvailableSpaces] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [reservationDate, setReservationDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const loadParkingLots = async () => {
      try {
        const response = await ParkingLotAPI.getAllParkingLots();
        setParkingLots(response);
      } catch (err) {
        toast.error("Failed to load parking lots.");
      }
    };
    loadParkingLots();
  }, []);

  useEffect(() => {
    if (selectedLot) {
      const lot = parkingLots.find((lot) => lot.parkingLotID === selectedLot);
      if (lot) {
        setAvailableSpaces(lot.parkingSpaces);
      }
    }
  }, [selectedLot, parkingLots]);

  const handleReserve = async () => {
    if (!user) {
      toast.error("You must be logged in to make a reservation.");
      return;
    }

    if (selectedSpot && reservationDate && startTime && endTime) {
      try {
        const startDateTime = new Date(
          `${reservationDate}T${startTime}:00`
        ).toISOString();
        const endDateTime = new Date(
          `${reservationDate}T${endTime}:00`
        ).toISOString();

        console.log('Current user:', user);

        await ParkingReservationAPI.createReservation({
          parkingSpace: { parkingSpaceId: selectedSpot },
          userEntity: { userID: user.userId },
          reservationStartTime: startDateTime,
          reservationEndTime: endDateTime,
        });

        toast.success(`Reserved spot ${selectedSpot} from ${startTime} to ${endTime}`);
        setSelectedSpot(null);
        setReservationDate(new Date().toISOString().split("T")[0]);
        setStartTime("");
        setEndTime("");
      } catch (err) {
        toast.error("Failed to reserve parking spot: " + err.message);
      }
    } else {
      toast.error("Please select a date, time, and a spot.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url("/images/wallpeps.png")' }}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-maroon text-center mb-8">
            {selectedLot
              ? `Reservations for ${
                  parkingLots.find((lot) => lot.parkingLotID === selectedLot)
                    ?.parkingLotName
                }`
              : "Parking Lot Reservations"}
          </h2>

          {!selectedLot ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {parkingLots.map((lot) => (
                <div
                  key={lot.parkingLotID}
                  onClick={() => setSelectedLot(lot.parkingLotID)}
                  className="group relative bg-white/90 rounded-lg shadow-md overflow-hidden cursor-pointer
                            h-[280px] transform transition-all duration-300 hover:scale-105
                            hover:shadow-xl border border-maroon/20 hover:border-gold">
                  <img
                    src={`/images/${lot.parkingLotName.toLowerCase()}.jpg`}
                    alt={lot.parkingLotName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon via-maroon/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"/>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {lot.parkingLotName}
                    </h3>
                    <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-gold text-sm mb-3">
                        Click to view available spots
                      </p>
                      <div className="flex items-center text-white text-sm">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Available Spots: {lot.parkingSpaces?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-maroon">
                  Available Spots
                </h3>
                <button
                  onClick={() => setSelectedLot(null)}
                  className="bg-maroon/10 text-maroon px-4 py-2 rounded-md font-semibold
                            hover:bg-maroon hover:text-white transition-colors duration-300">
                  Back to Parking Lots
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="bg-white/90 rounded-lg shadow-lg p-4 border border-maroon/20">
                    <h3 className="text-xl font-bold text-maroon mb-4">
                      Create Reservation
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-maroon mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={reservationDate}
                          onChange={(e) => setReservationDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full p-2 border border-maroon rounded-md focus:ring-gold focus:border-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-maroon mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full p-2 border border-maroon rounded-md focus:ring-gold focus:border-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-maroon mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full p-2 border border-maroon rounded-md focus:ring-gold focus:border-gold"
                        />
                      </div>

                      <button
                        onClick={handleReserve}
                        disabled={
                          !selectedSpot ||
                          !reservationDate ||
                          !startTime ||
                          !endTime
                        }
                        className="w-full bg-maroon text-white py-2 rounded-md font-semibold
                                 hover:bg-gold hover:text-maroon transition-colors duration-300
                                 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:text-gray-200">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:w-2/3">
                  <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2 rounded-lg">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {availableSpaces.map((space) => (
                        <button
                          key={space.parkingSpaceId}
                          onClick={() => setSelectedSpot(space.parkingSpaceId)}
                          className={`p-3 rounded-lg text-center transition-all duration-300
                                    ${
                                      selectedSpot === space.parkingSpaceId
                                        ? "bg-maroon text-white transform scale-105 shadow-lg"
                                        : space.status === "RESERVED"
                                        ? "bg-gold/20 text-maroon"
                                        : "bg-white/80 text-maroon hover:bg-gold/10"
                                    } border border-maroon/20 hover:border-gold`}>
                          <div className="font-bold">{space.parkingName}</div>
                          <div className="text-sm mt-1">{space.status}</div>
                          <div className="text-sm">{space.spaceType}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {message && (
        <div
          className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 p-4 rounded-lg
                      text-green-700 shadow-lg max-w-md animate-slideIn">
          {message}
        </div>
      )}
      {error && (
        <div
          className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 p-4 rounded-lg
                      text-red-700 shadow-lg max-w-md animate-slideIn">
          {error}
        </div>
      )}
    </div>
  );
}

export default ParkingLot;
