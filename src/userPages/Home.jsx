import React from 'react';
import { FaClock, FaUsers, FaCalendarAlt, FaBook, FaCar, FaBell, FaMobileAlt, FaChartLine } from 'react-icons/fa';
import Navbar from '../components/UserNavbar';
import FeatureCard from '../components/FeatureCard';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Welcome to StatCheck</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Optimize your campus experience with real-time updates on room availability, class schedules, and parking spaces.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<FaClock className="text-blue-500" />}
            title="Real-Time Room Availability"
            description="Get instant updates on room occupancy status, updated every minute."
          />
          <FeatureCard
            icon={<FaUsers className="text-green-500" />}
            title="Room Capacity Indicator"
            description="Check if a room is full based on class registration and occupancy limits."
          />
          <FeatureCard
            icon={<FaCalendarAlt className="text-purple-500" />}
            title="Class Schedule Display"
            description="View schedules, times, and assigned teachers for each room."
          />
          <FeatureCard
            icon={<FaBook className="text-red-500" />}
            title="Library Room Reservation"
            description="Book library rooms online with ease, no in-person visits required."
          />
          <FeatureCard
            icon={<FaCar className="text-yellow-500" />}
            title="Parking Lot Availability"
            description="Find available parking spaces before arriving on campus."
          />
          <FeatureCard
            icon={<FaBell className="text-indigo-500" />}
            title="Notifications and Alerts"
            description="Receive updates about room availability and schedule changes."
          />
          <FeatureCard
            icon={<FaMobileAlt className="text-pink-500" />}
            title="Mobile-Friendly Interface"
            description="Access StatCheck on any device with our responsive design."
          />
          <FeatureCard
            icon={<FaChartLine className="text-teal-500" />}
            title="Analytics"
            description="Track usage patterns and optimize resource allocation."
          />
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">How StatCheck Helps You</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Save time by quickly finding available rooms and parking spaces</li>
            <li>Avoid overcrowded areas and plan your day more efficiently</li>
            <li>Reserve library rooms without the need for in-person visits</li>
            <li>Stay informed with real-time notifications about campus resources</li>
            <li>Access all information on-the-go with our mobile-friendly interface</li>
          </ul>
        </section>

        <section className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Ready to optimize your campus experience?</h2>
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            Get Started with StatCheck
          </button>
        </section>
      </main>
      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 StatCheck. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
