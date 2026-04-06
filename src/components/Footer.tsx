"use client";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-linear-to-r from-green-600 to-green-700 text-white mt-20"
    >
      <div className="w-[90%] md:w-[80%] mx-auto py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-3 text-white">GreenBasket</h2>
            <p className="text-sm text-green-100 leading-relaxed">
              Your one-stop shop for fresh and healthy groceries! We deliver
              quality products right to your doorstep.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* Social Media Icons - Placeholder for now */}
              <a
                href="#"
                className="text-green-200 hover:text-white transition-colors duration-200"
              >
                <span className="text-lg">📘</span> {/* Facebook */}
              </a>
              <a
                href="#"
                className="text-green-200 hover:text-white transition-colors duration-200"
              >
                <span className="text-lg">🐦</span> {/* Twitter */}
              </a>
              <a
                href="#"
                className="text-green-200 hover:text-white transition-colors duration-200"
              >
                <span className="text-lg">📷</span> {/* Instagram */}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">🏠</span>Home
                </Link>
              </li>
              <li>
                <Link
                  href="/user/cart"
                  className="hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">🛒</span>Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/user/my-orders"
                  className="hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">📦</span>My Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/user/track-order"
                  className="hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">🚚</span>Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3 text-white">
              Customer Service
            </h3>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3 text-white">
              Contact Us
            </h3>
            <div className="space-y-2 text-green-100 text-sm">
              <p className="flex items-start">
                <span className="mr-2 mt-0.5">📍</span>
                123 Grocery Street, Fresh City, FC 12345
              </p>
              <p className="flex items-center">
                <span className="mr-2">📧</span>
                info@greenbasket.com
              </p>
              <p className="flex items-center">
                <span className="mr-2">📞</span>
                (123) 456-7890
              </p>
              <p className="flex items-center">
                <span className="mr-2">🕒</span>
                Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-6PM
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-green-500/40 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Stay Updated
            </h3>
            <p className="text-green-100 text-sm mb-4">
              Subscribe to our newsletter for the latest deals and fresh
              arrivals!
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-r-md transition-colors duration-200 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-500/40 pt-6 flex flex-col md:flex-row justify-between items-center text-green-100 text-sm">
          <p>&copy; 2024 GreenBasket. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
