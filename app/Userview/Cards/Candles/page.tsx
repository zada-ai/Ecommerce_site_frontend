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

type Candle = {
  id: number;
  title: string;
  img: string;
  price?: number | string;
};

export default function CandlesSection() {
  const [favourites, setFavourites] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [candles, setCandles] = useState<Candle[]>([]);

  const toggleFavourite = (id: number) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const prev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const next = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, candles.length - 1));

  const visibleCandles = candles.slice(currentIndex, currentIndex + 4);

  useEffect(() => {
    fetch("http://localhost/Shirt%20store/Backend1/api/Candles.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("API Error:", data.error);
          setCandles([]);
        } else {
          setCandles(data);
        }
      })
      .catch((err) => console.error("Failed to fetch candles:", err));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 bg-white">
      <Link href="/Userview/AllCandles">
        <h2 className="text-2xl underline hovert:no-underline font-bold  text-gray-800 mb-6 text-center md:text-left cursor-pointer hover:text-green-600 transition">
          Our Best Candles
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
          {visibleCandles.map((candle) => (
            <div key={candle.id} className="relative">
              {/* Card Link */}
              <Link href={`/Userview/Products/Product/${candle.id}?type=candles`}>
                <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer">
                  {/* Image */}
                  <div className="w-full h-56 relative">
                    {candle.img ? (
                      <Image
                        src={candle.img}
                        alt={candle.title}
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
                    <div className="text-lg">{candle.title}</div>
                    <div className="text-gray-600 mt-1">
                      ${Number(candle.price || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Favourite Icon */}
              <div
                className="absolute top-3 right-3 bg-white rounded-full p-1 cursor-pointer z-10"
                onClick={() => toggleFavourite(candle.id)}
              >
                {favourites.includes(candle.id) ? (
                  <HeartFilled />
                ) : (
                  <Heart className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Button */}
        {currentIndex + 4 < candles.length && (
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
