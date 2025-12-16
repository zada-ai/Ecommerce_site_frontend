"use client";

import React from "react";
import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.div
      className="w-full bg-white shadow-md py-3 px-4 md:px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">

        {/* Title */}
      <Link href="/">
        <motion.div
          className="text-xl font-semibold text-gray-800 text-center md:text-left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Welcome to <span className="text-green-600">Riza Glow Garden</span>
        </motion.div>
</Link>
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">

          {/* Email */}
          <motion.div
            className="flex items-center gap-2 text-gray-700"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Mail size={18} />
            <span className="text-sm md:text-base">rizamunawar11@gmail.com</span>
          </motion.div>

          {/* Phone */}
          <motion.div
            className="flex items-center gap-2 text-gray-700"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Phone size={18} />
            <span className="text-sm md:text-base">+92 324 5032005</span>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
