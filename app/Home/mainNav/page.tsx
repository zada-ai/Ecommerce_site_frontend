"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, X, User, Bell, List } from "lucide-react";

type UserType = {
  name?: string;
  email?: string;
  username?: string;
};

type ProductType = {
  id: number;
  title: string;
  price: number;
  img: string;
};

export default function MainNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductType[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  // Search Function
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const fetchProducts = async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(
          `https://rizamunawar.kesug.com/Backend1/api/SearchProduct.php?query=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        if (data.status === "success") {
          setSearchResults(data.products);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timeout = setTimeout(fetchProducts, 300); // debounce 300ms
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  const handleSearchEnter = () => {
    const query = searchQuery.toLowerCase().trim();
    if (query.includes('candle')) {
      window.location.href = `/Userview/AllCandles?search=${encodeURIComponent(searchQuery)}`;
    } else if (query.includes('bracelet')) {
      window.location.href = `/Userview/AllBracelets?search=${encodeURIComponent(searchQuery)}`;
    } else if (query.includes('bouquet') || query.includes('flower')) {
      window.location.href = `/Userview/AllBouquets?search=${encodeURIComponent(searchQuery)}`;
    } else {
      // Default to candles
      window.location.href = `/Userview/AllCandles?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="relative">
      {/* Popup */}
      {showPopup && !isLoggedIn && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto relative text-center animate-fadeIn">
            <h2 className="text-lg font-semibold text-green-700 mb-2">
              🎉 Special Offer!
            </h2>
            <p className="text-gray-700 mb-4">
              If you login, you get <span className="font-bold">10% off</span> for your first 3 orders. Thank you!
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <Link href="/Userview/Login">
              <button className="px-4 py-2 bg-green-700 text-white rounded-full shadow hover:bg-green-800 transition">
                Login Now
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="w-full bg-white shadow-md py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6">
          {/* LEFT */}
          <div className="flex flex-col leading-tight">
            <h1 className="text-3xl font-bold text-green-700 tracking-wide">RIZA GLOW</h1>
            <p className="text-gray-600 text-xs hidden sm:block">
              Bringing freshness, beauty, and nature to your space
            </p>
          </div>

          {/* MIDDLE - Search */}
          <div className="flex-1 flex justify-center relative">
            <div className="flex items-center w-full max-w-md bg-gray-100 rounded-full px-4 py-2 shadow-inner gap-3">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-transparent outline-none text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleSearchEnter();
                  }
                }}
              />
            </div>

            {/* Search Dropdown */}
            {searchQuery && (
              <div className="absolute top-12 left-0 right-0 bg-white shadow-lg rounded-lg max-h-80 overflow-y-auto z-50">
                {searchLoading ? (
                  <p className="p-4 text-gray-500">Loading...</p>
                ) : searchResults.length === 0 ? (
                  <p className="p-4 text-gray-500">No products found</p>
                ) : (
                  searchResults.map((product) => (
                    <Link key={product.id} href={`/Userview/ProductPage/${product.id}`}>
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <img src={product.img} alt={product.title} className="w-10 h-10 object-cover rounded" />
                        <div>
                          <p className="text-gray-800 font-medium">{product.title}</p>
                          <p className="text-green-700 text-sm">${product.price}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 relative">
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-full bg-black hover:bg-gray-400"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-64 p-4 text-sm text-gray-700">
                    🎉 Welcome! You get a 10% discount on your first purchase.
                  </div>
                )}
              </div>
            )}

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-4 relative">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="p-2 rounded-full bg-black hover:bg-gray-400"
                  >
                    <User size={20} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-44 overflow-hidden">
                      <div className="px-4 py-3 border-b text-sm font-semibold text-gray-700">
                        {user?.username || user?.email || "User"}
                      </div>
                      <Link href="/Userview/Orderspage">
                        <button className="w-full text-left px-4 py-2 text-black hover:bg-gray-100 flex items-center gap-2">
                          <List size={16} /> Orders Check
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}

                  <button className="flex items-center gap-2 px-5 py-2 bg-green-700 text-white rounded-full shadow hover:bg-green-800 transition">
                    <ShoppingCart size={18} /> Cart
                  </button>
                </>
              ) : (
                <>
                  <Link href="/Userview/Login">
                    <button className="px-5 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition">
                      Login
                    </button>
                  </Link>
                  <Link href="/Userview/Register">
                    <button className="px-5 py-2 bg-gray-800 text-white rounded-full shadow hover:bg-black transition">
                      Register
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 px-4 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 text-gray-800 px-4 py-2">
                  <User size={18} /> <span>{user?.username || user?.email}</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-5 py-2 bg-green-700 text-white rounded-full shadow">
                  <ShoppingCart size={18} /> Cart
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-2 bg-red-600 text-white rounded-full shadow"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/Userview/Login">
                  <button className="w-full px-5 py-2 bg-green-600 text-white rounded-full shadow">
                    Login
                  </button>
                </Link>
                <Link href="/Userview/Register">
                  <button className="w-full px-5 py-2 bg-gray-800 text-white rounded-full shadow">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

