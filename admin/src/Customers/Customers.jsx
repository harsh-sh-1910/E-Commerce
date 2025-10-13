import React from "react";

const customers = [
  {
    id: "C001",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+91-9876543210",
    orders: 5,
    joined: "2024-12-10",
    status: "Active",
  },
  {
    id: "C002",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+91-9123456789",
    orders: 3,
    joined: "2025-01-05",
    status: "Inactive",
  },
  {
    id: "C003",
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "+91-9988776655",
    orders: 8,
    joined: "2024-11-22",
    status: "Active",
  },
];

const Customers = () => {
  const URL = "https://e-commerce-4pcq.onrender.com";
  // const URL = "http://localhost:5000";

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customers</h2>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full max-w-xs border px-4 py-2 rounded-md"
        />
        <select className="border px-4 py-2 rounded-md">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-6">Customer ID</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Phone</th>
              <th className="py-3 px-6">Orders</th>
              <th className="py-3 px-6">Joined</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="py-3 px-6">{customer.id}</td>
                <td className="py-3 px-6">{customer.name}</td>
                <td className="py-3 px-6">{customer.email}</td>
                <td className="py-3 px-6">{customer.phone}</td>
                <td className="py-3 px-6">{customer.orders}</td>
                <td className="py-3 px-6">{customer.joined}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
