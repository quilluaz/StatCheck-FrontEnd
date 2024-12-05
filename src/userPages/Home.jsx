import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
import { HomeIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { CarIcon } from "lucide-react";
import { fetchCurrentUserProfile } from "../services/UserAPI/UserProfileAPI";
import { getAllRooms } from "../services/UserAPI/RoomAPI";
import { getAllBuildings } from "../services/UserAPI/BuildingAPI";

function HomePage() {
  const [userName, setUserName] = useState("");
  const [buildingStats, setBuildingStats] = useState({
    totalRooms: 0,
    totalBuildings: 0,
    totalOccupants: 0,
    averageOccupancy: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userProfile = await fetchCurrentUserProfile();
        setUserName(userProfile.name);

        // Fetch analytics data
        const roomData = await getAllRooms();
        const buildingData = await getAllBuildings();

        // Calculate statistics
        const totalRooms = roomData.length;
        const totalBuildings = buildingData.length;
        const totalOccupants = roomData.reduce(
          (sum, room) => sum + room.currentCapacity,
          0
        );
        const totalCapacity = roomData.reduce(
          (sum, room) => sum + room.capacity,
          0
        );
        const averageOccupancy =
          totalCapacity > 0 ? (totalOccupants / totalCapacity) * 100 : 0;

        setBuildingStats({
          totalRooms,
          totalBuildings,
          totalOccupants,
          averageOccupancy,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <UserNavbar />

      <main className="flex-grow">
        {/* Greeting Section */}
        <section
          className="relative bg-cover bg-center bg-fixed py-20"
          style={{ backgroundImage: 'url("/images/wallpeps.png")' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in-down text-maroon">
              Welcome back,{" "}
              <span className="text-maroon glow">{userName}!</span>
            </h1>
            <p className="text-xl mb-8 text-maroon">
              Streamline your day with real-time campus updates.
            </p>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<HomeIcon className="h-12 w-12 text-gold" />}
                title="Real-Time Room Availability"
                description="View live room statuses across campus and avoid delays."
                cta="Find a Room"
                href="/buildings"
              />
              <FeatureCard
                icon={<CalendarIcon className="h-12 w-12 text-gold" />}
                title="Library Room Reservations"
                description="Book study rooms online without any hassle."
                cta="Reserve Now"
                href="/reservations/library"
              />
              <FeatureCard
                icon={<CarIcon className="h-12 w-12 text-gold" />}
                title="Parking Lot Availability"
                description="Check real-time parking space availability before you arrive."
                cta="View Parking Map"
                href="/reservations/parking"
              />
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="bg-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-maroon mb-2">
                  Total Buildings
                </h3>
                <p className="text-2xl font-bold text-gold">
                  {buildingStats.totalBuildings}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-maroon mb-2">
                  Total Rooms
                </h3>
                <p className="text-2xl font-bold text-gold">
                  {buildingStats.totalRooms}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-maroon mb-2">
                  Current Occupants
                </h3>
                <p className="text-2xl font-bold text-gold">
                  {buildingStats.totalOccupants}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-maroon mb-2">
                  Average Occupancy
                </h3>
                <p className="text-2xl font-bold text-gold">
                  {buildingStats.averageOccupancy.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
