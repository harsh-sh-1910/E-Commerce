import React from "react";
import { FaEye } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";

const SingleBlogPage = () => {
  const articles = [
    {
      id: 1,
      date: "02 JAN,2023",
      image: "/article-03.jpg",
      category: "Audio Electronics",
      title: "Success Story on Amazon",
      description:
        "Recently, I was invited by Nintendo of Canada to attend a very special Nintendo Holiday Showcase exclusive preview event in New York City. Located in the heart of the city, at this exclusive event I was able to play some of the Nintendo Switch‘s top video games for the holiday.",
      author: "rosetyler",
      views: 1387,
      comments: 0,
    },
  ];
  return (
    <div className="flex p-10 gap-5">
      {articles.map((item) => (
        <div key={item.id} className="relative px-10 border-2">
          {/* Left Section - Image with Date */}
          <div className="relative w-full ">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="py-6 max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="absolute inline-block px-5 py-2 bg-teal-700 text-white font-semibold text-sm rounded-md mb-3 top-5">
              {item.category}
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold ">
              {item.title}
            </h2>
            <div className=" flex gap-3 text-gray-500 font-semibold">
              <p className="flex items-center gap-2">
                <SlCalender />
                {item.date}
              </p>
              /<p> by {item.author}</p>/
              <p className="flex gap-2 items-center">
                <FaEye className="mt-[1px]" />
                {item.views}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg mt-10">{item.description}</p>
            <div className="border-t mt-5 border-gray-300 flex justify-between p-2"></div>
          </div>
        </div>
      ))}

      <aside className="w-3/10 h-screen border-2"></aside>
    </div>
  );
};

export default SingleBlogPage;
