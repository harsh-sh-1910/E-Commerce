import React, { useEffect, useState } from "react";
import axios from "axios";

const Customers = () => {
  // const URL = "https://e-commerce-4pcq.onrender.com";
  const URL = "http://localhost:5000";

  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${URL}/auth/`);

        // ✅ Show only non-admin users (isAdmin === false)
        const filtered = res.data.filter(
          (user) => user.isAdmin === false || user.isAdmin === "false"
        );

        setCustomers(filtered);
        console.log("Non-admin users:", filtered);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers. Please try again.");
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customers</h2>
      </div>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-600 text-center">No customers found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-6">Customer ID</th>
                <th className="py-3 px-6">Username</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Phone</th>
                <th className="py-3 px-6">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id} className="border-t">
                  <td className="py-3 px-6">{customer._id}</td>
                  <td className="py-3 px-6">{customer.uName || "N/A"}</td>
                  <td className="py-3 px-6">
                    {`${customer.fName || ""} ${customer.lName || ""}`.trim() ||
                      "N/A"}
                  </td>
                  <td className="py-3 px-6">{customer.email || "N/A"}</td>
                  <td className="py-3 px-6">{customer.phone || "N/A"}</td>
                  <td className="py-3 px-6">
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString()
                      : "N/A"}
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

export default Customers;
