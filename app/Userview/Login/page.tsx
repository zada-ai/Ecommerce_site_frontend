"use client";

import Navbar from "../../Home/Navbar/page";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");

  async function login() {
    if (!email || !password) {
      setResponse("Please enter email and password");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8000/api/Login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setResponse("Invalid JSON response from server.");
        return;
      }

      if (data.status === "success") {
        // Save login info
        localStorage.setItem("user", JSON.stringify(data));

        setResponse("Login Successful! Redirecting...");

        // 🔥 redirect based on backend response
        setTimeout(() => {
          window.location.href = data.redirect || "/";
        }, 800);

      } else {
        setResponse(data.message || "Login failed");
      }
    } catch (err) {
      setResponse("Network error: " + err.message);
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-green-700">
            RIZA GLOW
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Welcome back! Please login.
          </p>

          <label className="block mb-2 text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 mb-4 border rounded-lg text-black focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mb-2 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 mb-4 border rounded-lg text-black focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="text-center text-red-600 min-h-[20px]">{response}</p>

          <button
            onClick={login}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
          >
            Login
          </button>

          <p className="mt-4 text-center text-sm">
            Don't have an account?
            <a href="/Userview/Register" className="text-green-600 font-bold ml-1">
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

