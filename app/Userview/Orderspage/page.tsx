"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import Navbar from "../../Home/Navbar/page";
import Footer from "../Footer/page";

interface Order {
  id: number;
  user_email: string;
  product_id: number;
  product_type: string;
  quantity: number;
  selected_color: string | null;
  tid: string;
  payment_method: string;
  phone_number: string;
  full_name: string;
  street_address: string;
  city: string;
  zip_code: string;
  country: string;
  total_price: string;
  status: string;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get logged-in user's email from localStorage
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  const user_email = user?.email;

  useEffect(() => {
    if (user_email) fetchOrders();
  }, [user_email]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/Orders.php?user_email=${user_email}`
      );
      const data = await response.json();
      if (data.status === "success") {
        setOrders(data.orders);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  if (!user_email) return <div className="p-8 text-center text-red-600">Please login to view your orders</div>;
  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
        <div className="text-center">Loading orders...</div>
      </div>
      <Footer />
    </>
  );
  if (error) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
      <Footer />
    </>
  );
  if (orders.length === 0) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Found</h2>
          <p className="text-gray-500">You haven't placed any orders yet. Start shopping to see your orders here!</p>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-black">My Orders</h1>

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-black">Order #{order.id}</h2>
                    <p className="text-black"><strong>Product ID:</strong> {order.product_id}</p>
                    <p className="text-black"><strong>Type:</strong> {order.product_type}</p>
                    <p className="text-black"><strong>Quantity:</strong> {order.quantity}</p>
                    <p className="text-black"><strong>Color:</strong> {order.selected_color || "N/A"}</p>
                    <p className="text-black"><strong>TID:</strong> {order.tid}</p>
                    <p className="text-black"><strong>Payment:</strong> {order.payment_method}</p>
                    <p className="text-black"><strong>Total:</strong> ${order.total_price}</p>
                    <p className="text-black">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-2 py-1 rounded ${
                          order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-200 text-blue-800' :
                          order.status === 'successful' ? 'bg-green-200 text-green-800' :
                          'bg-red-200 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-black"><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-black ">Shipping Details</h3>
                    <p className="text-black"><strong>Phone:</strong> {order.phone_number}</p>
                    <p className="text-black"><strong>Name:</strong> {order.full_name}</p>
                    <p className="text-black"><strong>Address:</strong> {order.street_address}</p>
                    <p className="text-black"><strong>City:</strong> {order.city}</p>
                    <p className="text-black"><strong>ZIP:</strong> {order.zip_code}</p>
                    <p className="text-black"><strong>Country:</strong> {order.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

