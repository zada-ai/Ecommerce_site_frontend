"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";
import Navbar from "../../Home/Navbar/page";
import Footer from "../Footer/page";

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

export default function AllBraceletsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [favourites, setFavourites] = useState<number[]>([]);
  const [bracelets, setBracelets] = useState<Bracelet[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleFavourite = (id: number) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetch("http://localhost/Shirt%20store/Backend1/api/Bracelet.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("API Error:", data.error);
          setBracelets([]);
        } else {
          setBracelets(data);
        }
      })
      .catch((err) => console.error("Failed to fetch bracelets:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBracelets = bracelets.filter(bracelet =>
    searchQuery ? bracelet.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
          <div className="text-center">Loading bracelets...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-black">All Bracelets</h1>

          {filteredBracelets.length === 0 ? (
            <div className="text-center text-gray-500">
              {searchQuery ? `No bracelets found for "${searchQuery}"` : "No bracelets available"}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredBracelets.map((bracelet) => (
                <div key={bracelet.id} className="relative">
                  {/* Card Link */}
                  <Link href={`/Userview/Products/Product/${bracelet.id}?type=bracelets`}>
                    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer">
                      {/* Image */}
                      <div className="w-full h-56 relative">
                        {bracelet.img ? (
                          <Image
                            src={bracelet.img}
                            alt={bracelet.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {bracelet.title}
                        </h3>
                        {bracelet.price && (
                          <p className="text-green-600 font-bold">${bracelet.price}</p>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Favourite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavourite(bracelet.id);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                  >
                    {favourites.includes(bracelet.id) ? (
                      <HeartFilled />
                    ) : (
                      <Heart size={20} className="text-gray-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}