"use client";

import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand & Description */}
        <div>
          <h2 className="text-2xl font-bold text-green-500">RIZA GLOW</h2>
          <p className="mt-2 text-gray-300">
            Bringing freshness, beauty, and nature to your space. Explore our collection of plants, flowers, seeds, and more.
          </p>
          <div className="flex mt-4 space-x-4">
            <a href="#" className="hover:text-green-400"><Facebook size={24} /></a>
            <a href="#" className="hover:text-pink-400"><Instagram size={24} /></a>
            <a href="#" className="hover:text-blue-400"><Twitter size={24} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/" className="hover:text-green-400">Home</a></li>
            <li><a href="/shop" className="hover:text-green-400">Shop</a></li>
            <li><a href="/about" className="hover:text-green-400">About Us</a></li>
            <li><a href="/contact" className="hover:text-green-400">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <Mail size={18} /> <span>rizamunawar11@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> <span>+92 324 5032005</span>
            </li>
            <li>
              <p className="mt-2 text-gray-400 text-sm">123 Flower Street, Lahore, Pakistan</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
        © 2025 Riza Glow Garden. All rights reserved.
      </div>
    </footer>
  );
}

