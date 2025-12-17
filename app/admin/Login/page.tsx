"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      setResponse("Please enter email & password");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/Admin-apis/Admin-login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      console.log("RAW ADMIN RESPONSE:", text);

      const data = JSON.parse(text);

      if (data.status === "success") {
        localStorage.setItem("admin_token", data.token);

        setResponse("Admin Login Successful! Redirecting...");

        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 800);
      } else {
        setResponse(data.message || "Login failed");
      }
    } catch (err) {
      setResponse("Network error: " + err);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">

        <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>

        <label>Email</label>
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="admin@riza.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          className="w-full border p-2 rounded mb-3"
          placeholder="*********"
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="text-center text-red-600 min-h-[20px]">{response}</p>

        <button
          className="w-full bg-green-600 text-white py-2 rounded mt-2"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}

