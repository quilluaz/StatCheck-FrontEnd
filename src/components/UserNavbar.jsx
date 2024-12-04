import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import UserImgIcon from "../assets/lex.png";

const NavItem = ({ href, children }) => (
  <a
    href={href}
    className="block px-3 py-2 rounded-md text-white font-bold relative group transition-transform hover:scale-105">
    <span className="relative z-10 group-hover:text-gold transition-colors duration-300">
      {children}
    </span>
    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold transform scale-x-0 group-hover:animate-underline-lr"></div>
  </a>
);

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Add refs for timeout handlers
  const closeReservationTimeout = useRef(null);
  const closeUserMenuTimeout = useRef(null);

  // Function to handle dropdown closing with delay
  const handleMouseLeave = (dropdownSetter, timeoutRef) => {
    timeoutRef.current = setTimeout(() => {
      dropdownSetter(false);
    }, 500); // 500ms delay before closing
  };

  // Function to cancel closing if mouse returns
  const handleMouseEnter = (timeoutRef) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (closeReservationTimeout.current)
        clearTimeout(closeReservationTimeout.current);
      if (closeUserMenuTimeout.current)
        clearTimeout(closeUserMenuTimeout.current);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-maroon shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/home" className="flex-shrink-0">
              <span className="text-white text-2xl font-bold">StatCheck</span>
            </a>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavItem href="/home">Home</NavItem>
                <NavItem href="/buildings">Buildings</NavItem>
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(closeReservationTimeout)}
                  onMouseLeave={() =>
                    handleMouseLeave(setIsOpen, closeReservationTimeout)
                  }>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center px-3 py-2 text-white font-bold transition-colors hover:text-gold">
                    Reservations
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  {isOpen && (
                    <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="py-1">
                        <a
                          href="/reservations/library"
                          className="block px-4 py-2 text-sm text-maroon relative overflow-hidden group">
                          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                            Library Rooms
                          </span>
                          <div className="absolute inset-0 bg-maroon transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </a>
                        <a
                          href="/reservations/parking"
                          className="block px-4 py-2 text-sm text-maroon relative overflow-hidden group">
                          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                            Parking Slot
                          </span>
                          <div className="absolute inset-0 bg-maroon transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <NavItem href="/about">About</NavItem>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter(closeUserMenuTimeout)}
                onMouseLeave={() =>
                  handleMouseLeave(setIsUserMenuOpen, closeUserMenuTimeout)
                }>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1 rounded-full text-white hover:text-gold focus:outline-none">
                  <img
                    src={UserImgIcon}
                    alt="User Profile"
                    className="h-9 w-9 rounded-full"
                  />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="py-1">
                      <a
                        href="/user-profile"
                        className="block px-4 py-2 text-sm text-maroon relative overflow-hidden group">
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                          <User className="inline-block h-4 w-4 mr-2" />
                          User Profile
                        </span>
                        <div className="absolute inset-0 bg-maroon transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </a>
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="w-full text-left px-4 py-2 text-sm text-maroon relative overflow-hidden group">
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                          <LogOut className="inline-block h-4 w-4 mr-2" />
                          {isLoading ? "Signing out..." : "Sign Out"}
                        </span>
                        <div className="absolute inset-0 bg-maroon transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gold focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavItem href="/home">Home</NavItem>
              <NavItem href="/buildings">Buildings</NavItem>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-3 py-2 text-white font-bold transition-colors hover:text-gold">
                Reservations
              </button>
              {isOpen && (
                <div className="pl-4">
                  <NavItem href="/reservations/library">Library Rooms</NavItem>
                  <NavItem href="/reservations/parking">Parking Slot</NavItem>
                </div>
              )}
              <NavItem href="/about">About</NavItem>
              <div className="border-t border-gray-200 pt-4">
                <NavItem href="/user-profile">Profile</NavItem>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 text-white font-bold transition-colors hover:text-gold">
                  {isLoading ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
