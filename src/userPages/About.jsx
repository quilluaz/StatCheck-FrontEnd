import React from "react";
import Navbar from "../components/UserNavbar";
import {
  FaLightbulb,
  FaUsers,
  FaChartLine,
  FaUniversity,
} from "react-icons/fa";
import Footer from "../components/Footer";

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          About StatCheck
        </h1>

        <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 mb-4">
            StatCheck is dedicated to revolutionizing the campus experience for
            CIT-U students and faculty. Our mission is to provide a
            comprehensive digital solution that addresses the pressing
            challenges of space management, resource allocation, and time
            efficiency within the university environment.
          </p>
          <p className="text-gray-600">
            By offering real-time updates on room availability, occupancy
            status, class schedules, and parking lot availability, we aim to
            significantly enhance productivity, reduce frustration, and optimize
            the use of campus resources.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaLightbulb className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              The Problem We're Solving
            </h3>
            <p className="text-gray-600">
              CIT-U students and faculty often struggle to find available spaces
              for studying or waiting between classes. The current system of
              in-person reservations for library study rooms and the lack of
              real-time parking information further compounds these issues,
              leading to wasted time and decreased productivity.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaUsers className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Our Solution
            </h3>
            <p className="text-gray-600">
              StatCheck provides a user-friendly platform that offers instant
              access to real-time data on room availability, class schedules,
              and parking spaces. Our system includes features like online
              library room reservations, mobile notifications, and a responsive
              interface accessible from any device.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Real-time room availability updates</li>
            <li>Room capacity and "Is Full" indicators</li>
            <li>Comprehensive class schedule display</li>
            <li>Online library room reservation system</li>
            <li>Real-time parking lot availability information</li>
            <li>Instant notifications and alerts</li>
            <li>Mobile-friendly interface for on-the-go access</li>
            <li>Analytics for optimized resource management</li>
          </ul>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaChartLine className="text-4xl text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Our Impact
            </h3>
            <p className="text-gray-600">
              By implementing StatCheck, we aim to significantly reduce time
              wasted in searching for available spaces, streamline the room
              reservation process, and provide valuable insights for better
              resource allocation. This will lead to improved student and
              faculty satisfaction, increased productivity, and more efficient
              use of campus facilities.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaUniversity className="text-4xl text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Future Plans
            </h3>
            <p className="text-gray-600">
              We are committed to continuously improving StatCheck based on user
              feedback and emerging technologies. Future updates may include
              integration with student schedules, AI-powered predictive
              analytics for space usage, and expanded features to support other
              aspects of campus life.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AboutUs;
