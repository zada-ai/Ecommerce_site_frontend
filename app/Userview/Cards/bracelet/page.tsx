"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";

// Custom HeartFilled SVG
const HeartFilled = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="red"
    viewBox="0 0 24 24"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

type Bracelet = {
  id: number;
  title: string;
  img: string;
  price?: number | string;
};

export default function Bracelet() {
  const [favourites, setFavourites] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bracelets, setBracelets] = useState<Bracelet[]>([]);

  const toggleFavourite = (id: number) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const prev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const next = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, bracelets.length - 1));

  const visibleCandles = bracelets.slice(currentIndex, currentIndex + 4);

  useEffect(() => {
    fetch("http://localhost:8000/api/Bracelet.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("API Error:", data.error);
          setBracelets([]);
        } else {
          setBracelets(data);
        }
      })
      .catch((err) => console.error("Failed to fetch bracelets:", err));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 bg-white">
      <Link href="/Userview/AllBracelets">
        <h2 className="text-2xl font-bold underline hover:no-underline text-gray-800 mb-6 text-center md:text-left cursor-pointer hover:text-green-600 transition">
          Our Best Bracelet
        </h2>
      </Link>

      <div className="relative flex items-center">
        {/* Left Button */}
        {currentIndex > 0 && (
          <button
            onClick={prev}
            className="absolute left-0 z-10 bg-gray-200 text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-300 hidden md:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.5L8.25 12l6.75-7.5"
              />
            </svg>
          </button>
        )}

        {/* Cards */}
        <div className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleCandles.map((bracelet) => (
            <div
              key={bracelet.id}
              className="relative border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer"
            >
              <Link href={`/Userview/Products/Product/${bracelet.id}?type=bracelets`}>
              {/* Image */}
              <div className="w-full h-56 relative">
                {bracelet.img ? (
                  <Image
                    src={bracelet.img}
                    alt={bracelet.title}
                    fill
                    className="object-cover"
                    quality={100}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div className="p-3 text-center font-semibold text-gray-800">
                <div className="text-lg">{bracelet.title}</div>
                <div className="text-gray-600 mt-1">
                  ${Number(bracelet.price || 0).toFixed(2)}
                </div>
              </div>
</Link>
              {/* Favourite Icon */}
              <div
                className="absolute top-3 right-3 bg-white rounded-full p-1 cursor-pointer"
                onClick={() => toggleFavourite(bracelet.id)}
              >
                {favourites.includes(bracelet.id) ? (
                  <HeartFilled />
                ) : (
                  <Heart className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Button */}
        {currentIndex + 4 < bracelets.length && (
          <button
            onClick={next}
            className="absolute right-0 z-10 bg-gray-200 text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-300 hidden md:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 4.5l6.75 7.5L9 19.5"
              />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
