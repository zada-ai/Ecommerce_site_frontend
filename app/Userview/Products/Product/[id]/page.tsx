"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Thumbs } from "swiper/modules";
import Footer from "../../../../Userview/Footer/page";
import Navbar from "../../../../Home/Navbar/page";

interface Product {
  id: number;
  title: string;
  price: number | string;
  description: string;
  images: string[];
  colors: string[];
  category: string;
}

export default function ProductPage() {
  const params = useParams();
  const { id } = params;
  const searchParams = useSearchParams();
  const typeParam = searchParams?.get("type") ?? "";
  const router = useRouter();

  // Get logged-in user's email
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  const user_email = user?.email;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [tid, setTid] = useState("");
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  // Shipping & payment state
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Easypaisa");

  useEffect(() => {
    if (!id) return;
    const typeQuery = typeParam ? `&type=${encodeURIComponent(typeParam)}` : "";
    fetch(`http://localhost:8000/api/Product.php?id=${id}${typeQuery}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          const prod = data.product;
          setProduct({
            ...prod,
            price: Number(prod.price ?? 0),
            description: prod.description ?? "No description available",
            images: (prod.images?.length ? prod.images : [prod.img]).filter((img: string) => img && img.trim()),
            colors: prod.colors ?? [],
          });
          if (prod.colors?.length) setSelectedColor(prod.colors[0]);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to fetch product");
        setLoading(false);
      });
  }, [id, typeParam]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">{error}</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  const totalPrice = Number(product.price) * quantity;

  const handleBuyNow = async () => {
    if (!user_email) return alert("Please login to place an order");
    if (!tid) return alert("Please enter TID");
    if (!name || !street || !city || !zip) return alert("Please fill shipping address");

    const orderData = {
      user_email,
      product_id: id,
      product_type: typeParam,
      quantity,
      selected_color: selectedColor,
      tid,
      payment_method: paymentMethod,
      phone_number: number,
      full_name: name,
      street_address: street,
      city,
      zip_code: zip,
      total_price: totalPrice,
    };

    try {
      const response = await fetch("http://localhost:8000/api/Order.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.status === "success") {
        alert("Your order is pending. Wait for 24 hours. Thank you.");
        router.push('/');
      } else {
        alert("Failed to place order: " + data.message);
      }
    } catch (e) {
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 md:p-10 grid md:grid-cols-2 gap-10">

            {/* LEFT SIDE - Image Slider */}
            <div>
              <Swiper
                modules={[Navigation, Thumbs]}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                className="rounded-lg h-96 mb-4"
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative w-full h-96">
                      {img ? (
                        <Image src={img} alt={`Slide ${idx + 1}`} fill className="object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">No Image</div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Thumbnail slider */}
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                spaceBetween={10}
                slidesPerView={Math.min(product.images.length, 6)}
                freeMode
                watchSlidesProgress
                className="h-24 mt-4"
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative w-full h-24 border rounded overflow-hidden cursor-pointer">
                      {img ? (
                        <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No Image</div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* RIGHT SIDE - Details */}
            <div className="flex flex-col gap-5">
              <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
              <p className="text-gray-600">{product.description}</p>
              <div className="text-2xl font-semibold text-green-600">${Number(product.price).toFixed(2)}</div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-black ">Quantity:</span>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-black rounded text-white"
                >-</button>
                <span className="text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-1 bg-black rounded text-white"
                >+</button>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <span className="font-semibold block mb-2 text-black">Select Color:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <div
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selectedColor === color ? "border-black" : "border-gray-300"}`}
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}

              {/* TID & File */}
              <input
                type="text"
                value={tid}
                onChange={e => setTid(e.target.value)}
                placeholder="Enter TID"
                className="w-full border px-3 py-2 rounded mb-2 text-black"
              />
              <input
                type="file"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full border px-3 py-2 rounded mb-4 text-black" 
              />

              {/* Payment Method */}
              <div className="mb-4">
                <span className="font-semibold text-black block mb-2">Payment Method:</span>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="Easypaisa"
                      checked={paymentMethod === "Easypaisa"}
                      onChange={() => setPaymentMethod("Easypaisa")}
                    />
                    Easypaisa
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="JazzCash"
                      checked={paymentMethod === "JazzCash"}
                      onChange={() => setPaymentMethod("JazzCash")}
                    />
                    JazzCash
                  </label>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-4">
                <span className="font-semibold text-black block mb-2">Shipping Address:</span>
                <input
                  type="number"
                  placeholder="Phone Number"
                  className="w-full border px-3 py-2 rounded mb-2 text-black"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border px-3 py-2 rounded mb-2 text-black"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  className="w-full border px-3 py-2 rounded mb-2 text-black"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="City"
                  className="w-full border px-3 py-2 rounded mb-2 text-black"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="ZIP / Postal Code"
                  className="w-full border px-3 py-2 rounded mb-2 text-black"
                  value={zip}
                  onChange={e => setZip(e.target.value)}
                />
                <input
                  type="text"
                  value="Pakistan"
                  disabled
                  className="w-full border px-3 py-2 rounded mb-2 text-black bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Total & Buy */}
              <div className="text-xl text-black font-bold mb-2">Total: ${(Number(product.price) * quantity).toFixed(2)}</div>
              <button
                onClick={handleBuyNow}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
