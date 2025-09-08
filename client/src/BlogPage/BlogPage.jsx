import React from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const BlogPage = () => {
  const articles = [
    {
      id: 1,
      date: "02 JAN",
      image: "/article-01.jpg",
      category: "Audio Electronics",
      title: "Announcing the new Fitbits Charge 6smart Fitness Tracker",
      description:
        "Recently, I was invited by Nintendo of Canada to attend a very special Nintendo Holiday Showcase exclusive preview event in New York City. Located in...",
      author: "rosetyler",
      views: 1387,
      comments: 0,
    },
    {
      id: 2,
      date: "02 JAN",
      image: "/article-02.jpg",
      category: "Audio Electronics",
      title: "Announcing the new Fitbits Charge 6smart Fitness Tracker",
      description:
        "Recently, I was invited by Nintendo of Canada to attend a very special Nintendo Holiday Showcase exclusive preview event in New York City. Located in...",
      author: "rosetyler",
      views: 1387,
      comments: 0,
    },
    {
      id: 3,
      date: "02 JAN",
      image: "/article-03.jpg",
      category: "Audio Electronics",
      title: "Announcing the new Fitbits Charge 6smart Fitness Tracker",
      description:
        "Recently, I was invited by Nintendo of Canada to attend a very special Nintendo Holiday Showcase exclusive preview event in New York City. Located in...",
      author: "rosetyler",
      views: 1387,
      comments: 0,
    },
  ];
  return (
    <div className="p-6">
      {articles.map((item) => (
        <div
          key={item.id}
          className="flex flex-col lg:flex-row bg-white rounded-xl shadow-md overflow-hidden mb-5"
        >
          {/* Left Section - Image with Date */}
          <div className="relative w-full lg:w-1/2">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="inline-block px-3 py-1 border border-green-500 text-green-700 font-semibold text-sm rounded-md mb-3">
              {item.category}
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold my-6">
              {item.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg ">{item.description}</p>
            <div className="border-t mt-5 border-gray-300 flex justify-between p-2">
              <p> by {item.author}</p>
              <p className="flex gap-2 items-center">
                <FaEye className="mt-1" />
                {item.views}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogPage;
