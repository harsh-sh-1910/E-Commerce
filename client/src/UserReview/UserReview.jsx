import React from "react";
import { GoStar } from "react-icons/go";

const reviews = [
  {
    id: 1,
    productImage: "https://via.placeholder.com/80x80.png",
    productName: "Wireless Headphones",
    review: "Great sound quality and comfortable fit.",
    rating: 4,
  },
  {
    id: 2,
    productImage: "https://via.placeholder.com/80x80.png",
    productName: "Smart Watch",
    review: "Battery lasts long, but screen could be brighter.",
    rating: 3,
  },
  {
    id: 3,
    productImage: "https://via.placeholder.com/80x80.png",
    productName: "Gaming Mouse",
    review: "Responsive and lightweight — perfect for FPS games.",
    rating: 5,
  },
];

const UserReview = () => {
  const URL = "https://e-commerce-4pcq.onrender.com";
  // const URL = "http://localhost:5000";

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="w-full text-center border-b mb-5 border-gray-300">
        <h1 className="text-5xl font-bold text-gray-500 mb-6">
          Product Reviews
        </h1>
      </div>

      <div className=" bg-gray-50 shadow-xl rounded-lg overflow-x-auto">
        <div className="min-w-[800px] space-y-2 ">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-5 shadow-sm border-gray-300 hover:bg-gray-100 transition rounded-lg"
            >
              {/* Product Image */}
              <div className="flex items-center gap-4 w-1/4">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <span className="font-medium">{item.productName}</span>
              </div>

              {/* Review */}
              <div className="w-2/4 text-gray-700">{item.review}</div>

              {/* Rating */}
              <div className="w-1/4 flex items-center gap-1 justify-end">
                {[1, 2, 3, 4, 5].map((star) => (
                  <GoStar
                    key={star}
                    size={20}
                    className={
                      star <= item.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserReview;
