import React from "react";

const UserOrders = () => {
  const URL = "https://e-commerce-4pcq.onrender.com";
  const orders = [
    {
      id: "ORD001",
      date: "2025-07-20",

      productName: "Wireless Headphones",
      image: "https://via.placeholder.com/80", // Replace with real image
      status: "Shipped",
    },
    {
      id: "ORD001",
      date: "2025-07-20",

      productName: "Wireless Headphones",
      image: "https://via.placeholder.com/80", // Replace with real image
      status: "Delivered",
    },
    {
      id: "ORD002",
      date: "2025-07-19",

      productName: "Smart Watch",
      image: "https://via.placeholder.com/80", // Replace with real image
      status: "Pending",
    },
  ];

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
    <div className="  max-w-7xl mx-auto mt-12 p-4">
      {/* Page heading */}
      <div className="w-full text-center p-5 mb-5 border-b border-gray-300">
        <h1 className="text-4xl font-bold text-gray-600 ">Your Orders</h1>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg shadow-md bg-white overflow-hidden"
          >
            {/* Order Info Header */}
            <div className="bg-gray-100 px-4 py-3 flex flex-wrap justify-between text-sm text-gray-700">
              <p>
                <span className="font-semibold">Order ID:</span> {order.id}
              </p>
              <p>
                <span className="font-semibold">Placed on:</span> {order.date}
              </p>
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={order.image}
                  alt={order.productName}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">
                    {order.productName}
                  </p>
                  <p
                    className={`mt-1 text-xs sm:text-sm ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </p>
                </div>
              </div>

              {/* View Button */}
              <div className="text-right">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition">
                  View Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;
