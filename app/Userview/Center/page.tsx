"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/Center/HERO1.png",
  "/Center/HERO2.jpg",
  "/Center/HERO3.jpg",
];

export default function AutoSlider() {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 3000); // 3 seconds per slide
    return () => clearInterval(interval);
  }, [total]);

  return (
    <div className="w-full ">
      <div className="w-full h-screen relative overflow-hidden ">
        <Image
          src={images[current]}
          alt={`Slide ${current}`}
          fill
          className="object-cover w-full h-full "
          priority
           quality={100}
        />
      </div>

      {/* Optional: pagination dots */}
      <div className="flex justify-center gap-2 mt-3">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === current ? "bg-green-600" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}

