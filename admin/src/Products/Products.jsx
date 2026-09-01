import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Products = () => {
  // const URL = "https://e-commerce-4pcq.onrender.com";
  const URL = "http://localhost:5000";

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${URL}/product/`);
        setProducts(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      }
    };
    fetchProducts();
  }, []);

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

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600 text-center">No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Actual Price</th>
                <th className="py-3 px-6">Sale Price</th>
                <th className="py-3 px-6">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="py-3 px-6">
                    {product.productId || product._id}
                  </td>
                  <td className="py-3 px-6">
                    {product.name?.length > 40
                      ? product.name.slice(0, 40) + "..."
                      : product.name}
                  </td>
                  <td className="py-3 px-6">
                    {product.categoryName || product.category || "N/A"}
                  </td>
                  <td className="py-3 px-6 text-red-500">
                    &#8377;
                    {product.pricing?.mrp ? `${product.pricing.mrp}` : "0.00"}
                  </td>
                  <td className="py-3 px-6 text-teal-600">
                    &#8377;
                    {product.pricing?.salePrice
                      ? `${product.pricing.salePrice}`
                      : "0.00"}
                  </td>
                  <td className="py-3 px-6">
                    {product.inventory?.stockQty ?? product.stockQty ?? 0}
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

export default Products;
