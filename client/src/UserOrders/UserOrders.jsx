import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiBaseUrl";

const UserOrders = () => {
  // const URL="https://e-commerce-4pcq.onrender.com";
  const URL = "http://localhost:5000";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from backend API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/order/`);
        console.log("res.data:", res.data);
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);

  // Badge colors by status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Shipped":
        return "text-yellow-700";
      case "Pending":
        return "text-red-700";
      case "Delivered":
        return "text-green-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 p-4">
      {/* Page heading */}
      <div className="w-full text-center p-5 mb-5 border-b border-gray-300">
        <h1 className="text-4xl font-bold text-gray-600">Your Orders</h1>
      </div>

      {/* Error State */}
      {error && <p className="text-center text-red-500 font-medium">{error}</p>}

      {/* Orders List */}
      {!error && orders.length > 0 ? (
        <div className="space-y-6 max-w-5xl mx-auto">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-lg shadow-md bg-white overflow-hidden"
            >
              {/* Order Info Header */}
              <div className="bg-gray-100 px-4 py-3 flex flex-wrap justify-between text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {order.orderNumber}
                </p>
                <p>
                  <span className="font-semibold">Placed on:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Product Name */}
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {order.orderDetail?.[0]?.name
                        ? order.orderDetail[0].name.length > 55
                          ? order.orderDetail[0].name.slice(0, 55) + "..."
                          : order.orderDetail[0].name
                        : "Product"}
                    </p>

                    {/* Order Status */}
                    <p
                      className={`mt-1 text-xs sm:text-sm text-gray-900 font-semibold text-md ${getStatusBadge(
                        order.fulfillment?.status,
                      )}`}
                    >
                      Order Status : &nbsp;
                      <span className="text-red-500">
                        {order.fulfillment?.status || "Pending"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* View Button */}
                <div className="text-right">
                  <span className="text-xl text-teal-600">
                    &#8377; {order.summary.grandTotal}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !error && <p className="text-center text-gray-500">No orders found.</p>
      )}
    </div>
  );
};

export default UserOrders;
