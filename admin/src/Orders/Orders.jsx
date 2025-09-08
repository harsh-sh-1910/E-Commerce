import React from "react";
import { Link } from "react-router-dom";

const orders = [
  {
    id: "ORD001",
    customer: "Alice Johnson",
    date: "2025-07-20",
    total: "$149.99",
    status: "Shipped",
  },
  {
    id: "ORD002",
    customer: "Bob Smith",
    date: "2025-07-19",
    total: "$89.50",
    status: "Pending",
  },
  {
    id: "ORD003",
    customer: "Charlie Brown",
    date: "2025-07-18",
    total: "$220.00",
    status: "Delivered",
  },
];

const Orders = () => {
  const URL = "https://e-commerce-4pcq.onrender.com";
  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Orders</h2>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by customer"
          className="w-full max-w-xs border px-4 py-2 rounded-md"
        />
        <select className="border px-4 py-2 rounded-md">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-6">Order ID</th>
              <th className="py-3 px-6">Customer</th>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Total</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="py-3 px-6">{order.id}</td>
                <td className="py-3 px-6">{order.customer}</td>
                <td className="py-3 px-6">{order.date}</td>
                <td className="py-3 px-6">{order.total}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-6 space-x-2">
                  <Link to="/singleOrder">
                    <button className="text-blue-500 hover:underline">
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
