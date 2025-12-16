"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const API_BASE = "http://localhost/Shirt%20store/Backend1/api/Admin-apis/Admin-candles.php";

type Candle = {
  id: number;
  title: string;
  img: string;
  price?: number;
};

export default function AdminDashboard() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);

  // form states
  const [editing, setEditing] = useState<Candle | null>(null);
  const [title, setTitle] = useState("");
  const [img, setImg] = useState("");
  const [price, setPrice] = useState("");

  /* 🔹 FETCH */
  const fetchCandles = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}?action=read`);
    const data = await res.json();
    setCandles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCandles();
  }, []);

  /* 🔹 RESET FORM */
  const clearForm = () => {
    setEditing(null);
    setTitle("");
    setImg("");
    setPrice("");
  };

  /* 🔹 EDIT */
  const startEdit = (c: Candle) => {
    setEditing(c);
    setTitle(c.title);
    setImg(c.img);
    setPrice(c.price ? c.price.toString() : "");
  };

  /* 🔹 CREATE / UPDATE */
  const createOrUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("img", img);
    formData.append("price", price);

    if (editing) {
      formData.append("id", String(editing.id));
      formData.append("action", "update");
    } else {
      formData.append("action", "create");
    }

    await fetch(API_BASE, {
      method: "POST",
      body: formData,
    });

    fetchCandles();
    clearForm();
  };

  /* 🔹 DELETE */
  const remove = async (id: number) => {
    if (!confirm("Delete this candle?")) return;

    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("id", String(id));

    await fetch(API_BASE, {
      method: "POST",
      body: formData,
    });

    fetchCandles();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Navigation */}
        <nav className="mb-6 bg-white p-4 rounded shadow">
          <div className="flex gap-4">
            <a href="/admin/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded">Candles</a>
            <a href="/admin/orders" className="px-4 py-2 bg-green-600 text-white rounded">Orders</a>
          </div>
        </nav>

        {/* FORM */}
        <section className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">{editing ? "Edit Candle" : "Create Candle"}</h2>

          <div className="grid grid-cols-3 gap-3">
            <input
              className="p-2 border rounded"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="p-2 border rounded"
              placeholder="Image path (/candles/vanilla.jpg)"
              value={img}
              onChange={(e) => setImg(e.target.value)}
            />
            <input
              className="p-2 border rounded"
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={createOrUpdate}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              {editing ? "Update" : "Create"}
            </button>

            <button onClick={clearForm} className="px-3 py-2 bg-gray-200 rounded">
              Clear
            </button>
          </div>
        </section>

        {/* LIST */}
        <section className="grid grid-cols-4 gap-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            candles.map((c) => (
              <div key={c.id} className="bg-white rounded shadow overflow-hidden">
                <div className="w-full h-48 relative">
                  <Image src={c.img} alt={c.title} fill className="object-cover" />
                </div>

                <div className="p-3">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-gray-600">Price: ${c.price ? Number(c.price).toFixed(2) : 'N/A'}</p>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(c.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
