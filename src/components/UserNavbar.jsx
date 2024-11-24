import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import UserImgIcon from "../assets/lex.png";

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
    <nav className="bg-[#8a333b] text-[#ffffff] p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <a href="/home" className="text-xl font-bold ml-4 mr-8">
            StatCheck
          </a>
          <div className="hidden md:flex items-center space-x-6">
            <NavItems
              handleDropdownToggle={handleDropdownToggle}
              activeDropdown={activeDropdown}
            />
          </div>
        </div>
        <div className="hidden md:block relative">
          <UserMenu
            handleDropdownToggle={handleDropdownToggle}
            activeDropdown={activeDropdown}
          />
        </div>
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4">
          <NavItems
            handleDropdownToggle={handleDropdownToggle}
            activeDropdown={activeDropdown}
          />
          <UserMenu
            handleDropdownToggle={handleDropdownToggle}
            activeDropdown={activeDropdown}
          />
        </div>
      )}
    </nav>
  );
}

function NavItems({ handleDropdownToggle, activeDropdown }) {
  return (
    <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
      <li>
        <a href="/home" className="hover:text-gray-300 transition duration-200">
          Home
        </a>
      </li>
      <li className="relative">
        <button
          onClick={() => handleDropdownToggle("buildings")}
          className="flex items-center hover:text-gray-300 transition duration-200">
          Buildings <FaChevronDown className="ml-1" />
        </button>
        {activeDropdown === "buildings" && (
          <ul className="mt-2 md:absolute md:left-0 w-40 bg-[#a33c45] rounded-md shadow-lg py-2 z-10">
            <li>
              <a
                href="/buildings/rtl"
                className="block px-4 py-2 hover:bg-[#8a333b] transition duration-200 text-[#ffffff]">
                RTL
              </a>
            </li>
            <li>
              <a
                href="/buildings/nge"
                className="block px-4 py-2 hover:bg-[#8a333b] transition duration-200 text-[#ffffff]">
                NGE
              </a>
            </li>
            <li>
              <a
                href="/buildings/gle"
                className="block px-4 py-2 hover:bg-[#8a333b] transition duration-200 text-[#ffffff]">
                GLE
              </a>
            </li>
          </ul>
        )}
      </li>
      <li className="relative">
        <button
          onClick={() => handleDropdownToggle("reservations")}
          className="flex items-center hover:text-gray-300 transition duration-200">
          Reservations <FaChevronDown className="ml-1" />
        </button>
        {activeDropdown === "reservations" && (
          <ul className="mt-2 md:absolute md:left-0 w-40 bg-[#a33c45] rounded-md shadow-lg py-2 z-10">
            <li>
              <a
                href="/reservations/library"
                className="block px-4 py-2 hover:bg-[#8a333b] transition duration-200 text-[#ffffff]">
                Library Rooms
              </a>
            </li>
            <li>
              <a
                href="/reservations/parking"
                className="block px-4 py-2 hover:bg-[#8a333b] transition duration-200 text-[#ffffff]">
                Parking Slot
              </a>
            </li>
          </ul>
        )}
      </li>
      <li>
        <a
          href="/about"
          className="hover:text-gray-300 transition duration-200">
          About
        </a>
      </li>
    </ul>
  );
}

function UserMenu({ handleDropdownToggle, activeDropdown }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 md:mt-0 mr-3">
      <button
        onClick={() => handleDropdownToggle("user")}
        className="flex items-center justify-center w-10 h-10 bg-[#993404] rounded-full hover:bg-gray-500 transition duration-200 text-[#fff7bc]">
        <img
          src={UserImgIcon}
          alt="User Profile"
          className="mx-auto rounded-full"
        />
      </button>
      {activeDropdown === "user" && (
        <ul className="mt-2 md:absolute md:right-0 w-40 bg-[#a33c45] rounded-md shadow-lg py-2 z-10">
          <li>
            <a
              href="/user-profile"
              className="flex items-center px-4 py-2 hover:bg-[#8a333b] transition duration-200 text-[#ffffff]">
              <FaUser className="mr-2" /> User Profile
            </a>
          </li>
          <li>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center px-4 py-2 hover:bg-[#8a333b] transition duration-200 text-[#ffffff]">
              <FaSignOutAlt className="mr-2" />
              {isLoading ? "Signing out..." : "Sign Out"}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Navbar;
