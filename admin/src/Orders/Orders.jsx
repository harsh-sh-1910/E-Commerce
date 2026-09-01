import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  // const URL = "https://e-commerce-4pcq.onrender.com";
  const URL = "http://localhost:5000";

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${URL}/order/`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Orders</h2>
      </div>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 text-center">No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Product Name</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Total</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="py-3 px-6">{order.orderId || order._id}</td>
                  <td className="py-3 px-6">
                    {" "}
                    {order.orderDetail?.[0]?.name
                      ? order.orderDetail[0].name.length > 35
                        ? order.orderDetail[0].name.slice(0, 35) + "..."
                        : order.orderDetail[0].name
                      : "Product"}
                  </td>
                  <td className="py-3 px-6">
                    {order.customerName || order.customerInfo?.name || "N/A"}
                  </td>
                  <td className="py-3 px-6">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">
                    &#8377;{" "}
                    {order.summary?.grandTotal
                      ? `${order.summary.grandTotal}`
                      : "$0.00"}
                  </td>
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
                      {order.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
