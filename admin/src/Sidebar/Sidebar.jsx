// Sidebar.tsx
import React, { useState } from "react";
import {
  FaBars,
  FaChartLine,
  FaShoppingCart,
  FaBox,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: <FaChartLine />, path: "/dashboard" },
  { label: "Orders", icon: <FaShoppingCart />, path: "/orders" },
  { label: "Products", icon: <FaBox />, path: "/products" },
  { label: "Create Deals", icon: <FaBox />, path: "/dealpage" },
  { label: "Customers", icon: <FaUsers />, path: "/customers" },
  { label: "Category", icon: <FaBox />, path: "/category" },
  { label: "Reviews", icon: <FaMessage />, path: "/reviews" },
  { label: "Settings", icon: <FaCog />, path: "/settings" },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login"); // or homepage
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <aside
      className={`h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Top bar with toggle */}
      <div className="flex items-center justify-between px-4 py-4">
        {isSidebarOpen && <h1 className="text-xl font-bold">Admin</h1>}
        <button
          onClick={toggleSidebar}
          className="text-white text-xl p-2 rounded hover:bg-gray-700 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-700"
          >
            <span className="text-lg">{item.icon}</span>
            {isSidebarOpen && <span className="text-base">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4">
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg w-full hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
