import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { GoStar } from "react-icons/go";
import { HiOutlineMapPin } from "react-icons/hi2";
import { BsPersonLock } from "react-icons/bs";
import { GiShoppingCart } from "react-icons/gi";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { MdOutlineChecklistRtl } from "react-icons/md";
import axios from "axios";

function getProfileFromLocalStorage() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Invalid access token", error);
    return null;
  }
}

const defaultStats = {
  orders: 47,
  favorites: 23,
  reviews: 4.8,
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(defaultStats);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      // Step 1: store basic info from token if needed
      setUser(decoded);

      // Step 2: fetch full user profile from backend
      axios
        .get(`http://localhost:5000/auth/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // pass token to verify request
          },
        })
        .then((res) => {
          console.log("User data from backend:", res.data);
          setUser(res.data); // override decoded with actual DB user info
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          navigate("/login"); // optional: redirect if request fails
        });
    } catch (error) {
      console.error("Invalid access token", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/login"); // redirect after logout
  };
  const items = [
    {
      title: "Reviews",
      subtitle: "View your ratings",
      icon: <GoStar className="w-12 h-12 text-yellow-400" />,
      href: "/userReview",
    },
    {
      title: "Address",
      subtitle: "Manage saved addresses",
      icon: <HiOutlineMapPin className="w-12 h-12 text-blue-400" />,
      href: "/userAddress",
    },
    {
      title: "Login & Security",
      subtitle: "Update password & info",
      icon: <BsPersonLock className="w-12 h-12 text-red-400" />,
      href: "/updateuser",
    },
    {
      title: "My Cart",
      subtitle: "3 items in cart",
      icon: <GiShoppingCart className="w-12 h-12 text-green-400" />,
      href: "/checkout",
    },
    {
      title: "Contact Us",
      subtitle: "Get support quickly",
      icon: <TfiHeadphoneAlt className="w-12 h-12 text-purple-400" />,
      href: "/contact",
    },
    {
      title: "Order History",
      subtitle: "View past orders",
      icon: <MdOutlineChecklistRtl className="w-12 h-12 text-orange-400" />,
      href: "/userOrder",
    },
  ];

  if (!user) return null; // Optionally show a loading state

  return (
    <div className="mx-auto mt-10 bg-white p-6 sm:p-8 rounded-xl shadow">
      {/* User Info Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-center pb-6 border-b border-gray-100 gap-4">
        {/* Avatar + User Info */}
        <div className="flex sm:flex-col md:flex-row items-start sm:items-center gap-4">
          {/* Avatar Circle */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-700">
            {(user.fName?.[0] || user.uName?.[0] || "").toUpperCase()}
            {(user.lName?.[0] || "").toUpperCase()}
          </div>

          {/* User Info */}
          <div className="flex flex-col">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {user.fName || ""} {user.lName || ""}
              {!user.fName && !user.lName && user.uName}
            </div>
            <div className="text-gray-600 text-sm sm:text-base break-words">
              {user.email}
            </div>
            <div className="text-gray-400 text-sm">
              Member since&nbsp;
              {user.createdAt
                ? new Date(user.createdAt).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })
                : "March 2023"}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          className="w-full sm:w-auto py-2 sm:py-3 px-3 sm:px-5 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition"
        >
          Log Out
        </button>
      </div>

      {/* Quick Actions */}
      <div className="my-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {items.map((item, idx) => (
            <Link
              to={item.href}
              key={idx}
              className="flex items-start sm:items-center p-6 sm:p-8 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="mr-3 text-2xl flex-shrink-0">{item.icon}</span>
              <span className="text-left">
                <div className="font-semibold text-lg lg:text-xl">
                  {item.title}
                </div>
                <div className="text-sm sm:text-md text-gray-500">
                  {item.subtitle}
                </div>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
