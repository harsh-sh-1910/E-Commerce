import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: "P001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: "$99.99",
    stock: 25,
    status: "In Stock",
  },
  {
    id: "P002",
    name: "Running Shoes",
    category: "Footwear",
    price: "$79.99",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "P003",
    name: "Smartwatch",
    category: "Accessories",
    price: "$199.99",
    stock: 15,
    status: "In Stock",
  },
];

const Products = () => {
  return (
    <div className="p-4 w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Link to="/addProduct">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Product
          </button>
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by name"
          className="border px-4 py-2 rounded-md w-full max-w-xs"
        />
        <select className="border px-4 py-2 rounded-md">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Footwear</option>
          <option>Accessories</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-6">ID</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Category</th>
              <th className="py-3 px-6">Price</th>
              <th className="py-3 px-6">Stock</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="py-3 px-6">{product.id}</td>
                <td className="py-3 px-6">{product.name}</td>
                <td className="py-3 px-6">{product.category}</td>
                <td className="py-3 px-6">{product.price}</td>
                <td className="py-3 px-6">{product.stock}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      product.status === "In Stock"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.status}
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

export default Products;
