import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import {
  ChartBarIcon,
  TruckIcon,
  UsersIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronUpDownIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import {
  MdOutlineDoorFront,
  MdSchedule,
} from "react-icons/md";
import { IoLibraryOutline } from "react-icons/io5";
import { LuSchool2 } from "react-icons/lu";
import { VscNotebook } from "react-icons/vsc";
import { FaRegCalendarPlus } from "react-icons/fa";
import { TiDocumentText } from "react-icons/ti";

const menuItems = [
  { name: "Analytics", icon: ChartBarIcon, path: "analytics" },
  { name: "Buildings", icon: LuSchool2, path: "buildings" },
  { name: "Library", icon: IoLibraryOutline, path: "library" },
  { name: "Library Reservations", icon: FaRegCalendarPlus, path: "library-reservations" },
  { name: "Parking Lot", icon: TruckIcon, path: "parking-lot" },
  { name: "Parking Reservations", icon: FaRegCalendarPlus, path: "parking-reservations" },
  { name: "Rooms", icon: MdOutlineDoorFront, path: "rooms" },
  { name: "Schedule", icon: MdSchedule, path: "schedule" },
  { name: "Subjects", icon: VscNotebook, path: "subjects" },
  { name: "Time Slot", icon: TiDocumentText, path: "timeslot" },
  { name: "Users", icon: UsersIcon, path: "users" },
];

const userMenuItems = [
  { name: "Profile", icon: UserCircleIcon },
  { name: "Settings", icon: Cog6ToothIcon },
  { name: "Sign Out", icon: ArrowRightOnRectangleIcon },
];

const Tooltip = ({ children, text, isVisible }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0 });
  const targetRef = useRef(null);

  useEffect(() => {
    if (isVisible && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + rect.height / 2,
      });
    }
  }, [isVisible]);

  if (!isVisible) return children;

  return (
    <div className="relative" ref={targetRef}>
      {children}
      <div
        className="fixed ml-2"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "14px",
          whiteSpace: "nowrap",
          zIndex: 1000,
          pointerEvents: "none",
          transform: "translateY(-50%)",
          top: tooltipPosition.top,
          left: "4rem",
        }}>
        {text}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const sidebarWidth = isSidebarOpen ? "16rem" : "4rem";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        style={{
          backgroundColor: "#1f2937",
          color: "white",
          width: sidebarWidth,
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 20,
          transition: "width 300ms ease-in-out",
        }}
        className="flex flex-col">
        {/* Sidebar Header */}
        <div
          className="p-4 border-b border-gray-700 flex items-center"
          style={{
            backgroundColor: hoveredItem === "menu" ? "#374151" : "transparent",
            transition: "background-color 150ms ease-in-out",
          }}
          onMouseEnter={() => setHoveredItem("menu")}
          onMouseLeave={() => setHoveredItem(null)}>
          <Tooltip
            text="Toggle Sidebar"
            isVisible={!isSidebarOpen && hoveredItem === "menu"}>
            <button
              onClick={toggleSidebar}
              className="mr-4 bg-transparent border-0 text-white cursor-pointer">
              <Bars3Icon className="h-6 w-6" />
            </button>
          </Tooltip>
          {isSidebarOpen && (
            <h1 className="text-base font-bold leading-tight">
              StatCheck Admin
            </h1>
          )}
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-grow overflow-visible">
          <ul className="py-4">
            {menuItems.map((item) => (
              <li
                key={item.name}
                style={{
                  backgroundColor:
                    hoveredItem === item.name ? "#374151" : "transparent",
                  transition: "background-color 150ms ease-in-out",
                }}
                className="px-4 py-2 cursor-pointer"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}>
                <Tooltip
                  text={item.name}
                  isVisible={!isSidebarOpen && hoveredItem === item.name}>
                  <Link
                    to={`/admin/${item.path}`}
                    className="flex items-center text-white no-underline">
                    <item.icon
                      className={`h-5 w-5 ${isSidebarOpen ? "mr-3" : ""}`}
                    />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Dropup */}
        <div
          className="border-t border-gray-700 p-4 mt-auto relative"
          style={{
            backgroundColor:
              hoveredItem === "profile" ? "#374151" : "transparent",
            transition: "background-color 150ms ease-in-out",
          }}
          onMouseEnter={() => setHoveredItem("profile")}
          onMouseLeave={() => setHoveredItem(null)}>
          <Tooltip
            text="User Profile"
            isVisible={!isSidebarOpen && hoveredItem === "profile"}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center w-full text-left bg-transparent border-0 text-white cursor-pointer">
              <UserCircleIcon
                className={`h-5 w-5 ${isSidebarOpen ? "mr-3" : ""}`}
              />
              {isSidebarOpen && (
                <>
                  <span>John Doe</span>
                  <ChevronUpDownIcon className="h-5 w-5 ml-auto" />
                </>
              )}
            </button>
          </Tooltip>
          {isUserMenuOpen && (
            <ul className="absolute bottom-full left-0 right-0 mb-2 bg-gray-700 rounded shadow-lg">
              {userMenuItems.map((item) => (
                <li
                  key={item.name}
                  style={{
                    backgroundColor:
                      hoveredItem === item.name ? "#4B5563" : "transparent",
                    transition: "background-color 150ms ease-in-out",
                  }}
                  className="px-4 py-2 cursor-pointer"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}>
                  <Link
                    to="#"
                    className="flex items-center text-white no-underline">
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 300ms ease-in-out",
        }}
        className="flex-grow">
        {/* Content Area */}
        <main className="h-screen overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
