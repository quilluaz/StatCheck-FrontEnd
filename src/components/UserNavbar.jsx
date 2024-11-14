import React, { useState } from 'react';
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDropdownToggle = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <a href="/" className="text-xl font-bold">
            StatCheck
          </a>
          <div className="hidden md:flex items-center space-x-6">
            <NavItems handleDropdownToggle={handleDropdownToggle} activeDropdown={activeDropdown} />
          </div>
        </div>
        <div className="hidden md:block relative">
          <UserMenu handleDropdownToggle={handleDropdownToggle} activeDropdown={activeDropdown} />
        </div>
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4">
          <NavItems handleDropdownToggle={handleDropdownToggle} activeDropdown={activeDropdown} />
          <UserMenu handleDropdownToggle={handleDropdownToggle} activeDropdown={activeDropdown} />
        </div>
      )}
    </nav>
  );
}

function NavItems({ handleDropdownToggle, activeDropdown }) {
  return (
    <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
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
          <ul className="mt-2 md:absolute md:left-0 w-40 bg-gray-700 rounded-md shadow-lg py-2 z-10">
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
          <ul className="mt-2 md:absolute md:left-0 w-40 bg-gray-700 rounded-md shadow-lg py-2 z-10">
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
  );
}

function UserMenu({ handleDropdownToggle, activeDropdown }) {
  return (
    <div className="mt-4 md:mt-0">
      <button
        onClick={() => handleDropdownToggle('user')}
        className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full hover:bg-gray-500 transition duration-200"
      >
        <FaUser />
      </button>
      {activeDropdown === 'user' && (
        <ul className="mt-2 md:absolute md:right-0 w-40 bg-gray-700 rounded-md shadow-lg py-2 z-10">
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
  );
}

export default Navbar;
