import React, { useState, useEffect } from 'react';
import Navbar from '../components/UserNavbar';
import { ParkingLotAPI } from '../services/AdminAPI/ParkingLotAPI';
import { ParkingReservationAPI } from '../services/AdminAPI/ParkingReservationAPI';
import { useAuth } from '../contexts/AuthContext';

function ParkingLot() {
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [availableSpaces, setAvailableSpaces] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [reservationDate, setReservationDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

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
    if (!user) {
      setError('You must be logged in to make a reservation.');
      return;
    }

    if (selectedSpot && reservationDate && startTime && endTime) {
      try {
        const startDateTime = new Date(`${reservationDate}T${startTime}:00`).toISOString();
        const endDateTime = new Date(`${reservationDate}T${endTime}:00`).toISOString();

        await ParkingReservationAPI.createReservation({
          parkingSpace: { parkingSpaceId: selectedSpot },
          userEntity: { userID: user.id },
          reservationStartTime: startDateTime,
          reservationEndTime: endDateTime,
        });

        setMessage(`Reserved spot ${selectedSpot} from ${startDateTime} to ${endDateTime}`);
        setSelectedSpot(null);
        setReservationDate(new Date().toISOString().split('T')[0]);
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
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url('/images/wallpeps.png')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navbar />
      <main style={{
        flexGrow: 1,
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          maxWidth: '1200px',
          marginBottom: '2rem',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
            marginBottom: '1rem',
          }}>
            {selectedLot ? `Reservations for ${parkingLots.find(lot => lot.parkingLotID === selectedLot)?.parkingLotName}` : 'Parking Lot Reservations'}
          </h2>
        </div>

        {!selectedLot ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            width: '100%',
            maxWidth: '1200px',
          }}>
            {parkingLots.map((lot) => (
              <div
                key={lot.parkingLotID}
                onClick={() => setSelectedLot(lot.parkingLotID)}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  ':hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={`/images/${lot.parkingLotName.toLowerCase()}.jpg`}
                    alt={lot.parkingLotName}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}>
                    {lot.parkingLotName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            gap: '2rem',
            width: '100%',
            maxWidth: '1200px',
          }}>
            <div style={{
              flex: '1',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#333',
              }}>Create Reservation</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="reservation-date" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#4a5568',
                }}>
                  Date
                </label>
                <input
                  type="date"
                  id="reservation-date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="start-time" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#4a5568',
                }}>
                  Start Time
                </label>
                <input
                  type="time"
                  id="start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="end-time" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#4a5568',
                }}>
                  End Time
                </label>
                <input
                  type="time"
                  id="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <button
                onClick={handleReserve}
                disabled={!selectedSpot || !reservationDate || !startTime || !endTime}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: 'white',
                  background: selectedSpot && reservationDate && startTime && endTime ? '#4299e1' : '#a0aec0',
                  cursor: selectedSpot && reservationDate && startTime && endTime ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.3s ease',
                }}
              >
                Book Now
              </button>
              <button
                onClick={() => setSelectedLot(null)}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: 'white',
                  background: '#e53e3e',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
              >
                Back to Parking Lots
              </button>
            </div>
            <div style={{ flex: '2' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#333',
              }}>Available Spots</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '1rem',
              }}>
                {availableSpaces.map((space) => (
                  <button
                    key={space.parkingSpaceId}
                    onClick={() => setSelectedSpot(space.parkingSpaceId)}
                    style={{
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: selectedSpot === space.parkingSpaceId ? '#4299e1' : (space.status === 'RESERVED' ? '#ecc94b' : '#9ae6b4'),
                      color: selectedSpot === space.parkingSpaceId ? 'white' : '#2d3748',
                      transform: selectedSpot === space.parkingSpaceId ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: selectedSpot === space.parkingSpaceId ? '0 4px 6px rgba(66, 153, 225, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{space.parkingName}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{space.status}</div>
                    <div style={{ fontSize: '0.75rem' }}>{space.spaceType}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {message && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          background: '#c6f6d5',
          borderLeft: '4px solid #48bb78',
          padding: '1rem',
          borderRadius: '0.5rem',
          color: '#2f855a',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          maxWidth: '300px',
          animation: 'slideIn 0.5s ease-out',
        }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          background: '#fed7d7',
          borderLeft: '4px solid #f56565',
          padding: '1rem',
          borderRadius: '0.5rem',
          color: '#c53030',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          maxWidth: '300px',
          animation: 'slideIn 0.5s ease-out',
        }}>
          {error}
        </div>
      )}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default ParkingLot;