import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaSearch } from "react-icons/fa";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Base URL
  // const URL = "http://localhost:5000";
  const URL = "https://e-commerce-4pcq.onrender.com";
  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${URL}/review`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Delete review
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`${URL}/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((review) =>
    review.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reviews</h1>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-full md:w-72 border border-gray-400">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer..."
            className="ml-2 bg-transparent border-none focus:outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="py-3 px-4">Review ID</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Comment</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review._id} className="border-t">
                <td className="py-3 px-4">{review._id.slice(0, 6)}</td>
                <td className="py-3 px-4">{review.productName}</td>
                <td className="py-3 px-4">{review.customerName}</td>
                <td className="py-3 px-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 max-w-xs whitespace-normal">
                  {review.comment}
                </td>
                <td className="py-3 px-4">
                  {new Date(review.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredReviews.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reviews;
