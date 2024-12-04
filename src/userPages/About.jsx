import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, HomeIcon, Car } from "lucide-react";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";

const teamMembers = [
  {
    name: "Jeric",
    role: "Back-end Wizard",
    funFact: "Loves solving puzzles and building efficient systems.",
  },
  {
    name: "Isaac",
    role: "Creative Thinker",
    funFact: "All about user experience and sleek design.",
  },
  {
    name: "Zeke",
    role: "PM and Voice",
    funFact: "Confidently represents the team during presentations.",
  },
  {
    name: "Alexander",
    role: "The Planner",
    funFact: "Ensures the team stays on track and goals are met.",
  },
  {
    name: "Selina",
    role: "Details Expert",
    funFact: "Specializes in refining features and fixing bugs.",
  },
];

function TeamMember({ name, role, funFact }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-40 h-40 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}>
      <div
        className={`absolute w-full h-full rounded-full transition-all duration-500 ${
          isFlipped ? "opacity-0" : "opacity-100"
        }`}>
        <img
          src={`/images/${name.toLowerCase()}.png`}
          alt={name}
          className="rounded-full w-full h-full object-cover"
        />
      </div>
      <div
        className={`absolute w-full h-full rounded-full bg-gold flex items-center justify-center p-4 text-center text-maroon transition-all duration-500 ${
          isFlipped ? "opacity-100" : "opacity-0"
        }`}>
        <p className="text-sm">{funFact}</p>
      </div>
      <div className="absolute -bottom-8 left-0 right-0 text-center">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white font-inter">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <img
            src="/images/wallpeps.png"
            alt="Hero Background"
            className="absolute inset-0 z-0 w-full h-full object-cover"
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gold transition-all duration-300 hover:text-shadow-glow">
                Who We Are
              </h1>
              <p className="mt-4 text-xl sm:text-2xl text-white">
                Enhancing campus life, one smart solution at a time.
              </p>
              <div className="mt-8 inline-block animate-bounce hover:animate-spin transition-all duration-300">
                <img
                  src="/logo.png"
                  alt="StatCheck Logo"
                  className="rounded-full w-[100px] h-[100px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About StatCheck Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-maroon mb-4">
                  What is StatCheck?
                </h2>
                <p className="text-lg text-gray-700">
                  StatCheck is your go-to campus companion, designed to simplify
                  life at Cebu Institute of Technology - University. Whether
                  it's finding available study spaces, booking library rooms, or
                  checking parking availability, we're here to make your day
                  smoother, smarter, and more productive.
                </p>
              </div>
              <div className="relative h-64 md:h-full">
                <img
                  src="/public/images/campusMap.png"
                  alt="Campus Map"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-maroon mb-8">
              Meet the Makers of StatCheck
            </h2>
            <p className="text-center text-lg mb-12">
              StatCheck was brought to life by "J.I.Z.A.S." five ambitious
              college students determined to solve campus challenges.
            </p>
            <div className="flex flex-wrap justify-center gap-12">
              {teamMembers.map((member) => (
                <TeamMember key={member.name} {...member} />
              ))}
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="relative py-20 bg-maroon overflow-hidden">
          <div className="absolute inset-0">
            <div className="animate-wave1 absolute inset-0 bg-gold opacity-10"></div>
            <div className="animate-wave2 absolute inset-0 bg-gold opacity-10"></div>
            <div className="animate-wave3 absolute inset-0 bg-gold opacity-10"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Together, we're making campus smarter and life better for
                everyone at CIT-U.
              </h2>
              <button
                onClick={() => navigate("/features")}
                className="inline-block bg-gold text-maroon px-8 py-3 rounded-full font-semibold hover:animate-pulse transition-all duration-300">
                Discover Our Features
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
