import React, { useState } from 'react'
import Navbar from '../components/UserNavbar' // Import your Navbar component

// Dummy data for rooms and schedules
const rooms = [
    { id: '1', name: 'Multimedia Nook', image: '/images/multimedia-nook.jpg', capacity: 4 },
    { id: '2', name: 'Activity Loft', image: '/images/activity-loft.jpg', capacity: 8 },
    { id: '3', name: 'Pitch Room', image: '/images/pitch-room.jpg', capacity: 2 },
    { id: '4', name: 'Reading Hub', image: '/images/reading-hub.jpg', capacity: 12 },
];
  
const schedules = [
  { id: '1', start: '09:00', end: '10:00', isAvailable: true },
  { id: '2', start: '10:00', end: '11:00', isAvailable: false },
  { id: '3', start: '11:00', end: '12:00', isAvailable: true },
  { id: '4', start: '13:00', end: '14:00', isAvailable: true },
]

// Component for the RoomCard
function RoomCard({ room, onSelect }) {
  return (
    <div
      key={room.id}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
      onClick={() => onSelect(room)}
    >
      <RoomImage image={room.image} />
      <RoomDetails room={room} />
    </div>
  )
}

// Room image component
function RoomImage({ image }) {
    return (
      <div className="relative">
        {/* The book cover */}
        <img 
          src="/images/wallofFame.jpg" 
          alt="Book Cover" 
          className="w-full h-40 object-cover absolute inset-0 transition-opacity duration-300 hover:opacity-0" 
        />
        {/* Actual room image */}
        <img 
          src={image} 
          alt="Room" 
          className="w-full h-40 object-cover"
        />
      </div>
    );
  }

// Room details component (name, capacity)
function RoomDetails({ room }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
      <div className="flex items-center text-gray-600">
        <span className="mr-2">📚</span>
        <span>Capacity: {room.capacity}</span>
      </div>
    </div>
  )
}

// Component for individual schedule item
function ScheduleItem({ schedule, onBook }) {
  return (
    <div
      key={schedule.id}
      className={`flex items-center justify-between p-3 rounded-md ${schedule.isAvailable ? 'bg-green-100' : 'bg-red-100'}`}
    >
      <div className="flex items-center">
        <span className="mr-2">🕒</span>
        <span>{formatScheduleTime(schedule)}</span>
      </div>
      {schedule.isAvailable ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => onBook(schedule)}
        >
          Book Now
        </button>
      ) : (
        <span className="text-red-600 font-medium">Booked</span>
      )}
    </div>
  )
}

// Format the schedule time
function formatScheduleTime(schedule) {
  return `${schedule.start} - ${schedule.end}`
}

// Main Library Room Component
function LibraryRoom() {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [loading, setLoading] = useState(false) // Track loading state
  const [showModal, setShowModal] = useState(false) // Modal visibility
  const [selectedSchedule, setSelectedSchedule] = useState(null) // Selected schedule for booking

  // Simulate data loading or fetching from an API
  const loadRoomData = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false) // Stop loading after 2 seconds
    }, 2000)
  }

  React.useEffect(() => {
    loadRoomData() // Load room data when component mounts
  }, [])

  // Handle booking action
  const handleBookClick = (schedule) => {
    setSelectedSchedule(schedule)
    setShowModal(true)
  }

  // Confirm booking action
  const handleConfirmBooking = () => {
    // Handle actual booking logic here
    alert(`Booking confirmed for schedule ${formatScheduleTime(selectedSchedule)}`)
    setShowModal(false)
  }

  // Cancel booking action
  const handleCancelBooking = () => {
    setShowModal(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Add Navbar here */}
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Library Rooms</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>
        ) : !selectedRoom ? (
          // Room List
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onSelect={setSelectedRoom} />
            ))}
          </div>
        ) : (
          // Selected Room Details
          <div>
            <button
              onClick={() => setSelectedRoom(null)}
              className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Back to rooms
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedRoom.name}</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Available Schedules</h3>
              <div className="space-y-4">
                {schedules.length === 0 ? (
                  <p>No schedules available.</p>
                ) : (
                  schedules.map((schedule) => (
                    <ScheduleItem key={schedule.id} schedule={schedule} onBook={handleBookClick} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Booking Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to book this room?</h3>
            <p>{formatScheduleTime(selectedSchedule)}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleCancelBooking}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LibraryRoom
