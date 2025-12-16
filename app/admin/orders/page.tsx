"use client";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost/Shirt%20store/Backend1/api/Admin-apis/Admin-orders.php";

type Order = {
  id: number;
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
  status: 'pending' | 'successful' | 'processing' | 'failed';
  created_at: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 FETCH ORDERS */
  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}?action=read`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* 🔹 UPDATE STATUS */
  const updateStatus = async (id: number, newStatus: Order['status']) => {
    const formData = new FormData();
    formData.append("action", "update_status");
    formData.append("id", String(id));
    formData.append("status", newStatus);

    await fetch(API_BASE, {
      method: "POST",
      body: formData,
    });

    fetchOrders(); // Refresh list
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'successful': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

        {/* Navigation */}
        <nav className="mb-6 bg-white p-4 rounded shadow">
          <div className="flex gap-4">
            <a href="/admin/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded">Candles</a>
            <a href="/admin/orders" className="px-4 py-2 bg-green-600 text-white rounded">Orders</a>
          </div>
        </nav>

        {/* ORDERS LIST */}
        <section className="bg-white rounded shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-black">
                  <tr >
                    <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-black">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-black  uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-black  uppercase">Details</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-black  uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div>Product ID: {order.product_id}</div>
                        <div>Type: {order.product_type}</div>
                        <div>Qty: {order.quantity}</div>
                        {order.selected_color && <div>Color: {order.selected_color}</div>}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div>{order.full_name}</div>
                        <div>{order.phone_number}</div>
                        <div>{order.street_address}</div>
                        <div>{order.city}, {order.zip_code}</div>
                        <div>{order.country}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div>TID: {order.tid}</div>
                        <div>Payment: {order.payment_method}</div>
                        <div>Total: ${order.total_price}</div>
                        <div>Created: {new Date(order.created_at).toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                          className="border rounded px-2 py-1 text-sm text-black "
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="successful">Successful</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}