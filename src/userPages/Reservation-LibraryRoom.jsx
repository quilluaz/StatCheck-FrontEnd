import React, { useState } from 'react'
import Navbar from '../components/UserNavbar' // Import your Navbar component

// Dummy data for rooms and schedules
const rooms = [
  { id: '1', name: 'Study Room A', image: '/placeholder.svg?height=200&width=300', capacity: 4 },
  { id: '2', name: 'Group Space B', image: '/placeholder.svg?height=200&width=300', capacity: 8 },
  { id: '3', name: 'Quiet Zone C', image: '/placeholder.svg?height=200&width=300', capacity: 2 },
  { id: '4', name: 'Collaboration Hub D', image: '/placeholder.svg?height=200&width=300', capacity: 12 },
]

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
  return <img src={image} alt="Room" className="w-full h-40 object-cover" />
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
function ScheduleItem({ schedule }) {
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
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
                    <ScheduleItem key={schedule.id} schedule={schedule} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 StatCheck. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LibraryRoom
