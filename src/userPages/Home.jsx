import React, { useEffect, useState } from 'react';
import UserNavbar from '../components/UserNavbar';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';
import { HomeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { CarIcon } from 'lucide-react';
import { fetchCurrentUserProfile } from '../services/UserAPI/UserProfileAPI';

function HomePage() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userProfile = await fetchCurrentUserProfile();
        setUserName(userProfile.name);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    getUserProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <UserNavbar />
      
      <main className="flex-grow">
        {/* Greeting Section */}
        <section className="relative bg-cover bg-center bg-fixed py-20" 
          style={{ 
            backgroundImage: 'url("/images/wallpeps.png")',
          }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in-down text-maroon">
              Welcome back, <span className="text-maroon glow">{userName}!</span>
            </h1>
            <p className="text-xl mb-8 text-maroon">Streamline your day with real-time campus updates.</p>
            <div className="space-x-4">
              <button className="bg-gold text-maroon px-6 py-3 rounded-full font-semibold hover:animate-pulse transition-all duration-300">
                Check Room Availability
              </button>
              <button className="bg-maroon text-gold px-6 py-3 rounded-full font-semibold hover:glow transition-all duration-300">
                Reserve a Library Room
              </button>
            </div>
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
                href="/room-availability"
              />
              <FeatureCard
                icon={<CalendarIcon className="h-12 w-12 text-gold" />}
                title="Library Room Reservations"
                description="Book study rooms online without any hassle."
                cta="Reserve Now"
                href="/library-reservations"
              />
              <FeatureCard
                icon={<CarIcon className="h-12 w-12 text-gold" />}
                title="Parking Lot Availability"
                description="Check real-time parking space availability before you arrive."
                cta="View Parking Map"
                href="/parking-availability"
              />
            </div>
          </div>
        </section>

        {/* Analytics Teaser Section */}
        <section className="bg-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Optimize Campus Resources</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {/* Placeholder for chart */}
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <button className="bg-gold text-maroon px-6 py-2 rounded-full font-semibold hover:bg-maroon hover:text-gold transition-all duration-300">
                View Full Analytics
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage;
