import React, { useState } from 'react';
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownToggle = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <a href="/" className="text-xl font-bold">
            StatCheck
          </a>
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="hover:text-gray-300 transition duration-200">
                Home
              </a>
            </li>
            <li className="relative">
              <button
                onClick={() => handleDropdownToggle('buildings')}
                className="flex items-center hover:text-gray-300 transition duration-200"
              >
                Buildings <FaChevronDown className="ml-1" />
              </button>
              {activeDropdown === 'buildings' && (
                <ul className="absolute left-0 mt-2 w-40 bg-gray-700 rounded-md shadow-lg py-2 z-10">
                  <li>
                    <a href="/buildings/rtl" className="block px-4 py-2 hover:bg-gray-600 transition duration-200">
                      RTL
                    </a>
                  </li>
                  <li>
                    <a href="/buildings/nge" className="block px-4 py-2 hover:bg-gray-600 transition duration-200">
                      NGE
                    </a>
                  </li>
                  <li>
                    <a href="/buildings/gle" className="block px-4 py-2 hover:bg-gray-600 transition duration-200">
                      GLE
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li className="relative">
              <button
                onClick={() => handleDropdownToggle('reservations')}
                className="flex items-center hover:text-gray-300 transition duration-200"
              >
                Reservations <FaChevronDown className="ml-1" />
              </button>
              {activeDropdown === 'reservations' && (
                <ul className="absolute left-0 mt-2 w-40 bg-gray-700 rounded-md shadow-lg py-2 z-10">
                  <li>
                    <a
                      href="/reservations/library"
                      className="block px-4 py-2 hover:bg-gray-600 transition duration-200"
                    >
                      Library Rooms
                    </a>
                  </li>
                  <li>
                    <a
                      href="/reservations/parking"
                      className="block px-4 py-2 hover:bg-gray-600 transition duration-200"
                    >
                      Parking Slot
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a href="/about" className="hover:text-gray-300 transition duration-200">
                About
              </a>
            </li>
          </ul>
        </div>
        <div className="relative mr-2">
          <button
            onClick={() => handleDropdownToggle('user')}
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-200"
          >
            <FaUser />
          </button>
          {activeDropdown === 'user' && (
            <ul className="absolute right-0 mt-2 w-40 bg-gray-700 rounded-md shadow-lg py-2 z-10">
              <li>
                <a
                  href="/user-profile"
                  className="flex items-center px-4 py-2 hover:bg-gray-600 transition duration-200"
                >
                  <FaUser className="mr-2" /> User
                </a>
              </li>
              <li>
                <a href="/settings" className="flex items-center px-4 py-2 hover:bg-gray-600 transition duration-200">
                  <FaCog className="mr-2" /> Settings
                </a>
              </li>
              <li>
                <a href="/signout" className="flex items-center px-4 py-2 hover:bg-gray-600 transition duration-200">
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;