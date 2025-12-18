"use client";

import { useState } from "react";
import Navbar from "../../Home/Navbar/page";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [error, setError] = useState(false);

  const signup = async () => {
    if (!name || !email || !password) {
      showResponse("Please provide name, email and password", true);
      return;
    }

    try {
      const res = await fetch(
        "https://rizamunawar.kesug.com/Backend1/api/Signup.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const text = await res.text();
      console.log("RAW SIGNUP RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        showResponse("Server returned non-JSON response. Check console.", true);
        return;
      }

      if (data.status === "success") {
        showResponse("Signup successful! Redirecting to login...", false);
        setTimeout(() => {
          window.location.href = "/Userview/Login"; // redirect to login page
        }, 1000);
      } else {
        showResponse(data.message || "Signup failed", true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      showResponse("Network error: " + message, true);
    }
  };

  const showResponse = (text: string, isError: boolean) => {
    setError(isError);
    setResponseMsg(text);
  };

  return (
    <>
        <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-green-700">
          RIZA GLOW
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Create your account
        </p>

        {/* Name */}
        <label className="block mb-2 text-gray-700">Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 text-black mb-4 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <label className="block mb-2 text-gray-700">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 mb-4 border text-black rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="block mb-2 text-gray-700">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 mb-4 border text-black rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Response */}
        {responseMsg && (
          <p className={`text-center font-bold mb-3 ${error ? "text-red-600" : "text-green-600"}`}>
            {responseMsg}
          </p>
        )}

        {/* Signup Button */}
        <button
          onClick={signup}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <a href="/Userview/Login" className="text-green-600 font-bold ml-1">
            Login
          </a>
        </p>
      </div>
    </div>
         </>
  );
}

