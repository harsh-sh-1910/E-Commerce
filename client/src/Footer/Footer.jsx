import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 py-10 text-sm">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 relative">
        {/* Column 1: Logo and Contact Info */}
        <div className="space-y-4">
          <a href="/">
            <img src="/Logo-footer.svg" className="bg-black" />
          </a>
          <p className="text-gray-400 mt-2">Call us 24/7</p>
          <h2 className="text-xl font-semibold">+1 1800 9797 6000</h2>
          <p className="text-gray-400">
            215 Western Plaza, Melbourne, Australia
          </p>
          <a href="mailto:contact@xstore.com" className="underline text-white">
            contact@xstore.com
          </a>

          {/* Social Icons */}
          <div className="flex gap-4 text-xl pt-4">
            <FaFacebookF className="hover:text-teal-500" />
            <FaXTwitter className="hover:text-teal-500" />
            <FaInstagram className="hover:text-teal-500" />
            <FaYoutube className="hover:text-teal-500" />
            <FaTelegramPlane className="hover:text-teal-500" />
          </div>
        </div>

        {/* Column 2: Our Story */}
        <div>
          <h3 className="font-bold text-gray-400 mb-5 text-2xl">Our Story</h3>
          <div className="flex flex-col gap-2 text-white ">
            <Link to="/about" className="hover:text-teal-500 hover:underline">
              Company Profile
            </Link>
            <Link to="/about" className="hover:text-teal-500 hover:underline">
              Our Facility
            </Link>
            <Link to="/about" className="hover:text-teal-500 hover:underline">
              Commitment To Quality
            </Link>
            <Link to="/about" className="hover:text-teal-500 hover:underline">
              Contract Manufacturing
            </Link>
            <Link to="/about" className="hover:text-teal-500 hover:underline">
              Our Awards
            </Link>
          </div>
        </div>

        {/* Column 3: Categories */}
        <div>
          <h3 className="font-bold text-gray-400 mb-5 text-2xl">Categories</h3>
          <div className="flex flex-col gap-2 text-white">
            <Link to="/shop" className="hover:text-teal-500 hover:underline">
              Smartphone
            </Link>
            <Link to="/shop" className="hover:text-teal-500 hover:underline">
              Gaming Laptop
            </Link>
            <Link to="/shop" className="hover:text-teal-500 hover:underline">
              Smart Home
            </Link>
            <Link to="/shop" className="hover:text-teal-500 hover:underline">
              Major Appliances
            </Link>
            <Link to="/shop" className="hover:text-teal-500 hover:underline">
              Technologies
            </Link>
          </div>
        </div>

        {/* Column 4: Quick Link */}
        <div>
          <h3 className="font-bold text-gray-400 mb-5 text-2xl">Quick Link</h3>
          <div className="flex flex-col gap-2 text-white">
            <Link to="/blog" className="hover:text-teal-500 hover:underline">
              Blog
            </Link>
            <Link to="/blog" className="hover:text-teal-500 hover:underline">
              Subscription
            </Link>
            <Link to="/blog" className="hover:text-teal-500 hover:underline">
              Announcements
            </Link>
            <Link to="/blog" className="hover:text-teal-500 hover:underline">
              FAQ’s
            </Link>
          </div>
        </div>

        {/* Column 5: Contact Us */}
        <div>
          <h3 className="font-bold text-gray-400 mb-5 text-2xl">Contact Us</h3>
          <div className="flex flex-col gap-2 text-white">
            <Link to="/contact" className="hover:text-teal-500 hover:underline">
              Become a Seller
            </Link>
            <Link to="/contact" className="hover:text-teal-500 hover:underline">
              Contract Manufacturing
            </Link>
            <Link to="/contact" className="hover:text-teal-500 hover:underline">
              Terms & Condition
            </Link>
            <Link to="/contact" className="hover:text-teal-500 hover:underline">
              Career with us
            </Link>
            <Link to="/contact" className="hover:text-teal-500 hover:underline">
              Consumer enquiry
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-xs">
        <p>
          Copyright © 2024 XStore theme. Created by 8theme – WordPress
          WooCommerce themes.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
